import { Character } from './CharacterPreview';

// Game states
export type GameState = 'start' | 'character_select' | 'car_color_select' | 'track_select' | 'playing' | 'paused' | 'settings';

// Car color options
export interface CarColorOption {
  id: string;
  name: string;
  color: string;
}

export const CAR_COLORS: CarColorOption[] = [
  { id: 'blue', name: 'Racing Blue', color: '#4361EE' },
  { id: 'red', name: 'Ruby Red', color: '#FF6B6B' },
  { id: 'green', name: 'Neon Green', color: '#06D6A0' },
  { id: 'purple', name: 'Royal Purple', color: '#7400B8' },
  { id: 'orange', name: 'Sunset Orange', color: '#FF9F1C' },
  { id: 'yellow', name: 'Lightning Yellow', color: '#FFBE0B' },
];

export type { Character }; 