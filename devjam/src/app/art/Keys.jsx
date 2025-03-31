import React, { useState } from 'react';

const DirectionalButtons = ({ updateGameState }) => {
  const [pressedButtons, setPressedButtons] = useState({
    up: false,
    down: false,
    left: false,
    right: false
  });
  
  // Handle button press
  const handleButtonPress = (direction) => {
    setPressedButtons(prev => ({ ...prev, [direction]: true }));
    
    const event = new KeyboardEvent('keydown', {
      key: `Arrow${direction.charAt(0).toUpperCase() + direction.slice(1)}`,
      code: `Arrow${direction.charAt(0).toUpperCase() + direction.slice(1)}`,
      keyCode: direction === 'up' ? 38 : direction === 'down' ? 40 : direction === 'left' ? 37 : 39,
      which: direction === 'up' ? 38 : direction === 'down' ? 40 : direction === 'left' ? 37 : 39,
      bubbles: true,
      cancelable: true
    });
    
    document.dispatchEvent(event);
  };
  
  // Handle button release
  const handleButtonRelease = (direction) => {
    setPressedButtons(prev => ({ ...prev, [direction]: false }));
    
    const event = new KeyboardEvent('keyup', {
      key: `Arrow${direction.charAt(0).toUpperCase() + direction.slice(1)}`,
      code: `Arrow${direction.charAt(0).toUpperCase() + direction.slice(1)}`,
      keyCode: direction === 'up' ? 38 : direction === 'down' ? 40 : direction === 'left' ? 37 : 39,
      which: direction === 'up' ? 38 : direction === 'down' ? 40 : direction === 'left' ? 37 : 39,
      bubbles: true,
      cancelable: true
    });
    
    document.dispatchEvent(event);
  };
  
  // Handle click for temporary button press (for non-up buttons)
  const handleButtonClick = (direction) => {
    // Press the button
    handleButtonPress(direction);
    
    // Only release if it's not the up button
    if (direction !== 'up') {
      // Release the button after a short delay
      setTimeout(() => {
        handleButtonRelease(direction);
      }, 100); // 100ms delay, adjust as needed
    }
  };
  
  // Generate button component
  const DirectionButton = ({ direction, label, className }) => {
    const isPressed = pressedButtons[direction];
    
    return (
      <button 
        className={`w-20 h-20 rounded-2xl flex items-center justify-center text-white font-bold text-2xl ${className} 
          
         
         `}
        onClick={(e) => {
          e.preventDefault();
          handleButtonClick(direction);
        }}
        aria-label={direction}
      >
        <div className="select-none">
          {label}
        </div>
      </button>
    );
  };

  return (
    <div className="relative p-4 rounded-3xl ">
      <div className="absolute inset-0 rounded-3xl"></div>
      <div className="relative flex flex-col items-center">
        {/* Up Button */}
        <DirectionButton 
          direction="up" 
          label="↑" 
          className="mb-4" 
        />
        
        {/* Left/Right Buttons */}
        <div className="flex space-x-8">
          <DirectionButton 
            direction="left" 
            label="←" 
          />
          
          <DirectionButton 
            direction="right" 
            label="→" 
          />
        </div>
        
        {/* Down Button */}
        <DirectionButton 
          direction="down" 
          label="↓" 
          className="mt-4" 
        />
      </div>
    </div>
  );
};

export default DirectionalButtons;