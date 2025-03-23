import { useState, useEffect } from 'react';
import GameScene from '../scenes/GameScene';
import Menu from './Menu';
import '../styles/Game.css';
import { loadAllTracks } from '../utils/TrackUtils';

type GameState = 'menu' | 'characterSelect' | 'trackSelect' | 'playing' | 'paused' | 'gameOver';
type Character = 'pingbin' | 'bunny';

export const Game = () => {
  const [gameState, setGameState] = useState<GameState>('menu');
  const [selectedCharacter, setSelectedCharacter] = useState<Character>('pingbin');
  const [selectedTrackId, setSelectedTrackId] = useState('main_track');
  
  // Get all available tracks
  const tracks = loadAllTracks();
  
  const handleStartGame = () => {
    setGameState('characterSelect');
  };
  
  const handleCharacterSelect = (character: Character) => {
    setSelectedCharacter(character);
    setGameState('trackSelect');
  };
  
  const handleTrackSelect = (trackId: string) => {
    setSelectedTrackId(trackId);
    setGameState('playing');
  };
  
  const handlePauseGame = () => {
    if (gameState === 'playing') {
      setGameState('paused');
    } else if (gameState === 'paused') {
      setGameState('playing');
    }
  };
  
  const handleSettings = () => {
    // For now, this just returns to the main menu
    setGameState('menu');
  };
  
  // Set up keyboard listener for pause
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && (gameState === 'playing' || gameState === 'paused')) {
        handlePauseGame();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [gameState]);
  
  return (
    <div className="game-container">
      <GameScene character={selectedCharacter} trackId={selectedTrackId} />
      
      {gameState === 'menu' && (
        <Menu 
          onStartGame={handleStartGame} 
          onSettings={handleSettings} 
        />
      )}

      {gameState === 'characterSelect' && (
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
      
      {gameState === 'trackSelect' && (
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
      
      {gameState === 'paused' && (
        <div className="pause-overlay">
          <div className="pause-menu">
            <h2>Game Paused</h2>
            <button onClick={handlePauseGame}>Resume</button>
            <button onClick={handleSettings}>Settings</button>
            <button onClick={() => setGameState('menu')}>Main Menu</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Game; 