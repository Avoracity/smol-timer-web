import React, { useState, useRef } from 'react';
import CircularProgressTimer from './CircularProgressTimer';

const App = () => {
  const [timers, setTimers] = useState([]);
  const inputRefs = useRef([]); // Refs for input fields

  const addTimer = () => {
    const newTimer = { id: Date.now() };
    setTimers([...timers, newTimer]);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-4">Circular Progress Timers</h1>
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded-md mb-4"
        onClick={addTimer}
      >
        Add Timer
      </button>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {timers.map((timer, index) => (
          <div key={timer.id}>
            <div className="rounded-lg p-4 shadow-md">
              <CircularProgressTimer ref={(ref) => (inputRefs.current[index] = ref)} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
