import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Typewriter } from 'react-simple-typewriter';
import { useNavigate } from 'react-router-dom';

function TourTooltip({ top, left, text, onNext }) {
  return (
    <motion.div
      className='absolute bg-white text-black p-3 rounded-lg shadow-lg z-50 w-48 max-w-[80vw] sm:w-56'
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.3 }}
      style={{ top, left }}
    >
      <p className='text-sm mb-2'>{text}</p>
      <button
        onClick={onNext}
        className='bg-blue-500 text-white px-2 py-1 rounded text-xs hover:bg-blue-600 transition'
      >
        Next
      </button>
    </motion.div>
  );
}

export default function Onboarding() {
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(true);
  const [tourStep, setTourStep] = useState(0);

  // Responsive tooltip positions (percentages)
  const [roastTogglePos] = useState({ top: '20%', left: '10%' });
  const [voiceTogglePos] = useState({ top: '30%', left: '10%' });
  const [sendButtonPos] = useState({ top: '60%', left: '40%' });

  // Looping for icon animation
  const [isLooping, setIsLooping] = useState(true);
  const timers = useRef([]);

  useEffect(() => {
    function cycle() {
      setIsLooping(true);
      const stopTimer = setTimeout(() => setIsLooping(false), 3000);
      const startTimer = setTimeout(() => cycle(), 7000);
      timers.current.push(stopTimer, startTimer);
    }
    cycle();
    return () => timers.current.forEach((t) => clearTimeout(t));
  }, []);

  return (
    <div className='min-h-screen bg-gray-100 p-4 flex items-center justify-center relative overflow-hidden'>
      <AnimatePresence>
        {showPopup && (
          <div className='flex flex-col-reverse lg:flex-row items-center justify-center gap-8 w-full max-w-4xl'>
            {/* Bobbsey Icon */}
            <motion.div
              initial={{ y: '-100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1.5 }}
            >
              <lord-icon
                src='/bobbsey.json'
                trigger='loop'
                // base 200px (w-48), tablet 256px (sm:w-64), desktop 288px (lg:w-72)
                className='w-48 h-48 sm:w-64 sm:h-64 lg:w-72 lg:h-72'
              />
            </motion.div>

            {/* Welcome Message */}
            <motion.div
              initial={{ x: '100%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 1.5, delay: 0.3 }}
              className='w-full max-w-xl bg-white p-6 rounded-lg shadow-lg'
            >
              <Typewriter
                words={[
                  'Hey, I’m Bobbsey! I can be your friendly assistant or your roast manager. Ready to begin?',
                ]}
                loop={1}
                typeSpeed={60}
                deleteSpeed={40}
                delaySpeed={800}
              />
              <div className='mt-4 text-right'>
                <button
                  className='bg-green-500 text-white px-4 py-2 rounded-lg transition ease-in-out duration-200 hover:bg-green-600 hover:scale-105'
                  onClick={() => navigate('/chat')}
                >
                  Take me to the chat!
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Tour Tooltips */}
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
            top='50%'
            left='30%'
            text='That’s it! Enjoy the bot!'
            onNext={() => setTourStep(0)}
          />
        )}
      </AnimatePresence>

      {/* Fallback Button */}
      {!showPopup && (
        <div className='text-center mt-8'>
          <button
            className='bg-green-500 text-white px-4 py-2 rounded-lg'
            onClick={() => navigate('/chat')}
          >
            Go to the Chat
          </button>
        </div>
      )}
    </div>
  );
}
