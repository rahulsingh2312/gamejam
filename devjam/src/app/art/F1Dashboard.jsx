import React, { useState, useEffect } from 'react';
import { 
  Car, 
  Gauge, 
  LifeBuoy, 
  Pen,
  ArrowUp, 
  ArrowDown, 
  ArrowLeft, 
  ArrowRight, 
  Zap,
  X
} from 'lucide-react';

const F1Dashboard = ({ 
  position, 
  lap, 
  maxLaps, 
  speedometer, 
  score, 
  selectedCar, 
  carModels,
  aiCars,
  drsActive,
  drsTime,
}) => {
  const [showTireSelection, setShowTireSelection] = useState(false);
  const [selectedTire, setSelectedTire] = useState({ name: 'Medium', color: '#FFDC00', durability: 40, wear: 50 });
  const [changingTire, setChangingTire] = useState(false);
  const [countdownTimer, setCountdownTimer] = useState(3);
  const [pressedKeys, setPressedKeys] = useState({
    up: false,
    down: false,
    left: false,
    right: false,
    drs: false
  });

  // Mobile view states
  const [showTireMenu, setShowTireMenu] = useState(false);
  const [showTopPlayers, setShowTopPlayers] = useState(false);
  const [showSpeedometer, setShowSpeedometer] = useState(false);

  const tireTypes = [
    { name: 'Soft', color: '#FF4136', durability: 20, wear: 75 },
    { name: 'Medium', color: '#FFDC00', durability: 40, wear: 50 },
    { name: 'Hard', color: '#0074D9', durability: 60, wear: 25 }
  ];

  // Handle mobile menu visibility
  const toggleMobileMenu = (menu) => {
    // Close all menus first
    setShowTireMenu(false);
    setShowTopPlayers(false);
    setShowSpeedometer(false);
    
    // Then open the selected menu
    if (menu === 'tires') setShowTireMenu(true);
    if (menu === 'players') setShowTopPlayers(true);
    if (menu === 'speed') setShowSpeedometer(true);
  };

  // Tire Change Mechanism
  const initiateTireChange = () => {
    setShowTireSelection(true);
  };

  const selectTire = (tire) => {
    setSelectedTire(tire);
    setShowTireSelection(false);
    setChangingTire(true);
    
    const timer = setInterval(() => {
      setCountdownTimer((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setChangingTire(false);
          setCountdownTimer(3);
          return 3;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Speedometer Rendering
  const renderSpeedometer = () => {
    const maxSpeed = 340;
    const angle = Math.min((speedometer / maxSpeed) * 180, 180);

    return (
      <div className="relative w-36 h-24">
        <svg viewBox="0 0 100 50" className="absolute top-0 left-0 w-full h-full">
          {/* Background Arc */}
          <path
            d="M10 40 A40 40 0 0 1 90 40"
            fill="none"
            stroke="#0f0"
            strokeWidth="5"
          />
          
          {/* Speed Arc */}
          <path
            d={`M10 40 A40 40 0 0 1 ${Math.cos(Math.PI * angle / 180) * 40 + 50} ${-Math.sin(Math.PI * angle / 180) * 40 + 40}`}
            fill="none"
            stroke="#333"
            strokeWidth="5"
          />
          
          {/* Needle */}
          <line
            x1="50"
            y1="40"
            x2={`${Math.cos(Math.PI * angle / 180) * 35 + 50}`}
            y2={`${-Math.sin(Math.PI * angle / 180) * 35 + 40}`}
            stroke="red"
            strokeWidth="2"
          />
        </svg>
        <div className="absolute bottom-0 left-0 right-0 text-center text-white text-sm">
          {speedometer} KPH
        </div>
      </div>
    );
  };

  // Top Competitors
  const topCompetitors = aiCars
    .filter(car => car.mesh.visible)
    .sort((a, b) => {
      const aProgress = a.lap * 1000 + a.mesh.position.z;
      const bProgress = b.lap * 1000 + b.mesh.position.z;
      return bProgress - aProgress;
    })
    .slice(0, 5);

  return (
    <div className="fixed top-0 left-0 right-0 p-4 flex justify-between items-center z-10 text-white font-mono">
      {/* Tire Selection Modal */}
      {showTireSelection && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg shadow-2xl">
            <h2 className="text-xl mb-4 font-bold">Select Tire Type</h2>
            <div className="flex space-x-4">
              {tireTypes.map((tire) => (
                <button
                  key={tire.name}
                  onClick={() => selectTire(tire)}
                  className="p-3 rounded-lg hover:scale-105 transition-transform"
                  style={{ 
                    backgroundColor: tire.color,
                    color: tire.name === 'Medium' ? 'black' : 'white'
                  }}
                >
                  <div className="font-bold">{tire.name}</div>
                  <div className="text-sm">{tire.wear}% Wear</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tire Changing Overlay */}
      {changingTire && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
          <div className="text-center">
            <h2 className="text-3xl mb-4 font-bold">
                You Are In A Pit Stop 🚧
                </h2>
            <div className="text-6xl font-mono font-bold">{countdownTimer}</div>
            <div className="mt-4">
              <LifeBuoy size={64} className="mx-auto animate-pulse" />
            </div>
          </div>
        </div>
      )}

      {/* Desktop View */}
      <div className="hidden md:flex w-full justify-between items-start">
      {/* Left Panel - Car and Tire Info */}
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-4 space-y-3 shadow-lg">
        <div className="flex items-center space-x-3">
        <img
            src={`https://media.formula1.com/content/dam/fom-website/teams/2025/${carModels[selectedCar].image}-logo.png`}
            alt={`${carModels[selectedCar].name} Logo`}
            className="h-12 w-12 mb-2"
          />
       <div className="flex flex-col">
              <span className="text-lg font-bold">{carModels[selectedCar].name}</span>
              <span className="text-lg font-bold text-green-400">Score: {score}</span>
            </div>
    </div>
        
        {/* Compact Tire Change Button */}
        <div className="flex items-center space-x-2">
          <button 
            onClick={initiateTireChange}
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 rounded-full p-2 transition-colors"
          >
              <LifeBuoy size={20} /> <Pen size={20} />  
          </button>
          <div className="flex items-center space-x-1">
            <div 
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: selectedTire?.color || '#888' }}
            />
            <span className="text-sm">{selectedTire?.name || 'No Tire'}</span>
            <span className="text-xs text-gray-400 ml-1">
              {selectedTire ? `${selectedTire.wear}% Wear` : ''}
            </span>
          </div>
        </div>
      </div>

      {/* Center Panel - Race Info and Controls */}
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-4 space-y-3 shadow-lg">
        {/* Race Information */}
        <div className="grid grid-cols-2 gap-2 text-center">
          <div>
            <span className="text-xs text-gray-400">LAP</span>
            <div className="font-bold">{lap} / {maxLaps}</div>
          </div>
          <div>
            <span className="text-xs text-gray-400">POSITION</span>
            <div className="font-bold">{position}{getOrdinal(position)}</div>
          </div>
        </div>
   
        <div className='flex justify-center items-center gap-5'>
            {renderSpeedometer()}
          <div className="flex flex-col items-center">
            <button 
              className={`rounded-full p-3 transition-colors ${
                drsActive 
                  ? 'bg-green-500 hover:bg-green-600' 
                  : 'bg-red-500 hover:bg-red-600'
              }`}
            >
              <Zap size={24} />
            </button>
            <span className="text-xs mt-4">
              DRS: {drsActive ? 'ACTIVE' : 'INACTIVE'}
                <br />
              Press Space 3 sec
              </span>
          </div>
      </div>
      </div>

      {/* Right Panel - Speed and Competitors */}
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-4 space-y-3 shadow-lg">
        {/* Top Competitors */}
        <div>
          <div className="text-xs text-gray-400 mb-2">TOP 5 COMPETITORS</div>
          {topCompetitors.map((car, index) => (
            <div 
              key={index} 
                className="flex items-center justify-between text-sm hover:bg-white/10 rounded px-2 py-1 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className="font-bold text-gray-400">{index + 1}.</span>
                  <span className="font-medium">{car.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400">{carModels[car.teamIndex || 0].name}</span>
                  <div 
                    className="w-2 h-2 rounded-full" 
                    style={{ backgroundColor: `#${carModels[car.teamIndex || 0].color.toString(16).padStart(6, '0')}` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile View */}
      <div className="  w-full">
        {/* Main Dashboard */}
        <div className="bg-black/50   backdrop-blur-sm rounded-lg p-4 flex justify-between items-center">
          <div>
            <div className="text-white text-sm">LAP</div>
            <div className="text-white font-bold">{lap} / {maxLaps}</div>
          </div>
          <div>
            <div className="text-white text-sm">POSITION</div>
            <div className="text-white font-bold">{position}{getOrdinal(position)}</div>
          </div>
          <div>
            <div className="text-white text-sm">SPEED</div>
            <div className="text-white font-bold">{speedometer} KPH</div>
          </div>
          <div>
            <div className="text-white text-sm">SCORE</div>
            <div className="text-white font-bold">{score}</div>
          </div>
        </div>

        {/* Menu Toggle Buttons */}
        <div className="mt-4 hidden  flex justify-between">
          <button 
            onClick={() => toggleMobileMenu('tires')}
            className={`bg-black/50 backdrop-blur-sm rounded-lg px-4 py-2 text-white ${showTireMenu ? 'bg-blue-500/50' : ''}`}
          >
            Tires
          </button>
          <button 
            onClick={() => toggleMobileMenu('speed')}
            className={`bg-black/50 backdrop-blur-sm rounded-lg px-4 py-2 text-white ${showSpeedometer ? 'bg-blue-500/50' : ''}`}
          >
            Speedometer
          </button>
          <button 
            onClick={() => toggleMobileMenu('players')}
            className={`bg-black/50 backdrop-blur-sm rounded-lg px-4 py-2 text-white ${showTopPlayers ? 'bg-blue-500/50' : ''}`}
          >
            Top Players
          </button>
        </div>

        {/* Sliding Tire Menu */}
        <div className={`fixed top-0 left-0 h-full w-64 bg-black/80 backdrop-blur-sm transform transition-transform duration-300 ease-in-out ${showTireMenu ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="p-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-white text-xl font-bold">Tire Selection</h2>
              <button 
                onClick={() => setShowTireMenu(false)}
                className="text-white hover:text-gray-300"
              >
                <X size={20} />
              </button>
            </div>
            <div className="flex flex-col space-y-4">
              <div className="flex items-center space-x-3">
                <img
                  src={`https://media.formula1.com/content/dam/fom-website/teams/2025/${carModels[selectedCar].image}-logo.png`}
                  alt={`${carModels[selectedCar].name} Logo`}
                  className="h-12 w-12"
                />
                <div className="flex flex-col">
                  <span className="text-lg font-bold">{carModels[selectedCar].name}</span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button 
                  onClick={initiateTireChange}
                  className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 rounded-full p-2 transition-colors"
                >
                  <LifeBuoy size={20} /> <Pen size={20} />  
                </button>
                <div className="flex items-center space-x-1">
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: selectedTire?.color || '#888' }}
                  />
                  <span className="text-sm">{selectedTire?.name || 'No Tire'}</span>
                  <span className="text-xs text-gray-400 ml-1">
                    {selectedTire ? `${selectedTire.wear}% Wear` : ''}
                  </span>
                </div>
              </div>
              <div className="mt-4 p-4 bg-gray-700/30 rounded-lg">
                <h3 className="text-white font-bold mb-2">Current Tire Info</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Type:</span>
                    <span className="font-bold">{selectedTire.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Durability:</span>
                    <span className="font-bold">{selectedTire.durability}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Wear:</span>
                    <span className="font-bold">{selectedTire.wear}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sliding Speedometer Menu */}
        <div className={`fixed top-0 right-0 h-full w-64 bg-black/80 backdrop-blur-sm transform transition-transform duration-300 ease-in-out ${showSpeedometer ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="p-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-white text-xl font-bold">Speedometer</h2>
              <button 
                onClick={() => setShowSpeedometer(false)}
                className="text-white hover:text-gray-300"
              >
                <X size={20} />
              </button>
            </div>
            <div className="flex flex-col items-center space-y-6">
              <div className="flex justify-center">
                {renderSpeedometer()}
              </div>
              <div className="flex flex-col items-center">
                <button 
                  className={`rounded-full p-3 transition-colors ${
                    drsActive 
                      ? 'bg-green-500 hover:bg-green-600' 
                      : 'bg-red-500 hover:bg-red-600'
                  }`}
                >
                  <Zap size={24} />
                </button>
                <span className="text-xs mt-4 text-center">
                  DRS: {drsActive ? 'ACTIVE' : 'INACTIVE'}
                  <br />
                  Press Space 3 sec
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Sliding Top Players Menu */}
        <div className={`fixed top-0 right-0 h-full w-64 bg-black/80 backdrop-blur-sm transform transition-transform duration-300 ease-in-out ${showTopPlayers ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="p-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-white text-xl font-bold">Top Players</h2>
              <button 
                onClick={() => setShowTopPlayers(false)}
                className="text-white hover:text-gray-300"
              >
                <X size={20} />
              </button>
            </div>
            <div className="space-y-4">
              {topCompetitors.map((car, index) => (
                <div key={index} className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-white font-bold">{car.name}</div>
                      <div className="text-gray-300 text-sm">{carModels[car.teamIndex || 0].name}</div>
                    </div>
                    <div className="text-white font-bold">
                      {index + 1}{getOrdinal(index + 1)}
                    </div>
                  </div>
                  <div className="mt-2 text-gray-300 text-sm">
                    Lap: {car.lap} / {maxLaps}
                  </div>
            </div>
          ))}
            </div>
          </div>
        </div>
      </div>

           {/* Control Indicators */}
      <div className="absolute md:block hidden -bottom-full left-4 pointer-events-auto">
        <div className='flex justify-center items-center mx-auto'>Tut</div>
        <div className="flex justify-center space-x-4 mt-2">
          <div className="grid grid-cols-3 grid-rows-3 gap-1 w-fit h-24 bg-black/50 rounded-lg p-2">
            <div></div>
            <div
              className={`bg-white/10 w-fit p-2 rounded flex items-center justify-center 
                ${pressedKeys.up ? 'bg-blue-500/50' : ''}`}
            >
               Gas⛽️
            </div>
            <div></div>
            
            <div
              className={`bg-white/10 w-fit p-2 rounded flex items-center mx-auto justify-center 
                ${pressedKeys.left ? 'bg-blue-500/50' : ''}`}
            >
                <ArrowLeft size={20} />
            </div>
            <div></div>
            <div
              className={`bg-white/10 w-fit p-2 rounded flex items-center justify-center mx-auto
                ${pressedKeys.right ? 'bg-blue-500/50' : ''}`}
            >
               <ArrowRight size={20} />
            </div>
            
            <div></div>
            <div
              className={`bg-white/10 w-fit p-2 rounded flex items-center justify-center 
                ${pressedKeys.down ? 'bg-blue-500/50' : ''}`}
            >
              break
            </div>
            <div></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default F1Dashboard;

// Helper function to get ordinal suffix
function getOrdinal(n) {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return s[(v - 20) % 10] || s[v] || s[0];
}