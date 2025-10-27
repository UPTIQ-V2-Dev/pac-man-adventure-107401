import { useState, useCallback, useEffect } from 'react';
import { GameCanvas } from '../components/GameCanvas';
import { GameUI } from '../components/GameUI';
import { GameControls } from '../components/GameControls';
import { useGameLoop } from '../hooks/useGameLoop';
import { useKeyboard } from '../hooks/useKeyboard';
import { 
  GameState, 
  Direction, 
  DIRECTIONS, 
  CellType, 
  GhostMode 
} from '../types/pacman';
import { GAME_CONFIG } from '../utils/constants';
import { createInitialMaze, countPellets } from '../data/mazeLayout';
import {
  createInitialPacMan,
  createInitialGhosts,
  movePacMan,
  moveGhost,
  checkPelletCollision,
  checkGhostCollision,
} from '../utils/gameUtils';

export const PacManPage = () => {
  const [nextDirection, setNextDirection] = useState<Direction>(DIRECTIONS.NONE);
  const [gameStarted, setGameStarted] = useState(false);
  
  const createInitialGameState = useCallback((): GameState => {
    const initialMaze = createInitialMaze();
    return {
      pacman: createInitialPacMan(),
      ghosts: createInitialGhosts(),
      maze: initialMaze,
      score: 0,
      lives: 3,
      level: 1,
      gameStatus: 'menu',
      pelletCount: countPellets(initialMaze),
      powerPelletActive: false,
      powerPelletTimer: 0,
      frightendScore: 200,
    };
  }, []);

  const [gameState, setGameState] = useState<GameState>(createInitialGameState);

  const handleDirectionChange = useCallback((direction: Direction) => {
    setNextDirection(direction);
  }, []);

  const handlePause = useCallback(() => {
    setGameState(prev => ({ ...prev, gameStatus: 'paused' }));
  }, []);

  const handleResume = useCallback(() => {
    setGameState(prev => ({ ...prev, gameStatus: 'playing' }));
  }, []);

  const startGame = useCallback(() => {
    setGameState(prev => ({ ...prev, gameStatus: 'playing' }));
    setGameStarted(true);
  }, []);

  const resetGame = useCallback(() => {
    setGameState(createInitialGameState());
    setNextDirection(DIRECTIONS.NONE);
    setGameStarted(false);
  }, [createInitialGameState]);

  const gameLoop = useCallback(() => {
    setGameState(prevState => {
      if (prevState.gameStatus !== 'playing') {
        return prevState;
      }

      let newState = { ...prevState };

      // Move Pac-Man
      newState.pacman = movePacMan(prevState.pacman, nextDirection, prevState.maze);

      // Check pellet collision
      const pelletCollision = checkPelletCollision(newState.pacman.position, newState.maze);
      if (pelletCollision) {
        // Remove pellet from maze
        const newMaze = newState.maze.map(row => [...row]);
        newMaze[pelletCollision.position.y][pelletCollision.position.x] = CellType.EMPTY;
        newState.maze = newMaze;
        
        // Update score and pellet count
        if (pelletCollision.type === CellType.PELLET) {
          newState.score += GAME_CONFIG.POINTS.PELLET;
          newState.pelletCount--;
        } else if (pelletCollision.type === CellType.POWER_PELLET) {
          newState.score += GAME_CONFIG.POINTS.POWER_PELLET;
          newState.pelletCount--;
          newState.powerPelletActive = true;
          newState.powerPelletTimer = GAME_CONFIG.POWER_PELLET_DURATION;
          newState.frightendScore = 200;
          
          // Make ghosts frightened
          newState.ghosts = newState.ghosts.map(ghost => ({
            ...ghost,
            mode: GhostMode.FRIGHTENED,
            frightendTimer: GAME_CONFIG.POWER_PELLET_DURATION,
          }));
        }
      }

      // Update power pellet timer
      if (newState.powerPelletActive) {
        newState.powerPelletTimer--;
        if (newState.powerPelletTimer <= 0) {
          newState.powerPelletActive = false;
          // Return ghosts to chase mode
          newState.ghosts = newState.ghosts.map(ghost => ({
            ...ghost,
            mode: ghost.mode === GhostMode.FRIGHTENED ? GhostMode.CHASE : ghost.mode,
            frightendTimer: 0,
          }));
        }
      }

      // Move ghosts
      newState.ghosts = newState.ghosts.map(ghost => 
        moveGhost(ghost, newState.pacman.position, newState.maze, newState.ghosts)
      );

      // Check ghost collision
      const ghostCollision = checkGhostCollision(newState.pacman.position, newState.ghosts);
      if (ghostCollision) {
        if (ghostCollision.mode === GhostMode.FRIGHTENED) {
          // Eat the ghost
          newState.score += newState.frightendScore;
          newState.frightendScore *= 2; // Double the score for next ghost
          
          // Send ghost back to home
          newState.ghosts = newState.ghosts.map(ghost => 
            ghost.id === ghostCollision.id 
              ? { ...ghost, mode: GhostMode.EATEN }
              : ghost
          );
        } else if (ghostCollision.mode !== GhostMode.EATEN) {
          // Pac-Man loses a life
          newState.lives--;
          
          if (newState.lives <= 0) {
            newState.gameStatus = 'gameOver';
          } else {
            // Reset positions
            newState.pacman = createInitialPacMan();
            newState.ghosts = createInitialGhosts();
            newState.powerPelletActive = false;
            newState.powerPelletTimer = 0;
          }
        }
      }

      // Check win condition
      if (newState.pelletCount <= 0) {
        newState.gameStatus = 'won';
      }

      // Update ghost modes periodically (simplified AI)
      const gameFrame = Date.now() / 1000;
      if (Math.floor(gameFrame) % 10 < 5) {
        newState.ghosts = newState.ghosts.map(ghost => 
          ghost.mode === GhostMode.CHASE || ghost.mode === GhostMode.SCATTER 
            ? { ...ghost, mode: GhostMode.CHASE }
            : ghost
        );
      } else {
        newState.ghosts = newState.ghosts.map(ghost => 
          ghost.mode === GhostMode.CHASE || ghost.mode === GhostMode.SCATTER 
            ? { ...ghost, mode: GhostMode.SCATTER }
            : ghost
        );
      }

      return newState;
    });
  }, [nextDirection]);

  // Handle keyboard input
  useKeyboard(handleDirectionChange);

  // Handle spacebar for pause/resume
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.code === 'Space') {
        event.preventDefault();
        if (gameState.gameStatus === 'menu' && !gameStarted) {
          startGame();
        } else if (gameState.gameStatus === 'playing') {
          handlePause();
        } else if (gameState.gameStatus === 'paused') {
          handleResume();
        }
      }
      if (event.code === 'KeyR' && (gameState.gameStatus === 'gameOver' || gameState.gameStatus === 'won')) {
        resetGame();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameState.gameStatus, gameStarted, startGame, handlePause, handleResume, resetGame]);

  // Start game loop
  useGameLoop(gameLoop, gameState.gameStatus === 'playing', 60);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center p-4">
      {/* Game Title */}
      <h1 className="text-4xl font-bold text-yellow-400 mb-4 font-mono">PAC-MAN</h1>
      
      {/* Game UI */}
      <GameUI 
        gameState={gameState} 
        onPause={handlePause}
        onResume={handleResume}
      />
      
      {/* Game Canvas */}
      <div className="flex flex-col lg:flex-row items-center justify-center gap-8 mt-4">
        <GameCanvas gameState={gameState} className="max-w-full" />
        
        {/* Mobile Controls */}
        <div className="lg:hidden">
          <GameControls onDirectionChange={handleDirectionChange} />
        </div>
      </div>
      
      {/* Desktop Controls Help */}
      <div className="hidden lg:block mt-4">
        <GameControls onDirectionChange={handleDirectionChange} />
      </div>

      {/* Game Status Overlay */}
      {gameState.gameStatus === 'menu' && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
          <div className="text-center">
            <h2 className="text-6xl font-bold text-yellow-400 mb-8 font-mono animate-pulse">
              PAC-MAN
            </h2>
            <p className="text-2xl text-white mb-8">
              Press SPACE to Start
            </p>
            <p className="text-lg text-gray-400">
              Use ARROW KEYS or WASD to move
            </p>
            <button
              onClick={startGame}
              className="mt-8 px-8 py-4 bg-yellow-500 text-black font-bold text-xl rounded-lg hover:bg-yellow-400 transition-colors"
            >
              START GAME
            </button>
          </div>
        </div>
      )}

      {gameState.gameStatus === 'gameOver' && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
          <div className="text-center">
            <h2 className="text-6xl font-bold text-red-500 mb-8 font-mono">
              GAME OVER
            </h2>
            <p className="text-3xl text-white mb-4">
              Final Score: {gameState.score.toLocaleString()}
            </p>
            <p className="text-xl text-gray-400 mb-8">
              Level Reached: {gameState.level}
            </p>
            <p className="text-lg text-gray-400 mb-4">
              Press R to Restart
            </p>
            <button
              onClick={resetGame}
              className="px-8 py-4 bg-yellow-500 text-black font-bold text-xl rounded-lg hover:bg-yellow-400 transition-colors"
            >
              PLAY AGAIN
            </button>
          </div>
        </div>
      )}

      {gameState.gameStatus === 'won' && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
          <div className="text-center">
            <h2 className="text-6xl font-bold text-green-500 mb-8 font-mono animate-pulse">
              YOU WON!
            </h2>
            <p className="text-3xl text-white mb-4">
              Final Score: {gameState.score.toLocaleString()}
            </p>
            <p className="text-xl text-gray-400 mb-8">
              Level Completed: {gameState.level}
            </p>
            <p className="text-lg text-gray-400 mb-4">
              Press R to Play Again
            </p>
            <button
              onClick={resetGame}
              className="px-8 py-4 bg-yellow-500 text-black font-bold text-xl rounded-lg hover:bg-yellow-400 transition-colors"
            >
              PLAY AGAIN
            </button>
          </div>
        </div>
      )}
    </div>
  );
};