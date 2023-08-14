import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faPause, faRedo, faInfinity } from '@fortawesome/free-solid-svg-icons';
import alarmSound from './alarm.mp3'; // Replace with the correct path to your sound file

const CircularProgressTimer = React.forwardRef((props, ref) => {
    const [initialTime, setInitialTime] = useState(60);
    const [time, setTime] = useState(initialTime);
    const [isPaused, setIsPaused] = useState(true);
    const [isPlayed, setIsPlayed] = useState(false); // Track if play button has been clicked
    const [timerTitle, setTimerTitle] = useState('Timer'); // Default title
    const inputRef = useRef(null);
    const audioElementRef = useRef(null); // Ref for the audio element
  
    useEffect(() => {
        const audioElement = audioElementRef.current; // Store the ref value in a local variable
        const interval = setInterval(() => {
          if (!isPaused && time > 0) {
            setTime(time - 1);
          } else if (time === 0 && !isPlayed) {
            setTimeout(() => {
              audioElement.play(); // Play the sound when timer hits 0 and sound hasn't been played
            }, 500);
            setIsPlayed(true); // Set isPlayed to true
            setIsPaused(true); // Pause the timer
          } else if (time === 0 && isPlayed) {
            setIsPaused(true); // Pause the timer
          }
        }, 1000);
      
        return () => {
          clearInterval(interval);
          audioElement.pause(); // Pause the sound if the component unmounts
          audioElement.currentTime = 0; // Reset the sound to the beginning
        };
      }, [time, isPaused, isPlayed]);
      
    useEffect(() => {
      if (ref) {
        ref.current = inputRef.current;
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }
    }, [ref]);
  
    const progress = ((initialTime - time) / initialTime) * 100;
    const radius = 40;
    const circumference = 2 * Math.PI * radius;
  
    const togglePause = () => {
      setIsPaused(!isPaused);
      if (!isPaused && time === 0) {
        const audioElement = audioElementRef.current; // Store the ref value in a local variable
        audioElement.pause(); // Pause the sound if the pause button is pressed when time is 0
        audioElement.currentTime = 0; // Reset the sound to the beginning
        setIsPlayed(false); // Reset the isPlayed state
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

    const handleRestart = () => {
        setTime(initialTime);
        setIsPaused(true);
        setIsPlayed(false); // Reset the isPlayed state when timer is restarted
      };
  return (
    <div className="flex items-center space-x-4">
      <div className="flex flex-col items-center">
        <svg className="w-24 h-24">
          <circle
            cx="50"
            cy="50"
            r={radius}
            stroke="#f3f3f3"
            strokeWidth="10"
            fill="transparent"
          />
          <circle
            cx="50"
            cy="50"
            r={radius}
            stroke="orange"
            strokeWidth="10"
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
              className="bg-yellow-500 text-white px-3 py-2 rounded-lg"
              onClick={togglePause}
            >
              <FontAwesomeIcon icon={isPaused ? faPlay : faPause} />
            </button>
            <button 
              className="bg-orange-500 text-white px-3 py-2 rounded-lg"
              onClick={() => {
                setTime(initialTime);
                setIsPaused(true);
                handleRestart();
              }}
            >
              <FontAwesomeIcon icon={faRedo} />
            </button>
            <button
              className="bg-red-500 text-white px-3 py-2 rounded-lg"
              onClick={() => {
                // Add loop button functionality here
              }}
            >
              <FontAwesomeIcon icon={faInfinity} />
            </button>
          </div>
        </div>
      </div>
      {/* Audio element for the alarm sound */}
      <audio ref={audioElementRef}>
        <source src={alarmSound} type="audio/mpeg" />
      </audio>
    </div>
  );
});

export default CircularProgressTimer;
