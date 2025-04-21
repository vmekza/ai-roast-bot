import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Typewriter } from 'react-simple-typewriter';
import { useNavigate } from 'react-router-dom';

export default function Onboarding() {
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(true);
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
            <motion.div
              initial={{ y: '-100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1.5 }}
            >
              <lord-icon
                src='/bobbsey.json'
                trigger='loop'
                className='w-48 h-48 sm:w-64 sm:h-64 lg:w-72 lg:h-72'
              />
            </motion.div>

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
