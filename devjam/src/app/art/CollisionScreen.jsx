import React from 'react';

const CollisionScreen = ({ onRetry }) => {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-80 z-10 text-white">
      <h1 className="text-4xl font-bold mb-4">CRASH! 🏎️💥</h1>
      <p className="text-2xl mb-6">Your race has ended due to a collision</p>
      <button
        className="px-8 py-3 bg-red-600 hover:bg-red-700 rounded-lg text-xl font-bold transition-colors"
        onClick={onRetry}
      >
        Retry Race
      </button>
    </div>
  );
};

export default CollisionScreen; 