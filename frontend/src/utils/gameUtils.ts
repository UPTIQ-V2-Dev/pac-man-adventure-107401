import { Position, Direction, CellType, GameEntity, PacManEntity, GhostEntity, GhostMode } from '../types/pacman';
import { GAME_CONFIG, INITIAL_POSITIONS, SCATTER_TARGETS } from './constants';

export const isValidMove = (position: Position, direction: Direction, maze: CellType[][]): boolean => {
  const newX = Math.round(position.x + direction.dx);
  const newY = Math.round(position.y + direction.dy);

  // Check bounds
  if (newX < 0 || newX >= GAME_CONFIG.BOARD_WIDTH || newY < 0 || newY >= GAME_CONFIG.BOARD_HEIGHT) {
    return false;
  }

  // Check for walls (except doors for ghosts)
  return maze[newY][newX] !== CellType.WALL;
};

export const isWallCollision = (position: Position, maze: CellType[][]): boolean => {
  const cellX = Math.round(position.x);
  const cellY = Math.round(position.y);
  
  if (cellX < 0 || cellX >= GAME_CONFIG.BOARD_WIDTH || cellY < 0 || cellY >= GAME_CONFIG.BOARD_HEIGHT) {
    return true;
  }
  
  return maze[cellY][cellX] === CellType.WALL;
};

export const getDistance = (pos1: Position, pos2: Position): number => {
  const dx = pos1.x - pos2.x;
  const dy = pos1.y - pos2.y;
  return Math.sqrt(dx * dx + dy * dy);
};

export const movePacMan = (pacman: PacManEntity, nextDirection: Direction, maze: CellType[][]): PacManEntity => {
  let newDirection = pacman.direction;
  
  // Try to change direction if requested
  if (nextDirection.dx !== 0 || nextDirection.dy !== 0) {
    if (isValidMove(pacman.position, nextDirection, maze)) {
      newDirection = nextDirection;
    }
  }
  
  // Move in current direction if possible
  let newPosition = { ...pacman.position };
  if (isValidMove(pacman.position, newDirection, maze)) {
    newPosition.x += newDirection.dx * pacman.speed;
    newPosition.y += newDirection.dy * pacman.speed;
    
    // Handle tunnel (wrap around)
    if (newPosition.x < 0) {
      newPosition.x = GAME_CONFIG.BOARD_WIDTH - 1;
    } else if (newPosition.x >= GAME_CONFIG.BOARD_WIDTH) {
      newPosition.x = 0;
    }
  } else {
    // Stop if can't move
    newDirection = { dx: 0, dy: 0 };
  }
  
  return {
    ...pacman,
    position: newPosition,
    direction: newDirection,
    animationFrame: pacman.animationFrame + 1,
    mouthOpen: Math.floor(pacman.animationFrame / 5) % 2 === 0,
  };
};

export const moveGhost = (ghost: GhostEntity, pacmanPosition: Position, maze: CellType[][], otherGhosts: GhostEntity[]): GhostEntity => {
  let targetPosition: Position;
  
  switch (ghost.mode) {
    case GhostMode.CHASE:
      targetPosition = pacmanPosition;
      break;
    case GhostMode.SCATTER:
      targetPosition = SCATTER_TARGETS[ghost.id as keyof typeof SCATTER_TARGETS] || ghost.homePosition;
      break;
    case GhostMode.FRIGHTENED:
      // Random movement when frightened
      targetPosition = {
        x: Math.random() * GAME_CONFIG.BOARD_WIDTH,
        y: Math.random() * GAME_CONFIG.BOARD_HEIGHT,
      };
      break;
    case GhostMode.EATEN:
      targetPosition = ghost.homePosition;
      break;
    default:
      targetPosition = ghost.homePosition;
  }
  
  // Find best direction towards target
  const possibleDirections = [
    { dx: 0, dy: -1 }, // Up
    { dx: 0, dy: 1 },  // Down
    { dx: -1, dy: 0 }, // Left
    { dx: 1, dy: 0 },  // Right
  ];
  
  let bestDirection = ghost.direction;
  let bestDistance = Infinity;
  
  for (const direction of possibleDirections) {
    // Don't reverse unless necessary
    if (direction.dx === -ghost.direction.dx && direction.dy === -ghost.direction.dy) {
      continue;
    }
    
    if (isValidMove(ghost.position, direction, maze)) {
      const newPos = {
        x: ghost.position.x + direction.dx,
        y: ghost.position.y + direction.dy,
      };
      const distance = getDistance(newPos, targetPosition);
      
      if (distance < bestDistance) {
        bestDistance = distance;
        bestDirection = direction;
      }
    }
  }
  
  // Move the ghost
  let newPosition = { ...ghost.position };
  if (isValidMove(ghost.position, bestDirection, maze)) {
    newPosition.x += bestDirection.dx * ghost.speed;
    newPosition.y += bestDirection.dy * ghost.speed;
    
    // Handle tunnel
    if (newPosition.x < 0) {
      newPosition.x = GAME_CONFIG.BOARD_WIDTH - 1;
    } else if (newPosition.x >= GAME_CONFIG.BOARD_WIDTH) {
      newPosition.x = 0;
    }
  }
  
  let newFrightendTimer = ghost.frightendTimer;
  if (ghost.mode === GhostMode.FRIGHTENED && newFrightendTimer > 0) {
    newFrightendTimer--;
  }
  
  return {
    ...ghost,
    position: newPosition,
    direction: bestDirection,
    frightendTimer: newFrightendTimer,
  };
};

export const checkPelletCollision = (position: Position, maze: CellType[][]): { type: CellType; position: Position } | null => {
  const cellX = Math.round(position.x);
  const cellY = Math.round(position.y);
  
  if (cellX >= 0 && cellX < GAME_CONFIG.BOARD_WIDTH && cellY >= 0 && cellY < GAME_CONFIG.BOARD_HEIGHT) {
    const cellType = maze[cellY][cellX];
    if (cellType === CellType.PELLET || cellType === CellType.POWER_PELLET) {
      return { type: cellType, position: { x: cellX, y: cellY } };
    }
  }
  
  return null;
};

export const checkGhostCollision = (pacmanPosition: Position, ghosts: GhostEntity[]): GhostEntity | null => {
  for (const ghost of ghosts) {
    const distance = getDistance(pacmanPosition, ghost.position);
    if (distance < 1) { // Close enough for collision
      return ghost;
    }
  }
  return null;
};

export const createInitialPacMan = (): PacManEntity => ({
  position: { ...INITIAL_POSITIONS.PACMAN },
  direction: { dx: 0, dy: 0 },
  speed: GAME_CONFIG.PACMAN_SPEED,
  mouthOpen: true,
  animationFrame: 0,
});

export const createInitialGhosts = (): GhostEntity[] => {
  return INITIAL_POSITIONS.GHOSTS.map(ghostData => ({
    position: { x: ghostData.x, y: ghostData.y },
    direction: { dx: 0, dy: -1 },
    speed: GAME_CONFIG.GHOST_SPEED,
    mode: GhostMode.SCATTER,
    color: ghostData.color,
    homePosition: { x: ghostData.x, y: ghostData.y },
    scatterTarget: SCATTER_TARGETS[ghostData.id as keyof typeof SCATTER_TARGETS] || { x: ghostData.x, y: ghostData.y },
    frightendTimer: 0,
    id: ghostData.id,
  }));
};