// src/components/RoastBot.js

import React, { useState, useRef, useEffect } from 'react';
import { getRoast } from '../api'; // your API call
import { motion } from 'framer-motion'; // if you want animations here too

export default function RoastBot() {
  const [userInput, setUserInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isRoastMode, setIsRoastMode] = useState(false);
  const [voiceMode, setVoiceMode] = useState(false);
  const chatRef = useRef(null);

  useEffect(() => {
    chatRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // AI Speaks if voiceMode is ON
  const speakResponse = (text) => {
    if (!text || !voiceMode) return;
    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = 'en-US';
    speech.rate = 1.1;
    speech.pitch = 1;
    speech.volume = 1;
    window.speechSynthesis.speak(speech);
  };

  // Speech-to-Text
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

  // Send message
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

  return (
    <div className='flex flex-col max-w-lg mx-auto bg-gray-900 text-white p-6 rounded-lg shadow-md mt-8'>
      <h1 className='text-2xl font-bold text-center mb-4'>
        AI RoastBot & Assistant
      </h1>

      {/* Roast Mode Toggle */}
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

      {/* Voice Mode Toggle */}
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

      {/* Input + Buttons */}
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
}
