import { useState, useRef, useEffect } from 'react';
import { getRoast } from '../api';

const RoastBot = () => {
  const [userInput, setUserInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isRoastMode, setIsRoastMode] = useState(false);
  const [voiceMode, setVoiceMode] = useState(false);
  const chatRef = useRef(null);

  useEffect(() => {
    chatRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // AI Speaks if voice mode is ON
  const speakResponse = (text) => {
    if (!text || !voiceMode) return;
    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = 'en-US';
    speech.rate = 1.1;
    speech.pitch = 1;
    speech.volume = 1;
    window.speechSynthesis.speak(speech);
  };

  // Speech-to-Text (user voice input)
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

  const sendMessage = async (message) => {
    if (!message.trim()) return;
    setLoading(true);

    // 🎭 Mode switching
    const systemPrompt = isRoastMode
      ? `You are an AI comedian who ONLY gives funny and sarcastic roasts.
         You MUST NEVER answer questions or provide helpful information.
         Every response must be an insult, but it should be lighthearted and playful.`
      : `You are a professional AI assistant.
         Your job is to help users with clear, useful, and polite answers.
         YOU MUST NEVER roast or insult the user in any way.
         Do not make jokes unless asked.`;

    const response = await getRoast(message, systemPrompt);

    setMessages([
      ...messages,
      { text: message, sender: 'user' },
      { text: response, sender: 'ai' },
    ]);
    setUserInput('');

    if (voiceMode) speakResponse(response);
    setLoading(false);
  };

  // Reset chat when changing modes
  const toggleRoastMode = () => {
    setIsRoastMode(!isRoastMode);
    setMessages([]);
  };

  return (
    <div className='flex flex-col max-w-lg mx-auto bg-gray-900 text-white p-6 rounded-lg shadow-md'>
      <h1 className='text-2xl font-bold text-center mb-4'>
        🔥 AI RoastBot & Assistant 🤖
      </h1>
      <div className='flex justify-between items-center mb-4'>
        <label className='flex items-center cursor-pointer'>
          <input
            type='checkbox'
            className='hidden'
            checked={isRoastMode}
            onChange={toggleRoastMode}
          />
          <span className='ml-2'>
            {isRoastMode ? '🔥 Roast Mode' : '🤖 Normal Mode'}
          </span>
        </label>
      </div>
      <div className='flex justify-between items-center mb-4'>
        <label className='flex items-center cursor-pointer'>
          <input
            type='checkbox'
            className='hidden'
            checked={voiceMode}
            onChange={() => setVoiceMode(!voiceMode)}
          />
          <span className='ml-2'>
            {voiceMode ? '🔊 Voice ON' : '🔇 Voice OFF'}
          </span>
        </label>
      </div>
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
      <textarea
        className='w-full p-2 border border-gray-600 rounded bg-gray-800 text-white'
        placeholder='Type your message...'
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
      ></textarea>
      <div className='flex gap-2 mt-3'>
        <button
          className='flex-1 bg-green-500 text-white p-2 rounded'
          onClick={() => sendMessage(userInput)}
          disabled={loading || !userInput.trim()}
        >
          Send
        </button>
        <button
          className='flex-1 bg-purple-500 text-white p-2 rounded'
          onClick={handleVoiceInput}
        >
          🎤 Speak
        </button>
      </div>
    </div>
  );
};

export default RoastBot;
