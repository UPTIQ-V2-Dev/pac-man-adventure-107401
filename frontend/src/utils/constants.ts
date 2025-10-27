import { GameConfig } from '../types/pacman';

export const GAME_CONFIG: GameConfig = {
  BOARD_WIDTH: 19,
  BOARD_HEIGHT: 21,
  CELL_SIZE: 20,
  PACMAN_SPEED: 2,
  GHOST_SPEED: 1.8,
  POWER_PELLET_DURATION: 300, // frames (5 seconds at 60fps)
  POINTS: {
    PELLET: 10,
    POWER_PELLET: 50,
    GHOST: 200,
    FRUIT: 100,
  },
};

export const GHOST_COLORS = {
  BLINKY: '#FF0000', // Red
  PINKY: '#FFB8FF', // Pink
  INKY: '#00FFFF', // Cyan
  CLYDE: '#FFB852', // Orange
};

export const INITIAL_POSITIONS = {
  PACMAN: { x: 9, y: 15 },
  GHOSTS: [
    { x: 9, y: 9, color: GHOST_COLORS.BLINKY, id: 'blinky' },
    { x: 8, y: 10, color: GHOST_COLORS.PINKY, id: 'pinky' },
    { x: 9, y: 10, color: GHOST_COLORS.INKY, id: 'inky' },
    { x: 10, y: 10, color: GHOST_COLORS.CLYDE, id: 'clyde' },
  ],
};

export const SCATTER_TARGETS = {
  blinky: { x: 18, y: 0 },
  pinky: { x: 0, y: 0 },
  inky: { x: 18, y: 20 },
  clyde: { x: 0, y: 20 },
};