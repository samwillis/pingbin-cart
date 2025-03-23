import { useState, useEffect, useRef } from 'react';
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
import { GameState, Character, CAR_COLORS } from './game/GameTypes';

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
    const isMobileDevice = /iphone|ipad|ipod|android|blackberry|windows phone/.test(userAgent);
    setShowTouchControls(isMobileDevice || window.innerWidth <= 1024);
  }, []);

  // Handle start game
  const handleStartGame = () => {
    setPreviousState(gameState);
    setGameState('character_select');
  };

  // Handle settings from start screen
  const handleStartScreenSettings = () => {
    setPreviousState(gameState);
    setGameState('settings');
  };

  // Handle character selection
  const handleCharacterSelect = (character: Character) => {
    setSelectedCharacter(character);
    setPreviousState(gameState);
    setGameState('car_color_select');
  };

  // Handle car color selection
  const handleCarColorSelect = (color: string) => {
    setSelectedCarColor(color);
    setPreviousState(gameState);
    setGameState('track_select');
  };

  // Handle track selection
  const handleTrackSelect = (trackId: string) => {
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
  const handleResume = () => {
    if (gameState === 'paused') {
      setPreviousState(gameState);
      setGameState('playing');
    }
  };

  // Handle settings toggle
  const handleSettings = () => {
    if (gameState === 'paused') {
      setPreviousState(gameState);
      setGameState('settings');
    } else if (gameState === 'settings') {
      setPreviousState(gameState);
      setGameState('paused');
    }
  };

  // Handle main menu
  const handleMainMenu = () => {
    setPreviousState(gameState);
    setGameState('character_select');
  };

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
  }, [gameState]);

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
          onCharacterSelect={handleCharacterSelect}
        />
      )}

      {gameState === 'track_select' && (
        <TrackSelectScreen 
          tracks={tracks}
          selectedTrackId={selectedTrackId}
          onTrackSelect={handleTrackSelect}
        />
      )}

      {gameState === 'car_color_select' && (
        <CarColorSelectScreen 
          selectedCharacter={selectedCharacter}
          selectedCarColor={selectedCarColor}
          setSelectedCarColor={setSelectedCarColor}
          onCarColorSelect={handleCarColorSelect}
        />
      )}
    </div>
  );
}

export default Game; 