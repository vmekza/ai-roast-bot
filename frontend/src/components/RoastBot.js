import React, { useState, useRef, useEffect } from 'react';
import ToggleSwitch from './ToggleSwitch';
import { getRoast } from '../api';

export default function RoastBot() {
  const [userInput, setUserInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  // For toggles:
  const [isRoastMode, setIsRoastMode] = useState(false);
  const [voiceMode, setVoiceMode] = useState(false);

  const chatRef = useRef(null);

  useEffect(() => {
    chatRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const speakResponse = (text) => {
    if (!text || !voiceMode) return;
    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = 'en-US';
    speech.rate = 1.1;
    speech.pitch = 1;
    speech.volume = 1;
    window.speechSynthesis.speak(speech);
  };

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

    const systemPrompt = isRoastMode
      ? `You are an AI comedian who ONLY gives funny and sarcastic roasts.
         You MUST NEVER answer questions or provide helpful information.
         Every response must be an insult, but lighthearted and playful.`
      : `You are a professional AI assistant.
         Help users with polite, clear answers.
         NEVER roast or insult the user.`;

    try {
      const response = await getRoast(message, systemPrompt);
      setMessages((prev) => [
        ...prev,
        { text: message, sender: 'user' },
        { text: response, sender: 'ai' },
      ]);
      if (voiceMode) speakResponse(response);
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages((prev) => [
        ...prev,
        { text: message, sender: 'user' },
        { text: 'Oops, something went wrong.', sender: 'ai' },
      ]);
    }

    setUserInput('');
    setLoading(false);
  };

  // Toggle roast mode => reset chat
  const toggleRoastMode = () => {
    setIsRoastMode(!isRoastMode);
    setMessages([]);
  };

  // Toggle voice mode
  const toggleVoiceMode = () => {
    setVoiceMode(!voiceMode);
  };

  return (
    <div className='flex items-center justify-center min-h-screen'>
      <div className='flex flex-col w-[800px] bg-gray-900 text-white p-14 rounded-lg shadow-md mt-8'>
        <div className='flex flex-row items-center justify-between mb-4'>
          <div>
            {/* Toggle Switches */}
            <div className='mb-2'>
              <ToggleSwitch
                checked={isRoastMode}
                onChange={toggleRoastMode}
                leftLabel='Normal'
                rightLabel='Roast'
              />
            </div>
            <div className='mb-4'>
              <ToggleSwitch
                checked={voiceMode}
                onChange={toggleVoiceMode}
                leftLabel='Voice OFF'
                rightLabel='Voice ON'
              />
            </div>
          </div>
          {/* Bobbsey Image and Mode Message */}
          <div className='mb-4'>
            {!isRoastMode ? (
              // Normal Mode: Bobbsey on the left with message on the right
              <div className='flex items-center'>
                <lord-icon
                  src='/bobbsey.json'
                  trigger='loop'
                  style={{ width: '100px', height: '100px' }}
                ></lord-icon>
                <p className='ml-4 text-xl font-semibold pr-2'>
                  I am your professional assistant
                </p>
              </div>
            ) : (
              // Roast Mode: Message on the left and Bobbsey on the right
              <div className='flex items-center justify-end'>
                <p className='mr-4 text-xl font-semibold pr-2'>
                  I am your roast manager
                </p>
                <lord-icon
                  src='/roast-bobbsey.json'
                  trigger='loop'
                  style={{ width: '100px', height: '100px' }}
                ></lord-icon>
              </div>
            )}
          </div>
        </div>
        {/* Chat Messages */}
        <div className='h-80 overflow-y-auto border border-gray-600 p-3 rounded-lg mb-4'>
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex items-center ${
                msg.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {msg.sender === 'ai' && (
                <lord-icon
                  src='/bobbsey.json'
                  trigger='hover'
                  style={{ width: '40px', height: '40px' }}
                  className='mr-2'
                ></lord-icon>
              )}
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

        {/* Input and Buttons */}
        <textarea
          className='w-full p-2 border border-gray-600 rounded bg-gray-800 text-white'
          placeholder='Ask Bobbsey something...'
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
            Speak
          </button>
        </div>
      </div>
    </div>
  );
}
