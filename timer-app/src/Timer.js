// src/Timer.js
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faPause, faSync } from '@fortawesome/free-solid-svg-icons';

const Timer = ({ initialTime = 0 }) => {
  const [time, setTime] = useState(initialTime || 0);
  const [isPaused, setIsPaused] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isPaused && time > 0) {
        setTime(time - 1);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [time, isPaused]);

  const progress = ( initialTime) * 100;

  const togglePause = () => {
    setIsPaused(!isPaused);
  };

  const handleInputChange = (e) => {
    const inputValue = e.target.value;
    const newTime = inputValue === '' ? 0 : parseInt(inputValue);
    setTime(newTime);
  };

  return (
    <div className="bg-white p-4 shadow-md rounded-xl flex items-center space-x-4">
      <div className="w-2/5">
        <input
          type="text"
          placeholder="Title"
          className="mb-2 p-2 border rounded-md w-full"
        />
        <input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          value={time}
          onChange={handleInputChange}
          className="p-2 border rounded-md w-full text-center"
          min="0"
          disabled={!isPaused}
          style={{ visibility: isPaused ? 'visible' : 'hidden' }}
        />
        <div className="flex justify-center mt-4 space-x-2">
          <button
            className="bg-green-500 text-white px-3 py-2 rounded-lg"
            onClick={togglePause}
          >
            <FontAwesomeIcon icon={isPaused ? faPlay : faPause} />
          </button>
          <button
            className="bg-red-500 text-white px-3 py-2 rounded-lg"
            onClick={() => {
              setTime(initialTime);
              setIsPaused(true); // Pause when reset
            }}
          >
            <FontAwesomeIcon icon={faSync} />
          </button>
        </div>
      </div>
      <div className="w-3/5 flex flex-col items-center">
        <svg className="w-40 h-40">
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
    </div>
  );
};

Timer.propTypes = {
  initialTime: PropTypes.number,
};

export default Timer;
