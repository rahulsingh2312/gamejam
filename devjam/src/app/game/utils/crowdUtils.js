import * as THREE from 'three';

export const createCrowd = (xOffset, roadLength, scene) => {
  const crowdGroup = new THREE.Group();
  
  // Create crowd geometry
  const crowdGeometry = new THREE.BoxGeometry(2, 4, roadLength);
  const crowdMaterial = new THREE.MeshStandardMaterial({ 
    color: 0x444444,
    roughness: 0.8,
    metalness: 0.2
  });
  
  // Create multiple crowd sections
  const numSections = 5;
  const sectionLength = roadLength / numSections;
  
  for (let i = 0; i < numSections; i++) {
    const section = new THREE.Mesh(crowdGeometry, crowdMaterial);
    section.position.set(xOffset, 2, (i * sectionLength) + (sectionLength / 2));
    section.rotation.y = xOffset > 0 ? -Math.PI / 2 : Math.PI / 2;
    crowdGroup.add(section);
  }
  
  // Add crowd group to scene
  scene.add(crowdGroup);
  
  // Store reference for animation
  scene.userData.crowd = crowdGroup;
  
  return crowdGroup;
};

export const animateCrowd = (crowdGroup, time) => {
  if (!crowdGroup) return;
  
  crowdGroup.children.forEach((section, index) => {
    // Add subtle wave animation
    section.position.y = 2 + Math.sin(time * 0.5 + index) * 0.1;
  });
}; 