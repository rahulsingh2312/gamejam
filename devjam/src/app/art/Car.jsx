 // Function to create a car
 import * as THREE from 'three';
 function createCar(color, secondaryColor) {
    const carGroup = new THREE.Group();
    
    // Car body
    const carBodyGeometry = new THREE.BoxGeometry(2, 0.75, 4);
    const carBodyMaterial = new THREE.MeshStandardMaterial({ color: color });
    const carBody = new THREE.Mesh(carBodyGeometry, carBodyMaterial);
    carBody.position.y = 0.5;
    carGroup.add(carBody);
    
    // Wheels
    const wheelGeometry = new THREE.CylinderGeometry(0.5, 0.5, 0.4, 32);
    const wheelMaterial = new THREE.MeshStandardMaterial({ color: 0x000000 });
    
    const wheelPositions = [
      { x: -1.1, y: 0, z: 1.25 },
      { x: 1.1, y: 0, z: 1.25 },
      { x: -1.1, y: 0, z: -1.25 },
      { x: 1.1, y: 0, z: -1.25 }
    ];
    
    wheelPositions.forEach(pos => {
      const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
      wheel.rotation.z = Math.PI / 2;
      wheel.position.set(pos.x, pos.y, pos.z);
      carGroup.add(wheel);
    });
    
    // Car front wing
    const frontWingGeometry = new THREE.BoxGeometry(2.4, 0.1, 0.5);
    const frontWingMaterial = new THREE.MeshStandardMaterial({ color: secondaryColor });
    const frontWing = new THREE.Mesh(frontWingGeometry, frontWingMaterial);
    frontWing.position.set(0, 0.5, 2);
    carGroup.add(frontWing);
    
    // Car rear wing
    const rearWingGeometry = new THREE.BoxGeometry(2.4, 0.5, 0.1);
    const rearWingMaterial = new THREE.MeshStandardMaterial({ color: secondaryColor });
    const rearWing = new THREE.Mesh(rearWingGeometry, rearWingMaterial);
    rearWing.position.set(0, 1, -1.8);
    carGroup.add(rearWing);
    
    // Driver's cockpit/helmet
    const cockpitGeometry = new THREE.BoxGeometry(1, 0.5, 1);
    const cockpitMaterial = new THREE.MeshStandardMaterial({ color: 0x333333 });
    const cockpit = new THREE.Mesh(cockpitGeometry, cockpitMaterial);
    cockpit.position.set(0, 1, 0);
    carGroup.add(cockpit);
    
    return carGroup;
  }

  export default createCar;