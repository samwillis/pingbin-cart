import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import RaceCar from './RaceCar';

// Welcome screen with characters in cars
const WelcomeScreen = () => {
  return (
    <Canvas className="welcome-canvas">
      <ambientLight intensity={0.8} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <PerspectiveCamera makeDefault position={[0, 3, 8]} fov={60} />
      
      {/* Checkered floor */}
      <mesh rotation={[-Math.PI/2, 0, 0]} position={[0, -0.5, 0]}>
        <planeGeometry args={[40, 40, 40, 40]} />
        <meshStandardMaterial 
          color="white" 
          wireframe={true}
          opacity={0.3}
          transparent={true}
        />
      </mesh>
      
      {/* Race track-like ground */}
      <mesh rotation={[-Math.PI/2, 0, 0]} position={[0, -0.49, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#3d3d3d" />
      </mesh>
      
      {/* Characters in their cars */}
      <RaceCar 
        character="pingbin" 
        position={[-2.5, 0, 0]} 
        rotation={[0, Math.PI/8, 0]} 
        carColor="#7400B8" 
      />
      <RaceCar 
        character="bunny" 
        position={[2.5, 0, 1]} 
        rotation={[0, -Math.PI/8, 0]} 
        carColor="#FF9F1C" 
      />
      
      <OrbitControls 
        enableZoom={false} 
        enablePan={false}
        autoRotate 
        autoRotateSpeed={1}
        maxPolarAngle={Math.PI/2.2}
        minPolarAngle={Math.PI/3}
      />
    </Canvas>
  );
};

export default WelcomeScreen; 