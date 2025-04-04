// src/components/Onboarding.js

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Typewriter } from 'react-simple-typewriter';
import { useNavigate } from 'react-router-dom';

/** Optional: Reusable tooltip if you want to keep the "tour step" feature. */
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

export default function Onboarding() {
  const navigate = useNavigate();

  // Controls whether we show the Bobbsey popup
  const [showPopup, setShowPopup] = useState(true);

  // Tour step states (only if you still want the pointer tooltips)
  const [tourStep, setTourStep] = useState(0);

  // Positions for the pointer tooltips
  const [roastTogglePos] = useState({ top: 160, left: 100 });
  const [voiceTogglePos] = useState({ top: 210, left: 100 });
  const [sendButtonPos] = useState({ top: 420, left: 300 });

  // For the bobbsey "bubble" looping animation (if you still want it)
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
    <div className='min-h-screen bg-gray-100 p-4 relative'>
      {/* STEP A: The small "Hi, I'm Bobbsey" popup */}
      <AnimatePresence>
        {showPopup && (
          <motion.div className='relative w-full h-full'>
            {/* Bobbsey JSON animation */}
            <motion.div
              initial={{ y: '-100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 2 }}
              style={{ position: 'absolute', top: '250px', left: '10%' }}
            >
              <lord-icon
                src='/bobbsey.json'
                trigger='loop'
                style={{ width: '300px', height: '300px' }}
              ></lord-icon>
            </motion.div>

            {/* Typed text & button on the RIGHT */}
            <motion.div
              initial={{ x: '100%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 2, delay: 0.5 }}
              style={{
                position: 'absolute',
                top: '220px',
                left: '40%',
                width: '40%',
                backgroundColor: 'white',
                padding: '20px',
                borderRadius: '8px',
                boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
              }}
            >
              <Typewriter
                words={[
                  'Hey, I’m Bobbsey! I can be your friendly assistant or your roast manager. Ready to begin?',
                ]}
                loop={1}
                typeSpeed={70}
                deleteSpeed={50}
                delaySpeed={1000}
              />
              <div className='mt-4 text-right'>
                <button
                  className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600'
                  onClick={() => navigate('/chat')}
                >
                  Take Me to the Chat!
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/*
        If you want the chat to appear *below* the popup (instead of a new route),
        you could import <RoastBot /> and render it here.
        But since we're doing routing, we won't show RoastBot here.
      */}

      {/* Example of pointer tooltips if you want them AFTER the popup is dismissed */}
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
            onNext={() => setTourStep(0)}
          />
        )}
      </AnimatePresence>

      {/*
        Optionally, if you want a "Go to Chat" button after the popup is closed:
      */}
      {!showPopup && (
        <div className='text-center mt-8'>
          <button
            className='bg-green-500 text-white px-4 py-2 rounded'
            onClick={() => navigate('/chat')}
          >
            Go to the Chat
          </button>
        </div>
      )}
    </div>
  );
}
