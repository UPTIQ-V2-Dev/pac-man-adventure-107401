import { GameState } from '../types/pacman';

interface GameUIProps {
  gameState: GameState;
  onPause: () => void;
  onResume: () => void;
}

export const GameUI = ({ gameState, onPause, onResume }: GameUIProps) => {
  return (
    <div className="flex flex-col gap-4 p-4 bg-black text-yellow-400 font-mono">
      {/* Top row - Score and Lives */}
      <div className="flex justify-between items-center">
        <div className="text-xl font-bold">
          SCORE: {gameState.score.toLocaleString()}
        </div>
        <div className="text-xl font-bold">
          LEVEL: {gameState.level}
        </div>
      </div>
      
      {/* Lives indicator */}
      <div className="flex items-center gap-2">
        <span className="text-lg font-bold">LIVES:</span>
        <div className="flex gap-1">
          {Array.from({ length: gameState.lives }, (_, i) => (
            <div
              key={i}
              className="w-6 h-6 rounded-full bg-yellow-400"
              style={{
                clipPath: 'polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)'
              }}
            />
          ))}
        </div>
      </div>

      {/* Game status and controls */}
      <div className="flex justify-between items-center">
        <div className="text-lg">
          {gameState.gameStatus === 'playing' && 'PLAYING'}
          {gameState.gameStatus === 'paused' && 'PAUSED'}
          {gameState.gameStatus === 'gameOver' && 'GAME OVER'}
          {gameState.gameStatus === 'won' && 'YOU WON!'}
          {gameState.gameStatus === 'menu' && 'READY?'}
        </div>
        
        <div className="flex gap-2">
          {gameState.gameStatus === 'playing' && (
            <button
              onClick={onPause}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              PAUSE
            </button>
          )}
          {gameState.gameStatus === 'paused' && (
            <button
              onClick={onResume}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
            >
              RESUME
            </button>
          )}
        </div>
      </div>

      {/* Power pellet indicator */}
      {gameState.powerPelletActive && (
        <div className="text-center text-lg font-bold text-white animate-pulse">
          POWER PELLET ACTIVE! {Math.ceil(gameState.powerPelletTimer / 60)}s
        </div>
      )}

      {/* Instructions */}
      <div className="text-sm text-gray-400 text-center">
        Use ARROW KEYS or WASD to move • SPACE to pause
      </div>
    </div>
  );
};