import { useCallback } from 'react';

export const useMobileControls = (gameState, updateGameState) => {
  const handleTouchStart = useCallback((control) => {
    if (!gameState.started || gameState.gameOver) return;

    // Update both mobile controls and keyboard state to ensure consistent behavior
    updateGameState({
      mobileControls: {
        ...gameState.mobileControls,
        [control]: true
      },
      keys: {
        ...gameState.keys,
        ArrowUp: control === 'accelerate' ? true : gameState.keys.ArrowUp,
        ArrowDown: control === 'brake' ? true : gameState.keys.ArrowDown,
        ArrowLeft: control === 'left' ? true : gameState.keys.ArrowLeft,
        ArrowRight: control === 'right' ? true : gameState.keys.ArrowRight,
        Space: control === 'boost' ? true : gameState.keys.Space
      }
    });
  }, [gameState.started, gameState.gameOver, gameState.mobileControls, gameState.keys, updateGameState]);

  const handleTouchEnd = useCallback((control) => {
    // Update both mobile controls and keyboard state to ensure consistent behavior
    updateGameState({
      mobileControls: {
        ...gameState.mobileControls,
        [control]: false
      },
      keys: {
        ...gameState.keys,
        ArrowUp: control === 'accelerate' ? false : gameState.keys.ArrowUp,
        ArrowDown: control === 'brake' ? false : gameState.keys.ArrowDown,
        ArrowLeft: control === 'left' ? false : gameState.keys.ArrowLeft,
        ArrowRight: control === 'right' ? false : gameState.keys.ArrowRight,
        Space: control === 'boost' ? false : gameState.keys.Space
      }
    });
  }, [gameState.mobileControls, gameState.keys, updateGameState]);

  return {
    handleTouchStart,
    handleTouchEnd,
    controls: gameState.mobileControls
  };
}; 