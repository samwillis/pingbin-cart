import { KeyboardEvent as ReactKeyboardEvent } from 'react';

interface SettingsScreenProps {
  showTouchControls: boolean;
  setShowTouchControls: (show: boolean) => void;
  onBack: () => void;
}

const SettingsScreen = ({ 
  showTouchControls, 
  setShowTouchControls, 
  onBack 
}: SettingsScreenProps) => {
  return (
    <div className="pause-overlay">
      <div className="settings-menu">
        <h2>Settings</h2>
        <div className="setting-option">
          <label htmlFor="touch-controls">Touch Controls</label>
          <input 
            type="checkbox" 
            id="touch-controls" 
            checked={showTouchControls} 
            onChange={() => setShowTouchControls(!showTouchControls)}
            onKeyDown={(e: ReactKeyboardEvent) => {
              if (e.key === 'Enter' || e.key === ' ') {
                setShowTouchControls(!showTouchControls);
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
          onClick={onBack}
          onKeyDown={(e: ReactKeyboardEvent) => {
            if (e.key === 'Enter' || e.key === ' ') {
              onBack();
            }
          }}
        >
          Back
        </button>
        <p className="keyboard-hint">ESC to go back</p>
      </div>
    </div>
  );
};

export default SettingsScreen; 