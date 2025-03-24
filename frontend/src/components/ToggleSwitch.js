import React from 'react';

export default function ToggleSwitch({
  checked,
  onChange,
  leftLabel = 'Normal',
  rightLabel = 'Roast',
}) {
  return (
    <div
      className='relative w-[200px] h-10 rounded-full bg-gray-300 cursor-pointer overflow-hidden'
      onClick={onChange}
    >
      <div
        className={`
          absolute top-0 left-0 w-[100px] h-full rounded-full
          transition-transform duration-300
          ${checked ? 'translate-x-full bg-red-500' : 'bg-blue-500'}
        `}
      />
      <div className='relative flex items-center justify-between h-full px-2'>
        <div className='w-[83px] flex justify-center items-center'>
          <span
            className={`text-sm font-medium ${
              checked ? 'text-gray-700' : 'text-white'
            }`}
          >
            {leftLabel}
          </span>
        </div>
        <div className='w-[83px] flex justify-center items-center'>
          <span
            className={`text-sm font-medium ${
              checked ? 'text-white' : 'text-gray-700'
            }`}
          >
            {rightLabel}
          </span>
        </div>
      </div>
    </div>
  );
}
