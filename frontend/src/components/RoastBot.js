import React, { useState, useRef, useEffect } from 'react';
import ToggleSwitch from './ToggleSwitch';
import { getRoast } from '../api';

export default function RoastBot() {
  const [userInput, setUserInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isRoastMode, setIsRoastMode] = useState(false);
  const [voiceMode, setVoiceMode] = useState(false);
  const [voices, setVoices] = useState([]);
  const chatRef = useRef(null);

  useEffect(() => {
    chatRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    const synth = window.speechSynthesis;
    const load = () => {
      const available = synth.getVoices();
      if (available.length) setVoices(available);
    };
    load();
    synth.addEventListener('voiceschanged', load);
    return () => synth.removeEventListener('voiceschanged', load);
  }, []);

  // const speakResponse = (text) => {
  //   if (!text || !voiceMode || voices.length === 0) return;
  //   const utter = new SpeechSynthesisUtterance(text);
  //   utter.lang = 'en-US';
  //   utter.voice = voices.find((v) => v.lang.startsWith('en')) || voices[0];
  //   utter.rate = 1.1;
  //   utter.pitch = 1;
  //   utter.volume = 1;
  //   window.speechSynthesis.speak(utter);
  // };

  const speakResponse = (text) => {
    if (!text || !voiceMode) return;

    const synth = window.speechSynthesis;
    const voices = synth.getVoices();
    if (!voices.length) {
      synth.addEventListener('voiceschanged', () => speakResponse(text), {
        once: true,
      });
      return;
    }

    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = 'en-US';
    utter.voice = voices.find((v) => v.lang.startsWith('en')) || voices[0];
    utter.rate = 1.1;
    utter.pitch = 1;
    utter.volume = 1;
    synth.speak(utter);
  };

  const handleVoiceInput = () => {
    const recognition =
      new window.webkitSpeechRecognition() || new window.SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.start();
    recognition.onresult = (e) => setUserInput(e.results[0][0].transcript);
    recognition.onerror = (e) =>
      console.error('Speech Recognition Error:', e.error);
  };

  const sendMessage = async (message) => {
    if (!message.trim()) return;

    setLoading(true);

    setMessages((prev) => [
      ...prev,
      { text: message, sender: 'user' },
      { text: 'thinking', sender: 'ai-thinking' },
    ]);

    setUserInput('');

    const systemPrompt = isRoastMode
      ? `Your name is Bobbsey. You are an AI comedian who ONLY gives funny and sarcastic roasts.`
      : `Your name is Bobbsey. You are a professional AI assistant.`;

    try {
      await new Promise((res) => setTimeout(res, 1500));
      const response = await getRoast(message, systemPrompt);

      setMessages((prev) =>
        prev.slice(0, -1).concat({ text: response, sender: 'ai' })
      );

      if (voiceMode) speakResponse(response);
    } catch {
      setMessages((prev) =>
        prev.slice(0, -1).concat({
          text: 'Oops, something went wrong.',
          sender: 'ai',
        })
      );
    }

    setLoading(false);
  };

  return (
    <div className='min-h-screen bg-gray-00 p-4 flex items-center justify-center'>
      <div className='w-full max-w-md md:max-w-xl lg:max-w-2xl bg-gray-800 text-white rounded-lg shadow-lg p-4 sm:p-6 md:p-8 flex flex-col'>
        {/* Header: toggles & mode info */}
        <div className='flex flex-col sm:flex-row items-center justify-between mb-4 space-y-4 sm:space-y-0'>
          <div className='flex flex-col w-full sm:w-auto space-y-4'>
            <ToggleSwitch
              checked={isRoastMode}
              onChange={() => {
                setIsRoastMode(!isRoastMode);
                setMessages([]);
              }}
              leftLabel='Normal'
              rightLabel='Roast'
            />
            <ToggleSwitch
              checked={voiceMode}
              onChange={() => setVoiceMode(!voiceMode)}
              leftLabel='Voice OFF'
              rightLabel='Voice ON'
            />
          </div>
          <div className='flex items-center space-x-2 w-full sm:w-auto justify-center'>
            {!isRoastMode ? (
              <>
                <lord-icon
                  src='/bobbsey.json'
                  trigger='loop'
                  className='w-12 h-12 sm:w-16 sm:h-16'
                />
                <p className='text-sm sm:text-base md:text-lg font-semibold'>
                  I am your professional assistant
                </p>
              </>
            ) : (
              <>
                <p className='text-sm sm:text-base md:text-lg font-semibold'>
                  I am your roast manager
                </p>
                <lord-icon
                  src='/bobbsey-roast.json'
                  trigger='loop'
                  className='w-12 h-12 sm:w-16 sm:h-16'
                />
              </>
            )}
          </div>
        </div>

        {/* Chat area */}
        <div className='flex-1 bg-gray-700 rounded-lg p-3 overflow-y-auto mb-4'>
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${
                msg.sender === 'user' ? 'justify-end' : 'justify-start'
              } mb-2`}
            >
              {msg.sender !== 'user' && (
                <lord-icon
                  src={isRoastMode ? '/bobbsey-roast.json' : '/bobbsey.json'}
                  trigger={msg.sender === 'ai-thinking' ? 'loop' : 'hover'}
                  className='w-8 h-8 mr-2'
                />
              )}
              <span
                className={`px-3 py-2 rounded-lg max-w-xs break-words ${
                  msg.sender === 'user'
                    ? 'bg-blue-600'
                    : msg.sender === 'ai-thinking'
                    ? 'bg-gray-600 italic'
                    : 'bg-gray-800'
                }`}
              >
                {msg.sender === 'ai-thinking' ? (
                  <span className='typing-dots'>...</span>
                ) : (
                  msg.text
                )}
              </span>
            </div>
          ))}
          <div ref={chatRef} />
        </div>

        {/* Input & buttons */}
        <textarea
          rows={3}
          className='w-full bg-gray-800 text-white p-2 rounded-lg mb-3 border border-gray-600 resize-none'
          placeholder='Ask Bobbsey something...'
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
        />
        <div className='flex flex-col sm:flex-row gap-2'>
          <button
            className='flex-1 bg-green-500 py-2 rounded-lg transition hover:bg-green-600 disabled:opacity-50'
            // onClick={() => sendMessage(userInput)}
            // disabled={loading || !userInput.trim()}

            onClick={() => {
              if (voiceMode) {
                const unlock = new SpeechSynthesisUtterance('');
                window.speechSynthesis.speak(unlock);
              }
              sendMessage(userInput);
              setUserInput('');
            }}
            disabled={loading || !userInput.trim()}
          >
            Send
          </button>
          <button
            className='flex-1 bg-purple-500 py-2 rounded-lg transition hover:bg-purple-600'
            onClick={handleVoiceInput}
          >
            Speak
          </button>
        </div>
      </div>

      <style>{`
        .typing-dots { display: inline-block; animation: blink 1s infinite; }
        @keyframes blink { 0%,100% { opacity:0.2;} 50%{ opacity:1;} }
      `}</style>
    </div>
  );
}
