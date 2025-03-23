import * as THREE from 'three';
import tracksData from '../data/tracks.json';

export interface Point3D {
  x: number;
  y: number;
  z: number;
}

export interface TrackData {
  id: string;
  name: string;
  points: Point3D[];
  width: number;
  trackColor: string;
  lineColor: string;
  startPosition: Point3D;
}

export function loadTrack(trackId: string = 'main_track'): TrackData | null {
  const track = tracksData.tracks.find(t => t.id === trackId);
  return track || null;
}

export function loadAllTracks(): TrackData[] {
  return tracksData.tracks;
}

export function point3DToVector3(point: Point3D): THREE.Vector3 {
  return new THREE.Vector3(point.x, point.y, point.z);
}

export function createTrackCurve(trackData: TrackData): THREE.CatmullRomCurve3 {
  const points = trackData.points.map(point => new THREE.Vector3(point.x, 0, point.z));
  
  // Create a closed curve with proper settings
  const curve = new THREE.CatmullRomCurve3(points, true);
  
  // Ensure the curve is closed to make a continuous loop
  curve.closed = true;
  
  // Set tension to 0.2 for smoother transitions while maintaining 
  // the track shape defined by control points
  curve.tension = 0.2;
  
  return curve;
}

export function createTrackShape(width: number): THREE.Shape {
  const shape = new THREE.Shape();
  shape.moveTo(-width / 2, 0);
  shape.lineTo(width / 2, 0);
  shape.lineTo(width / 2, 0.3);  // Track height
  shape.lineTo(-width / 2, 0.3);
  shape.lineTo(-width / 2, 0);
  return shape;
}

export function calculateRightEdgePoints(trackData: TrackData): THREE.Vector3[] {
  const points = trackData.points;
  const width = trackData.width;
  
  return points.map((point, i) => {
    // For a closed track, handle edge cases properly
    const prev = i === 0 ? points[points.length - 2] : points[i - 1];
    const next = i === points.length - 1 ? points[1] : points[i + 1];
    
    // Calculate direction vector
    const dirX = next.x - prev.x;
    const dirZ = next.z - prev.z;
    
    // Normalize
    const length = Math.sqrt(dirX * dirX + dirZ * dirZ);
    const normX = dirX / length;
    const normZ = dirZ / length;
    
    // Perpendicular vector (right side of track)
    const perpX = -normZ;
    const perpZ = normX;
    
    // Calculate right edge point
    return new THREE.Vector3(
      point.x + perpX * width / 2,
      0, // Force y to zero for flat track
      point.z + perpZ * width / 2
    );
  });
}

export function calculateLeftEdgePoints(trackData: TrackData): THREE.Vector3[] {
  const points = trackData.points;
  const width = trackData.width;
  
  return points.map((point, i) => {
    // For a closed track, handle edge cases properly
    const prev = i === 0 ? points[points.length - 2] : points[i - 1];
    const next = i === points.length - 1 ? points[1] : points[i + 1];
    
    // Calculate direction vector
    const dirX = next.x - prev.x;
    const dirZ = next.z - prev.z;
    
    // Normalize
    const length = Math.sqrt(dirX * dirX + dirZ * dirZ);
    const normX = dirX / length;
    const normZ = dirZ / length;
    
    // Perpendicular vector (left side of track)
    const perpX = normZ;
    const perpZ = -normX;
    
    // Calculate left edge point
    return new THREE.Vector3(
      point.x + perpX * width / 2,
      0, // Force y to zero for flat track
      point.z + perpZ * width / 2
    );
  });
} 