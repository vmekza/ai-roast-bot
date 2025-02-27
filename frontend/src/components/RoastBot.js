import { useState, useRef, useEffect } from 'react';
import { getRoast } from '../api';

const RoastBot = () => {
  const [userInput, setUserInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const chatRef = useRef(null);

  useEffect(() => {
    chatRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleRoast = async () => {
    if (!userInput.trim()) return;
    setLoading(true);
    const newMessages = [...messages, { text: userInput, sender: 'user' }];
    setMessages(newMessages);
    setUserInput('');

    const generatedRoast = await getRoast(userInput, 'roast-user');
    setMessages([...newMessages, { text: generatedRoast, sender: 'ai' }]);
    setLoading(false);
  };

  const handleRoastAI = async () => {
    if (!userInput.trim()) return;
    setLoading(true);

    const newMessages = [...messages, { text: userInput, sender: 'user' }];
    setMessages(newMessages);
    setUserInput('');

    const generatedRoast = await getRoast(userInput, 'roast-ai');
    setMessages([...newMessages, { text: generatedRoast, sender: 'ai' }]);

    setLoading(false);
  };

  return (
    <div className='flex flex-col max-w-lg mx-auto bg-gray-900 text-white p-6 rounded-lg shadow-md'>
      <h1 className='text-2xl font-bold text-center mb-4'>AI RoastBot</h1>

      {/* Chat Messages */}
      <div className='h-80 overflow-y-auto border border-gray-700 p-3 rounded-lg mb-4'>
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${
              msg.sender === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <p
              className={`p-3 my-1 rounded-lg max-w-xs text-white ${
                msg.sender === 'user' ? 'bg-blue-500' : 'bg-gray-700'
              }`}
            >
              {msg.text}
            </p>
          </div>
        ))}
        <div ref={chatRef}></div>
      </div>

      {/* Input Field */}
      <textarea
        className='w-full p-2 border border-gray-600 rounded bg-gray-800 text-white'
        placeholder='Type something...'
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
      ></textarea>

      {/* Buttons */}
      <div className='flex gap-2 mt-3'>
        <button
          className='flex-1 bg-red-500 hover:bg-red-600 text-white p-2 rounded'
          onClick={handleRoast}
          disabled={loading}
        >
          {loading ? 'Roasting...' : 'Roast Me!'}
        </button>

        <button
          className='flex-1 bg-green-500 hover:bg-green-600 text-white p-2 rounded'
          onClick={handleRoastAI}
          disabled={loading}
        >
          {loading ? 'Roasting AI...' : 'Roast the AI!'}
        </button>
      </div>
    </div>
  );
};

export default RoastBot;
