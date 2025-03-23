import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { TrackData } from '../../utils/TrackUtils';

interface TrackMapProps {
  trackData: TrackData;
  playerPosition: THREE.Vector3;
  playerRotation: number;
}

const TrackMap = ({ trackData, playerPosition, playerRotation }: TrackMapProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Check if mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);
  
  // Draw the track map whenever trackData, playerPosition, or playerRotation changes
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !trackData) return;
    
    const context = canvas.getContext('2d');
    if (!context) return;
    
    // Clear canvas
    context.clearRect(0, 0, canvas.width, canvas.height);
    
    // Set background to dark gray with transparency
    context.fillStyle = 'rgba(40, 40, 40, 0.65)';
    context.fillRect(0, 0, canvas.width, canvas.height);
    
    // Calculate scale to fit the map in the canvas
    const points = trackData.points;
    if (!points || points.length === 0) return;
    
    // Find min/max coordinates to determine scale
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
    
    // Add padding - smaller for mobile
    const padding = isMobile ? canvas.width * 0.12 : canvas.width * 0.1;
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
    context.beginPath();
    context.strokeStyle = '#999999'; // Light gray track
    // Adjust line width for mobile
    const baseWidth = isMobile ? 0.4 : 0.5;
    context.lineWidth = trackData.width * scale * baseWidth || (isMobile ? 6 : 10);
    context.lineCap = 'round';
    context.lineJoin = 'round';
    
    const firstPoint = toCanvasCoords(points[0].x, points[0].z);
    context.moveTo(firstPoint.x, firstPoint.y);
    
    for (let i = 1; i < points.length; i++) {
      const point = toCanvasCoords(points[i].x, points[i].z);
      context.lineTo(point.x, point.y);
    }
    
    // Close the path if it's a loop
    if (points.length > 2 && 
        Math.abs(points[0].x - points[points.length - 1].x) < 1 && 
        Math.abs(points[0].z - points[points.length - 1].z) < 1) {
      context.closePath();
    }
    
    // Draw track
    context.stroke();
    
    // Draw player position
    if (playerPosition) {
      const playerPos = toCanvasCoords(playerPosition.x, playerPosition.z);
      
      // Draw player arrow
      context.save();
      context.translate(playerPos.x, playerPos.y);
      
      // Fix the rotation calculation:
      // Add PI (180 degrees) to flip the arrow to point in the correct direction
      context.rotate(-playerRotation + Math.PI);
      
      context.beginPath();
      // Use a bright red for visibility
      context.fillStyle = '#FF5F5F';
      
      // Draw triangle - scale for mobile
      const arrowSize = isMobile ? Math.max(4, canvas.width * 0.05) : 8;
      context.moveTo(0, -arrowSize);
      context.lineTo(-arrowSize / 2, arrowSize / 2);
      context.lineTo(arrowSize / 2, arrowSize / 2);
      context.closePath();
      context.fill();
      
      context.restore();
    }
    
    // Draw start position
    if (trackData.startPosition) {
      const startPos = toCanvasCoords(trackData.startPosition.x, trackData.startPosition.z);
      
      context.beginPath();
      // Use a bright green for visibility
      context.fillStyle = '#5FFF5F';
      // Scale circle size for mobile
      const dotSize = isMobile ? Math.max(3, canvas.width * 0.03) : 5;
      context.arc(startPos.x, startPos.y, dotSize, 0, Math.PI * 2);
      context.fill();
    }
  }, [trackData, playerPosition, playerRotation, isMobile]);
  
  return (
    <canvas 
      ref={canvasRef} 
      width={200} 
      height={200}
      aria-label="Track Map"
      className="track-map-canvas"
    />
  );
};

export default TrackMap; 