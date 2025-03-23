import { useEffect, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { PerspectiveCamera, Sky } from '@react-three/drei';
import * as THREE from 'three';
import { Pingbin, Bunny } from '../models/Characters';
import { 
  loadTrack, 
  createTrackCurve
} from '../utils/TrackUtils';
import TouchControls from '../components/TouchControls';
import TrackMap from '../components/game/TrackMap';

// Track component for the racing circuit
const Track = ({ trackId = 'main_track' }: { trackId?: string }) => {
  const trackData = loadTrack(trackId);
  
  if (!trackData) {
    console.error(`Track with ID ${trackId} not found!`);
    return null;
  }
  
  // Create track curve from the loaded track data
  const trackCurve = createTrackCurve(trackData);
  
  // Track properties
  const trackWidth = trackData.width;
  const trackSegments = 100;
  
  // Create track shape
  // The track shape defines the cross-section of the track
  // Define it in the X-Y plane for proper extrusion along the curve
  const trackShape = new THREE.Shape();
  trackShape.moveTo(0, -trackWidth / 2);
  trackShape.lineTo(0, trackWidth / 2);
  trackShape.lineTo(0.1, trackWidth / 2);  // Small height for the track
  trackShape.lineTo(0.1, -trackWidth / 2);
  trackShape.lineTo(0, -trackWidth / 2);
  
  // Create geometry settings
  const extrudeSettings = {
    steps: trackSegments,
    bevelEnabled: false,
    extrudePath: trackCurve
  };
  
  // Calculate starting position for starting line
  const startPoint = trackData.points[0];
  const nextPoint = trackData.points[1];
  
  // Calculate the direction of the track at the starting point
  const startAngle = Math.atan2(nextPoint.z - startPoint.z, nextPoint.x - startPoint.x);
  
  // Calculate edge points for borders
  // const leftEdgePoints = calculateLeftEdgePoints(trackData);
  // const rightEdgePoints = calculateRightEdgePoints(trackData);
  
  // Create left and right edge curves
  // const leftEdgeCurve = new THREE.CatmullRomCurve3(leftEdgePoints, true);
  // const rightEdgeCurve = new THREE.CatmullRomCurve3(rightEdgePoints, true);
  
  // Set tension for smoother curves
  // leftEdgeCurve.tension = 0.5;
  // rightEdgeCurve.tension = 0.5;
  // leftEdgeCurve.closed = true;
  // rightEdgeCurve.closed = true;
  
  return (
    <group>
      {/* Track base */}
      <mesh receiveShadow position={[0, 0, 0]}>
        <extrudeGeometry args={[trackShape, extrudeSettings]} />
        <meshStandardMaterial color={trackData.trackColor} />
      </mesh>
      
      {/* Track Edge Lines - Created directly from the track */}
      <mesh position={[0, 0.15, 0]}>
        <extrudeGeometry 
          args={[
            new THREE.Shape().moveTo(0, -trackWidth / 2 - 0.3).lineTo(0, -trackWidth / 2).lineTo(0.1, -trackWidth / 2).lineTo(0.1, -trackWidth / 2 - 0.3).lineTo(0, -trackWidth / 2 - 0.3),
            {...extrudeSettings}
          ]} 
        />
        <meshStandardMaterial color={trackData.lineColor} />
      </mesh>
      
      {/* Right edge line */}
      <mesh position={[0, 0.15, 0]}>
        <extrudeGeometry 
          args={[
            new THREE.Shape().moveTo(0, trackWidth / 2).lineTo(0, trackWidth / 2 + 0.3).lineTo(0.1, trackWidth / 2 + 0.3).lineTo(0.1, trackWidth / 2).lineTo(0, trackWidth / 2),
            {...extrudeSettings}
          ]} 
        />
        <meshStandardMaterial color={trackData.lineColor} />
      </mesh>
      
      {/* Starting line */}
      <group 
        position={[startPoint.x, 0.1, startPoint.z]} 
        rotation={[0, startAngle + Math.PI / 2, 0]}
      >
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[trackWidth + 0.6, 3]} />
          <meshStandardMaterial color="white" side={THREE.DoubleSide} />
        </mesh>
        {/* Checkerboard pattern for the starting line */}
        {Array.from({ length: 8 }).map((_, i) => (
          <mesh 
            key={i}
            position={[(i % 2 === 0 ? -1 : 1) * (trackWidth / 2 - 1.5), 0.01, (i < 4 ? -1 : 1) * 0.9]} 
            rotation={[-Math.PI / 2, 0, 0]}
          >
            <planeGeometry args={[1.5, 1.5]} />
            <meshStandardMaterial color={i % 2 === 0 ? "black" : "white"} side={THREE.DoubleSide} />
          </mesh>
        ))}
      </group>
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
  trackId = 'main_track',
  onPositionChange,
  carColor = "#e01b24"
}: { 
  position: [number, number, number],
  controls: {
    forward: boolean;
    backward: boolean;
    left: boolean;
    right: boolean;
  },
  character?: 'pingbin' | 'bunny',
  trackId?: string,
  onPositionChange: (position: THREE.Vector3, rotation: number) => void,
  carColor?: string
}) => {
  const meshRef = useRef<THREE.Group>(null);
  const [velocity, setVelocity] = useState(0);
  const [rotation, setRotation] = useState(0);
  const trackData = loadTrack(trackId);
  const trackCurve = createTrackCurve(trackData!);
  const trackWidth = trackData?.width || 15;
  
  // Set initial rotation to match track direction at the starting point
  useEffect(() => {
    if (trackData && meshRef.current) {
      const startPoint = trackData.points[0];
      const nextPoint = trackData.points[1];
      // Calculate initial direction along the track
      const startAngle = Math.atan2(nextPoint.z - startPoint.z, nextPoint.x - startPoint.x) - Math.PI / 2;
      setRotation(startAngle);
      
      // Apply initial rotation
      meshRef.current.rotation.y = startAngle;
    }
  }, [trackData]);
  
  useFrame(() => {
    if (!meshRef.current || !trackData) return;
    
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
    
    // Calculate potential new position
    const newPosX = meshRef.current.position.x + Math.sin(rotation) * velocity;
    const newPosZ = meshRef.current.position.z + Math.cos(rotation) * velocity;
    
    // Check if the new position is on the track
    const newPos = new THREE.Vector3(newPosX, 0, newPosZ);
    
    // Find closest point on track curve to the new position
    const closestPointOnCurve = trackCurve.getPointAt(
      trackCurve.getUtoTmapping(trackCurve.getPoint(0).distanceTo(newPos) / 1000, 0)
    );
    
    for (let i = 0; i <= 1; i += 0.01) {
      const point = trackCurve.getPointAt(i);
      if (point.distanceTo(newPos) < closestPointOnCurve.distanceTo(newPos)) {
        closestPointOnCurve.copy(point);
      }
    }
    
    // If the distance to the track is too large, constrain movement
    const distanceToTrack = newPos.distanceTo(closestPointOnCurve);
    const maxAllowedDistance = (trackWidth / 2) - 1; // Allow car to move within track width, minus car width
    
    if (distanceToTrack > maxAllowedDistance) {
      // Calculate direction to the closest point on track
      const dirToTrack = new THREE.Vector3().subVectors(closestPointOnCurve, newPos).normalize();
      
      // Apply a "bounce" effect - push the car back toward the track
      const pushFactor = 0.5;
      const bounceX = dirToTrack.x * pushFactor;
      const bounceZ = dirToTrack.z * pushFactor;
      
      // Update position with constraint and slight bounce
      meshRef.current.position.x = newPosX + bounceX;
      meshRef.current.position.z = newPosZ + bounceZ;
      
      // Reduce velocity on collision
      setVelocity(prev => prev * 0.7);
    } else {
      // Normal movement
      meshRef.current.position.x = newPosX;
      meshRef.current.position.z = newPosZ;
    }
    
    // Update rotation
    meshRef.current.rotation.y = rotation;
    
    // Always notify about position and rotation changes, even when not moving or turning
    onPositionChange(meshRef.current.position, rotation);
  });
  
  return (
    <group ref={meshRef} position={position}>
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
      <mesh castShadow position={[0.5, 0.6, 1.54]} rotation={[Math.PI/2, 0, 0]}>
        <cylinderGeometry args={[0.15, 0.15, 0.1, 16]} />
        <meshStandardMaterial color="#FFFF99" emissive="#FFFF00" emissiveIntensity={0.5} />
      </mesh>
      
      {/* Headlights - left */}
      <mesh castShadow position={[-0.5, 0.6, 1.54]} rotation={[Math.PI/2, 0, 0]}>
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
      
      {/* Sky */}
      <Sky 
        distance={450000} 
        sunPosition={[10, 5, 10]} 
        inclination={0.5} 
        azimuth={0.25} 
        rayleigh={0.5}
      />
    </>
  );
};

