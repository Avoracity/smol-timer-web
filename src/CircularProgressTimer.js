import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faPause, faRedo, faInfinity } from '@fortawesome/free-solid-svg-icons';

const CircularProgressTimer = React.forwardRef((props, ref) => {
    const [initialTime, setInitialTime] = useState(60);
    const [time, setTime] = useState(initialTime);
    const [isPaused, setIsPaused] = useState(true);
    const [isLooped, setIsLooped] = useState(false);
    const [loopInterval, setLoopInterval] = useState(null);
    //const [loopMax, setLoopMax] = useState(999); // default loop amount
    const [loopMax] = useState(999); // default loop amount

    const [loopCounter, setLoopCounter] = useState(0);
    const [timerTitle, setTimerTitle] = useState('Timer');
    const inputRef = useRef(null);
  
    useEffect(() => {
      const interval = setInterval(() => {
        if (!isPaused && time > 0) {
          setTime(time - 1);
        } else if (time === 0 && isLooped) {
          setLoopCounter(loopCounter + 1);
          if (loopCounter < loopMax) {
            setTime(initialTime);
          } else {
            clearInterval(loopInterval);
            setIsLooped(false);
            setIsPaused(true);
            setLoopCounter(0);
          }
        } else if (time === 0) {
          clearInterval(loopInterval);
          setIsPaused(true);
        }
      }, 1000);
  
      return () => {
        clearInterval(interval);
        clearInterval(loopInterval);
      };
    }, [time, isPaused, isLooped, loopCounter, loopInterval, loopMax, initialTime]);
  
    useEffect(() => {
      if (ref) {
        ref.current = inputRef.current;
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }
    }, [ref]);
  
    const togglePause = () => {
      setIsPaused(!isPaused);
    };
  
    const handleLoop = () => {
      setIsLooped(!isLooped);
      if (isLooped) {
        clearInterval(loopInterval);
        setLoopCounter(0);
        setTime(initialTime);
        setIsPaused(false);
      } else {
        const newLoopInterval = setInterval(() => {
          if (isPaused) {
            setTime(initialTime);
          }
        }, initialTime * 1000);
        setLoopInterval(newLoopInterval);
      }
    };
    const handleRestart = () => {
      setTime(initialTime);
      setIsPaused(true);
      //setIsPlayed(false);
      setLoopCounter(0);
      setIsLooped(false);
      if (loopInterval) {
        clearInterval(loopInterval);
      }
    };
  
  const handleInputChange = (e) => {
    const inputValue = e.target.value;
    const newTime = inputValue === '' ? 0 : parseInt(inputValue);
    setInitialTime(newTime);
    setTime(newTime);
  };

  const handleTitleChange = (e) => {
    setTimerTitle(e.target.value);
  };



  const progress = ((initialTime - time) / initialTime) * 100;
  const radius = 40;
  const circumference = 2 * Math.PI * radius;

  return (
    <div className="flex items-center space-x-4">
      <div className="flex flex-col items-center">
        <svg className="w-24 h-24">
          <circle
            cx="50"
            cy="50"
            r={radius}
            stroke="#f3f3f3"
            strokeWidth="3"
            fill="transparent"
          />
          <circle
            cx="50"
            cy="50"
            r={radius}
            stroke="orange"
            strokeWidth="3"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={(circumference * progress) / 100}
          />
        </svg>
        <div className="text-2xl font-bold mt-2 text-yellow-50">{time} seconds</div>
      </div>
      <div className="w-2/4 flex flex-col justify-between">
        <div className="flex flex-col items-center space-y-2">
          <input
            type="text"
            value={timerTitle}
            onChange={handleTitleChange}
            className="border rounded-md p-2 w-full text-white bg-indigo-900 appearance-none"
          />
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={initialTime}
            onChange={handleInputChange}
            ref={inputRef}
            className="border rounded-md p-2 w-full bg-indigo-100 appearance-none number-input-field"
            min="0"
            disabled={!isPaused}
            style={{ visibility: isPaused ? 'visible' : 'hidden' }}
          />
          <div className="flex justify-center space-x-2 pl-10">
            <button
              className="bg-yellow-500 active:bg-yellow-600 text-white px-3 py-2 rounded-lg"
              onClick={togglePause}
            >
              <FontAwesomeIcon icon={isPaused ? faPlay : faPause} />
            </button>
            <button 
              className="bg-orange-500 active:bg-orange-600 text-white px-3 py-2 rounded-lg"
              onClick={() => {
                setTime(initialTime);
                setIsPaused(true);
                handleRestart();
              }}
            >
              <FontAwesomeIcon icon={faRedo} />
            </button>
            <button
              className="bg-red-500 active:bg-red-600 text-white px-3 py-2 rounded-lg"
              onClick={() => {
                handleLoop();
                setTime(initialTime);
                setIsPaused(false);
                //setIsPlayed(false); // Reset isPlayed state
              }}
            >
              <FontAwesomeIcon icon={faInfinity} />
            </button>
          </div>
        </div>
      </div>
      {/* Audio element for the alarm sound */}

    </div>
  );
});

export default CircularProgressTimer;
