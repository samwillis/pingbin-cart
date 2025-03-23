import { useEffect, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import { Pingbin, Bunny } from '../models/Characters';

// Track component for the racing circuit
const Track = () => {
  // Create a simple oval track
  const trackRadius = 50;
  const trackWidth = 15;
  const trackGeometry = useRef<THREE.TorusGeometry>(null);
  
  return (
    <group>
      {/* Ground plane with checkered pattern will be handled separately */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]} receiveShadow>
        <planeGeometry args={[250, 250]} />
        <meshStandardMaterial color="#538a5f" visible={false} />
      </mesh>
      
      {/* Race track */}
      <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <torusGeometry ref={trackGeometry} args={[trackRadius, trackWidth, 16, 100]} />
        <meshStandardMaterial color="#333333" />
      </mesh>
      
      {/* Track markings - outer edge */}
      <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <torusGeometry args={[trackRadius + trackWidth - 1, 0.5, 16, 100]} />
        <meshStandardMaterial color="white" />
      </mesh>
      
      {/* Track markings - inner edge */}
      <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <torusGeometry args={[trackRadius - trackWidth + 1, 0.5, 16, 100]} />
        <meshStandardMaterial color="white" />
      </mesh>
      
      {/* Starting line */}
      <mesh position={[0, 0.05, trackRadius]} rotation={[-Math.PI / 2, 0, 0]}>
        <boxGeometry args={[trackWidth, 2, 0.1]} />
        <meshStandardMaterial color="white" />
      </mesh>
    </group>
  );
};

// Checkered ground
const CheckeredGround = () => {
  const size = 250;
  const divisions = 25; // Number of squares in each direction
  const squareSize = size / divisions;
  
  return (
    <group rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.15, 0]}>
      {Array.from({ length: divisions }).map((_, row) => 
        Array.from({ length: divisions }).map((_, col) => {
          const isEven = (row + col) % 2 === 0;
          const x = (col - divisions / 2) * squareSize + squareSize / 2;
          const z = (row - divisions / 2) * squareSize + squareSize / 2;
          
          return (
            <mesh key={`${row}-${col}`} position={[x, z, 0]} receiveShadow>
              <planeGeometry args={[squareSize, squareSize]} />
              <meshStandardMaterial color={isEven ? "#538a5f" : "#3e6846"} />
            </mesh>
          );
        })
      )}
    </group>
  );
};

// Player vehicle component
const Vehicle = ({ 
  position,
  controls,
  character = 'pingbin',
  onPositionChange
}: { 
  position: [number, number, number],
  controls: {
    forward: boolean;
    backward: boolean;
    left: boolean;
    right: boolean;
  },
  character?: 'pingbin' | 'bunny',
  onPositionChange: (position: THREE.Vector3, rotation: number) => void
}) => {
  const meshRef = useRef<THREE.Group>(null);
  const [velocity, setVelocity] = useState(0);
  const [rotation, setRotation] = useState(0);
  
  useFrame(() => {
    if (!meshRef.current) return;
    
    // Simple physics
    const acceleration = 0.05;
    const deceleration = 0.03;
    const maxSpeed = 1;
    const rotationSpeed = 0.05;
    
    // Handle acceleration and deceleration
    if (controls.forward) {
      setVelocity(prev => Math.min(prev + acceleration, maxSpeed));
    } else if (controls.backward) {
      setVelocity(prev => Math.max(prev - acceleration, -maxSpeed / 2));
    } else {
      // Natural deceleration
      setVelocity(prev => {
        if (prev > 0) return Math.max(prev - deceleration, 0);
        if (prev < 0) return Math.min(prev + deceleration, 0);
        return 0;
      });
    }
    
    // Handle rotation
    if (controls.left) {
      setRotation(prev => prev + rotationSpeed * Math.sign(velocity));
    }
    if (controls.right) {
      setRotation(prev => prev - rotationSpeed * Math.sign(velocity));
    }
    
    // Update position based on velocity and rotation
    meshRef.current.rotation.y = rotation;
    meshRef.current.position.x += Math.sin(rotation) * velocity;
    meshRef.current.position.z += Math.cos(rotation) * velocity;
    
    // Notify about position and rotation changes
    onPositionChange(meshRef.current.position, rotation);
  });
  
  return (
    <group ref={meshRef} position={position}>
      {/* Car body */}
      <mesh castShadow position={[0, 0.5, 0]}>
        <boxGeometry args={[1.5, 0.5, 3]} />
        <meshStandardMaterial color="#e01b24" />
      </mesh>
      
      {/* Car top */}
      <mesh castShadow position={[0, 1, -0.2]}>
        <boxGeometry args={[1.2, 0.4, 1.5]} />
        <meshStandardMaterial color="#e01b24" />
      </mesh>
      
      {/* Wheels */}
      <mesh castShadow position={[0.8, 0.3, 1]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.3, 0.3, 0.2, 16]} />
        <meshStandardMaterial color="#241f31" />
      </mesh>
      <mesh castShadow position={[-0.8, 0.3, 1]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.3, 0.3, 0.2, 16]} />
        <meshStandardMaterial color="#241f31" />
      </mesh>
      <mesh castShadow position={[0.8, 0.3, -1]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.3, 0.3, 0.2, 16]} />
        <meshStandardMaterial color="#241f31" />
      </mesh>
      <mesh castShadow position={[-0.8, 0.3, -1]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.3, 0.3, 0.2, 16]} />
        <meshStandardMaterial color="#241f31" />
      </mesh>
      
      {/* Character */}
      {character === 'pingbin' ? (
        <Pingbin position={[0, 1.5, -0.2]} />
      ) : (
        <Bunny position={[0, 1.5, -0.2]} />
      )}
    </group>
  );
};

