import { useState, useCallback } from 'react';

export const useGameState = () => {
  const [gameState, setGameState] = useState({
    score: 0,
    lap: 1,
    maxLaps: 5,
    gameOver: false,
    started: false,
    speedometer: 0,
    carSpeed: 0,
    position: 1,
    keys: {
      ArrowUp: false,
      ArrowDown: false,
      ArrowLeft: false,
      ArrowRight: false,
      Space: false
    },
    mobileControls: {
      left: false,
      right: false,
      accelerate: false,
      brake: false,
      boost: false
    }
  });

  const updateGameState = useCallback((updates) => {
    setGameState(prevState => {
      const newState = { ...prevState, ...updates };
      
      // Combine mobile and keyboard controls
      const isAccelerating = newState.keys.ArrowUp || newState.mobileControls.accelerate;
      const isBraking = newState.keys.ArrowDown || newState.mobileControls.brake;
      const isTurningLeft = newState.keys.ArrowLeft || newState.mobileControls.left;
      const isTurningRight = newState.keys.ArrowRight || newState.mobileControls.right;
      const isBoosting = newState.keys.Space || newState.mobileControls.boost;

      // Update car speed based on combined controls
      if (isAccelerating) {
        newState.carSpeed = Math.min(newState.carSpeed + 0.005, 1.2);
      }
      if (isBraking) {
        newState.carSpeed = Math.max(newState.carSpeed - 0.01, 0);
      }
      if (isBoosting) {
        newState.carSpeed = Math.min(newState.carSpeed + 0.2, 1.2);
      }

      // Apply drag when no controls are active
      if (!isAccelerating && !isBraking && !isBoosting) {
        newState.carSpeed = Math.max(0, newState.carSpeed - 0.001);
      }

      return newState;
    });
  }, []);

  const calculateNewSpeed = (currentSpeed, isAccelerating, isBraking, isBoosting) => {
    const maxSpeed = 1.2;
    const acceleration = 0.005;
    const braking = 0.01;
    const drag = 0.001;
    const boostMultiplier = 1.5;

    let newSpeed = currentSpeed;

    if (isAccelerating) {
      console.log('Accelerating:', newSpeed.toFixed(3));
      newSpeed += acceleration;
    }
    if (isBraking) {
      console.log('Braking:', newSpeed.toFixed(3));
      newSpeed -= braking;
    }
    if (isBoosting) {
      console.log('Boost Activated');
      newSpeed *= boostMultiplier;
    }

    // Apply drag and clamp speed
    newSpeed -= drag;
    newSpeed = Math.max(0, Math.min(newSpeed, maxSpeed));

    if (isAccelerating || isBraking || isBoosting) {
      console.log('New Speed:', newSpeed.toFixed(3));
    }

    return newSpeed;
  };

  const calculateNewPosition = (currentPosition, isAccelerating, isBraking) => {
    // Update position based on speed and controls
    return currentPosition;
  };

  const calculateNewRotation = (currentRotation = 0, isTurningLeft, isTurningRight) => {
    const handling = 0.15;
    let newRotation = currentRotation;

    if (isTurningLeft) {
      newRotation = Math.min(newRotation + 0.01, handling);
    } else if (isTurningRight) {
      newRotation = Math.max(newRotation - 0.01, -handling);
    } else {
      newRotation *= 0.9; // Return to neutral position
    }

    return newRotation;
  };

  const resetGame = useCallback(() => {
    setGameState({
      score: 0,
      lap: 1,
      maxLaps: 5,
      gameOver: false,
      started: false,
      speedometer: 0,
      carSpeed: 0,
      position: 1,
      keys: {
        ArrowUp: false,
        ArrowDown: false,
        ArrowLeft: false,
        ArrowRight: false,
        Space: false
      },
      mobileControls: {
        left: false,
        right: false,
        accelerate: false,
        brake: false,
        boost: false
      }
    });
  }, []);

  const startGame = useCallback(() => {
    setGameState(prevState => ({
      ...prevState,
      started: true
    }));
  }, []);

  const handleCollision = useCallback(() => {
    setGameState(prevState => ({
      ...prevState,
      gameOver: true
    }));
  }, []);

  const completeLap = useCallback(() => {
    setGameState(prevState => ({
      ...prevState,
      lap: prevState.lap + 1
    }));
  }, []);

  const toggleDRS = useCallback(() => {
    setGameState(prevState => ({
      ...prevState,
      drsActive: !prevState.drsActive
    }));
  }, []);

  return {
    gameState,
    updateGameState,
    resetGame,
    startGame,
    handleCollision,
    completeLap,
    toggleDRS
  };
}; 