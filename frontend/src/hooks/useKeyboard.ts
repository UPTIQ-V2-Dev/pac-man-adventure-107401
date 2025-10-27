import { useEffect, useRef } from 'react';
import { Direction, DIRECTIONS } from '../types/pacman';

export const useKeyboard = (onDirectionChange: (direction: Direction) => void) => {
  const keysPressed = useRef<Set<string>>(new Set());

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      keysPressed.current.add(event.code);
      
      let newDirection: Direction = DIRECTIONS.NONE;
      
      switch (event.code) {
        case 'ArrowUp':
        case 'KeyW':
          newDirection = DIRECTIONS.UP;
          break;
        case 'ArrowDown':
        case 'KeyS':
          newDirection = DIRECTIONS.DOWN;
          break;
        case 'ArrowLeft':
        case 'KeyA':
          newDirection = DIRECTIONS.LEFT;
          break;
        case 'ArrowRight':
        case 'KeyD':
          newDirection = DIRECTIONS.RIGHT;
          break;
      }
      
      if (newDirection !== DIRECTIONS.NONE) {
        event.preventDefault();
        onDirectionChange(newDirection);
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      keysPressed.current.delete(event.code);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [onDirectionChange]);

  return keysPressed.current;
};