'use client'
import React, { useEffect, useRef, useState } from 'react';
import Head from 'next/head';
import * as THREE from 'three';
import Image from 'next/image';
import EntryScreen from './art/entryscreen';
import createCar from './art/Car';
import createCrowd from './art/createCrowd';
import F1Dashboard from './art/F1Dashboard';
import CollisionScreen from './art/CollisionScreen';
import { GameScene } from './game/components/GameScene';
import { useGameState } from './game/hooks/useGameState';
import { useGameControls } from './game/hooks/useGameControls';
import { useMobileControls } from './game/hooks/useMobileControls';
import JoystickController    from './art/Keys';
import { gameAudio } from './audio/GameAudio';
import WalletIntegration from './components/WalletIntegration';

export default function Home() {
  const mountRef = useRef(null);
  const rendererRef = useRef(null);
  const gameRef = useRef({
    score: 0,
    lap: 1,
    maxLaps: 5,
    gameOver: false,
    started: false,
    speedometer: 0,
    carSpeed: 0,
    animation: null,
    position: 1,
    aiCars: [],
    selectedCar: 0,
    drsTime : 0,
    drsActive : false
  });
  
  const [score, setScore] = useState(0);
  const [lap, setLap] = useState(1);
  const [maxLaps] = useState(5);
  const [gameOver, setGameOver] = useState(false);
  const [started, setStarted] = useState(false);
  const [speedometer, setSpeedometer] = useState(0);
  const [position, setPosition] = useState(1);
  const [carSelection, setCarSelection] = useState(true);
  const [selectedCar, setSelectedCar] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  // const [drsActive,setDrsActive] = useState(false);
  const [mobileControls, setMobileControls] = useState({
    left: false,
    right: false,
    accelerate: false,
    brake: false,
    boost: false
  });
  const [collision, setCollision] = useState(false);
  const [gameStartTime, setGameStartTime] = useState(null);
  const [fireParticles, setFireParticles] = useState([]);
  const [startingLights, setStartingLights] = useState([false, false, false, false, false]);
  const [countdownStarted, setCountdownStarted] = useState(false);
  const [playerName, setPlayerName] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('playerName') || '';
    }
    return '';
  });
  const [aiCarNames, setAiCarNames] = useState(() => {
    if (typeof window !== 'undefined') {
      return JSON.parse(localStorage.getItem('aiCarNames') || '[]');
    }
    return [];
  });
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showTireMenu, setShowTireMenu] = useState(false);
  const [showTopPlayers, setShowTopPlayers] = useState(false);
  const [showBoostButton, setShowBoostButton] = useState(true);
  
  const {
    gameState,
    updateGameState,
    resetGame: resetGameState,
    startGame: startGameState,
    handleCollision,
    completeLap,
    updatePlayerPosition,
    updateSpeed,
    toggleDRS
  } = useGameState();

  useGameControls(gameState, updateGameState);
  const { mobileControls: gameMobileControls, handleTouchStart, handleTouchEnd } = useMobileControls(gameState, updateGameState);

  // Car models data
  const carModels = [
    { name: "Red Bull Racing", color: 0x0600EF, secondaryColor: 0xFFD700, image: "red-bull-racing" },
    { name: "Ferrari", color: 0xFF0000, secondaryColor: 0x000000, image: "ferrari" },
    { name: "Mercedes AMG", color: 0x00D2BE, secondaryColor: 0x000000, image: "mercedes" },
    { name: "McLaren", color: 0xFF8700, secondaryColor: 0x0000FF, image: "mclaren" },
    { name: "Aston Martin", color: 0x006F62, secondaryColor: 0xFFFFFF, image: "aston-martin" },
    { name: "Alpine", color: 0x0090FF, secondaryColor: 0xFF0000, image: "alpine" },
    { name: "Williams", color: 0x005AFF, secondaryColor: 0xFFFFFF, image: "williams" },
    { name: "Racing Bulls", color: 0x2B4562, secondaryColor: 0xFFFFFF, image: "racing-bulls" },
    { name: "Kick Sauber", color: 0x52E252	, secondaryColor: 0x000000, image: "kick-sauber" },
    { name: "Haas F1", color: 0xFFFFFF, secondaryColor: 0xFF0000, image: "haas" }
  ];
  
  //   const carModels = [
  //   { name: "Red Bull Racing", color: 0x0600EF, secondaryColor: 0xFFD700 , image : "https://media.formula1.com/d_team_car_fallback_image.png/content/dam/fom-website/teams/2025/red-bull-racing.png"  },
  //   { name: "Ferrari", color: 0xFF0000, secondaryColor: 0x000000 , image : "https://media.formula1.com/d_team_car_fallback_image.png/content/dam/fom-website/teams/2025/ferrari.png"},
  //   { name: "Mercedes AMG", color: 0x00D2BE, secondaryColor: 0x000000, image : "https://media.formula1.com/d_team_car_fallback_image.png/content/dam/fom-website/teams/2025/mercedes.png" },
  //   { name: "McLaren", color: 0xFF8700, secondaryColor: 0x0000FF , image : "https://media.formula1.com/d_team_car_fallback_image.png/content/dam/fom-website/teams/2025/mclaren.png"},
  //   { name: "Aston Martin", color: 0x006F62, secondaryColor: 0xFFFFFF , image : "https://media.formula1.com/d_team_car_fallback_image.png/content/dam/fom-website/teams/2025/aston-martin.png"},
  //   { name: "Alpine", color: 0x0090FF, secondaryColor: 0xFF0000 , image : "https://media.formula1.com/d_team_car_fallback_image.png/content/dam/fom-website/teams/2025/alpine.png"},
  //   { name: "Williams", color: 0x005AFF, secondaryColor: 0xFFFFFF , image : "https://media.formula1.com/d_team_car_fallback_image.png/content/dam/fom-website/teams/2025/williams.png"},
  //   { name: "Racing Bulls", color: 0x2B4562, secondaryColor: 0xFFFFFF, image : "https://media.formula1.com/d_team_car_fallback_image.png/content/dam/fom-website/teams/2025/racing-bulls.png" },
  //   { name: "Kick Sauber", color: 0x900000, secondaryColor: 0xFFFFFF , image : "https://media.formula1.com/d_team_car_fallback_image.png/content/dam/fom-website/teams/2025/kick-sauber.png" },
  //   { name: "Haas F1", color: 0xFFFFFF, secondaryColor: 0xFF0000, image : "https://media.formula1.com/d_team_car_fallback_image.png/content/dam/fom-website/teams/2025/haas.png" }
  // ];
  // Add this useEffect to handle document-level touch events

  // Detect mobile device on client side
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  useEffect(() => {
    if (!isMobile) return;

    const keys = {
      ArrowUp: mobileControls.accelerate,
      ArrowDown: mobileControls.brake,
      ArrowLeft: mobileControls.left,
      ArrowRight: mobileControls.right,
      Space: mobileControls.boost
    };

    // Update game ref with current keys state
    gameRef.current = {
      ...gameRef.current,
      keys: keys
    };
  }, [mobileControls, isMobile]);


  
  useEffect(() => {
    if (!mountRef.current || carSelection) return;
    
    // Set up scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x87ceeb); // Sky blue background
    
    // Camera setup
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 5, -10);
    camera.lookAt(0, 0, 10);
    
    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;
    
    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 10, 7.5);
    scene.add(directionalLight);
    
    // Road
    const roadWidth = 30;
    const roadLength = 1000;
    const roadGeometry = new THREE.PlaneGeometry(roadWidth, roadLength);
    const roadMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x333333,
      roughness: 0.7,
    });
    const road = new THREE.Mesh(roadGeometry, roadMaterial);
    road.rotation.x = -Math.PI / 2;
    road.position.z = roadLength / 2;
    scene.add(road);
    
    // Road markings
    const markingsGeometry = new THREE.PlaneGeometry(0.5, roadLength);
    const markingsMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
    const markings = new THREE.Mesh(markingsGeometry, markingsMaterial);
    markings.rotation.x = -Math.PI / 2;
    markings.position.z = roadLength / 2;
    markings.position.y = 0.01; // Just above the road
    scene.add(markings);
    
    // Create grid positions for starting line
    const gridPositionsX = [];
    const lanesCount = 5;
    const laneWidth = (roadWidth - 8) / lanesCount;
    
    for (let i = 0; i < lanesCount; i++) {
      gridPositionsX.push(-roadWidth / 2 + 4 + laneWidth / 2 + i * laneWidth);
    }
    
    // Grid markings
    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < lanesCount; j++) {
        const gridBox = new THREE.Mesh(
          new THREE.PlaneGeometry(laneWidth - 0.5, 4),
          new THREE.MeshStandardMaterial({ 
            color: (i + j) % 2 === 0 ? 0xffffff : 0x222222,
          })
        );
        gridBox.rotation.x = -Math.PI / 2;
        gridBox.position.set(gridPositionsX[j], 0.02, 10 + i * 4);
        scene.add(gridBox);
      }
    }
    
    // Sidewalls to prevent falling off
    const wallHeight = 3;
    const wallGeometry = new THREE.BoxGeometry(1, wallHeight, roadLength);
    const wallMaterial = new THREE.MeshStandardMaterial({ color: 0xEEEEEE, roughness: 0.5 });
    
    const leftWall = new THREE.Mesh(wallGeometry, wallMaterial);
    leftWall.position.set(-roadWidth/2 - 0.5, wallHeight/2, roadLength/2);
    scene.add(leftWall);
    
    const rightWall = new THREE.Mesh(wallGeometry, wallMaterial);
    rightWall.position.set(roadWidth/2 + 0.5, wallHeight/2, roadLength/2);
    scene.add(rightWall);
    
    // Create checkered start/finish line
    const startLineGeometry = new THREE.PlaneGeometry(roadWidth, 4);
    const startLineTexture = createCheckerTexture();
    const startLineMaterial = new THREE.MeshStandardMaterial({ 
      map: startLineTexture, 
      roughness: 0.5 
    });
    const startLine = new THREE.Mesh(startLineGeometry, startLineMaterial);
    startLine.rotation.x = -Math.PI / 2;
    startLine.position.set(0, 0.02, 50); // Start line position
    scene.add(startLine);
    
    // Create crowd in stands
    createCrowd(-roadWidth/2 - 5, roadLength, scene);
    createCrowd(roadWidth/2 + 5, roadLength, scene);
    
    // Function to create checker texture
    function createCheckerTexture() {
      const size = 64;
      const data = new Uint8Array(4 * size * size);
      
      for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
          const stride = (i * size + j) * 4;
          const isWhite = (Math.floor(i / 8) + Math.floor(j / 8)) % 2 === 0;
          const color = isWhite ? 255 : 0;
          
          data[stride] = color;
          data[stride + 1] = color;
          data[stride + 2] = color;
          data[stride + 3] = 255;
        }
      }
      
      const texture = new THREE.DataTexture(data, size, size);
      texture.needsUpdate = true;
      return texture;
    }
    

    
 
    // Create player car
    const playerCar = createCar(
      carModels[selectedCar].color,
      carModels[selectedCar].secondaryColor
    );
    playerCar.position.set(gridPositionsX[2], 0, 20);
    scene.add(playerCar);
    
 
