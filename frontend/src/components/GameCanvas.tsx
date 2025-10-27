import { useEffect, useRef } from 'react';
import { GameState, CellType, GhostMode } from '../types/pacman';
import { GAME_CONFIG } from '../utils/constants';

interface GameCanvasProps {
  gameState: GameState;
  className?: string;
}

export const GameCanvas = ({ gameState, className = '' }: GameCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw maze
    drawMaze(ctx, gameState.maze);

    // Draw entities
    drawPacMan(ctx, gameState.pacman);
    gameState.ghosts.forEach(ghost => drawGhost(ctx, ghost, gameState.powerPelletActive));
  }, [gameState]);

  const drawMaze = (ctx: CanvasRenderingContext2D, maze: CellType[][]) => {
    for (let row = 0; row < maze.length; row++) {
      for (let col = 0; col < maze[row].length; col++) {
        const x = col * GAME_CONFIG.CELL_SIZE;
        const y = row * GAME_CONFIG.CELL_SIZE;
        
        switch (maze[row][col]) {
          case CellType.WALL:
            ctx.fillStyle = '#0000FF';
            ctx.fillRect(x, y, GAME_CONFIG.CELL_SIZE, GAME_CONFIG.CELL_SIZE);
            break;
          case CellType.PELLET:
            ctx.fillStyle = '#FFFF00';
            ctx.beginPath();
            ctx.arc(
              x + GAME_CONFIG.CELL_SIZE / 2,
              y + GAME_CONFIG.CELL_SIZE / 2,
              2,
              0,
              2 * Math.PI
            );
            ctx.fill();
            break;
          case CellType.POWER_PELLET:
            ctx.fillStyle = '#FFFF00';
            ctx.beginPath();
            ctx.arc(
              x + GAME_CONFIG.CELL_SIZE / 2,
              y + GAME_CONFIG.CELL_SIZE / 2,
              6,
              0,
              2 * Math.PI
            );
            ctx.fill();
            break;
          case CellType.DOOR:
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(x, y + GAME_CONFIG.CELL_SIZE / 2 - 2, GAME_CONFIG.CELL_SIZE, 4);
            break;
        }
      }
    }
  };

  const drawPacMan = (ctx: CanvasRenderingContext2D, pacman: any) => {
    const x = pacman.position.x * GAME_CONFIG.CELL_SIZE + GAME_CONFIG.CELL_SIZE / 2;
    const y = pacman.position.y * GAME_CONFIG.CELL_SIZE + GAME_CONFIG.CELL_SIZE / 2;
    const radius = GAME_CONFIG.CELL_SIZE / 2 - 2;

    ctx.fillStyle = '#FFFF00';
    ctx.beginPath();
    
    if (pacman.mouthOpen) {
      // Calculate mouth direction based on movement direction
      let startAngle = 0.2 * Math.PI;
      let endAngle = 1.8 * Math.PI;
      
      if (pacman.direction.dx > 0) {
        // Moving right
        startAngle = 0.2 * Math.PI;
        endAngle = 1.8 * Math.PI;
      } else if (pacman.direction.dx < 0) {
        // Moving left  
        startAngle = 1.2 * Math.PI;
        endAngle = 0.8 * Math.PI;
      } else if (pacman.direction.dy > 0) {
        // Moving down
        startAngle = 0.7 * Math.PI;
        endAngle = 0.3 * Math.PI;
      } else if (pacman.direction.dy < 0) {
        // Moving up
        startAngle = 1.7 * Math.PI;
        endAngle = 1.3 * Math.PI;
      }
      
      ctx.arc(x, y, radius, startAngle, endAngle);
      ctx.lineTo(x, y);
    } else {
      ctx.arc(x, y, radius, 0, 2 * Math.PI);
    }
    
    ctx.fill();
  };

  const drawGhost = (ctx: CanvasRenderingContext2D, ghost: any, powerPelletActive: boolean) => {
    const x = ghost.position.x * GAME_CONFIG.CELL_SIZE + GAME_CONFIG.CELL_SIZE / 2;
    const y = ghost.position.y * GAME_CONFIG.CELL_SIZE + GAME_CONFIG.CELL_SIZE / 2;
    const radius = GAME_CONFIG.CELL_SIZE / 2 - 2;

    // Change color based on mode
    let fillColor = ghost.color;
    if (ghost.mode === GhostMode.FRIGHTENED && powerPelletActive) {
      fillColor = ghost.frightendTimer > 60 && ghost.frightendTimer % 20 < 10 ? '#FFFFFF' : '#0000FF';
    } else if (ghost.mode === GhostMode.EATEN) {
      fillColor = '#666666';
    }

    ctx.fillStyle = fillColor;
    
    // Draw ghost body (circle top, wavy bottom)
    ctx.beginPath();
    ctx.arc(x, y - radius / 2, radius, Math.PI, 0);
    
    // Draw wavy bottom
    const waveCount = 3;
    const waveWidth = (radius * 2) / waveCount;
    for (let i = 0; i < waveCount; i++) {
      const waveX = x - radius + (i * waveWidth) + (waveWidth / 2);
      const waveY = y + radius / 2;
      if (i === 0) {
        ctx.lineTo(x - radius, waveY - 3);
      }
      ctx.lineTo(waveX, waveY + 3);
      ctx.lineTo(waveX + waveWidth / 2, waveY - 3);
    }
    ctx.lineTo(x + radius, y + radius / 2 - 3);
    ctx.closePath();
    ctx.fill();

    // Draw eyes (unless eaten)
    if (ghost.mode !== GhostMode.EATEN) {
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(x - 4, y - 4, 3, 0, 2 * Math.PI);
      ctx.arc(x + 4, y - 4, 3, 0, 2 * Math.PI);
      ctx.fill();

      ctx.fillStyle = '#000000';
      ctx.beginPath();
      ctx.arc(x - 4, y - 4, 1.5, 0, 2 * Math.PI);
      ctx.arc(x + 4, y - 4, 1.5, 0, 2 * Math.PI);
      ctx.fill();
    }
  };

  return (
    <canvas
      ref={canvasRef}
      width={GAME_CONFIG.BOARD_WIDTH * GAME_CONFIG.CELL_SIZE}
      height={GAME_CONFIG.BOARD_HEIGHT * GAME_CONFIG.CELL_SIZE}
      className={`border border-blue-500 ${className}`}
    />
  );
};