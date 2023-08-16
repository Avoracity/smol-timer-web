import React, { useState } from 'react';
import CircularProgressTimer from './CircularProgressTimer';

const App = () => {
  const [timers, setTimers] = useState([]);
  //const inputRefs = useRef([]); // Refs for input fields

  const addTimer = () => {
    const newTimer = { id: Date.now() };
    setTimers([...timers, newTimer]);
  };

  function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }
  //let randomColor = getRandomColor();
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-indigo-950">
      <h1 className="text-3xl font-bold mb-4 text-yellow-50">Circular Progress Timers</h1>
      <button
        className="bg-indigo-500 text-white px-4 py-2 rounded-md mb-4"
        onClick={addTimer}
      >
        Add Timer
      </button>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {timers.map((timer, index) => {
          const randomColor = getRandomColor();
          return (
            <div key={timer.id}>
              <div className="rounded-lg p-4 shadow-md bg-indigo-900" style={{ boxShadow: `6px 6px 0px 0px ${randomColor}` }}>
                <CircularProgressTimer />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default App;