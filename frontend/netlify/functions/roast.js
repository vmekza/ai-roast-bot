import { post } from 'axios';

export async function handler(event) {
  try {
    const { prompt, systemPrompt } = JSON.parse(event.body);

    const backendUrl = process.env.BACKEND_URL || 'http://localhost:5001';
    const res = await post(`${backendUrl}/roast`, {
      prompt,
      systemPrompt,
    });

    return {
      statusCode: 200,
      body: JSON.stringify(res.data),
    };
  } catch (e) {
    console.error('Roast function error:', e);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error' }),
    };
  }
}
