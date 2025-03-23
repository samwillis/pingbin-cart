import { Pingbin, Bunny } from '../../models/Characters';
import { Character } from './CharacterPreview';

// Race car component
const RaceCar = ({ 
  character, 
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  carColor = "#4361EE"
}: { 
  character: Character, 
  position?: [number, number, number],
  rotation?: [number, number, number],
  carColor?: string
}) => {
  return (
    <group position={position} rotation={rotation}>
      {/* Car body - main chassis */}
      <mesh castShadow position={[0, 0.5, 0]}>
        <boxGeometry args={[1.5, 0.4, 3]} />
        <meshStandardMaterial color={carColor} />
      </mesh>
      
      {/* Car nose - for a sports car look */}
      <mesh castShadow position={[0, 0.6, 1.4]}>
        <boxGeometry args={[1.2, 0.25, 0.4]} />
        <meshStandardMaterial color={carColor} />
      </mesh>
      
      {/* Car rear spoiler base */}
      <mesh castShadow position={[0, 0.7, -1.4]}>
        <boxGeometry args={[1.4, 0.1, 0.3]} />
        <meshStandardMaterial color={carColor} />
      </mesh>
      
      {/* Car rear spoiler wing */}
      <mesh castShadow position={[0, 0.9, -1.5]}>
        <boxGeometry args={[1.5, 0.1, 0.4]} />
        <meshStandardMaterial color="#333333" />
      </mesh>
      
      {/* Spoiler supports - left */}
      <mesh castShadow position={[0.5, 0.8, -1.5]}>
        <boxGeometry args={[0.1, 0.2, 0.1]} />
        <meshStandardMaterial color="#333333" />
      </mesh>
      
      {/* Spoiler supports - right */}
      <mesh castShadow position={[-0.5, 0.8, -1.5]}>
        <boxGeometry args={[0.1, 0.2, 0.1]} />
        <meshStandardMaterial color="#333333" />
      </mesh>
      
      {/* Car top/cockpit */}
      <mesh castShadow position={[0, 0.9, -0.2]}>
        <boxGeometry args={[1.2, 0.4, 1.5]} />
        <meshStandardMaterial color={character === 'pingbin' ? "#4CC9F0" : "#FF9F9F"} />
      </mesh>
      
      {/* Windshield */}
      <mesh castShadow position={[0, 0.9, 0.8]} rotation={[Math.PI/6, 0, 0]}>
        <boxGeometry args={[1.1, 0.02, 0.7]} />
        <meshStandardMaterial color="#87CEEB" metalness={0.6} roughness={0.2} />
      </mesh>
      
      {/* Headlights - right */}
      <mesh castShadow position={[0.53, 0.6, 1.57]} rotation={[Math.PI/2, 0, 0]}>
        <cylinderGeometry args={[0.15, 0.15, 0.1, 16]} />
        <meshStandardMaterial color="#FFFF99" emissive="#FFFF00" emissiveIntensity={0.5} />
      </mesh>
      
      {/* Headlights - left */}
      <mesh castShadow position={[-0.53, 0.6, 1.57]} rotation={[Math.PI/2, 0, 0]}>
        <cylinderGeometry args={[0.15, 0.15, 0.1, 16]} />
        <meshStandardMaterial color="#FFFF99" emissive="#FFFF00" emissiveIntensity={0.5} />
      </mesh>
      
      {/* Taillights - right */}
      <mesh castShadow position={[0.5, 0.6, -1.54]} rotation={[Math.PI/2, 0, 0]}>
        <cylinderGeometry args={[0.15, 0.15, 0.1, 16]} />
        <meshStandardMaterial color="#FF3333" emissive="#FF0000" emissiveIntensity={0.5} />
      </mesh>
      
      {/* Taillights - left */}
      <mesh castShadow position={[-0.5, 0.6, -1.54]} rotation={[Math.PI/2, 0, 0]}>
        <cylinderGeometry args={[0.15, 0.15, 0.1, 16]} />
        <meshStandardMaterial color="#FF3333" emissive="#FF0000" emissiveIntensity={0.5} />
      </mesh>
      
      {/* Side skirts - right */}
      <mesh castShadow position={[0.8, 0.3, 0]}>
        <boxGeometry args={[0.1, 0.2, 2.5]} />
        <meshStandardMaterial color="#222222" />
      </mesh>
      
      {/* Side skirts - left */}
      <mesh castShadow position={[-0.8, 0.3, 0]}>
        <boxGeometry args={[0.1, 0.2, 2.5]} />
        <meshStandardMaterial color="#222222" />
      </mesh>
      
      {/* Wheels - front right */}
      <group position={[0.8, 0.3, 1]} rotation={[0, 0, Math.PI / 2]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.3, 0.3, 0.2, 16]} />
          <meshStandardMaterial color="#241f31" />
        </mesh>
        {/* Wheel hub */}
        <mesh castShadow position={[0, 0, 0.11]}>
          <cylinderGeometry args={[0.15, 0.15, 0.02, 16]} />
          <meshStandardMaterial color="silver" metalness={0.8} roughness={0.2} />
        </mesh>
        {/* Spokes */}
        {[0, 1, 2, 3, 4].map((_, i) => (
          <mesh castShadow key={i} rotation={[0, 0, (Math.PI * 2 * i) / 5]} position={[0, 0, 0.11]}>
            <boxGeometry args={[0.25, 0.05, 0.01]} />
            <meshStandardMaterial color="silver" metalness={0.8} roughness={0.2} />
          </mesh>
        ))}
      </group>
      
      {/* Wheels - front left */}
      <group position={[-0.8, 0.3, 1]} rotation={[0, 0, Math.PI / 2]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.3, 0.3, 0.2, 16]} />
          <meshStandardMaterial color="#241f31" />
        </mesh>
        {/* Wheel hub */}
        <mesh castShadow position={[0, 0, -0.11]}>
          <cylinderGeometry args={[0.15, 0.15, 0.02, 16]} />
          <meshStandardMaterial color="silver" metalness={0.8} roughness={0.2} />
        </mesh>
        {/* Spokes */}
        {[0, 1, 2, 3, 4].map((_, i) => (
          <mesh castShadow key={i} rotation={[0, 0, (Math.PI * 2 * i) / 5]} position={[0, 0, -0.11]}>
            <boxGeometry args={[0.25, 0.05, 0.01]} />
            <meshStandardMaterial color="silver" metalness={0.8} roughness={0.2} />
          </mesh>
        ))}
      </group>
      
      {/* Wheels - rear right */}
      <group position={[0.8, 0.3, -1]} rotation={[0, 0, Math.PI / 2]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.3, 0.3, 0.2, 16]} />
          <meshStandardMaterial color="#241f31" />
        </mesh>
        {/* Wheel hub */}
        <mesh castShadow position={[0, 0, 0.11]}>
          <cylinderGeometry args={[0.15, 0.15, 0.02, 16]} />
          <meshStandardMaterial color="silver" metalness={0.8} roughness={0.2} />
        </mesh>
        {/* Spokes */}
        {[0, 1, 2, 3, 4].map((_, i) => (
          <mesh castShadow key={i} rotation={[0, 0, (Math.PI * 2 * i) / 5]} position={[0, 0, 0.11]}>
            <boxGeometry args={[0.25, 0.05, 0.01]} />
            <meshStandardMaterial color="silver" metalness={0.8} roughness={0.2} />
          </mesh>
        ))}
      </group>
      
      {/* Wheels - rear left */}
      <group position={[-0.8, 0.3, -1]} rotation={[0, 0, Math.PI / 2]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.3, 0.3, 0.2, 16]} />
          <meshStandardMaterial color="#241f31" />
        </mesh>
        {/* Wheel hub */}
        <mesh castShadow position={[0, 0, -0.11]}>
          <cylinderGeometry args={[0.15, 0.15, 0.02, 16]} />
          <meshStandardMaterial color="silver" metalness={0.8} roughness={0.2} />
        </mesh>
        {/* Spokes */}
        {[0, 1, 2, 3, 4].map((_, i) => (
          <mesh castShadow key={i} rotation={[0, 0, (Math.PI * 2 * i) / 5]} position={[0, 0, -0.11]}>
            <boxGeometry args={[0.25, 0.05, 0.01]} />
            <meshStandardMaterial color="silver" metalness={0.8} roughness={0.2} />
          </mesh>
        ))}
      </group>
      
      {/* Character */}
      <group position={[0, 1.5, -0.2]} scale={[0.8, 0.8, 0.8]}>
        {character === 'pingbin' ? (
          <Pingbin position={[0, 0, 0]} disableAnimation={false} />
        ) : (
          <Bunny position={[0, 0, 0]} disableAnimation={false} />
        )}
      </group>
    </group>
  );
};

export default RaceCar; 