// Main game scene component
export const GameScene = ({ 
  character = 'pingbin',
  trackId = 'main_track',
  showTouchControls = false,
  onPause,
  carColor = "#e01b24"
}: { 
  character?: 'pingbin' | 'bunny',
  trackId?: string,
  showTouchControls?: boolean,
  onPause?: () => void,
  carColor?: string
}) => {
  const trackData = loadTrack(trackId);
  const startPos = trackData?.startPosition || { x: 0, y: 0, z: -45 };
  
  const playerPosition = useRef(new THREE.Vector3(startPos.x, 0, startPos.z));
  const playerRotation = useRef(0);
  // Add state variables for the map display
  const [mapPosition, setMapPosition] = useState(new THREE.Vector3(startPos.x, 0, startPos.z));
  const [mapRotation, setMapRotation] = useState(0);
  const [controls, setControls] = useState({
    forward: false,
    backward: false,
    left: false,
    right: false
  });
  const [countdown, setCountdown] = useState<number | null>(3);
  const [gameActive, setGameActive] = useState(false);
  const [countdownKey, setCountdownKey] = useState(0); // Key to force animation re-render
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [isLandscape, setIsLandscape] = useState<boolean>(false);
  
  // Detect mobile and orientation
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      setIsLandscape(window.innerWidth > window.innerHeight);
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  // Use requestAnimationFrame to continuously update map position
  useEffect(() => {
    let frameId: number;
    
    const updateMapPosition = () => {
      // Only update if the values have changed to avoid unnecessary renders
      if (!mapPosition.equals(playerPosition.current) || mapRotation !== playerRotation.current) {
        setMapPosition(playerPosition.current.clone());
        setMapRotation(playerRotation.current);
      }
      frameId = requestAnimationFrame(updateMapPosition);
    };
    
    frameId = requestAnimationFrame(updateMapPosition);
    
    return () => {
      cancelAnimationFrame(frameId);
    };
  }, [mapPosition, mapRotation]);
  
  // Countdown timer
  useEffect(() => {
    if (countdown === null) return;
    
    if (countdown > 0) {
      // Trigger animation by changing the key
      setCountdownKey(prev => prev + 1);
      
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      
      return () => clearTimeout(timer);
    } else if (countdown === 0) {
      // Show "GO!" for 1 second, then start the game
      // Trigger animation for "GO!"
      setCountdownKey(prev => prev + 1);
      
      const timer = setTimeout(() => {
        setCountdown(null);
        setGameActive(true);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [countdown]);
  
  // Handler for vehicle position updates
  const handlePositionChange = (position: THREE.Vector3, rotation: number) => {
    playerPosition.current.copy(position);
    playerRotation.current = rotation;
  };
  
  // Handler for touch controls
  const handleTouchControl = (control: string, isPressed: boolean) => {
    if (!gameActive) return; // Ignore controls until countdown is finished
    
    setControls(prev => {
      switch (control) {
        case 'forward':
          return { ...prev, forward: isPressed };
        case 'backward':
          return { ...prev, backward: isPressed };
        case 'left':
          return { ...prev, left: isPressed };
        case 'right':
          return { ...prev, right: isPressed };
        default:
          return prev;
      }
    });
  };
  
  // Set up keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!gameActive) return; // Ignore controls until countdown is finished
      
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
      if (e.key === 'Escape' && onPause) {
        onPause();
      }
    };
    
    const handleKeyUp = (e: KeyboardEvent) => {
      if (!gameActive) return; // Ignore controls until countdown is finished
      
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
  }, [onPause, gameActive]);

  // Update track map canvas classes
  useEffect(() => {
    const canvas = document.querySelector('.track-map-canvas');
    if (canvas) {
      // Add mobile and landscape classes as needed
      if (isMobile) canvas.classList.add('mobile');
      else canvas.classList.remove('mobile');
      
      if (isLandscape) canvas.classList.add('landscape');
      else canvas.classList.remove('landscape');
      
      if (countdown !== null) canvas.classList.add('countdown-active');
      else canvas.classList.remove('countdown-active');
    }
  }, [isMobile, isLandscape, countdown]);

  return (
    <>
      <Canvas shadows>
        <PerspectiveCamera makeDefault position={[0, 5, -10]} fov={75} />
        <FollowCamera target={playerPosition.current} rotation={playerRotation.current} />
        <Environment />
        <CheckeredGround />
        <Track trackId={trackId} />
        <Vehicle 
          position={[startPos.x, startPos.y, startPos.z]} 
          controls={gameActive ? controls : { forward: false, backward: false, left: false, right: false }}
          character={character}
          trackId={trackId}
          onPositionChange={handlePositionChange}
          carColor={carColor}
        />
      </Canvas>
      
      {/* Pause button */}
      {gameActive && (
        <button 
          className="pause-button"
          onClick={onPause}
          aria-label="Pause Game"
        >
          <svg width="24" height="24" viewBox="0 0 24 24">
            <rect x="6" y="4" width="4" height="16" fill="white" />
            <rect x="14" y="4" width="4" height="16" fill="white" />
          </svg>
        </button>
      )}
      
      {/* Track Map UI */}
      {trackData && (
        <TrackMap 
          trackData={trackData} 
          playerPosition={mapPosition} 
          playerRotation={mapRotation} 
        />
      )}
      
      {/* Countdown UI */}
      {countdown !== null && (
        <div className="countdown-overlay">
          <div key={countdownKey} className="countdown">
            {countdown > 0 ? countdown : "GO!"}
          </div>
        </div>
      )}
      
      {/* Touch controls for mobile/tablet devices, only if enabled */}
      {showTouchControls && <TouchControls onControlChange={handleTouchControl} />}
    </>
  );
};

export default GameScene; 