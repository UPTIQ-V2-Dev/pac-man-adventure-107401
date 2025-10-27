export interface Position {
  x: number;
  y: number;
}

export interface Direction {
  dx: number;
  dy: number;
}

export const DIRECTIONS = {
  UP: { dx: 0, dy: -1 },
  DOWN: { dx: 0, dy: 1 },
  LEFT: { dx: -1, dy: 0 },
  RIGHT: { dx: 1, dy: 0 },
  NONE: { dx: 0, dy: 0 },
} as const;

export type DirectionKey = keyof typeof DIRECTIONS;

export enum CellType {
  EMPTY = 0,
  WALL = 1,
  PELLET = 2,
  POWER_PELLET = 3,
  DOOR = 4,
}

export enum GhostMode {
  CHASE = 'chase',
  SCATTER = 'scatter',
  FRIGHTENED = 'frightened',
  EATEN = 'eaten',
}

export interface GameEntity {
  position: Position;
  direction: Direction;
  speed: number;
}

export interface PacManEntity extends GameEntity {
  mouthOpen: boolean;
  animationFrame: number;
}

export interface GhostEntity extends GameEntity {
  mode: GhostMode;
  color: string;
  homePosition: Position;
  scatterTarget: Position;
  frightendTimer: number;
  id: string;
}

export interface GameState {
  pacman: PacManEntity;
  ghosts: GhostEntity[];
  maze: CellType[][];
  score: number;
  lives: number;
  level: number;
  gameStatus: 'menu' | 'playing' | 'paused' | 'gameOver' | 'won';
  pelletCount: number;
  powerPelletActive: boolean;
  powerPelletTimer: number;
  frightendScore: number;
}

export interface GameConfig {
  BOARD_WIDTH: number;
  BOARD_HEIGHT: number;
  CELL_SIZE: number;
  PACMAN_SPEED: number;
  GHOST_SPEED: number;
  POWER_PELLET_DURATION: number;
  POINTS: {
    PELLET: number;
    POWER_PELLET: number;
    GHOST: number;
    FRUIT: number;
  };
}

export interface HighScore {
  id: string;
  name: string;
  score: number;
  level: number;
  date: string;
}

export interface CreateHighScoreInput {
  name: string;
  score: number;
  level: number;
}