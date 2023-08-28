import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faPause, faRedo, faInfinity } from '@fortawesome/free-solid-svg-icons';
import alarmSound from './alarm.mp3'; // Adjust the path to your alarm sound file

const CircularProgressTimer = React.forwardRef(({id, onDelete}, ref) => {
    // state variables
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
    const [isDeleted, setIsDeleted] = useState(false);
    const [alarmPlayed, setAlarmPlayed] = useState(false); // New state variable for the alarm

    // Effect to handle countdown and loop
    // interval : updates timer countdown every second
    // setInterval : function that handles countdown logic every 1000
    useEffect(() => {
      const audioElement = new Audio(alarmSound); // Create a new audio element

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
        } else if (time === 0 ) {
          clearInterval(loopInterval);
          setIsPaused(true);

   
                // Play the alarm sound if it hasn't been played in the current loop cycle
                if (!alarmPlayed) {
                  audioElement.play();
                 // setAlarmPlayed(true);
              }
      }
      }, 1000);
  
      // Cleanup interval when component unmounts or dependencies change
      return () => {
        clearInterval(interval);
        clearInterval(loopInterval);
      };
    }, [time, isPaused, isLooped, loopCounter, loopInterval, loopMax, initialTime, alarmPlayed]);
  
    useEffect(() => {
      if (time !== initialTime) {
          // Reset the alarmPlayed state when time changes and isLooped is false
          setAlarmPlayed(false);
      }
  }, [time, isLooped, initialTime]);

    // Effect to handle playing the alarm sound when time reaches 0
    useEffect(() => {
      if (time === 0 && !alarmPlayed) {
        // Play the alarm sound
        const audio = new Audio(alarmSound);
        audio.play();
        
        setAlarmPlayed(true); // Set a state variable to prevent repeated playing
      }
    }, [time, alarmPlayed]);


  
    // Effect to manage input focus when user creates new timer
    useEffect(() => {
      if (ref) {
        ref.current = inputRef.current;
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }
    }, [ref]);
  
        // Reset the alarmPlayed state when the isLooped state changes
        useEffect(() => {
          if (isLooped) {
              setAlarmPlayed(false);
          }
      }, [isLooped]);
  
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
      setIsPaused(false); // start countdown immediately after reset
      //setIsPlayed(false);
      setLoopCounter(0);
      setIsLooped(false);
      if (loopInterval) {
        clearInterval(loopInterval);
      }
    };
  
  const handleInputChange = (e) => {
    const inputValue = e.target.value;
    let newTime = inputValue === '' ? 0 : parseInt(inputValue);

      // Limit the newTime to 999999
      if (newTime > 999999) {
        newTime = 999999;
      }
    setInitialTime(newTime);
    setTime(newTime);
  };

  const handleTitleChange = (e) => {
    setTimerTitle(e.target.value);
  };


  const handleDelete = () => {
    onDelete(id); // Call the onDelete function passed from the parent component
    setIsDeleted(true);
  };

  if (isDeleted) {
    return null; // Don't render the timer if it's deleted
  }


  const progress = ((initialTime - time) / initialTime) * 100;
  const radius = 40;
  const circumference = 2 * Math.PI * radius;

  return (
    <div className="flex items-center space-x-2 relative">
               
      {/* Delete button */}
      <button className="absolute top-0 right-0 text-white" onClick={handleDelete}>
        X
      </button>

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
      <div className="w-2/4 flex flex-col justify-between p-2">
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
            max="999999"
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
      <audio src={alarmSound} preload="auto" />

    </div>
  );
});

export default CircularProgressTimer;
