import { useState } from 'react';
import '../styles/Menu.css';

type MenuProps = {
  onStartGame: () => void;
  onSettings: () => void;
};

type MenuState = 'main' | 'settings' | 'paused';

export const Menu = ({ onStartGame, onSettings }: MenuProps) => {
  const [menuState, setMenuState] = useState<MenuState>('main');

  const handleStartGame = () => {
    onStartGame();
  };

  const handleSettings = () => {
    if (menuState === 'main') {
      setMenuState('settings');
    } else {
      onSettings();
    }
  };

  const handleBack = () => {
    setMenuState('main');
  };

  return (
    <div className="menu-container">
      <h1>Pingbin Cart</h1>
      
      {menuState === 'main' && (
        <div className="menu-buttons">
          <button onClick={handleStartGame}>Start Game</button>
          <button onClick={handleSettings}>Settings</button>
        </div>
      )}
      
      {menuState === 'settings' && (
        <div className="menu-settings">
          <h2>Settings</h2>
          <div className="settings-options">
            <div className="setting-item">
              <label>
                Music Volume:
                <input type="range" min="0" max="100" defaultValue="50" />
              </label>
            </div>
            <div className="setting-item">
              <label>
                Sound Effects:
                <input type="range" min="0" max="100" defaultValue="50" />
              </label>
            </div>
          </div>
          <button onClick={handleBack}>Back</button>
        </div>
      )}
      
      {menuState === 'paused' && (
        <div className="menu-paused">
          <h2>Game Paused</h2>
          <div className="menu-buttons">
            <button onClick={handleStartGame}>Resume</button>
            <button onClick={handleSettings}>Settings</button>
            <button onClick={handleBack}>Main Menu</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Menu; 