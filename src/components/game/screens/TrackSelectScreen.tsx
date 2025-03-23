import { KeyboardEvent as ReactKeyboardEvent, useRef, useState, useEffect } from 'react';
import { TrackData } from '../../../utils/TrackUtils';
import TrackMap from '../TrackMap';
import * as THREE from 'three';

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
  const [selectedTrack, setSelectedTrack] = useState<TrackData | null>(null);
  const [internalSelectedId, setInternalSelectedId] = useState(selectedTrackId);
  
  // Update the selected track whenever internalSelectedId changes
  useEffect(() => {
    const track = tracks.find(t => t.id === internalSelectedId);
    setSelectedTrack(track || null);
  }, [internalSelectedId, tracks]);
  
  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const currentIndex = tracks.findIndex(t => t.id === internalSelectedId);
      if (currentIndex === -1) return;
      
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        const nextIndex = (currentIndex + 1) % tracks.length;
        const nextTrack = tracks[nextIndex];
        setInternalSelectedId(nextTrack.id);
        const trackElement = trackRefsMap.current.get(nextTrack.id);
        if (trackElement) trackElement.focus();
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        const prevIndex = (currentIndex - 1 + tracks.length) % tracks.length;
        const prevTrack = tracks[prevIndex];
        setInternalSelectedId(prevTrack.id);
        const trackElement = trackRefsMap.current.get(prevTrack.id);
        if (trackElement) trackElement.focus();
      } else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onTrackSelect(internalSelectedId);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [internalSelectedId, tracks, onTrackSelect]);
  
  // Draw a simple track icon based on track data
  const renderTrackIcon = (track: TrackData) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    
    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw track shape
      const points = track.points;
      if (!points || points.length === 0) return;
      
      // Find min/max coordinates
      let minX = Infinity;
      let maxX = -Infinity;
      let minZ = Infinity;
      let maxZ = -Infinity;
      
      for (const point of points) {
        minX = Math.min(minX, point.x);
        maxX = Math.max(maxX, point.x);
        minZ = Math.min(minZ, point.z);
        maxZ = Math.max(maxZ, point.z);
      }
      
      // Add padding
      const padding = 10;
      const width = canvas.width - padding * 2;
      const height = canvas.height - padding * 2;
      
      // Calculate scale
      const scaleX = width / (maxX - minX || 1);
      const scaleZ = height / (maxZ - minZ || 1);
      const scale = Math.min(scaleX, scaleZ);
      
      // Function to convert world coordinates to canvas coordinates
      const toCanvasCoords = (x: number, z: number) => {
        return {
          x: padding + (x - minX) * scale,
          y: padding + (z - minZ) * scale
        };
      };
      
      // Draw track path
      ctx.beginPath();
      ctx.strokeStyle = track.trackColor;
      ctx.lineWidth = track.width * scale * 0.5;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      
      const firstPoint = toCanvasCoords(points[0].x, points[0].z);
      ctx.moveTo(firstPoint.x, firstPoint.y);
      
      for (let i = 1; i < points.length; i++) {
        const point = toCanvasCoords(points[i].x, points[i].z);
        ctx.lineTo(point.x, point.y);
      }
      
      // Close the path if it's a loop
      if (points.length > 2 && 
          Math.abs(points[0].x - points[points.length - 1].x) < 1 && 
          Math.abs(points[0].z - points[points.length - 1].z) < 1) {
        ctx.closePath();
      }
      
      // Draw track
      ctx.stroke();
      
      // Draw start position
      if (track.startPosition) {
        const startPos = toCanvasCoords(track.startPosition.x, track.startPosition.z);
        
        ctx.beginPath();
        ctx.fillStyle = track.lineColor || '#FFFFFF';
        ctx.arc(startPos.x, startPos.y, 5, 0, Math.PI * 2);
        ctx.fill();
      }
    }, [track]);
    
    return <canvas ref={canvasRef} width={100} height={80} className="track-icon-canvas" />;
  };
  
  // Handle selecting a track
  const handleSelectTrack = (trackId: string) => {
    setInternalSelectedId(trackId);
    const trackElement = trackRefsMap.current.get(trackId);
    if (trackElement) trackElement.focus();
  };
  
  // Handle continue button click
  const handleContinue = () => {
    onTrackSelect(internalSelectedId);
  };
  
  return (
    <div className="track-select-overlay">
      <div className="track-select">
        <h2>Select Track</h2>
        
        <div className="track-select-content">
          <div className="track-options">
            {tracks.map((track, index) => (
              <div 
                key={track.id}
                ref={(el) => {
                  trackRefsMap.current.set(track.id, el);
                  if (index === 0) setTimeout(() => el?.focus(), 10);
                }}
                className={`track-option ${internalSelectedId === track.id ? 'selected' : ''}`}
                onClick={() => handleSelectTrack(track.id)}
                tabIndex={0}
                onKeyDown={(e: ReactKeyboardEvent) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    handleSelectTrack(track.id);
                  }
                }}
              >
                <div className="track-image">
                  {renderTrackIcon(track)}
                </div>
                <span>{track.name}</span>
              </div>
            ))}
          </div>
          
          {/* Track Map Preview */}
          {selectedTrack && (
            <div className="track-map-preview">
              <h3>Track Preview</h3>
              <div className="track-map-container">
                <TrackMap 
                  trackData={selectedTrack}
                  playerPosition={new THREE.Vector3(selectedTrack.startPosition.x, 0, selectedTrack.startPosition.z)}
                  playerRotation={0}
                />
              </div>
              <div className="track-details">
                <p>Track width: {selectedTrack.width}m</p>
                <p>Start your engines at the marked position!</p>
              </div>
              <button 
                className="continue-button"
                onClick={handleContinue}
                onKeyDown={(e: ReactKeyboardEvent) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    handleContinue();
                  }
                }}
              >
                Race This Track!
              </button>
            </div>
          )}
        </div>
        
        <p className="keyboard-hint">Use ARROW KEYS to navigate, ENTER to select a track</p>
      </div>
    </div>
  );
};

export default TrackSelectScreen; 