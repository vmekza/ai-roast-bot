import { useState, useRef, useEffect } from 'react';
import { getRoast } from '../api';

const RoastBot = () => {
  const [userInput, setUserInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [voiceMode, setVoiceMode] = useState(false);
  const chatRef = useRef(null);

  useEffect(() => {
    chatRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  //Speech-to-Text (Voice Input)
  const handleVoiceInput = () => {
    const recognition =
      new window.webkitSpeechRecognition() || new window.SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.start();

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setUserInput(transcript);
    };

    recognition.onerror = (event) => {
      console.error('Speech Recognition Error:', event.error);
    };
  };

  // AI Speaks the roast (Only if voice mode is on)
  const speakRoast = (text) => {
    if (!text || !voiceMode) return;
    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = 'en-US';
    speech.rate = 1.1;
    speech.pitch = 1;
    speech.volume = 1;
    window.speechSynthesis.speak(speech);
  };

  const sendRoast = async (message, mode = 'roast-user') => {
    if (!message.trim()) return;
    setLoading(true);

    const newMessages = [...messages, { text: message, sender: 'user' }];
    setMessages(newMessages);
    setUserInput('');

    const generatedRoast = await getRoast(message, mode);
    setMessages([...newMessages, { text: generatedRoast, sender: 'ai' }]);

    speakRoast(generatedRoast);
    setLoading(false);
  };

  const clearChat = () => {
    setMessages([]);
  };

  return (
    <div className='flex flex-col max-w-lg mx-auto bg-gray-900 text-white p-6 rounded-lg shadow-md'>
      <h1 className='text-2xl font-bold text-center mb-4'>🔥 AI RoastBot 🔥</h1>

      {/*Toggle voice mode */}
      <div className='flex justify-between items-center mb-4'>
        <label className='flex items-center cursor-pointer'>
          <input
            type='checkbox'
            className='hidden'
            checked={voiceMode}
            onChange={() => setVoiceMode(!voiceMode)}
          />
          <div
            className={`w-10 h-5 flex items-center bg-gray-500 rounded-full p-1 transition duration-300 ${
              voiceMode ? 'bg-green-500' : ''
            }`}
          >
            <div
              className={`w-4 h-4 bg-white rounded-full shadow-md transform transition duration-300 ${
                voiceMode ? 'translate-x-5' : ''
              }`}
            ></div>
          </div>
          <span className='ml-2'>
            {voiceMode ? '🔊 Voice Mode ON' : '🔇 Voice Mode OFF'}
          </span>
        </label>
      </div>

      {/* Chat messages */}
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

      {/* Input field */}
      <textarea
        className='w-full p-2 border border-gray-600 rounded bg-gray-800 text-white'
        placeholder='Type your roast or use voice input...'
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
      ></textarea>

      {/* Buttons */}
      <div className='flex gap-2 mt-3'>
        <button
          className='flex-1 bg-red-500 hover:bg-red-600 text-white p-2 rounded'
          onClick={() => sendRoast(userInput, 'roast-user')}
          disabled={loading || !userInput.trim()}
        >
          {loading ? 'Roasting...' : 'Roast Me!'}
        </button>

        <button
          className='flex-1 bg-green-500 hover:bg-green-600 text-white p-2 rounded'
          onClick={() => sendRoast(userInput, 'roast-ai')}
          disabled={loading || !userInput.trim()}
        >
          {loading ? 'Roasting AI...' : 'Roast the AI!'}
        </button>

        <button
          className='flex-1 bg-purple-500 hover:bg-purple-600 text-white p-2 rounded'
          onClick={handleVoiceInput}
        >
          🎤 Speak
        </button>

        <button
          className='flex-1 bg-yellow-500 hover:bg-yellow-600 text-white p-2 rounded'
          onClick={() => speakRoast(messages[messages.length - 1]?.text)}
          disabled={!messages.length}
        >
          🔊 Hear last roast
        </button>
        <button
          className='flex-1 bg-yellow-500 hover:bg-orange-600 text-white p-2 rounded'
          onClick={clearChat}
        >
          Clear chat
        </button>
      </div>
    </div>
  );
};

export default RoastBot;
