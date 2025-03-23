import { Canvas } from '@react-three/fiber';
import { PerspectiveCamera, OrbitControls } from '@react-three/drei';
import { Pingbin, Bunny } from '../../models/Characters';

type Character = 'pingbin' | 'bunny';

// Character preview component for selection screen
const CharacterPreview = ({ 
  character, 
  enableRotation = false 
}: { 
  character: Character, 
  enableRotation?: boolean 
}) => {
  return (
    <Canvas className="character-preview-canvas">
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 10, 5]} intensity={0.8} />
      <PerspectiveCamera makeDefault position={[0, 0, 2]} fov={50} />
      
      {/* Colorful background */}
      <mesh position={[0, 0, -1]} rotation={[0, 0, 0]}>
        <planeGeometry args={[10, 10]} />
        <meshStandardMaterial 
          color={character === 'pingbin' ? "#4CC9F0" : "#FF9F9F"} 
          opacity={0.3}
          transparent={true}
        />
      </mesh>
      
      {/* Character model */}
      <group position={[0, -0.5, 0]} rotation={[0, character === 'pingbin' ? -0.2 : 0.2, 0]}>
        {character === 'pingbin' ? (
          <Pingbin position={[0, 0, 0]} disableAnimation={!enableRotation} />
        ) : (
          <Bunny position={[0, 0, 0]} disableAnimation={!enableRotation} />
        )}
      </group>
      
      {/* Add some decorative elements */}
      {Array.from({ length: 8 }).map((_, i) => (
        <mesh key={i} position={[
          (Math.random() - 0.5) * 3,
          (Math.random() - 0.5) * 3,
          -0.5
        ]}>
          <sphereGeometry args={[0.05, 16, 16]} />
          <meshStandardMaterial 
            color={character === 'pingbin' ? 
              ["#4361EE", "#3A0CA3", "#7209B7", "#4CC9F0"][i % 4] : 
              ["#FF6B6B", "#FF9E00", "#FF006E", "#FF9F9F"][i % 4]} 
            emissive={character === 'pingbin' ? 
              ["#4361EE", "#3A0CA3", "#7209B7", "#4CC9F0"][i % 4] : 
              ["#FF6B6B", "#FF9E00", "#FF006E", "#FF9F9F"][i % 4]}
            emissiveIntensity={0.5}
          />
        </mesh>
      ))}
      
      {enableRotation && (
        <OrbitControls 
          enableZoom={false} 
          enablePan={false}
          autoRotate 
          autoRotateSpeed={2} 
          rotateSpeed={0.5}
        />
      )}
    </Canvas>
  );
};

export default CharacterPreview;
export type { Character }; 