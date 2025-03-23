import { useState, useEffect, useCallback } from 'react';
import { GameScene } from '../scenes/GameScene';
import { loadAllTracks } from '../utils/TrackUtils';
import '../styles/Game.css';

// Import refactored components
import StartScreen from './game/screens/StartScreen';
import CharacterSelectScreen from './game/screens/CharacterSelectScreen';
import CarColorSelectScreen from './game/screens/CarColorSelectScreen';
import TrackSelectScreen from './game/screens/TrackSelectScreen';
import PauseScreen from './game/screens/PauseScreen';
import SettingsScreen from './game/screens/SettingsScreen';
import { GameState, Character } from './game/GameTypes';

function Game() {
  const [gameState, setGameState] = useState<GameState>('start');
  const [previousState, setPreviousState] = useState<GameState>('start');
  const [selectedCharacter, setSelectedCharacter] = useState<Character>('pingbin');
  const [selectedTrackId, setSelectedTrackId] = useState('main_track');
  const [selectedCarColor, setSelectedCarColor] = useState('#4361EE');
  const [showTouchControls, setShowTouchControls] = useState<boolean>(false);
  
  const tracks = loadAllTracks();

  // Check if the device is mobile/tablet on initial load
  useEffect(() => {
    const userAgent = navigator.userAgent.toLowerCase();
    
    // More specific detection for iOS and Android
    const isIOS = /iphone|ipad|ipod/.test(userAgent) || 
                 (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1); // Modern iPads
    const isAndroid = /android/.test(userAgent);
    const isOtherMobile = /blackberry|windows phone|mobile/.test(userAgent);
    
    // If it's iOS or Android, definitely enable touch controls
    if (isIOS || isAndroid) {
      console.log(`Mobile device detected: ${isIOS ? 'iOS' : 'Android'}`);
      setShowTouchControls(true);
    } 
    // Otherwise check screen size as a fallback
    else if (isOtherMobile || window.innerWidth <= 1024) {
      console.log('Other mobile device or small screen detected');
      setShowTouchControls(true);
    } else {
      console.log('Desktop device detected');
      setShowTouchControls(false);
    }
    
    // Also detect touch capability as another signal
    const isTouchCapable = 'ontouchstart' in window || 
                          navigator.maxTouchPoints > 0;
    
    if (isTouchCapable && !isIOS && !isAndroid && !isOtherMobile) {
      console.log('Touch-capable device detected');
      setShowTouchControls(true);
    }
  }, []);

  // Detect orientation changes and other device state changes
  useEffect(() => {
    const handleOrientationChange = () => {
      // Re-run device detection if necessary
      const userAgent = navigator.userAgent.toLowerCase();
      const isIOS = /iphone|ipad|ipod/.test(userAgent) || 
                   (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
      const isAndroid = /android/.test(userAgent);
      
      if (isIOS || isAndroid) {
        // For mobile devices, always ensure touch controls are enabled after orientation change
        setShowTouchControls(true);
        console.log('Orientation changed: ensuring touch controls are enabled for mobile device');
      }
    };
    
    // Listen for orientation changes
    window.addEventListener('orientationchange', handleOrientationChange);
    window.addEventListener('resize', handleOrientationChange);
    
    return () => {
      window.removeEventListener('orientationchange', handleOrientationChange);
      window.removeEventListener('resize', handleOrientationChange);
    };
  }, []);

  // Handle start game
  const handleStartGame = useCallback(() => {
    setPreviousState(gameState);
    setGameState('character_select');
  }, [gameState]);

  // Handle settings from start screen
  const handleStartScreenSettings = () => {
    setPreviousState(gameState);
    setGameState('settings');
  };

  // Handle character selection
  const handleSelectCharacter = (character: Character) => {
    setSelectedCharacter(character);
    setPreviousState(gameState);
    setGameState('car_color_select');
  };

  // Handle car color selection
  const handleSelectCarColor = (carColor: string) => {
    setSelectedCarColor(carColor);
    setPreviousState(gameState);
    setGameState('track_select');
  };

  // Handle track selection
  const handleSelectTrack = (trackId: string) => {
    setSelectedTrackId(trackId);
    setPreviousState(gameState);
    setGameState('playing');
  };

  // Handle pause
  const handlePause = () => {
    if (gameState === 'playing') {
      setPreviousState(gameState);
      setGameState('paused');
    }
  };

  // Handle resume
  const handleResume = useCallback(() => {
    if (gameState === 'paused') {
      setPreviousState(gameState);
      setGameState('playing');
    }
  }, [gameState]);

  // Handle settings toggle
  const handleSettings = useCallback(() => {
    if (gameState === 'paused') {
      setPreviousState(gameState);
      setGameState('settings');
    } else if (gameState === 'settings') {
      setPreviousState(gameState);
      setGameState('paused');
    }
  }, [gameState]);

  // Handle main menu
  const handleMainMenu = useCallback(() => {
    setPreviousState(gameState);
    setGameState('start');
  }, [gameState]);

  // Setup keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState === 'start' && (e.key === 'Enter' || e.key === ' ')) {
        handleStartGame();
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
  }, [gameState, handleStartGame, handleResume, handleSettings, handleMainMenu]);

  return (
    <div className="game-container">
      {gameState === 'start' && (
        <StartScreen 
          onStartGame={handleStartGame} 
          onSettings={handleStartScreenSettings}
        />
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
        <PauseScreen 
          onResume={handleResume}
          onSettings={handleSettings}
          onMainMenu={handleMainMenu}
        />
      )}

      {gameState === 'settings' && (
        <SettingsScreen 
          showTouchControls={showTouchControls}
          setShowTouchControls={setShowTouchControls}
          onBack={handleSettings}
          isFromPause={gameState === 'settings' && previousState === 'paused'}
          onMainMenu={handleMainMenu}
        />
      )}

      {gameState === 'character_select' && (
        <CharacterSelectScreen 
          selectedCharacter={selectedCharacter}
          onCharacterSelect={handleSelectCharacter}
        />
      )}

      {gameState === 'track_select' && (
        <TrackSelectScreen 
          tracks={tracks}
          selectedTrackId={selectedTrackId}
          onTrackSelect={handleSelectTrack}
        />
      )}

      {gameState === 'car_color_select' && (
        <CarColorSelectScreen 
          selectedCharacter={selectedCharacter}
          selectedCarColor={selectedCarColor}
          setSelectedCarColor={handleSelectCarColor}
          onCarColorSelect={handleSelectCarColor}
        />
      )}
    </div>
  );
}

export default Game; 