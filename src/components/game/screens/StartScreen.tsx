import { KeyboardEvent as ReactKeyboardEvent } from 'react';
import WelcomeScreen from '../WelcomeScreen';

interface StartScreenProps {
  onStartGame: () => void;
  onSettings: () => void;
}

const StartScreen = ({ onStartGame, onSettings }: StartScreenProps) => {
  return (
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
        <div className="start-buttons">
          <button 
            className="start-button"
            onClick={onStartGame}
            onKeyDown={(e: ReactKeyboardEvent) => {
              if (e.key === 'Enter' || e.key === ' ') {
                onStartGame();
              }
            }}
            autoFocus
          >
            Start Game
          </button>
          <button 
            className="settings-button"
            onClick={onSettings}
            onKeyDown={(e: ReactKeyboardEvent) => {
              if (e.key === 'Enter' || e.key === ' ') {
                onSettings();
              }
            }}
          >
            Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default StartScreen; 