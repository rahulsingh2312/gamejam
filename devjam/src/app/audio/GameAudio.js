class GameAudio {
  constructor() {
    this.sounds = {};
    this.isEnginePlaying = false;
    this.isBoostPlaying = false;
    
    // Only initialize sounds on the client side
    if (typeof window !== 'undefined') {
      this.initializeSounds();
    }
  }

  initializeSounds() {
    try {
      // Engine sound
      this.sounds.engine = new Audio('/sounds/engine.mp3');
      this.sounds.engine.loop = true;
      this.sounds.engine.volume = 0.3;

      // Crash sound
      this.sounds.crash = new Audio('/sounds/crash.mp3');
      this.sounds.crash.volume = 0.5;

      // Countdown sound
      this.sounds.countdown = new Audio('/sounds/countdown.mp3');
      this.sounds.countdown.volume = 0.4;

      // Boost sound
      this.sounds.boost = new Audio('/sounds/boost.mp3');
      this.sounds.boost.volume = 0.4;

      // Coin sound
      this.sounds.coin = new Audio('/sounds/coin.mp3');
      this.sounds.coin.volume = 0.3;

      // Lap sound
      this.sounds.lap = new Audio('/sounds/lap.mp3');
      this.sounds.lap.volume = 0.4;

      // Add error handling for each sound
      Object.values(this.sounds).forEach(sound => {
        sound.onerror = (e) => {
          console.error('Error loading sound:', e);
        };
      });

      console.log('All sounds initialized successfully');
    } catch (error) {
      console.error('Error initializing sounds:', error);
    }
  }

  playEngine() {
    if (this.sounds.engine && !this.isEnginePlaying) {
      this.sounds.engine.play().catch(error => {
        console.error('Error playing engine sound:', error);
      });
      this.isEnginePlaying = true;
    }
  }

  stopEngine() {
    if (this.sounds.engine && this.isEnginePlaying) {
      this.sounds.engine.pause();
      this.isEnginePlaying = false;
    }
  }

  playCrash() {
    if (this.sounds.crash) {
      this.sounds.crash.currentTime = 0;
      this.sounds.crash.play().catch(error => {
        console.error('Error playing crash sound:', error);
      });
    }
  }

  playCountdown() {
    if (this.sounds.countdown) {
      this.sounds.countdown.currentTime = 0;
      this.sounds.countdown.play().catch(error => {
        console.error('Error playing countdown sound:', error);
      });
    }
  }

  playBoost() {
    if (this.sounds.boost && !this.isBoostPlaying) {
      this.sounds.boost.currentTime = 0;
      this.sounds.boost.play().catch(error => {
        console.error('Error playing boost sound:', error);
      });
      this.isBoostPlaying = true;
    }
  }

  stopBoost() {
    if (this.sounds.boost && this.isBoostPlaying) {
      this.sounds.boost.pause();
      this.isBoostPlaying = false;
    }
  }

  playCoin() {
    if (this.sounds.coin) {
      this.sounds.coin.currentTime = 0;
      this.sounds.coin.play().catch(error => {
        console.error('Error playing coin sound:', error);
      });
    }
  }

  playLap() {
    if (this.sounds.lap) {
      this.sounds.lap.currentTime = 0;
      this.sounds.lap.play().catch(error => {
        console.error('Error playing lap sound:', error);
      });
    }
  }

  stopAll() {
    if (this.sounds.engine) {
      this.sounds.engine.pause();
      this.sounds.engine.currentTime = 0;
    }
    if (this.sounds.boost) {
      this.sounds.boost.pause();
      this.sounds.boost.currentTime = 0;
    }
    this.isEnginePlaying = false;
    this.isBoostPlaying = false;
  }
}

// Create a singleton instance
export const gameAudio = new GameAudio(); 