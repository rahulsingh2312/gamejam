import { useState, useCallback } from 'react';

export const useGameState = () => {
  const initialState = {
    score: 0,
    lap: 1,
    maxLaps: 5,
    gameOver: false,
    started: false,
    speedometer: 0,
    carSpeed: 0,
    position: 1,
    playerX: 0,
    playerZ: 0,
    playerRotation: 0,
    collision: false,
    animation: null,
    drsTime: 0,
    drsActive: false,
    mobileControls: {
      left: false,
      right: false,
      accelerate: false,
      brake: false,
      boost: false
    },
    keys: {
      ArrowUp: false,
      ArrowDown: false,
      ArrowLeft: false,
      ArrowRight: false,
      Space: false
    }
  };

  const [gameState, setGameState] = useState(initialState);

  const updateGameState = useCallback((newState) => {
    setGameState(prev => {
      // Create the next state by merging the previous state with the new state
      const nextState = {
        ...prev,
        ...newState
      };

      // Calculate physics based on both keyboard and mobile controls
      const maxSpeed = 1.2;
      const acceleration = 0.005;
      const braking = 0.01;
      const drag = 0.001;
      const handling = 0.15;

      // Update speed based on controls
      let speed = nextState.carSpeed;
      if (nextState.keys.ArrowUp || nextState.mobileControls.accelerate) {
        speed += acceleration;
      }
      if (nextState.keys.ArrowDown || nextState.mobileControls.brake) {
        speed -= braking;
      }
      if (nextState.keys.Space || nextState.mobileControls.boost) {
        speed += 0.2;
      }
      speed = Math.max(0, Math.min(speed - drag, maxSpeed));

      // Update position based on controls
      let posX = nextState.playerX;
      if (nextState.keys.ArrowLeft || nextState.mobileControls.left) {
        posX += handling;
      }
      if (nextState.keys.ArrowRight || nextState.mobileControls.right) {
        posX -= handling;
      }
      posX = Math.max(-15, Math.min(15, posX));

      // Update rotation based on controls
      let rotation = nextState.playerRotation;
      if (nextState.keys.ArrowLeft || nextState.mobileControls.left) {
        rotation = Math.min(rotation + 0.01, 0.1);
      } else if (nextState.keys.ArrowRight || nextState.mobileControls.right) {
        rotation = Math.max(rotation - 0.01, -0.1);
      } else {
        rotation *= 0.9;
      }

      // Return the final state with updated physics
      return {
        ...nextState,
        carSpeed: speed,
        playerX: posX,
        playerRotation: rotation,
        speedometer: Math.round(speed * 300)
      };
    });
  }, []);

  const resetGame = useCallback(() => {
    setGameState(initialState);
  }, []);

  const startGame = useCallback(() => {
    setGameState(prev => ({ ...prev, started: true }));
  }, []);

  const handleCollision = useCallback(() => {
    setGameState(prev => ({ ...prev, collision: true, gameOver: true }));
  }, []);

  const completeLap = useCallback(() => {
    setGameState(prev => {
      const newLap = prev.lap + 1;
      return {
        ...prev,
        lap: newLap,
        gameOver: newLap > prev.maxLaps
      };
    });
  }, []);

  const toggleDRS = useCallback((active) => {
    setGameState(prev => ({ ...prev, drsActive: active }));
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