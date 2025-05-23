import axios from 'axios';

const API_URL = 'http://localhost:5001';

export const getRoast = async (message, systemPrompt) => {
  try {
    const response = await axios.post(`${API_URL}/roast`, {
      message,
      systemPrompt,
    });
    return response.data.roast;
  } catch (error) {
    console.error('API Error:', error);
    return 'Oops! Something went wrong...';
  }
};
