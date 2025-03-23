import { KeyboardEvent as ReactKeyboardEvent } from 'react';

interface PauseScreenProps {
  onResume: () => void;
  onSettings: () => void;
  onMainMenu: () => void;
}

const PauseScreen = ({ 
  onResume, 
  onSettings, 
  onMainMenu 
}: PauseScreenProps) => {
  return (
    <div className="pause-overlay">
      <div className="pause-menu">
        <h2>Game Paused</h2>
        <button 
          onClick={onResume} 
          autoFocus
          onKeyDown={(e: ReactKeyboardEvent) => {
            if (e.key === 'Enter' || e.key === ' ') {
              onResume();
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
          onClick={onSettings}
          onKeyDown={(e: ReactKeyboardEvent) => {
            if (e.key === 'Enter' || e.key === ' ') {
              onSettings();
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
          onClick={onMainMenu}
          onKeyDown={(e: ReactKeyboardEvent) => {
            if (e.key === 'Enter' || e.key === ' ') {
              onMainMenu();
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
  );
};

export default PauseScreen; 