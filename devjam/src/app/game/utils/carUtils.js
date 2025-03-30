import * as THREE from 'three';

export const createCar = (color, secondaryColor) => {
  const car = new THREE.Group();
  
  // Car body
  const bodyGeometry = new THREE.BoxGeometry(2, 0.5, 4);
  const bodyMaterial = new THREE.MeshStandardMaterial({ color });
  const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
  car.add(body);
  
  // Car roof
  const roofGeometry = new THREE.BoxGeometry(1.5, 1.5, 2);
  const roofMaterial = new THREE.MeshStandardMaterial({ color: secondaryColor });
  const roof = new THREE.Mesh(roofGeometry, roofMaterial);
  roof.position.y = 1;
  roof.position.z = -0.5;
  car.add(roof);
  
  // Wheels
  const wheelGeometry = new THREE.CylinderGeometry(0.4, 0.4, 0.4, 16);
  const wheelMaterial = new THREE.MeshStandardMaterial({ color: 0x333333 });
  
  const wheelPositions = [
    { x: -1.2, y: 0, z: 1.5 },
    { x: 1.2, y: 0, z: 1.5 },
    { x: -1.2, y: 0, z: -1.5 },
    { x: 1.2, y: 0, z: -1.5 }
  ];
  
  wheelPositions.forEach(pos => {
    const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
    wheel.rotation.z = Math.PI / 2;
    wheel.position.set(pos.x, pos.y, pos.z);
    car.add(wheel);
  });
  
  return car;
}; 