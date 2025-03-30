import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { createCar } from '../utils/carUtils';
import { createCrowd } from '../utils/crowdUtils';
import { createFireParticles } from '../utils/particleUtils';

export const GameScene = ({ 
  carSelection, 
  selectedCar, 
  carModels, 
  onCollision, 
  onLapComplete,
  gameState,
  setGameState,
  playerName
}) => {
  const mountRef = useRef(null);
  const rendererRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const playerCarRef = useRef(null);
  const aiCarsRef = useRef([]);

  // Add function to create name tags
  const createNameTag = (name, isPlayer = false) => {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = 256;
    canvas.height = 64;
    
    // Draw background with different color for player
    context.fillStyle = isPlayer ? 'rgba(255, 0, 0, 0.7)' : 'rgba(0, 0, 0, 0.5)';
    context.fillRect(0, 0, 256, 64);
    
    // Draw text
    context.font = 'bold 32px Arial';
    context.fillStyle = 'white';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(name, 128, 32);
    
    const texture = new THREE.CanvasTexture(canvas);
    const spriteMaterial = new THREE.SpriteMaterial({ 
      map: texture,
      transparent: true,
      depthTest: false // Makes sure name tag is always visible
    });
    const sprite = new THREE.Sprite(spriteMaterial);
    sprite.scale.set(5, 1.25, 1);
    sprite.position.set(0, 2, 0); // Position above car
    
    return sprite;
  };

  useEffect(() => {
    if (!mountRef.current || carSelection) return;

    // Scene setup
    const scene = new THREE.Scene();
    // Set solid red background
    scene.background = new THREE.Color(0xcc0000); // Bright red background
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000); // Wider field of view
    camera.position.set(0, 15, 0); // Higher and further back
    camera.lookAt(0, 0, 40); // Look further ahead
    cameraRef.current = camera;

    // Renderer setup with performance optimizations
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      powerPreference: "high-performance"
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Enhanced lighting for red atmosphere
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
    directionalLight.position.set(5, 15, 7.5);
    scene.add(directionalLight);

    // Add red-tinted hemisphere light
    const hemisphereLight = new THREE.HemisphereLight(0xff0000, 0x000000, 0.5);
    scene.add(hemisphereLight);

    // Add fog for atmosphere
    scene.fog = new THREE.Fog(0xcc0000, 100, 1000);

    // Road setup with enhanced materials
    const roadWidth = 40;
    const roadLength = 1500;
    const roadGeometry = new THREE.PlaneGeometry(roadWidth, roadLength);
    const roadMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x333333,
      roughness: 0.6,
      metalness: 0.4,
    });
    const road = new THREE.Mesh(roadGeometry, roadMaterial);
    road.rotation.x = -Math.PI / 2;
    road.position.z = roadLength / 2;
    scene.add(road);

    // Create player car
    const playerCar = createCar(
      carModels[selectedCar].color,
      carModels[selectedCar].secondaryColor
    );
    playerCar.position.set(0, 0, 20);
    scene.add(playerCar);
    
    // Add name tag to player car
    const playerNameTag = createNameTag(playerName || 'Player', true);
    playerCar.add(playerNameTag);
    
    playerCarRef.current = playerCar;

    // Create AI cars
    const aiCars = [];
    const gridSpacing = 10;
    const gridRows = 3;
    const gridCols = 3;

    for (let i = 0; i < 9; i++) {
      const teamIndex = i < carModels.length ? i : Math.floor(Math.random() * carModels.length);
      const teamColor = i === selectedCar ? 0x444444 : carModels[teamIndex].color;
      const secondaryColor = i === selectedCar ? 0x666666 : carModels[teamIndex].secondaryColor;
      
      const aiCar = createCar(teamColor, secondaryColor);
      
      const row = Math.floor(i / gridCols);
      const col = i % gridCols;
      
      const xOffset = (col - 1) * gridSpacing;
      const zOffset = (row + 1) * gridSpacing;
      
      aiCar.position.set(xOffset, 0, 30 + zOffset);
      scene.add(aiCar);
      
      // Add name tag to AI car
      const aiNameTag = createNameTag(gameState.aiCarNames?.[i] || `AI ${i + 1}`);
      aiCar.add(aiNameTag);
      
      aiCars.push({
        mesh: aiCar,
        speed: 0,
        maxSpeed: 0.4 + Math.random() * 0.6, // Increased max speed
        acceleration: 0.002 + Math.random() * 0.003, // Increased acceleration
        wobble: Math.random() * 0.03,
        lap: 1,
        initialPos: aiCar.position.clone(),
        teamIndex: teamIndex,
        name: gameState.aiCarNames?.[i] || `AI ${i + 1}`
      });
    }
    aiCarsRef.current = aiCars;

    // Animation loop with performance optimizations
    let lastTime = 0;
    const animate = (currentTime) => {
      const deltaTime = currentTime - lastTime;
      lastTime = currentTime;

      if (deltaTime < 16) { // Cap at ~60fps
        requestAnimationFrame(animate);
        return;
      }

      if (gameState.gameOver || gameState.collision) {
        renderer.render(scene, camera);
        return;
      }

      if (!gameState.started) {
        renderer.render(scene, camera);
        return;
      }

      // Update game state
      updateGameState(deltaTime);
      
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };

    // Start animation loop
    requestAnimationFrame(animate);

    // Cleanup
    return () => {
      if (rendererRef.current && mountRef.current) {
        mountRef.current.removeChild(rendererRef.current.domElement);
      }
      if (gameState.animation) {
        cancelAnimationFrame(gameState.animation);
      }
    };
  }, [carSelection, selectedCar, carModels, playerName, gameState.aiCarNames]);

  const updateGameState = (deltaTime) => {
    // Update player car
    if (playerCarRef.current) {
      const playerCar = playerCarRef.current;
      
      // Handle mobile controls
      if (gameState.mobileControls) {
        const controls = gameState.mobileControls;
        
        // Acceleration
        if (controls.accelerate) {
          gameState.carSpeed = Math.min(gameState.carSpeed + 0.01, gameState.maxSpeed);
        }
        
        // Braking
        if (controls.brake) {
          gameState.carSpeed = Math.max(gameState.carSpeed - 0.01, 0);
        }
        
        // Steering
        if (controls.left) {
          playerCar.position.x += 0.2;
          playerCar.rotation.z = Math.min(playerCar.rotation.z + 0.01, -0.1);
        } else if (controls.right) {
          playerCar.position.x -= 0.2;
          playerCar.rotation.z = Math.max(playerCar.rotation.z - 0.01, 0.1);
        } else {
          // Return to normal position
          playerCar.rotation.z *= 0.9;
        }
        
        // Boost
        if (controls.boost) {
          gameState.carSpeed = Math.min(gameState.carSpeed + 0.05, gameState.maxSpeed * 1.5);
        }
      }
      
      // Update position based on game state
      playerCar.position.x = Math.max(-roadWidth/2 + 2, Math.min(roadWidth/2 - 2, playerCar.position.x));
      playerCar.position.z = gameState.playerZ;
    }

    // Update AI cars with increased speed
    aiCarsRef.current.forEach(aiCar => {
      if (gameState.started) {
        aiCar.speed = Math.min(aiCar.speed + aiCar.acceleration, aiCar.maxSpeed);
        aiCar.mesh.position.z += aiCar.speed;
        aiCar.mesh.position.x += Math.sin(Date.now() * 0.001) * aiCar.wobble;
        aiCar.mesh.position.x = Math.max(-roadWidth/2 + 2, Math.min(roadWidth/2 - 2, aiCar.mesh.position.x));
      }
    });
  };

  return <div ref={mountRef} className="fixed top-0 left-0 w-full h-full" />;
}; 