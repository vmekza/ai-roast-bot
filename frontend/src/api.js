import axios from 'axios';

const API_URL =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:5001'
    : '/.netlify/functions/roast';

export const getRoast = async (message, systemPrompt) => {
  try {
    const res = await axios.post(API_URL, { message, systemPrompt });
    return res.data.roast;
  } catch (err) {
    console.error('API Error:', err);
    return 'Oops! Something went wrong…';
  }
};
