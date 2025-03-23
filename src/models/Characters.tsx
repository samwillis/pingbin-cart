import React, { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

// Pingbin (Penguin) Character - Based on the plush toy in the photo
export const Pingbin = ({ 
  position = [0, 0, 0], 
  disableAnimation = false 
}: { 
  position?: [number, number, number],
  disableAnimation?: boolean
}) => {
  const groupRef = useRef<THREE.Group>(null);
  
  // Slight bobbing animation for the character
  useFrame(({ clock }) => {
    if (groupRef.current && !disableAnimation) {
      groupRef.current.position.y = Math.sin(clock.getElapsedTime() * 2) * 0.05;
      groupRef.current.rotation.y = Math.sin(clock.getElapsedTime()) * 0.05;
    }
  });
  
  // Colors based on the photo
  const bodyDarkBrown = "#59483b";  // Dark brown for main body
  const bodyLightCream = "#e9ddc8"; // Light cream for belly/face
  const beakOrange = "#e17434";     // Orange for beak/feet
  
  return (
    <group position={new THREE.Vector3(...position)}>
      <group ref={groupRef}>
        {/* Main body - Rounder and fluffier */}
        <mesh castShadow position={[0, -0.1, 0]}>
          <sphereGeometry args={[0.6, 32, 32]} />
          <meshStandardMaterial 
            color={bodyDarkBrown} 
            roughness={0.9}
            metalness={0.1}
          />
        </mesh>
        
        {/* Head - slightly merged with body to look plush */}
        <mesh castShadow position={[0, 0.5, 0]}>
          <sphereGeometry args={[0.5, 32, 32]} />
          <meshStandardMaterial 
            color={bodyDarkBrown}
            roughness={0.9}
            metalness={0.1}
          />
        </mesh>
        
        {/* Cream colored belly - flatter to body */}
        <mesh castShadow position={[0, -0.05, 0.25]}>
          <sphereGeometry args={[0.45, 32, 32]} scale={[0.8, 1.0, 0.4]} />
          <meshStandardMaterial 
            color={bodyLightCream}
            roughness={0.9}
            metalness={0.1}
          />
        </mesh>
        
        {/* Cream face patch - moved back and flatter */}
        <mesh castShadow position={[0, 0.5, 0.25]}>
          <sphereGeometry args={[0.35, 32, 32]} scale={[0.8, 0.8, 0.2]} />
          <meshStandardMaterial 
            color={bodyLightCream}
            roughness={0.9}
            metalness={0.1}
          />
        </mesh>
        
        {/* Eyes - small black beads - moved forward */}
        <mesh castShadow position={[0.15, 0.6, 0.48]}>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshStandardMaterial color="black" />
        </mesh>
        <mesh castShadow position={[-0.15, 0.6, 0.48]}>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshStandardMaterial color="black" />
        </mesh>
        
        {/* Orange beak - positioned forward */}
        <mesh castShadow position={[0, 0.55, 0.53]} rotation={[0.2, 0, 0]}>
          <coneGeometry args={[0.15, 0.2, 32]} />
          <meshStandardMaterial 
            color={beakOrange}
            roughness={0.8}
          />
        </mesh>
        
        {/* Feet - flat orange ovals */}
        <mesh castShadow position={[0.25, -0.75, 0.15]} rotation={[-0.3, 0.2, 0]}>
          <cylinderGeometry args={[0.12, 0.2, 0.35, 32]} />
          <meshStandardMaterial 
            color={beakOrange}
            roughness={0.8}
          />
        </mesh>
        <mesh castShadow position={[-0.25, -0.75, 0.15]} rotation={[-0.3, -0.2, 0]}>
          <cylinderGeometry args={[0.12, 0.2, 0.35, 32]} />
          <meshStandardMaterial 
            color={beakOrange}
            roughness={0.8}
          />
        </mesh>
        
        {/* Small flippers/arms */}
        <mesh castShadow position={[0.5, 0, 0]} rotation={[0, 0, -0.5]}>
          <capsuleGeometry args={[0.15, 0.3, 8, 16]} />
          <meshStandardMaterial 
            color={bodyDarkBrown}
            roughness={0.9}
            metalness={0.1}
          />
        </mesh>
        <mesh castShadow position={[-0.5, 0, 0]} rotation={[0, 0, 0.5]}>
          <capsuleGeometry args={[0.15, 0.3, 8, 16]} />
          <meshStandardMaterial 
            color={bodyDarkBrown}
            roughness={0.9}
            metalness={0.1}
          />
        </mesh>
      </group>
    </group>
  );
};

// Bunny Character - Based on the plush toy in the photo
export const Bunny = ({ 
  position = [0, 0, 0],
  disableAnimation = false 
}: { 
  position?: [number, number, number],
  disableAnimation?: boolean
}) => {
  const groupRef = useRef<THREE.Group>(null);
  
  // Slight bobbing animation for the character
  useFrame(({ clock }) => {
    if (groupRef.current && !disableAnimation) {
      groupRef.current.position.y = Math.sin(clock.getElapsedTime() * 2) * 0.05;
      groupRef.current.rotation.y = Math.sin(clock.getElapsedTime() * 1.5) * 0.05;
    }
  });

  // Colors based on the photo - single color for bunny with no white belly
  const bodyLightBrown = "#b8a795"; // Light tan/brown for the bunny
  const noseColor = "#ed9f9f";      // Pinkish nose
  
  return (
    <group position={new THREE.Vector3(...position)}>
      <group ref={groupRef}>
        {/* Main body - Rounder and fluffier */}
        <mesh castShadow position={[0, -0.1, 0]}>
          <sphereGeometry args={[0.5, 32, 32]} />
          <meshStandardMaterial 
            color={bodyLightBrown} 
            roughness={0.9}
            metalness={0.1}
          />
        </mesh>
        
        {/* Head - slightly merged with body to look plush */}
        <mesh castShadow position={[0, 0.5, 0]}>
          <sphereGeometry args={[0.45, 32, 32]} />
          <meshStandardMaterial 
            color={bodyLightBrown}
            roughness={0.9}
            metalness={0.1}
          />
        </mesh>
        
        {/* Eyes - small black beads */}
        <mesh castShadow position={[0.15, 0.55, 0.38]}>
          <sphereGeometry args={[0.07, 16, 16]} />
          <meshStandardMaterial color="black" />
        </mesh>
        <mesh castShadow position={[-0.15, 0.55, 0.38]}>
          <sphereGeometry args={[0.07, 16, 16]} />
          <meshStandardMaterial color="black" />
        </mesh>
        
        {/* Small pink nose */}
        <mesh castShadow position={[0, 0.45, 0.42]}>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshStandardMaterial 
            color={noseColor}
            roughness={0.8}
          />
        </mesh>
        
        {/* Long floppy ears - on sides of head, properly drooping */}
        <mesh castShadow position={[0.45, 0.45, 0.1]} rotation={[-0.3, 0.4, 0.5]}>
          <capsuleGeometry args={[0.1, 0.5, 8, 16]} />
          <meshStandardMaterial 
            color={bodyLightBrown}
            roughness={0.9}
            metalness={0.1}
          />
        </mesh>
        <mesh castShadow position={[-0.45, 0.45, 0.1]} rotation={[-0.3, -0.4, -0.5]}>
          <capsuleGeometry args={[0.1, 0.5, 8, 16]} />
          <meshStandardMaterial 
            color={bodyLightBrown}
            roughness={0.9}
            metalness={0.1}
          />
        </mesh>
        
        {/* Arms */}
        <mesh castShadow position={[0.3, 0.1, 0.1]} rotation={[0.3, 0, -0.5]}>
          <capsuleGeometry args={[0.12, 0.3, 8, 16]} />
          <meshStandardMaterial 
            color={bodyLightBrown}
            roughness={0.9}
            metalness={0.1}
          />
        </mesh>
        <mesh castShadow position={[-0.3, 0.1, 0.1]} rotation={[0.3, 0, 0.5]}>
          <capsuleGeometry args={[0.12, 0.3, 8, 16]} />
          <meshStandardMaterial 
            color={bodyLightBrown}
            roughness={0.9}
            metalness={0.1}
          />
        </mesh>
        
        {/* Stubby legs */}
        <mesh castShadow position={[0.2, -0.6, 0.1]} rotation={[0.3, 0, 0]}>
          <capsuleGeometry args={[0.12, 0.25, 8, 16]} />
          <meshStandardMaterial 
            color={bodyLightBrown}
            roughness={0.9}
            metalness={0.1}
          />
        </mesh>
        <mesh castShadow position={[-0.2, -0.6, 0.1]} rotation={[0.3, 0, 0]}>
          <capsuleGeometry args={[0.12, 0.25, 8, 16]} />
          <meshStandardMaterial 
            color={bodyLightBrown}
            roughness={0.9}
            metalness={0.1}
          />
        </mesh>
      </group>
    </group>
  );
}; 