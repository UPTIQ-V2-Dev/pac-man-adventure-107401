import { Direction, DIRECTIONS } from '../types/pacman';
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';

interface GameControlsProps {
  onDirectionChange: (direction: Direction) => void;
  className?: string;
}

export const GameControls = ({ onDirectionChange, className = '' }: GameControlsProps) => {
  const handleDirectionPress = (direction: Direction) => {
    onDirectionChange(direction);
  };

  return (
    <div className={`flex flex-col items-center gap-2 p-4 ${className}`}>
      {/* Up */}
      <button
        onTouchStart={() => handleDirectionPress(DIRECTIONS.UP)}
        onMouseDown={() => handleDirectionPress(DIRECTIONS.UP)}
        className="w-16 h-16 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center justify-center touch-manipulation active:scale-95 transition-transform"
        style={{ touchAction: 'manipulation' }}
      >
        <ChevronUp size={32} />
      </button>
      
      {/* Middle row - Left and Right */}
      <div className="flex items-center gap-16">
        <button
          onTouchStart={() => handleDirectionPress(DIRECTIONS.LEFT)}
          onMouseDown={() => handleDirectionPress(DIRECTIONS.LEFT)}
          className="w-16 h-16 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center justify-center touch-manipulation active:scale-95 transition-transform"
          style={{ touchAction: 'manipulation' }}
        >
          <ChevronLeft size={32} />
        </button>
        
        <button
          onTouchStart={() => handleDirectionPress(DIRECTIONS.RIGHT)}
          onMouseDown={() => handleDirectionPress(DIRECTIONS.RIGHT)}
          className="w-16 h-16 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center justify-center touch-manipulation active:scale-95 transition-transform"
          style={{ touchAction: 'manipulation' }}
        >
          <ChevronRight size={32} />
        </button>
      </div>
      
      {/* Down */}
      <button
        onTouchStart={() => handleDirectionPress(DIRECTIONS.DOWN)}
        onMouseDown={() => handleDirectionPress(DIRECTIONS.DOWN)}
        className="w-16 h-16 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center justify-center touch-manipulation active:scale-95 transition-transform"
        style={{ touchAction: 'manipulation' }}
      >
        <ChevronDown size={32} />
      </button>
    </div>
  );
};