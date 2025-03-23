import { useState, useEffect } from 'react';
import GameScene from '../scenes/GameScene';
import Menu from './Menu';
import '../styles/Game.css';

type GameState = 'menu' | 'characterSelect' | 'playing' | 'paused' | 'gameOver';
type Character = 'pingbin' | 'bunny';

export const Game = () => {
  const [gameState, setGameState] = useState<GameState>('menu');
  const [selectedCharacter, setSelectedCharacter] = useState<Character>('pingbin');
  
  const handleStartGame = () => {
    setGameState('characterSelect');
  };
  
  const handleCharacterSelect = (character: Character) => {
    setSelectedCharacter(character);
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
      <GameScene character={selectedCharacter} />
      
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