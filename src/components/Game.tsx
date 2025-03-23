import { useState, useEffect } from 'react';
import { GameScene } from '../scenes/GameScene';
import { loadAllTracks } from '../utils/TrackUtils';
import '../styles/Game.css';

// Game states
type GameState = 'character_select' | 'track_select' | 'playing' | 'paused' | 'settings';
type Character = 'pingbin' | 'bunny';

function Game() {
  const [gameState, setGameState] = useState<GameState>('character_select');
  const [selectedCharacter, setSelectedCharacter] = useState<Character>('pingbin');
  const [selectedTrackId, setSelectedTrackId] = useState('main_track');
  const [showTouchControls, setShowTouchControls] = useState<boolean>(false);
  
  const tracks = loadAllTracks();

  // Check if the device is mobile/tablet on initial load
  useEffect(() => {
    const userAgent = navigator.userAgent.toLowerCase();
    const isMobileDevice = /iphone|ipad|ipod|android|blackberry|windows phone/.test(userAgent);
    setShowTouchControls(isMobileDevice || window.innerWidth <= 1024);
  }, []);

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

  return (
    <div className="game-container">
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
            <button onClick={handleResume}>Resume</button>
            <button onClick={handleSettings}>Settings</button>
            <button onClick={handleMainMenu}>Main Menu</button>
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
              />
            </div>
            <button onClick={handleSettings}>Back</button>
          </div>
        </div>
      )}

      {gameState === 'character_select' && (
        <div className="character-select-overlay">
          <div className="character-select">
            <h2>Select Your Character</h2>
            <div className="character-options">
              <div 
                className={`character-option ${selectedCharacter === 'pingbin' ? 'selected' : ''}`}
                onClick={() => handleCharacterSelect('pingbin')}
              >
                <div className="character-image pingbin"></div>
                <span>Pingbin</span>
              </div>
              <div 
                className={`character-option ${selectedCharacter === 'bunny' ? 'selected' : ''}`}
                onClick={() => handleCharacterSelect('bunny')}
              >
                <div className="character-image bunny"></div>
                <span>Bunny</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {gameState === 'track_select' && (
        <div className="track-select-overlay">
          <div className="track-select">
            <h2>Select Track</h2>
            <div className="track-options">
              {tracks.map(track => (
                <div 
                  key={track.id}
                  className={`track-option ${selectedTrackId === track.id ? 'selected' : ''}`}
                  onClick={() => handleTrackSelect(track.id)}
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
          </div>
        </div>
      )}
    </div>
  );
}

export default Game; 