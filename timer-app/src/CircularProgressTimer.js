import React, { useState, useEffect, useRef } from 'react';

const CircularProgressTimer = React.forwardRef((props, ref) => {
  const [initialTime, setInitialTime] = useState(60);
  const [time, setTime] = useState(initialTime);
  const [isPaused, setIsPaused] = useState(true);
  const inputRef = useRef(null); // Ref for the input field

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isPaused && time > 0) {
        setTime(time - 1);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [time, isPaused]);

  useEffect(() => {
    if (ref) {
      ref.current = inputRef.current; // Set the ref from App.js
      if (inputRef.current) {
        inputRef.current.focus(); // Focus the input field
      }
    }
  }, [ref]);

  const progress = ((initialTime - time) / initialTime) * 100;

  const togglePause = () => {
    setIsPaused(!isPaused);
  };

  const handleInputChange = (e) => {
    const inputValue = e.target.value;
    const newTime = inputValue === '' ? 0 : parseInt(inputValue);
    setInitialTime(newTime);
    setTime(newTime);
  };

  return (
    <div className="flex items-center space-x-4">
      <div className="flex flex-col items-center">
        <svg className="w-24 h-24">
          <circle
            cx="50"
            cy="50"
            r="40"
            stroke="blue"
            strokeWidth="10"
            fill="transparent"
            strokeDasharray="251.327"
            strokeDashoffset={(progress / 100) * 251.327}
          />
        </svg>
        <div className="text-2xl font-bold mt-2">{time} seconds</div>
      </div>
      <div className="w-2/5">
        <input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          value={initialTime}
          onChange={handleInputChange}
          ref={inputRef} // Use the inputRef here
          className="border rounded-md p-2 w-full appearance-none number-input-field"
          min="0"
          disabled={!isPaused}
          style={{ visibility: isPaused ? 'visible' : 'hidden' }}
        />
        <div className="flex justify-center mt-4 space-x-2">
          <button
            className="bg-green-500 text-white px-3 py-2 rounded-lg"
            onClick={togglePause}
          >
            {isPaused ? 'Play' : 'Pause'}
          </button>
          <button
            className="bg-red-500 text-white px-3 py-2 rounded-lg"
            onClick={() => {
              setTime(initialTime);
              setIsPaused(true);
            }}
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
});

export default CircularProgressTimer;