// Camera that follows the player from behind
const FollowCamera = ({ target, rotation }: { target: THREE.Vector3, rotation: number }) => {
  const { camera } = useThree();
  
  useFrame(() => {
    // Calculate the camera position based on the vehicle's position and rotation
    // This creates a trailing effect where the camera follows from behind
    const cameraOffset = new THREE.Vector3(
      -Math.sin(rotation) * 8, // X offset (behind the car)
      5,                       // Y offset (above the car)
      -Math.cos(rotation) * 8  // Z offset (behind the car)
    );
    
    // Add the offset to the target position
    const cameraPosition = target.clone().add(cameraOffset);
    
    // Smoothly move the camera to the new position
    camera.position.lerp(cameraPosition, 0.1);
    
    // Look at the target, but add a slight Y offset to look slightly above the vehicle
    const lookAtPosition = target.clone().add(new THREE.Vector3(0, 1, 0));
    camera.lookAt(lookAtPosition);
  });
  
  return null;
};

// Environment elements
const Environment = () => {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight
        position={[10, 10, 5]}
        intensity={1}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <hemisphereLight intensity={0.5} groundColor="#538a5f" />
    </>
  );
};

// Main game scene component
export const GameScene = ({ character = 'pingbin' }: { character?: 'pingbin' | 'bunny' }) => {
  const playerPosition = useRef(new THREE.Vector3(0, 0, 30));
  const [playerRotation, setPlayerRotation] = useState(0);
  const [controls, setControls] = useState({
    forward: false,
    backward: false,
    left: false,
    right: false
  });
  
  // Handler for vehicle position updates
  const handlePositionChange = (position: THREE.Vector3, rotation: number) => {
    playerPosition.current.copy(position);
    setPlayerRotation(rotation);
  };
  
  // Set up keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp' || e.key === 'w') {
        setControls(prev => ({ ...prev, forward: true }));
      }
      if (e.key === 'ArrowDown' || e.key === 's') {
        setControls(prev => ({ ...prev, backward: true }));
      }
      if (e.key === 'ArrowLeft' || e.key === 'a') {
        setControls(prev => ({ ...prev, left: true }));
      }
      if (e.key === 'ArrowRight' || e.key === 'd') {
        setControls(prev => ({ ...prev, right: true }));
      }
    };
    
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp' || e.key === 'w') {
        setControls(prev => ({ ...prev, forward: false }));
      }
      if (e.key === 'ArrowDown' || e.key === 's') {
        setControls(prev => ({ ...prev, backward: false }));
      }
      if (e.key === 'ArrowLeft' || e.key === 'a') {
        setControls(prev => ({ ...prev, left: false }));
      }
      if (e.key === 'ArrowRight' || e.key === 'd') {
        setControls(prev => ({ ...prev, right: false }));
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  return (
    <Canvas shadows>
      <PerspectiveCamera makeDefault position={[0, 5, -10]} fov={75} />
      <FollowCamera target={playerPosition.current} rotation={playerRotation} />
      <Environment />
      <CheckeredGround />
      <Track />
      <Vehicle 
        position={[0, 0, 30]} 
        controls={controls}
        character={character}
        onPositionChange={handlePositionChange}
      />
    </Canvas>
  );
};

export default GameScene; 