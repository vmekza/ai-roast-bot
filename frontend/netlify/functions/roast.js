import axios from 'axios';
import 'dotenv/config';
export const handler = async (event, context) => {
  try {
    const { message, systemPrompt } = JSON.parse(event.body);

    if (!message || !systemPrompt) {
      return { statusCode: 400, body: 'Missing message or systemPrompt' };
    }

    const resp = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message },
        ],
        max_tokens: 100,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return {
      statusCode: 200,
      body: JSON.stringify({ roast: resp.data.choices[0].message.content }),
    };
  } catch (err) {
    console.error('Function Error:', err.response?.data || err.message);
    return { statusCode: 500, body: 'Server error' };
  }
};
