import * as THREE from 'three';

function createCrowd(xPosition, length, scene) {
    // Create stands
    const standGeometry = new THREE.BoxGeometry(4, 5, length);
    const standMaterial = new THREE.MeshStandardMaterial({ color: 0x888888 });
    const stand = new THREE.Mesh(standGeometry, standMaterial);
    stand.position.set(xPosition, 2.5, length/2);
    scene.add(stand);
    
    // Create crowd as small cubes with different colors
    const crowdColors = [0xFF0000, 0x00FF00, 0x0000FF, 0xFFFF00, 0xFF00FF, 0x00FFFF];
    const personGeometry = new THREE.BoxGeometry(0.4, 0.4, 0.4);
    
    for (let z = 0; z < length; z += 2) {
      for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 5; col++) {
          if (Math.random() > 0.2) { // 80% chance to place a person
            const personMaterial = new THREE.MeshStandardMaterial({ 
              color: crowdColors[Math.floor(Math.random() * crowdColors.length)] 
            });
            const person = new THREE.Mesh(personGeometry, personMaterial);
            person.position.set(
              xPosition - 1.5 + col * 0.7,
              5 + row * 0.5,
              z
            );
            scene.add(person);
          }
        }
      }
    }
    
    // Add some animated flags
    for (let z = 50; z < length; z += 100) {
      const flagGeometry = new THREE.PlaneGeometry(2, 1);
      const flagMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xFF0000, 
        side: THREE.DoubleSide 
      });
      const flag = new THREE.Mesh(flagGeometry, flagMaterial);
      flag.position.set(xPosition, 7, z);
      flag.rotation.y = xPosition > 0 ? Math.PI / 2 : -Math.PI / 2;
      scene.add(flag);
      
      // Store for animation
    //   gameRef.current.flags = gameRef.current.flags || [];
    //   gameRef.current.flags.push(flag);
    }
  }

  export default createCrowd;