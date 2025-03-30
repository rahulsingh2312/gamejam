import * as THREE from 'three';

export const createFireParticles = (position) => {
  const particles = [];
  const particleCount = 100;
  const particleGeometry = new THREE.SphereGeometry(0.3, 8, 8);
  
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
    particle.rotationSpeed = (Math.random() - 0.5) * 0.2;
    particles.push(particle);
  }
  return particles;
};

export const updateParticles = (particles, deltaTime) => {
  for (let i = particles.length - 1; i >= 0; i--) {
    const particle = particles[i];
    particle.life -= deltaTime * 0.5;
    particle.material.opacity = particle.life;
    particle.position.add(particle.velocity);
    particle.velocity.y += 0.01; // Gravity effect
    particle.rotation.x += particle.rotationSpeed;
    particle.rotation.y += particle.rotationSpeed;
    particle.scale.multiplyScalar(0.98); // Particles shrink over time
    
    if (particle.life <= 0) {
      particles.splice(i, 1);
    }
  }
}; 