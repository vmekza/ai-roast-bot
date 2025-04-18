import React, { useState, useRef, useEffect } from 'react';
import ToggleSwitch from './ToggleSwitch';
import { getRoast } from '../api';

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

    setMessages((prev) => [
      ...prev,
      { text: message, sender: 'user' },
      { text: 'thinking', sender: 'ai-thinking' },
    ]);

    const systemPrompt = isRoastMode
      ? `Your name is Bobbsey. You are an AI comedian who ONLY gives funny and sarcastic roasts.
         You MUST NEVER answer questions or provide helpful information.
         Every response must be an insult, but lighthearted and playful.`
      : `Your name is Bobbsey. You are a professional AI assistant.
         Help users with polite, clear answers.
         NEVER roast or insult the user.`;

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const response = await getRoast(message, systemPrompt);

      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = { text: response, sender: 'ai' };
        return updated;
      });

      if (voiceMode) speakResponse(response);
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          text: 'Oops, something went wrong.',
          sender: 'ai',
        };
        return updated;
      });
    }

    setUserInput('');
    setLoading(false);
  };

  const toggleRoastMode = () => {
    setIsRoastMode(!isRoastMode);
    setMessages([]);
  };

  const toggleVoiceMode = () => {
    setVoiceMode(!voiceMode);
  };

  return (
    <div className='flex items-center justify-center min-h-screen'>
      <div className='flex flex-col w-[800px] bg-gray-900 text-white p-14 rounded-lg shadow-md mt-8'>
        <div className='flex flex-row items-center justify-between mb-4'>
          <div>
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

          <div className='mb-4'>
            {!isRoastMode ? (
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
              <div className='flex items-center justify-end'>
                <p className='mr-4 text-xl font-semibold pr-2'>
                  I am your roast manager
                </p>
                <lord-icon
                  src='/bobbsey-roast.json'
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
              {msg.sender.startsWith('ai') && (
                <lord-icon
                  src={isRoastMode ? '/bobbsey-roast.json' : '/bobbsey.json'}
                  trigger={msg.sender === 'ai-thinking' ? 'loop' : 'hover'}
                  style={{ width: '40px', height: '40px' }}
                  className='mr-2'
                ></lord-icon>
              )}
              <p
                className={`p-3 my-1 rounded-lg max-w-xs text-white ${
                  msg.sender === 'user'
                    ? 'bg-[#0077b6]'
                    : msg.sender === 'ai-thinking'
                    ? 'bg-gray-600 italic'
                    : 'bg-gray-700'
                }`}
              >
                {msg.sender === 'ai-thinking' ? (
                  <span className='typing-dots'>
                    <span className='dot'>.</span>
                    <span className='dot'>.</span>
                    <span className='dot'>.</span>
                  </span>
                ) : (
                  msg.text
                )}
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

      <style>{`
        .typing-dots {
          display: inline-block;
          font-size: 24px;
          letter-spacing: 2px;
          animation: blink 1s infinite;
        }
        @keyframes blink {
          0% { opacity: 0.2; }
          20% { opacity: 1; }
          100% { opacity: 0.2; }
        }
      `}</style>
    </div>
  );
}
