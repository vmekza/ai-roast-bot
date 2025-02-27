require('dotenv').config();
console.log('Loaded API Key:', process.env.OPENAI_API_KEY);
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 5001;

app.use(
  cors({
    origin: '*', // Allow all origins (for testing)
    methods: 'GET,POST',
    allowedHeaders: 'Content-Type,Authorization',
  })
);

app.use(express.json());

app.post('/roast', async (req, res) => {
  const { message, mode } = req.body; // Add "mode"

  if (!message) {
    return res.status(400).json({ error: 'No message provided.' });
  }

  const systemPrompt =
    mode === 'roast-ai'
      ? 'You are an AI that gets roasted by users. Respond with a funny comeback.'
      : 'You are an AI that roasts users in a humorous way.';

  try {
    const response = await axios.post(
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

    res.json({ roast: response.data.choices[0].message.content });
  } catch (error) {
    console.error(
      'Error:',
      error.response ? error.response.data : error.message
    );
    res.status(500).json({ error: 'Failed to generate roast.' });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
