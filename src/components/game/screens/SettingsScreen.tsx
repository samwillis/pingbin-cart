import { KeyboardEvent as ReactKeyboardEvent, useEffect, useState } from 'react';

interface SettingsScreenProps {
  showTouchControls: boolean;
  setShowTouchControls: (show: boolean) => void;
  onBack: () => void;
  isFromPause?: boolean;
  onMainMenu?: () => void;
}

const SettingsScreen = ({ 
  showTouchControls, 
  setShowTouchControls, 
  onBack,
  isFromPause = true,
  onMainMenu 
}: SettingsScreenProps) => {
  const [deviceInfo, setDeviceInfo] = useState('');
  
  // Detect device type for informational purposes
  useEffect(() => {
    const userAgent = navigator.userAgent.toLowerCase();
    const isIOS = /iphone|ipad|ipod/.test(userAgent) || 
                 (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    const isAndroid = /android/.test(userAgent);
    
    if (isIOS) {
      setDeviceInfo('iOS device detected');
    } else if (isAndroid) {
      setDeviceInfo('Android device detected');
    } else if (/mobile|tablet/.test(userAgent)) {
      setDeviceInfo('Mobile device detected');
    } else {
      setDeviceInfo('Desktop device detected');
    }
  }, []);
  
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
        
        {deviceInfo && (
          <div className="device-info">
            <p>{deviceInfo}</p>
            <p className="info-text">
              {deviceInfo.includes('iOS') || deviceInfo.includes('Android') 
                ? 'Touch controls are automatically enabled for mobile devices.'
                : 'Touch controls can be toggled manually.'}
            </p>
          </div>
        )}
        
        <div className="settings-buttons">
          <button 
            onClick={onBack}
            onKeyDown={(e: ReactKeyboardEvent) => {
              if (e.key === 'Enter' || e.key === ' ') {
                onBack();
              }
            }}
          >
            {isFromPause ? 'Back to Game' : 'Back to Main Menu'}
          </button>
          
          {isFromPause && onMainMenu && (
            <button 
              onClick={onMainMenu}
              onKeyDown={(e: ReactKeyboardEvent) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  onMainMenu();
                }
              }}
            >
              Main Menu
            </button>
          )}
        </div>
        <p className="keyboard-hint">ESC to go back</p>
      </div>
    </div>
  );
};

export default SettingsScreen; 