import { useEffect, useCallback } from 'react';

export const useGameControls = (gameState, updateGameState) => {
  const handleKeyDown = useCallback((event) => {
    if (!gameState.started || gameState.gameOver) return;

    const key = event.code;
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(key)) {
      event.preventDefault();
      updateGameState({
        keys: {
          ...gameState.keys,
          [key]: true
        }
      });
    }
  }, [gameState.started, gameState.gameOver, gameState.keys, updateGameState]);

  const handleKeyUp = useCallback((event) => {
    const key = event.code;
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(key)) {
      event.preventDefault();
      updateGameState({
        keys: {
          ...gameState.keys,
          [key]: false
        }
      });
    }
  }, [gameState.keys, updateGameState]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  return {
    controls: gameState.keys
  };
}; 