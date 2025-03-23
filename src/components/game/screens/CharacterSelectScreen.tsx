import { KeyboardEvent as ReactKeyboardEvent, useRef } from 'react';
import CharacterPreview from '../CharacterPreview';
import { Character } from '../GameTypes';

interface CharacterSelectScreenProps {
  selectedCharacter: Character;
  onCharacterSelect: (character: Character) => void;
}

const CharacterSelectScreen = ({ 
  selectedCharacter, 
  onCharacterSelect 
}: CharacterSelectScreenProps) => {
  const pingbinRef = useRef<HTMLDivElement>(null);
  const bunnyRef = useRef<HTMLDivElement>(null);
  
  return (
    <div className="character-select-overlay">
      <div className="character-select">
        <h2>Select Your Character</h2>
        <div className="character-options">
          <div 
            ref={pingbinRef}
            className={`character-option ${selectedCharacter === 'pingbin' ? 'selected' : ''}`}
            onClick={() => onCharacterSelect('pingbin')}
            tabIndex={0}
            onKeyDown={(e: ReactKeyboardEvent) => {
              if (e.key === 'Enter' || e.key === ' ') {
                onCharacterSelect('pingbin');
              }
            }}
            autoFocus
          >
            <div className="character-preview">
              <CharacterPreview character="pingbin" enableRotation={false} />
            </div>
            <span>Pingbin</span>
          </div>
          <div 
            ref={bunnyRef}
            className={`character-option ${selectedCharacter === 'bunny' ? 'selected' : ''}`}
            onClick={() => onCharacterSelect('bunny')}
            tabIndex={0}
            onKeyDown={(e: ReactKeyboardEvent) => {
              if (e.key === 'Enter' || e.key === ' ') {
                onCharacterSelect('bunny');
              }
            }}
          >
            <div className="character-preview">
              <CharacterPreview character="bunny" enableRotation={false} />
            </div>
            <span>Bunny</span>
          </div>
        </div>
        <p className="keyboard-hint">Use ARROW KEYS to navigate, ENTER to select</p>
      </div>
    </div>
  );
};

export default CharacterSelectScreen; 