// Create AI cars with better spacing
const aiCars = [];
const gridSpacing = 10; // Increased spacing between cars (was 8)
const gridRows = 3;    // Number of rows in the grid
const gridCols = 3;   

for (let i = 0; i < 9; i++) {
  const teamIndex = i < carModels.length ? i : Math.floor(Math.random() * carModels.length);
  const teamColor = i === selectedCar ? 0x444444 : carModels[teamIndex].color;
  const secondaryColor = i === selectedCar ? 0x666666 : carModels[teamIndex].secondaryColor;
  
  const aiCar = createCar(teamColor, secondaryColor);
  
  // Calculate grid position
  const row = Math.floor(i / gridCols);
  const col = i % gridCols;
  
  const xOffset = (col - 1) * gridSpacing;
  const zOffset = (row + 1) * gridSpacing;
  
  aiCar.position.set(xOffset, 0, 30 + zOffset);
  scene.add(aiCar);
  
  // Create name tag
  const nameTag = createNameTag(aiCarNames[i] || `AI ${i + 1}`);
  aiCar.add(nameTag);
  
  aiCars.push({
    mesh: aiCar,
    speed: 100,
    maxSpeed: 0.5 + Math.random() * 0.6, // Increased max speed
    acceleration: 0.002 + Math.random() * 0.003, // Increased acceleration
    wobble: Math.random() * 0.03,
    lap: 1,
    initialPos: aiCar.position.clone(),
    teamIndex: teamIndex,
    name: aiCarNames[i] || `AI ${i + 1}`
  });
}
    
    gameRef.current.aiCars = aiCars;
    
    // Create coins
    const coins = [];
    const coinGeometry = new THREE.CylinderGeometry(0.5, 0.5, 0.1, 32);
    const coinMaterial = new THREE.MeshStandardMaterial({ color: 0xffd700 });
    
    for (let i = 0; i < 200; i++) {
      const coin = new THREE.Mesh(coinGeometry, coinMaterial);
      coin.rotation.x = Math.PI / 2;
      
      // Random position on the road, but not in the starting grid
      const zPos = 50 + Math.random() * (roadLength - 100);
      const xPos = (Math.random() - 0.5) * (roadWidth - 4);
      
      coin.position.set(xPos, 1, zPos);
      scene.add(coin);
      coins.push(coin);
    }
    
    // Game constants
    const maxSpeed = 1.2;
    const acceleration = 0.005;
    const braking = -0.1;
    const handling = 0.15;
    const drag = 0.001;
    
    // Controls state
    const keys = {
      ArrowUp: false,
      ArrowDown: false,
      ArrowLeft: false,
      ArrowRight: false,
      Space: false
    };
    
    // Event listeners for controls
    const handleKeyDown = (e) => {
      if (keys.hasOwnProperty(e.code)) {
        keys[e.code] = true;
      }
    };
    
    const handleKeyUp = (e) => {
      if (keys.hasOwnProperty(e.code)) {
        keys[e.code] = false;
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    // Handle window resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    
    window.addEventListener('resize', handleResize);
    
  // Add collision detection function
const checkCollision = (car1, car2) => {
  // Only check for collisions after 5 seconds from race start
  // AND only if we've moved some distance from the starting grid
  // if (!gameRef.current.started || 
  //     !gameStartTime || 
  //     Date.now() - gameStartTime < 5000 ||
  //     playerCar.position.z < 80) {
  //     console.log("Collision detection disabled");   // Allow cars to clear starting grid
  //   return false;
  // }
  
  const dx = car1.position.x - car2.position.x;
  const dz = car1.position.z - car2.position.z;
  const distance = Math.sqrt(dx * dx + dz * dz);
  // console.log(distance < 2 ,"" );
  // Make collision detection less sensitive
  return distance < 2; // Reduced from 2 to make collisions less frequent
};
    
    // Add fire particle system function
    const createFireParticles = (position) => {
      const particles = [];
      const particleCount = 100; // Increased particle count
      const particleGeometry = new THREE.SphereGeometry(0.3, 8, 8); // Slightly larger particles
      
      // Create multiple particle materials for different colors
      const materials = [
        new THREE.MeshBasicMaterial({ color: 0xff6600, transparent: true, opacity: 1 }), // Orange
        new THREE.MeshBasicMaterial({ color: 0xff0000, transparent: true, opacity: 1 }), // Red
        new THREE.MeshBasicMaterial({ color: 0xff3300, transparent: true, opacity: 1 }), // Deep Orange
        new THREE.MeshBasicMaterial({ color: 0xffcc00, transparent: true, opacity: 1 })  // Yellow
      ];

      for (let i = 0; i < particleCount; i++) {
        const particle = new THREE.Mesh(particleGeometry, materials[Math.floor(Math.random() * materials.length)]);
        particle.position.copy(position);
        
        // Create a more explosive velocity pattern
        const angle = Math.random() * Math.PI * 2;
        const speed = 0.5 + Math.random() * 1;
        particle.velocity = new THREE.Vector3(
          Math.cos(angle) * speed,
          Math.random() * speed,
          Math.sin(angle) * speed
        );
        
        particle.life = 1.0;
        particle.rotationSpeed = (Math.random() - 0.5) * 0.2; // Add rotation
        particles.push(particle);
      }
      return particles;
    };
    
    // Game loop
    const animate = () => {
      const animationId = requestAnimationFrame(animate);
      gameRef.current.animation = animationId;
      
      if (gameRef.current.gameOver || collision) {
        // Update fire particles with rotation and scaling
        fireParticles.forEach((particle, index) => {
          particle.life -= 0.02;
          particle.material.opacity = particle.life;
          particle.position.add(particle.velocity);
          particle.velocity.y += 0.01; // Gravity effect
          particle.rotation.x += particle.rotationSpeed;
          particle.rotation.y += particle.rotationSpeed;
          particle.scale.multiplyScalar(0.98); // Particles shrink over time
          
          if (particle.life <= 0) {
            scene.remove(particle);
            fireParticles.splice(index, 1);
          }
        });

        // Slowly spin the car if game over or collision
        playerCar.rotation.y += 0.05;
        renderer.render(scene, camera);
        return;
      }
      
      // if (!gameRef.current.started) {
      //   renderer.render(scene, camera);
      //   return;
      // }
      
      // Animate flags
      if (gameRef.current.flags) {
        gameRef.current.flags.forEach((flag, index) => {
          flag.rotation.z = Math.sin(Date.now() * 0.003 + index) * 0.2;
        });
      }
      
      // Log current control states
      console.log('Animation Loop - Controls:', {
        keyboard: keys,
        mobile: gameState.mobileControls,
        carSpeed: gameRef.current.carSpeed
      });
      
// Inside your animation loop, replace the code for handling controls with this:

// Handle car controls - keyboard or mobile joystick
let isAccelerating = keys.ArrowUp;
let isBraking = keys.ArrowDown;
let isTurningLeft = keys.ArrowLeft;
let isTurningRight = keys.ArrowRight;
let isBoosting = keys.Space;

// Check if mobile controls are active and override keyboard controls
if (gameState && gameState.mobileControls) {
  if (gameState.mobileControls.accelerate) isAccelerating = true;
  if (gameState.mobileControls.brake) isBraking = true;
  if (gameState.mobileControls.left) isTurningLeft = true;
  if (gameState.mobileControls.right) isTurningRight = true;
  if (gameState.mobileControls.boost) isBoosting = true;
}

// Handle audio for acceleration
if (isAccelerating) {
  gameAudio.playEngine();
  gameRef.current.carSpeed += acceleration;
} else {
  gameAudio.stopEngine();
}

// Handle steering
if (isTurningLeft) {
  playerCar.position.x += handling;
  playerCar.rotation.z = Math.min(playerCar.rotation.z + 0.01, 0.1);
} else if (isTurningRight) {
  playerCar.position.x -= handling;
  playerCar.rotation.z = Math.max(playerCar.rotation.z - 0.01, -0.1);
} else {
  playerCar.rotation.z *= 0.9;
}

// Handle boost audio
if (isBoosting) {
  gameAudio.playBoost();
  gameRef.current.drsTime++;
  
  if (!gameRef.current.drsActive) {
    gameRef.current.drsActive = true;
  }
  
  gameRef.current.carSpeed += 0.02;
  
  if (gameRef.current.drsTime >= 50) {
    gameRef.current.drsActive = false;
    gameRef.current.drsTime = 0;
    gameAudio.stopBoost();
  }
} else {
  if (gameRef.current.drsActive) {
    gameRef.current.drsActive = false;
    gameRef.current.drsTime = 0;
    gameAudio.stopBoost();
  }
}

      if (gameRef.current.boostTime > 0) {
        gameRef.current.boostTime--;
      }
      
      // Apply physics
      gameRef.current.carSpeed = Math.max(0, Math.min(gameRef.current.carSpeed, maxSpeed));
      gameRef.current.carSpeed -= drag;
      
      // Update car position
      playerCar.position.z += gameRef.current.carSpeed;
      
      // Add engine animation
      playerCar.position.y = 0.5 + Math.sin(Date.now() * 0.02) * 0.02 * gameRef.current.carSpeed;
      
      // Keep car within road bounds
      playerCar.position.x = Math.max(-roadWidth/2 + 2, Math.min(roadWidth/2 - 2, playerCar.position.x));
      
      // Update AI cars
      let playerRank = 1;
      for (let i = 0; i < aiCars.length; i++) {
        const aiCar = aiCars[i];
        
        // Only start moving after the race has started
        if (gameRef.current.started) {
          // Gradually increase speed
          aiCar.speed = Math.min(aiCar.speed + aiCar.acceleration, aiCar.maxSpeed);
          
          // Move AI car
          aiCar.mesh.position.z += aiCar.speed;
          
          // Add some wobble to AI cars for realism
          aiCar.mesh.position.x += Math.sin(Date.now() * 0.001 + i) * aiCar.wobble;
          aiCar.mesh.position.x = Math.max(-roadWidth/2 + 2, Math.min(roadWidth/2 - 2, aiCar.mesh.position.x));
        }
        
        // Check for collisions with AI cars
        if (checkCollision(playerCar, aiCar.mesh)) {
          // Play crash sound
          gameAudio.playCrash();
          
          // Create fire particles at collision point
          const collisionPoint = new THREE.Vector3(
            (playerCar.position.x + aiCar.mesh.position.x) / 2,
            (playerCar.position.y + aiCar.mesh.position.y) / 2,
            (playerCar.position.z + aiCar.mesh.position.z) / 2
          );
          
          const newFireParticles = createFireParticles(collisionPoint);
          newFireParticles.forEach(particle => {
            scene.add(particle);
          });
          setFireParticles(prev => [...prev, ...newFireParticles]);
          
          // Stop the game
          setCollision(true);
          gameRef.current.gameOver = true;
          setGameOver(true);
          return;
        }
        
        // Keep AI cars from bunching up too much
        for (let j = 0; j < aiCars.length; j++) {
          if (i !== j) {
            const dx = aiCar.mesh.position.x - aiCars[j].mesh.position.x;
            const dz = aiCar.mesh.position.z - aiCars[j].mesh.position.z;
            const distance = Math.sqrt(dx * dx + dz * dz);
            
            if (distance < 3) {
              aiCar.mesh.position.x += dx * 0.05;
              aiCars[j].mesh.position.x -= dx * 0.05;
            }
          }
        }
        
        // Reset AI car when reaching end of track
        if (aiCar.mesh.position.z > roadLength) {
          aiCar.mesh.position.z = 0;
          aiCar.lap++;
          
          if (aiCar.lap > maxLaps) {
            aiCar.mesh.visible = false;
          }
        }
        
        // Calculate player position in race
        const aiProgress = aiCar.lap * roadLength + aiCar.mesh.position.z;
        const playerProgress = gameRef.current.lap * roadLength + playerCar.position.z;
        
        if (aiProgress > playerProgress && aiCar.lap <= maxLaps) {
          playerRank++;
        }
      }
      
      gameRef.current.position = playerRank;
      setPosition(playerRank);
      
      // Update camera to follow car
      camera.position.z = playerCar.position.z - 10;
      camera.position.y = 5 + Math.sin(Date.now() * 0.001) * 0.5; // Add slight camera movement
      camera.lookAt(playerCar.position.x, playerCar.position.y, playerCar.position.z + 10);
      
      // Check for coin collisions
      coins.forEach((coin, index) => {
        if (coin.visible) {
          const distance = playerCar.position.distanceTo(coin.position);
          
          if (distance < 2) {
            coin.visible = false;
            gameRef.current.score += 10;
            setScore(gameRef.current.score);
            gameAudio.playCoin();
          }
        }
      });
      
      // Handle lap completion
      if (playerCar.position.z > roadLength) {
        // Reset car position immediately
        playerCar.position.z = 0;
        gameRef.current.lap += 1;
        setLap(gameRef.current.lap);
        gameAudio.playLap();
        
        if (gameRef.current.lap > maxLaps) {
          gameRef.current.gameOver = true;
          setGameOver(true);
        }
      }
      
      // Update speedometer display
      gameRef.current.speedometer = Math.round(gameRef.current.carSpeed * 300);
      setSpeedometer(gameRef.current.speedometer);
      
      renderer.render(scene, camera);
    };
    
    // Initialize game state
    gameRef.current = {
      score: 0,
      lap: 1,
      maxLaps: 5,
      gameOver: false,
      started: false,
      speedometer: 0,
      carSpeed: 0,
      boostTime: 0,
      animation: null,
      position: 1,
      aiCars: aiCars,
      selectedCar: selectedCar,
      flags: gameRef.current.flags || []
    };
    
    animate();
    
    // Clean up function
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('resize', handleResize);
      
      if (gameRef.current.animation) {
        cancelAnimationFrame(gameRef.current.animation);
      }
      
      if (rendererRef.current && mountRef.current) {
        mountRef.current.removeChild(rendererRef.current.domElement);
      }
    };
  }, [carSelection, selectedCar ]);
  

  // Function to start game
  const startGame = () => {
    if (!playerName) {
      const name = prompt('Enter your name:');
      if (name) {
        setPlayerName(name);
        localStorage.setItem('playerName', name);
        
        // Generate AI car names if not already stored
        if (aiCarNames.length === 0) {
          const names = [
            'Speed Demon', 'Thunder Bolt', 'Night Rider', 'Storm Chaser',
            'Lightning Fast', 'Wind Walker', 'Fire Fox', 'Ice Dragon', 'Shadow Runner'
          ];
          setAiCarNames(names);
          localStorage.setItem('aiCarNames', JSON.stringify(names));
        }
        
        setCarSelection(false);
      }
    } else {
      setCarSelection(false);
    }
  };
  
  // Function to reset game
  const handleResetGame = () => {
    gameAudio.stopAll();
    window.location.reload();
  };
  
  // Car selection handler
  const handleCarSelection = (index) => {
    setSelectedCar(index);
  };
  
  // Add starting lights effect
  useEffect(() => {
    if (!carSelection && !started && !gameOver && !countdownStarted) {
      setCountdownStarted(true);
      
      const turnOnLights = async () => {
        for (let i = 0; i < 5; i++) {
          await new Promise(resolve => setTimeout(resolve, 1000));
          setStartingLights(prev => {
            const newLights = [...prev];
            newLights[i] = true;
            return newLights;
          });
          if (i === 0) gameAudio.playCountdown();
        }
        
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const startTime = Date.now();
        setGameStartTime(startTime);
        gameRef.current.started = true;
        setStarted(true);
      };
      
      turnOnLights();
    }
  }, [carSelection, started, gameOver, countdownStarted]);
  
  // Add function to create name tags
  const createNameTag = (name) => {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = 256;
    canvas.height = 64;
    
    // Draw background
    context.fillStyle = 'rgba(0, 0, 0, 0.5)';
    context.fillRect(0, 0, 256, 64);
    
    // Draw text
    context.font = 'bold 32px Arial';
    context.fillStyle = 'white';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(name, 128, 32);
    
    const texture = new THREE.CanvasTexture(canvas);
    const spriteMaterial = new THREE.SpriteMaterial({ map: texture });
    const sprite = new THREE.Sprite(spriteMaterial);
    sprite.scale.set(5, 1.25, 1);
    sprite.position.set(0, 2, 0);
    
    return sprite;
  };
  
  const simulateSpaceKey = (isPressed) => {
    // Create a keyboard event
    const event = new KeyboardEvent(isPressed ? 'keydown' : 'keyup', {
      key: ' ',
      code: 'Space',
      keyCode: 32,
      which: 32,
      bubbles: true,
      cancelable: true
    });
    
    // Dispatch the event
    document.dispatchEvent(event);
  };

  // Add useEffect for boost button timer
  // useEffect(() => {
  //   if (!isMobile || carSelection || gameOver) return;

  //   const boostInterval = setInterval(() => {
  //     setShowBoostButton(true);
  //     setTimeout(() => {
  //       setShowBoostButton(false);
  //     }, 2000);
  //   }, 10000);

  //   return () => clearInterval(boostInterval);
  // }, [isMobile, carSelection, gameOver]);

  return (
    <>
      <Head>
        <title>F1 Racing Game</title>
        <meta name="description" content="3D Formula 1 Racing Game built with React and Three.js" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <div 
        ref={mountRef} 
        className="fixed top-0 left-0 w-full h-full"
        style={{ touchAction: 'none' }}
      >
<a
  target="_blank"
  href="https://jam.pieter.com"
  style={{
    fontFamily: "'system-ui', sans-serif",
    position: "fixed",
    bottom: "-1px",
    right: "-1px",
    padding: "7px",
    fontSize: "14px",
    fontWeight: "bold",
    background: "#fff",
    color: "#000",
    textDecoration: "none",
    zIndex: 10000,
    borderTopLeftRadius: "12px",
    border: "1px solid #fff",
  }}
>
  🕹️ Vibe Jam 2025
</a>

<Image 
  style={{
    fontFamily: "'system-ui', sans-serif",
    position: "fixed",
    bottom: "35px",
    right: "-1px",
    padding: "2px",
    fontSize: "14px",
    fontWeight: "bold",
    // background: "#fff",
    // color: "#000",
    textDecoration: "none",
    zIndex: 10000,
    marginBottom: "4px",
    // borderTopLeftRadius: "12px",
    // border: "1px solid #fff",
  }}
   alt='poweredbysolana' src="https://www.poweredbysolana.com/powered-by-color.svg" width={100} height={100} />
   

        {/* Entry Screen */}
        {carSelection && (
          <EntryScreen 
            startGame={startGame} 
            carModels={carModels} 
            selectedCar={selectedCar} 
            handleCarSelection={handleCarSelection} 
          />
        )}
        {gameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-80 z-10 text-white">
            <h1 className="text-4xl font-bold mb-4">Race Complete!</h1>
            <p className="text-2xl mb-2">Final Position: {position}{getOrdinal(position)}</p>
            <p className="text-2xl mb-6">Score: {score}</p>
            <button
              className="px-8 py-3 bg-red-600 hover:bg-red-700 rounded-lg text-xl font-bold transition-colors"
              onClick={handleResetGame}
            >
              Play Again
            </button>
          </div>
        )}
        
      

        {/* {!carSelection && !started && !gameOver && (
          <div className="absolute inset-0 flex items-center justify-center z-20">
            <div className="flex space-x-4">
              {startingLights.map((isOn, index) => (
                <div
                  key={index}
                  className={`w-16 h-16 rounded-full transition-colors duration-300 ${
                    isOn ? 'bg-red-600' : 'bg-gray-800'
                  }`}
                />
              ))}
            </div>
          </div>
        )} */}

        {!carSelection  && (
  <F1Dashboard 
    position={position}
    lap={lap}
    maxLaps={maxLaps}
    speedometer={speedometer}
    score={score}
    selectedCar={selectedCar}
    carModels={carModels}
    drsActive={gameRef.current.drsActive}
    drsTime={gameRef.current.drsTime}
    aiCars={gameRef.current.aiCars}
  />
)}
        {/* Mobile controls */}
        {isMobile && !carSelection && !gameOver && (
          <div className="fixed bottom-0 left-0 right-0 flex justify-between items-end p-4 z-50">
            {/* Joystick on the left */}
            <div className="flex items-center">
           
              <JoystickController  />
            </div>

            {/* Boost button on the right */}
            {showBoostButton && (
              <button
                className="w-24 select-none h-24 mb-20 bg-gradient-to-br from-red-500/80 to-red-700/80 
                  rounded-2xl flex items-center justify-center text-white font-bold text-xl 
                 
                 "
                onTouchStart={(e) => {
                  e.preventDefault();
                  simulateSpaceKey(true);
                }}
                onMouseDown={(e) => {
                  e.preventDefault();
                  simulateSpaceKey(true);
                }}
                onMouseUp={(e) => {
                  e.preventDefault();
                  simulateSpaceKey(false);
                }}
                onMouseLeave={(e) => {
                  e.preventDefault();
                  simulateSpaceKey(false);
                }}
                onTouchEnd={(e) => {
                  e.preventDefault();
                  simulateSpaceKey(false);
                }}
              >
                <div className=" select-none ">
                  DRS
                </div>
              </button>
            )}

  
          </div>
        )}

        

        {/* DRS Indicator for mobile */}
        {!carSelection && isMobile && gameRef.current.drsActive && (
          <div className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-purple-600/70 backdrop-blur-sm rounded-full px-6 py-2 text-white font-bold z-50">
            DRS ACTIVE
          </div>
        )}

        {/* Starting lights for mobile */}
        {!carSelection && !started && !gameOver  && (
          <div className="absolute inset-0 flex items-center justify-center z-20">
            <div className="flex space-x-4 bg-black/30 backdrop-blur-sm p-6 rounded-2xl">
              {startingLights.map((isOn, index) => (
                <div
                  key={index}
                  className={`w-12 h-12 rounded-full transition-colors duration-300 ${
                    isOn ? 'bg-red-600 shadow-lg shadow-red-600/50' : 'bg-gray-800'
                  }`}
                />
              ))}
            </div>
          </div>
        )}

        {/* Add Collision Screen */}
        {collision && (
          
          <CollisionScreen onRetry={handleResetGame} />
      
        )}

        <div className="fixed z-[1000000] top-4 right-4">
          <WalletIntegration />
        </div>
      </div>
    </>
  );
}

// Helper function to get ordinal suffix (1st, 2nd, 3rd, etc.)
function getOrdinal(n) {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return s[(v - 20) % 10] || s[v] || s[0];
}