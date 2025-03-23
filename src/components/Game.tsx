import { useState, useEffect, KeyboardEvent as ReactKeyboardEvent, useRef } from 'react';
import { GameScene } from '../scenes/GameScene';
import { loadAllTracks } from '../utils/TrackUtils';
import '../styles/Game.css';
import { Canvas } from '@react-three/fiber';
import { Pingbin, Bunny } from '../models/Characters';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';

// Game states
type GameState = 'start' | 'character_select' | 'car_color_select' | 'track_select' | 'playing' | 'paused' | 'settings';
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

function Game() {
  const [gameState, setGameState] = useState<GameState>('start');
  const [selectedCharacter, setSelectedCharacter] = useState<Character>('pingbin');
  const [selectedTrackId, setSelectedTrackId] = useState('main_track');
  const [selectedCarColor, setSelectedCarColor] = useState('#4361EE');
  const [showTouchControls, setShowTouchControls] = useState<boolean>(false);
  
  // Available car colors with friendly names
  const carColors = [
    { id: 'blue', name: 'Racing Blue', color: '#4361EE' },
    { id: 'red', name: 'Ruby Red', color: '#FF6B6B' },
    { id: 'green', name: 'Neon Green', color: '#06D6A0' },
    { id: 'purple', name: 'Royal Purple', color: '#7400B8' },
    { id: 'orange', name: 'Sunset Orange', color: '#FF9F1C' },
    { id: 'yellow', name: 'Lightning Yellow', color: '#FFBE0B' },
  ];
  
  const tracks = loadAllTracks();
  const pingbinRef = useRef<HTMLDivElement>(null);
  const bunnyRef = useRef<HTMLDivElement>(null);
  const trackRefsMap = useRef<Map<string, HTMLDivElement | null>>(new Map());
  const carColorRefsMap = useRef<Map<string, HTMLDivElement | null>>(new Map());

  // Check if the device is mobile/tablet on initial load
  useEffect(() => {
    const userAgent = navigator.userAgent.toLowerCase();
    const isMobileDevice = /iphone|ipad|ipod|android|blackberry|windows phone/.test(userAgent);
    setShowTouchControls(isMobileDevice || window.innerWidth <= 1024);
  }, []);

  // Handle start game
  const handleStartGame = () => {
    setGameState('character_select');
  };

  // Handle character selection
  const handleCharacterSelect = (character: Character) => {
    setSelectedCharacter(character);
    setGameState('car_color_select');
  };

  // Handle car color selection
  const handleCarColorSelect = (color: string) => {
    setSelectedCarColor(color);
    setGameState('track_select');
  };

  // Handle track selection
  const handleTrackSelect = (trackId: string) => {
    setSelectedTrackId(trackId);
    setGameState('playing');
  };

  // Handle pause
  const handlePause = () => {
    if (gameState === 'playing') {
      setGameState('paused');
    }
  };

  // Handle resume
  const handleResume = () => {
    if (gameState === 'paused') {
      setGameState('playing');
    }
  };

  // Handle settings toggle
  const handleSettings = () => {
    if (gameState === 'paused') {
      setGameState('settings');
    } else if (gameState === 'settings') {
      setGameState('paused');
    }
  };

  // Handle main menu
  const handleMainMenu = () => {
    setGameState('character_select');
  };

  // Setup keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState === 'start' && (e.key === 'Enter' || e.key === ' ')) {
        handleStartGame();
      } else if (gameState === 'character_select') {
        if (e.key === 'ArrowRight') {
          bunnyRef.current?.focus();
        } else if (e.key === 'ArrowLeft') {
          pingbinRef.current?.focus();
        }
      } else if (gameState === 'car_color_select') {
        if (e.key === 'ArrowRight' || e.key === 'ArrowLeft' || e.key === 'ArrowUp' || e.key === 'ArrowDown') {
          const colorRefs = Array.from(carColorRefsMap.current.entries());
          if (colorRefs.length === 0) return;
          
          const selectedIndex = colorRefs.findIndex(([id]) => id === carColors.find(c => c.color === selectedCarColor)?.id);
          let newIndex = selectedIndex;
          
          // Calculate the grid navigation (2 columns x 3 rows)
          const colCount = 3;
          const rowCount = Math.ceil(colorRefs.length / colCount);
          const currentRow = Math.floor(selectedIndex / colCount);
          const currentCol = selectedIndex % colCount;
          
          if (e.key === 'ArrowRight') {
            const nextCol = (currentCol + 1) % colCount;
            const nextIndex = currentRow * colCount + nextCol;
            newIndex = nextIndex < colorRefs.length ? nextIndex : selectedIndex;
          } else if (e.key === 'ArrowLeft') {
            const nextCol = (currentCol - 1 + colCount) % colCount;
            const nextIndex = currentRow * colCount + nextCol;
            newIndex = nextIndex < colorRefs.length ? nextIndex : selectedIndex;
          } else if (e.key === 'ArrowDown') {
            const nextRow = (currentRow + 1) % rowCount;
            const nextIndex = nextRow * colCount + currentCol;
            newIndex = nextIndex < colorRefs.length ? nextIndex : (nextIndex - colCount);
          } else if (e.key === 'ArrowUp') {
            const nextRow = (currentRow - 1 + rowCount) % rowCount;
            const nextIndex = nextRow * colCount + currentCol;
            newIndex = nextIndex < colorRefs.length ? nextIndex : selectedIndex;
          }
          
          const [newId, newRef] = colorRefs[newIndex];
          if (newRef) {
            newRef.focus();
          }
        }
      } else if (gameState === 'track_select') {
        if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
          const trackRefs = Array.from(trackRefsMap.current.entries());
          if (trackRefs.length === 0) return;
          
          const selectedIndex = trackRefs.findIndex(([id]) => id === selectedTrackId);
          let newIndex = selectedIndex;
          
          if (e.key === 'ArrowRight') {
            newIndex = selectedIndex === trackRefs.length - 1 ? 0 : selectedIndex + 1;
          } else if (e.key === 'ArrowLeft') {
            newIndex = selectedIndex === 0 ? trackRefs.length - 1 : selectedIndex - 1;
          }
          
          const [newId, newRef] = trackRefs[newIndex];
          if (newRef) {
            newRef.focus();
          }
        }
      } else if (gameState === 'paused') {
        if (e.key === 'Escape') {
          handleResume();
        } else if (e.key === 's') {
          handleSettings();
        } else if (e.key === 'm') {
          handleMainMenu();
        }
      } else if (gameState === 'settings' && e.key === 'Escape') {
        handleSettings(); // Go back to pause menu
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, selectedTrackId]);

  return (
    <div className="game-container">
      {gameState === 'start' && (
        <div className="start-screen-overlay">
          <div className="start-screen">
            <div className="game-title">
              <h2>Welcome to</h2>
              <h1>Pingbin Cart!</h1>
            </div>
            <p>Race around exciting tracks with Pingbin and Bunny!</p>
            <div className="welcome-preview">
              <WelcomeScreen />
            </div>
            <p className="keyboard-hint">Press ENTER or SPACE to start</p>
            <button 
              onClick={handleStartGame}
              onKeyDown={(e: ReactKeyboardEvent) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  handleStartGame();
                }
              }}
              autoFocus
            >
              Start Game
            </button>
          </div>
        </div>
      )}

      {gameState === 'playing' && (
        <GameScene 
          character={selectedCharacter} 
          trackId={selectedTrackId}
          showTouchControls={showTouchControls}
          onPause={handlePause}
          carColor={selectedCarColor}
        />
      )}

      {gameState === 'paused' && (
        <div className="pause-overlay">
          <div className="pause-menu">
            <h2>Game Paused</h2>
            <button 
              onClick={handleResume} 
              autoFocus
              onKeyDown={(e: ReactKeyboardEvent) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  handleResume();
                } else if (e.key === 'ArrowDown') {
                  const nextElement = (e.target as HTMLElement).nextElementSibling;
                  if (nextElement instanceof HTMLElement) {
                    nextElement.focus();
                  }
                }
              }}
            >
              Resume
            </button>
            <button 
              onClick={handleSettings}
              onKeyDown={(e: ReactKeyboardEvent) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  handleSettings();
                } else if (e.key === 'ArrowDown') {
                  const nextElement = (e.target as HTMLElement).nextElementSibling;
                  if (nextElement instanceof HTMLElement) {
                    nextElement.focus();
                  }
                } else if (e.key === 'ArrowUp') {
                  const prevElement = (e.target as HTMLElement).previousElementSibling;
                  if (prevElement instanceof HTMLElement) {
                    prevElement.focus();
                  }
                }
              }}
            >
              Settings
            </button>
            <button 
              onClick={handleMainMenu}
              onKeyDown={(e: ReactKeyboardEvent) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  handleMainMenu();
                } else if (e.key === 'ArrowUp') {
                  const prevElement = (e.target as HTMLElement).previousElementSibling;
                  if (prevElement instanceof HTMLElement) {
                    prevElement.focus();
                  }
                }
              }}
            >
              Main Menu
            </button>
            <p className="keyboard-hint">ESC to resume, S for settings, M for main menu</p>
          </div>
        </div>
      )}

      {gameState === 'settings' && (
        <div className="pause-overlay">
          <div className="settings-menu">
            <h2>Settings</h2>
            <div className="setting-option">
              <label htmlFor="touch-controls">Touch Controls</label>
              <input 
                type="checkbox" 
                id="touch-controls" 
                checked={showTouchControls} 
                onChange={() => setShowTouchControls(prev => !prev)}
                onKeyDown={(e: ReactKeyboardEvent) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    setShowTouchControls(prev => !prev);
                  } else if (e.key === 'ArrowDown') {
                    const button = document.querySelector('.settings-menu button');
                    if (button instanceof HTMLElement) {
                      button.focus();
                    }
                  }
                }}
                autoFocus
              />
            </div>
            <button 
              onClick={handleSettings}
              onKeyDown={(e: ReactKeyboardEvent) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  handleSettings();
                }
              }}
            >
              Back
            </button>
            <p className="keyboard-hint">ESC to go back</p>
          </div>
        </div>
      )}

      {gameState === 'character_select' && (
        <div className="character-select-overlay">
          <div className="character-select">
            <h2>Select Your Character</h2>
            <div className="character-options">
              <div 
                ref={pingbinRef}
                className={`character-option ${selectedCharacter === 'pingbin' ? 'selected' : ''}`}
                onClick={() => handleCharacterSelect('pingbin')}
                tabIndex={0}
                onKeyDown={(e: ReactKeyboardEvent) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    handleCharacterSelect('pingbin');
                  }
                }}
                autoFocus
              >
                <div className="character-preview">
                  <CharacterPreview character="pingbin" enableRotation={false} />
                </div>
                <span>Pingbin</span>
              </div>
              <div 
                ref={bunnyRef}
                className={`character-option ${selectedCharacter === 'bunny' ? 'selected' : ''}`}
                onClick={() => handleCharacterSelect('bunny')}
                tabIndex={0}
                onKeyDown={(e: ReactKeyboardEvent) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    handleCharacterSelect('bunny');
                  }
                }}
              >
                <div className="character-preview">
                  <CharacterPreview character="bunny" enableRotation={false} />
                </div>
                <span>Bunny</span>
              </div>
            </div>
            <p className="keyboard-hint">Use ARROW KEYS to navigate, ENTER to select</p>
          </div>
        </div>
      )}

      {gameState === 'track_select' && (
        <div className="track-select-overlay">
          <div className="track-select">
            <h2>Select Track</h2>
            <div className="track-options">
              {tracks.map((track, index) => (
                <div 
                  key={track.id}
                  ref={(el) => {
                    trackRefsMap.current.set(track.id, el);
                    if (index === 0) setTimeout(() => el?.focus(), 10);
                  }}
                  className={`track-option ${selectedTrackId === track.id ? 'selected' : ''}`}
                  onClick={() => handleTrackSelect(track.id)}
                  tabIndex={0}
                  onKeyDown={(e: ReactKeyboardEvent) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      handleTrackSelect(track.id);
                    }
                  }}
                >
                  <div className="track-image">
                    <div 
                      className="track-color" 
                      style={{ backgroundColor: track.trackColor }}
                    ></div>
                  </div>
                  <span>{track.name}</span>
                </div>
              ))}
            </div>
            <p className="keyboard-hint">Use ARROW KEYS to navigate, ENTER to select</p>
          </div>
        </div>
      )}

      {gameState === 'car_color_select' && (
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
              {carColors.map((colorOption) => (
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
              onClick={() => handleCarColorSelect(selectedCarColor)}
              autoFocus={false}
            >
              Select
            </button>
            <p className="keyboard-hint">Use ARROW KEYS to navigate, ENTER to select a color, or click SELECT when ready</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Game; 