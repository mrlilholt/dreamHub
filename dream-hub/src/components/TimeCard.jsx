import React, { useState, useEffect } from 'react';

export default function TimeCard() {
  const [time, setTime] = useState(new Date());
  
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);

  // Calculate "mission time" (days since Jan 1, 2023)
  const missionStart = new Date('2023-01-01');
  const missionDays = Math.floor((time - missionStart) / (1000 * 60 * 60 * 24));
  const missionHours = time.getHours().toString().padStart(2, '0');
  const missionMinutes = time.getMinutes().toString().padStart(2, '0');
  const missionSeconds = time.getSeconds().toString().padStart(2, '0');

  return (
    <div className="bg-black/80 border border-sky-900/50 rounded-lg p-3 sm:p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="bg-sky-900/50 px-2 py-0.5 rounded text-xs text-sky-300 font-mono">
          SYSTEM CLOCK
        </div>
        <div className="flex space-x-1">
          <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></div>
          <div className="w-1.5 h-1.5 rounded-full bg-sky-400"></div>
        </div>
      </div>
      
      <div className="flex justify-between gap-4">
        <div className="flex-1">
          <div className="text-xs text-gray-500 mb-1 font-mono">EARTH TIME</div>
          <div className="text-2xl text-sky-300 font-mono tracking-wider">
            {time.toLocaleTimeString('en-US', { hour12: false })}
          </div>
          <div className="text-xs text-sky-600 mt-1 font-mono">
            {time.toLocaleDateString()}
          </div>
        </div>
        
        <div className="flex-1">
          <div className="text-xs text-gray-500 mb-1 font-mono">MISSION TIME</div>
          <div className="text-sm text-sky-300 font-mono">
            <span className="text-green-400">T+</span> {missionDays}d {missionHours}:{missionMinutes}:{missionSeconds}
          </div>
          <div className="text-xs text-sky-600 mt-1 font-mono">
            STARDATE {Math.floor(time.getFullYear() - 1900)}.{(time.getMonth() + 1).toString().padStart(2, '0')}{time.getDate().toString().padStart(2, '0')}
          </div>
        </div>
      </div>
      
      <div className="mt-3 pt-2 border-t border-sky-900/30">
        <div className="grid grid-cols-3 gap-2">
          <div>
            <div className="text-xs text-gray-500 mb-1 font-mono">CPU</div>
            <div className="w-full bg-gray-800 rounded-full h-1.5">
              <div className="bg-green-500 h-1.5 rounded-full" style={{width: '34%'}}></div>
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-500 mb-1 font-mono">MEM</div>
            <div className="w-full bg-gray-800 rounded-full h-1.5">
              <div className="bg-yellow-500 h-1.5 rounded-full" style={{width: '67%'}}></div>
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-500 mb-1 font-mono">NET</div>
            <div className="w-full bg-gray-800 rounded-full h-1.5">
              <div className="bg-sky-500 h-1.5 rounded-full" style={{width: '22%'}}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}