import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getRoast } from '../api'; // your existing API function

export default function OnboardingRoastBot() {
  // 1) Control the initial popup
  const [showPopup, setShowPopup] = useState(true);

  // 2) After the chatbot appears, we guide the user with Boobsey’s pointers
  //    tourStep = 0 => No tour (yet)
  //    tourStep = 1 => highlight Roast Mode
  //    tourStep = 2 => highlight Voice Mode
  //    tourStep = 3 => highlight Send button
  //    tourStep = 4 => tour done
  const [tourStep, setTourStep] = useState(0);

  // Positions for each tooltip (approximate). In a real app,
  // you might use refs + getBoundingClientRect().
  const [roastTogglePos] = useState({ top: 160, left: 100 });
  const [voiceTogglePos] = useState({ top: 210, left: 100 });
  const [sendButtonPos] = useState({ top: 420, left: 300 });

  // Used for the bubble looping animation (for both bubbles)
  const [isLooping, setIsLooping] = useState(true);
  const timers = useRef([]);

  useEffect(() => {
    function cycle() {
      // Start looping
      setIsLooping(true);
      // After 3 seconds, stop looping
      const stopTimer = setTimeout(() => {
        setIsLooping(false);
      }, 3000);
      timers.current.push(stopTimer);

      // After 7 seconds total (3 on + 4 off), restart cycle
      const startTimer = setTimeout(() => {
        cycle();
      }, 7000);
      timers.current.push(startTimer);
    }
    cycle();

    return () => {
      // Clear all timers on cleanup
      timers.current.forEach((timer) => clearTimeout(timer));
    };
  }, []);

  return (
    <div className='min-h-screen bg-gray-100 p-4 relative'>
      {/* STEP A: The small "Hi, I'm Boobsey" popup */}
      <AnimatePresence>
        {showPopup && (
          <motion.div className='relative w-full h-full'>
            {/* Bobbsey */}
            <motion.div
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1 }}
              style={{ position: 'absolute', top: '500px', right: '25%' }}
            >
              <lord-icon
                src='/bobbsey.json'
                trigger='loop'
                style={{ width: '200px', height: '200px' }}
              ></lord-icon>
            </motion.div>

            {/* First bubble*/}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1 }}
              style={{
                position: 'absolute',
                top: '230px',
                right: '8%',
                marginLeft: '-55px',
                marginBottom: '120px',
              }}
            >
              <lord-icon
                key={isLooping ? 'loop' : 'none'}
                src='/bubble.json'
                trigger={isLooping ? 'loop' : 'none'}
                style={{ width: '300px', height: '300px' }}
              ></lord-icon>
            </motion.div>

            {/* Poppsey */}
            <motion.div
              initial={{ y: '-100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1, delay: 7 }}
              style={{ position: 'absolute', top: '250px', left: '5%' }}
            >
              <lord-icon
                src='/poppsey.json'
                trigger='loop'
                style={{ width: '200px', height: '200px' }}
              ></lord-icon>
            </motion.div>

            {/* Second bubble fades in after second bobbsey */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 7.5 }}
              style={{
                position: 'absolute',
                top: '10%',
                left: '20%',
                marginLeft: '-55px',
                marginBottom: '120px',
              }}
            >
              <lord-icon
                key={isLooping ? 'loop' : 'none'}
                src='/bubble2.json'
                trigger={isLooping ? 'loop' : 'none'}
                style={{ width: '300px', height: '300px' }}
              ></lord-icon>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* STEP B: The chatbot (always rendered, but hidden by popup initially) */}
      {!showPopup && <RoastBot />}

      {/* STEP C: Boobsey’s pointers AFTER the chatbot is shown */}
      <AnimatePresence>
        {tourStep === 1 && (
          <TourTooltip
            top={roastTogglePos.top}
            left={roastTogglePos.left}
            text='Toggle Roast or Normal mode here!'
            onNext={() => setTourStep(2)}
          />
        )}
        {tourStep === 2 && (
          <TourTooltip
            top={voiceTogglePos.top}
            left={voiceTogglePos.left}
            text='Toggle Voice ON/OFF here!'
            onNext={() => setTourStep(3)}
          />
        )}
        {tourStep === 3 && (
          <TourTooltip
            top={sendButtonPos.top}
            left={sendButtonPos.left}
            text='Send a message here!'
            onNext={() => setTourStep(4)}
          />
        )}
        {tourStep === 4 && (
          <TourTooltip
            top={250}
            left={200}
            text='That’s it! Enjoy the bot!'
            onNext={() => setTourStep(0)} // 0 = no tour
          />
        )}
      </AnimatePresence>
    </div>
  );
}

/** A small reusable tooltip for each tour step. */
function TourTooltip({ top, left, text, onNext }) {
  return (
    <motion.div
      className='fixed bg-white text-black p-3 rounded shadow z-50 w-48'
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.3 }}
      style={{ top, left }}
    >
      <p className='text-sm mb-2'>{text}</p>
      <button
        onClick={onNext}
        className='bg-blue-500 text-white px-2 py-1 rounded text-xs'
      >
        Next
      </button>
    </motion.div>
  );
}

function RoastBot() {
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
