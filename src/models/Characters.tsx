import React from 'react';
import * as THREE from 'three';

// Pingbin (Penguin) Character
export const Pingbin = ({ position = [0, 0, 0] }: { position?: [number, number, number] }) => {
  return (
    <group position={new THREE.Vector3(...position)}>
      {/* Body */}
      <mesh castShadow position={[0, 0, 0]}>
        <capsuleGeometry args={[0.5, 1, 4, 8]} />
        <meshStandardMaterial color="#1a5fb4" />
      </mesh>
      
      {/* Head */}
      <mesh castShadow position={[0, 0.8, 0]}>
        <sphereGeometry args={[0.4, 16, 16]} />
        <meshStandardMaterial color="#1a5fb4" />
      </mesh>
      
      {/* Belly */}
      <mesh castShadow position={[0, 0, 0.25]}>
        <capsuleGeometry args={[0.4, 0.8, 4, 8]} />
        <meshStandardMaterial color="white" />
      </mesh>
      
      {/* Eyes */}
      <mesh castShadow position={[0.15, 0.85, 0.3]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial color="white" />
      </mesh>
      <mesh castShadow position={[-0.15, 0.85, 0.3]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial color="white" />
      </mesh>
      
      {/* Pupils */}
      <mesh castShadow position={[0.15, 0.85, 0.37]}>
        <sphereGeometry args={[0.04, 16, 16]} />
        <meshStandardMaterial color="black" />
      </mesh>
      <mesh castShadow position={[-0.15, 0.85, 0.37]}>
        <sphereGeometry args={[0.04, 16, 16]} />
        <meshStandardMaterial color="black" />
      </mesh>
      
      {/* Beak */}
      <mesh castShadow position={[0, 0.75, 0.42]} rotation={[0.3, 0, 0]}>
        <coneGeometry args={[0.15, 0.3, 16]} />
        <meshStandardMaterial color="#f5c211" />
      </mesh>
      
      {/* Feet */}
      <mesh castShadow position={[0.2, -0.7, 0]} rotation={[0, 0, 0.2]}>
        <boxGeometry args={[0.3, 0.1, 0.5]} />
        <meshStandardMaterial color="#f5c211" />
      </mesh>
      <mesh castShadow position={[-0.2, -0.7, 0]} rotation={[0, 0, -0.2]}>
        <boxGeometry args={[0.3, 0.1, 0.5]} />
        <meshStandardMaterial color="#f5c211" />
      </mesh>
    </group>
  );
};

// Bunny Character
export const Bunny = ({ position = [0, 0, 0] }: { position?: [number, number, number] }) => {
  return (
    <group position={new THREE.Vector3(...position)}>
      {/* Body */}
      <mesh castShadow position={[0, 0, 0]}>
        <capsuleGeometry args={[0.45, 0.9, 4, 8]} />
        <meshStandardMaterial color="#9a9996" />
      </mesh>
      
      {/* Head */}
      <mesh castShadow position={[0, 0.8, 0]}>
        <sphereGeometry args={[0.4, 16, 16]} />
        <meshStandardMaterial color="#9a9996" />
      </mesh>
      
      {/* Belly */}
      <mesh castShadow position={[0, 0, 0.25]}>
        <capsuleGeometry args={[0.35, 0.7, 4, 8]} />
        <meshStandardMaterial color="#deddda" />
      </mesh>
      
      {/* Eyes */}
      <mesh castShadow position={[0.15, 0.85, 0.3]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial color="white" />
      </mesh>
      <mesh castShadow position={[-0.15, 0.85, 0.3]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial color="white" />
      </mesh>
      
      {/* Pupils */}
      <mesh castShadow position={[0.15, 0.85, 0.37]}>
        <sphereGeometry args={[0.04, 16, 16]} />
        <meshStandardMaterial color="#77767b" />
      </mesh>
      <mesh castShadow position={[-0.15, 0.85, 0.37]}>
        <sphereGeometry args={[0.04, 16, 16]} />
        <meshStandardMaterial color="#77767b" />
      </mesh>
      
      {/* Nose */}
      <mesh castShadow position={[0, 0.75, 0.42]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial color="#f66151" />
      </mesh>
      
      {/* Ears */}
      <mesh castShadow position={[0.15, 1.2, -0.1]} rotation={[0.2, 0.2, 0.1]}>
        <capsuleGeometry args={[0.1, 0.6, 4, 8]} />
        <meshStandardMaterial color="#9a9996" />
      </mesh>
      <mesh castShadow position={[-0.15, 1.2, -0.1]} rotation={[0.2, -0.2, -0.1]}>
        <capsuleGeometry args={[0.1, 0.6, 4, 8]} />
        <meshStandardMaterial color="#9a9996" />
      </mesh>
      
      {/* Feet */}
      <mesh castShadow position={[0.2, -0.7, 0]} rotation={[0, 0, 0.2]}>
        <mesh position={[0, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <capsuleGeometry args={[0.15, 0.3, 4, 8]} />
          <meshStandardMaterial color="#9a9996" />
        </mesh>
      </mesh>
      <mesh castShadow position={[-0.2, -0.7, 0]} rotation={[0, 0, -0.2]}>
        <mesh position={[0, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <capsuleGeometry args={[0.15, 0.3, 4, 8]} />
          <meshStandardMaterial color="#9a9996" />
        </mesh>
      </mesh>
    </group>
  );
}; 