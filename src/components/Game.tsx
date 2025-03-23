import { useState, useEffect, KeyboardEvent as ReactKeyboardEvent, useRef } from 'react';
import { GameScene } from '../scenes/GameScene';
import { loadAllTracks } from '../utils/TrackUtils';
import '../styles/Game.css';
import { Canvas } from '@react-three/fiber';
import { Pingbin, Bunny } from '../models/Characters';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';

// Game states
type GameState = 'start' | 'character_select' | 'track_select' | 'playing' | 'paused' | 'settings';
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
  rotation = [0, 0, 0]
}: { 
  character: Character, 
  position?: [number, number, number],
  rotation?: [number, number, number]
}) => {
  return (
    <group position={position} rotation={rotation}>
      {/* Car body - using the same dimensions as the main game */}
      <mesh castShadow position={[0, 0.5, 0]}>
        <boxGeometry args={[1.5, 0.5, 3]} />
        <meshStandardMaterial color={character === 'pingbin' ? "#4361EE" : "#FF6B6B"} />
      </mesh>
      
      {/* Car top */}
      <mesh castShadow position={[0, 1, -0.2]}>
        <boxGeometry args={[1.2, 0.4, 1.5]} />
        <meshStandardMaterial color={character === 'pingbin' ? "#4CC9F0" : "#FF9F9F"} />
      </mesh>
      
      {/* Wheels - using the same style as the main game */}
      <mesh castShadow position={[0.8, 0.3, 1]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.3, 0.3, 0.2, 16]} />
        <meshStandardMaterial color="#241f31" />
      </mesh>
      <mesh castShadow position={[-0.8, 0.3, 1]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.3, 0.3, 0.2, 16]} />
        <meshStandardMaterial color="#241f31" />
      </mesh>
      <mesh castShadow position={[0.8, 0.3, -1]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.3, 0.3, 0.2, 16]} />
        <meshStandardMaterial color="#241f31" />
      </mesh>
      <mesh castShadow position={[-0.8, 0.3, -1]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.3, 0.3, 0.2, 16]} />
        <meshStandardMaterial color="#241f31" />
      </mesh>
      
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
      <RaceCar character="pingbin" position={[-2.5, 0, 0]} rotation={[0, Math.PI/8, 0]} />
      <RaceCar character="bunny" position={[2.5, 0, 1]} rotation={[0, -Math.PI/8, 0]} />
      
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
  const [showTouchControls, setShowTouchControls] = useState<boolean>(false);
  
  const tracks = loadAllTracks();
  const pingbinRef = useRef<HTMLDivElement>(null);
  const bunnyRef = useRef<HTMLDivElement>(null);
  const trackRefsMap = useRef<Map<string, HTMLDivElement | null>>(new Map());

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
    </div>
  );
}

export default Game; 