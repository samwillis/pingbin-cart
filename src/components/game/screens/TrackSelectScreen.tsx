import { KeyboardEvent as ReactKeyboardEvent, useRef } from 'react';
import { TrackData } from '../../../utils/TrackUtils';

interface TrackSelectScreenProps {
  tracks: TrackData[];
  selectedTrackId: string;
  onTrackSelect: (trackId: string) => void;
}

const TrackSelectScreen = ({ 
  tracks, 
  selectedTrackId, 
  onTrackSelect 
}: TrackSelectScreenProps) => {
  const trackRefsMap = useRef<Map<string, HTMLDivElement | null>>(new Map());

  return (
    <div className="track-select-overlay">
      <div className="track-select">
        <h2>Select Track</h2>
        <div className="track-options">
          {tracks.map((track, index) => (
            <div 
              key={track.id}
              ref={(el) => {
                trackRefsMap.current.set(track.id, el);
                if (index === 0) setTimeout(() => el?.focus(), 10);
              }}
              className={`track-option ${selectedTrackId === track.id ? 'selected' : ''}`}
              onClick={() => onTrackSelect(track.id)}
              tabIndex={0}
              onKeyDown={(e: ReactKeyboardEvent) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  onTrackSelect(track.id);
                }
              }}
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
        <p className="keyboard-hint">Use ARROW KEYS to navigate, ENTER to select</p>
      </div>
    </div>
  );
};

export default TrackSelectScreen; 