'use client'
import React, { useEffect, useRef, useState } from 'react';
import Head from 'next/head';
import * as THREE from 'three';
import Image from 'next/image';
import EntryScreen from './art/entryscreen';
import createCar from './art/Car';
import createCrowd from './art/createCrowd';
import F1Dashboard from './art/F1Dashboard';
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
  
  // Car models data
  const carModels = [
    { name: "Red Bull Racing", color: 0x0600EF, secondaryColor: 0xFFD700 , image : "red-bull-racing" },
    { name: "Ferrari", color: 0xFF0000, secondaryColor: 0x000000 , image : "ferrari"},
    { name: "Mercedes AMG", color: 0x00D2BE, secondaryColor: 0x000000, image : "mercedes" },
    { name: "McLaren", color: 0xFF8700, secondaryColor: 0x0000FF , image : "mclaren"},
    { name: "Aston Martin", color: 0x006F62, secondaryColor: 0xFFFFFF , image : "aston-martin"},
    { name: "Alpine", color: 0x0090FF, secondaryColor: 0xFF0000 , image : "alpine"},
    { name: "Williams", color: 0x005AFF, secondaryColor: 0xFFFFFF , image : "williams"},
    { name: "Racing Bulls", color: 0x2B4562, secondaryColor: 0xFFFFFF, image : "racing-bulls" },
    { name: "Kick Sauber", color: 0x900000, secondaryColor: 0xFFFFFF , image : "kick-sauber" },
    { name: "Haas F1", color: 0xFFFFFF, secondaryColor: 0xFF0000, image : "haas" }
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
    
    // Create AI cars
    const aiCars = [];
    for (let i = 0; i < 9; i++) {
      const teamIndex = i < carModels.length ? i : Math.floor(Math.random() * carModels.length);
      const teamColor = i === selectedCar ? 0x444444 : carModels[teamIndex].color;
      const secondaryColor = i === selectedCar ? 0x666666 : carModels[teamIndex].secondaryColor;
      
      const aiCar = createCar(teamColor, secondaryColor);
      
      // Determine starting grid position
      let gridX, gridZ;
      
      if (i < 5) {
        gridX = gridPositionsX[i];
        gridZ = 20;
      } else {
        gridX = gridPositionsX[i - 5];
        gridZ = 24;
      }
      
      aiCar.position.set(gridX, 0, gridZ);
      scene.add(aiCar);
      
      // Store speed and other properties for AI behavior
      aiCars.push({
        mesh: aiCar,
        speed: 0.2 + Math.random() * 0.5, // Random speed between 0.2 and 0.7
        wobble: Math.random() * 0.05,     // Random car movement
        lap: 1,
        initialPos: aiCar.position.clone(),
        teamIndex:teamIndex
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
    const braking = 0.01;
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
        
        // Start the game when arrow up is pressed
        if (!gameRef.current.started && e.code === 'ArrowUp') {
          gameRef.current.started = true;
          setStarted(true);
        }
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
    
    // Game loop
    const animate = () => {
      const animationId = requestAnimationFrame(animate);
      gameRef.current.animation = animationId;
      
      if (gameRef.current.gameOver) {
        // Slowly spin the car if game over
        playerCar.rotation.y += 0.05;
        renderer.render(scene, camera);
        return;
      }
      
      if (!gameRef.current.started) {
        renderer.render(scene, camera);
        return;
      }
      
      // Animate flags
      if (gameRef.current.flags) {
        gameRef.current.flags.forEach((flag, index) => {
          flag.rotation.z = Math.sin(Date.now() * 0.003 + index) * 0.2;
        });
      }
      
      // Handle car controls - keyboard or mobile joystick
    // Handle car controls - keyboard or mobile joystick
if (keys.ArrowUp || keys.ArrowUp) {
  gameRef.current.carSpeed += acceleration;
}

if (keys.ArrowDown || keys.ArrowDown) {
  gameRef.current.carSpeed -= braking;
}

// Apply boost

// In the animate function, replace the existing Space key handling
if (keys.Space) {
  // Increment DRS time
  gameRef.current.drsTime++;
  
  // Activate DRS if not already active
  if (!gameRef.current.drsActive) {
    gameRef.current.drsActive = true;
  }
  
  // Boost speed
  gameRef.current.carSpeed += 0.2;
  
  // Limit DRS to 3 seconds (180 frames at 60fps)
  if (gameRef.current.drsTime >= 5) {
    gameRef.current.drsActive = false;
    gameRef.current.drsTime = 0;
  }
} else {
  // Reset DRS when space bar is released
  if (gameRef.current.drsActive) {
    gameRef.current.drsActive = false;
    gameRef.current.drsTime = 0;
  }
}
      if (gameRef.current.boostTime > 0) {
        // setDrsActive(false);

        gameRef.current.boostTime--;

      }
      
      // Apply physics
      gameRef.current.carSpeed = Math.max(0, Math.min(gameRef.current.carSpeed, maxSpeed));
      gameRef.current.carSpeed -= drag;
      
      if (keys.ArrowLeft ) {
        playerCar.position.x += handling;
        // Tilt car when turning
        playerCar.rotation.z = Math.min(playerCar.rotation.z + 0.01, -0.1);
      } else if (keys.ArrowRight > 0.3) {
        playerCar.position.x -= handling;
        // Tilt car when turning
        playerCar.rotation.z = Math.max(playerCar.rotation.z - 0.01, 0.1);
      } else {
        // Return to normal position
        playerCar.rotation.z *= 0.9;
      }
      
      // Update car position
      playerCar.position.z += gameRef.current.carSpeed;
      
      // Add engine animation
      playerCar.position.y = 0.5 + Math.sin(Date.now() * 0.02) * 0.02 * gameRef.current.carSpeed;
      
      // Keep car within road bounds
      playerCar.position.x = Math.max(-roadWidth/2 + 2, Math.min(roadWidth/2 - 2, playerCar.position.x));
      
      // Update AI cars
      let playerRank = 1;
      aiCars.forEach((aiCar, index) => {
        // Move AI car
        aiCar.mesh.position.z += aiCar.speed;
        
        // Add some wobble to AI cars for realism
        aiCar.mesh.position.x += Math.sin(Date.now() * 0.001 + index) * aiCar.wobble;
        aiCar.mesh.position.x = Math.max(-roadWidth/2 + 2, Math.min(roadWidth/2 - 2, aiCar.mesh.position.x));
        
        // Keep AI cars from bunching up too much
        for (let j = 0; j < aiCars.length; j++) {
          if (index !== j) { // Fixed: using index instead of i
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
      });
      
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
          }
        }
      });
      
      // Handle lap completion
      if (playerCar.position.z > roadLength) {
        playerCar.position.z = 0;
        gameRef.current.lap += 1;
        setLap(gameRef.current.lap);
        
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
  }, [carSelection, selectedCar]);
  

  // Function to start game
  const startGame = () => {
    setCarSelection(false);
    gameRef.current.selectedCar = selectedCar;
  };
  
  // Function to reset game
  const resetGame = () => {
    setGameOver(false);
    setStarted(false);
    setLap(1);
    setScore(0);
    setSpeedometer(0);
    setPosition(1);
    setCarSelection(true);
    
    gameRef.current = {
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
      selectedCar: selectedCar
    };
  };
  
  // Car selection handler
  const handleCarSelection = (index) => {
    setSelectedCar(index);
  };
  
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
              onClick={resetGame}
            >
              Play Again
            </button>
          </div>
        )}
        
      

        {!carSelection && (
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
      {/* Mobile controls */}
      {isMobile && !carSelection && !gameOver && (
        <div className="fixed bottom-4 left-0 right-0 flex flex-col items-center">
          {/* Start button for mobile */}
          {!started && (
            <div className="absolute inset-0 flex items-center justify-center">
              <button
                className="px-12 py-6 bg-green-600 rounded-full text-white text-2xl font-bold"
                onTouchStart={() => {
                  gameRef.current.started = true;
                  setStarted(true);
                }}
              >
                START
              </button>
            </div>
          )}
          
          {/* Controls Container */}
          <div className="w-full flex justify-between items-end px-4">
            {/* Left/Right Controls */}
            <div className="flex flex-col space-y-2">
              <button 
                className="w-16 h-16 bg-white/30 rounded-full text-white text-2xl"
                onTouchStart={() => setMobileControls(prev => ({...prev, left: true}))}
                onTouchEnd={() => setMobileControls(prev => ({...prev, left: false}))}
              >
                ←
              </button>
              <button 
                className="w-16 h-16 bg-white/30 rounded-full text-white text-2xl"
                onTouchStart={() => setMobileControls(prev => ({...prev, right: true}))}
                onTouchEnd={() => setMobileControls(prev => ({...prev, right: false}))}
              >
                →
              </button>
            </div>
            
            {/* Vertical Controls */}
            <div className="flex flex-col space-y-2">
              <button 
                className="w-16 h-16 bg-green-500/70 rounded-full text-white text-2xl"
                onTouchStart={() => setMobileControls(prev => ({...prev, accelerate: true}))}
                onTouchEnd={() => setMobileControls(prev => ({...prev, accelerate: false}))}
              >
                ↑
              </button>
              <button 
                className="w-16 h-16 bg-red-500/70 rounded-full text-white text-2xl"
                onTouchStart={() => setMobileControls(prev => ({...prev, brake: true}))}
                onTouchEnd={() => setMobileControls(prev => ({...prev, brake: false}))}
              >
                ↓
              </button>
            </div>
            
            {/* Boost Button */}
            <button 
              className="w-24 h-24 bg-purple-600/70 rounded-full flex items-center justify-center text-white font-bold text-lg"
              onTouchStart={() => setMobileControls(prev => ({...prev, boost: true}))}
              onTouchEnd={() => setMobileControls(prev => ({...prev, boost: false}))}
            >
              BOOST
            </button>
          </div>
        </div>
      )}
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