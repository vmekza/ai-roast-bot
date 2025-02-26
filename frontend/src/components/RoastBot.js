import { useState } from 'react';
import { getRoast } from '../api';
import './RoastBot.css';

const RoastBot = () => {
  const [userInput, setUserInput] = useState('');
  const [roast, setRoast] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRoast = async () => {
    if (!userInput.trim()) return;
    setLoading(true);
    const generatedRoast = await getRoast(userInput);
    setRoast(generatedRoast);
    setLoading(false);
  };

  return (
    <div className='roast-container'>
      <h1>🔥 AI RoastBot 🔥</h1>
      <textarea
        placeholder='Type something to get roasted...'
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
      ></textarea>
      <button onClick={handleRoast} disabled={loading}>
        {loading ? 'Roasting...' : 'Roast Me!'}
      </button>
      {roast && <p className='roast-text'>{roast}</p>}
    </div>
  );
};

export default RoastBot;
