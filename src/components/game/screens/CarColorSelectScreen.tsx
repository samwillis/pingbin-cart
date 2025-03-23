import { KeyboardEvent as ReactKeyboardEvent, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { PerspectiveCamera, OrbitControls } from '@react-three/drei';
import RaceCar from '../RaceCar';
import { CAR_COLORS, Character } from '../GameTypes';

interface CarColorSelectScreenProps {
  selectedCharacter: Character;
  selectedCarColor: string;
  setSelectedCarColor: (color: string) => void;
  onCarColorSelect: (color: string) => void;
}

const CarColorSelectScreen = ({ 
  selectedCharacter,
  selectedCarColor,
  setSelectedCarColor,
  onCarColorSelect
}: CarColorSelectScreenProps) => {
  const carColorRefsMap = useRef<Map<string, HTMLDivElement | null>>(new Map());

  return (
    <div className="car-color-select-overlay">
      <div className="car-color-select">
        <h2>Choose Your Car Color</h2>
        <div className="car-preview">
          <Canvas className="car-preview-canvas">
            <ambientLight intensity={0.8} />
            <directionalLight position={[10, 10, 5]} intensity={1} />
            <PerspectiveCamera makeDefault position={[0, 2, 5]} fov={60} />
            
            {/* Car display platform */}
            <mesh rotation={[-Math.PI/2, 0, 0]} position={[0, -0.5, 0]} receiveShadow>
              <planeGeometry args={[10, 10]} />
              <meshStandardMaterial color="#3d3d3d" />
            </mesh>
            
            {/* Display the car with selected color */}
            <RaceCar 
              character={selectedCharacter} 
              position={[0, 0, 0]} 
              rotation={[0, Math.PI/4, 0]} 
              carColor={selectedCarColor} 
            />
            
            <OrbitControls 
              enableZoom={false} 
              enablePan={false}
              autoRotate 
              autoRotateSpeed={1}
            />
          </Canvas>
        </div>
        <div className="color-options">
          {CAR_COLORS.map((colorOption) => (
            <div 
              key={colorOption.id}
              ref={(el) => {
                carColorRefsMap.current.set(colorOption.id, el);
                // Set initial focus on the first color option
                if (colorOption.id === 'blue') setTimeout(() => el?.focus(), 10);
              }}
              className={`color-option ${selectedCarColor === colorOption.color ? 'selected' : ''}`}
              onClick={() => setSelectedCarColor(colorOption.color)}
              tabIndex={0}
              onKeyDown={(e: ReactKeyboardEvent) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  setSelectedCarColor(colorOption.color);
                }
              }}
              aria-label={`Select ${colorOption.name}`}
            >
              <div 
                className="color-swatch" 
                style={{ backgroundColor: colorOption.color }}
              ></div>
              <span>{colorOption.name}</span>
            </div>
          ))}
        </div>
        <button 
          className="select-button"
          onClick={() => onCarColorSelect(selectedCarColor)}
          autoFocus={false}
        >
          Select
        </button>
        <p className="keyboard-hint">Use ARROW KEYS to navigate, ENTER to select a color, or click SELECT when ready</p>
      </div>
    </div>
  );
};

export default CarColorSelectScreen; 