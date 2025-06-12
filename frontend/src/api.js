import axios from 'axios';

export async function getRoast(prompt, systemPrompt) {
  const { data } = await axios.post(
    '/.netlify/functions/roast',
    { prompt, systemPrompt },
    { timeout: 30000 }
  );

  return data.roast;
}
