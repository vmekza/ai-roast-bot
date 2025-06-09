// frontend/netlify/functions/roast.js
const axios = require('axios');

exports.handler = async (event) => {
  try {
    const { prompt, systemPrompt } = JSON.parse(event.body || '{}');
    if (!prompt || !systemPrompt) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing prompt or systemPrompt' }),
      };
    }

    // call OpenAI
    const openaiRes = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt },
        ],
        max_tokens: 100,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        timeout: 30000,
      }
    );

    const roast = openaiRes.data.choices[0].message.content;
    return {
      statusCode: 200,
      body: JSON.stringify({ roast }),
    };
  } catch (err) {
    console.error('Roast function error:', err.response?.data || err.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Oops! Something went wrong...' }),
    };
  }
};
