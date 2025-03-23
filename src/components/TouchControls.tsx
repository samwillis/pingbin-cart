import React from 'react';
import '../styles/TouchControls.css';

interface TouchControlsProps {
  onControlChange: (control: string, isPressed: boolean) => void;
}

const TouchControls: React.FC<TouchControlsProps> = ({ onControlChange }) => {
  // Handler for touch start events
  const handleTouchStart = (control: string) => {
    onControlChange(control, true);
  };

  // Handler for touch end events
  const handleTouchEnd = (control: string) => {
    onControlChange(control, false);
  };

  return (
    <div className="touch-controls">
      {/* Left side - steering controls */}
      <div className="control-group left">
        <button
          className="control-button left-btn"
          onTouchStart={() => handleTouchStart('left')}
          onTouchEnd={() => handleTouchEnd('left')}
          onMouseDown={() => handleTouchStart('left')}
          onMouseUp={() => handleTouchEnd('left')}
          onMouseLeave={() => handleTouchEnd('left')}
        >
          <svg viewBox="0 0 24 24" fill="white">
            <path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z" />
          </svg>
        </button>
        <button
          className="control-button right-btn"
          onTouchStart={() => handleTouchStart('right')}
          onTouchEnd={() => handleTouchEnd('right')}
          onMouseDown={() => handleTouchStart('right')}
          onMouseUp={() => handleTouchEnd('right')}
          onMouseLeave={() => handleTouchEnd('right')}
        >
          <svg viewBox="0 0 24 24" fill="white">
            <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
          </svg>
        </button>
      </div>

      {/* Right side - acceleration controls */}
      <div className="control-group right">
        <button
          className="control-button forward-btn"
          onTouchStart={() => handleTouchStart('forward')}
          onTouchEnd={() => handleTouchEnd('forward')}
          onMouseDown={() => handleTouchStart('forward')}
          onMouseUp={() => handleTouchEnd('forward')}
          onMouseLeave={() => handleTouchEnd('forward')}
        >
          <svg viewBox="0 0 24 24" fill="white">
            <path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6 1.41 1.41z" />
          </svg>
        </button>
        <button
          className="control-button backward-btn"
          onTouchStart={() => handleTouchStart('backward')}
          onTouchEnd={() => handleTouchEnd('backward')}
          onMouseDown={() => handleTouchStart('backward')}
          onMouseUp={() => handleTouchEnd('backward')}
          onMouseLeave={() => handleTouchEnd('backward')}
        >
          <svg viewBox="0 0 24 24" fill="white">
            <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default TouchControls; 