# Pac-Man Game

A classic Pac-Man game built with React, TypeScript, and HTML5 Canvas.

## Features

- Classic Pac-Man gameplay with ghosts, pellets, and power pellets
- Responsive design with mobile touch controls
- Smooth 60 FPS game loop
- Complete game states (menu, playing, paused, game over, victory)
- Score system with lives tracking
- Modern React + TypeScript implementation

## Installation

This project uses npm (not pnpm). To set up and run:

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production  
npm run build

# Preview production build
npm run preview
```

## How to Play

- Use **Arrow Keys** or **WASD** to move Pac-Man
- Press **Spacebar** to pause/resume or start the game
- On mobile, use the touch controls
- Collect all pellets to win the level
- Avoid ghosts unless you've eaten a power pellet
- Power pellets make ghosts vulnerable temporarily

## Game Controls

### Desktop
- **Arrow Keys** or **WASD**: Move Pac-Man
- **Spacebar**: Pause/Resume/Start game
- **R**: Restart game (when game over)

### Mobile
- **Touch Controls**: Use the directional pad on screen
- **Tap buttons**: Start game, pause, resume

## Technical Stack

- **React 19** with TypeScript
- **Vite** for build tooling
- **HTML5 Canvas** for game rendering
- **Tailwind CSS** for styling
- **shadcn/ui** components
- **React Router** for navigation

## Development

The game uses a component-based architecture:

- `GameCanvas` - Main game rendering
- `GameUI` - Score, lives, and status display
- `GameControls` - Mobile touch controls
- `PacManPage` - Main game logic and state management

Game logic is handled through custom hooks and utilities:
- `useGameLoop` - 60 FPS game loop with requestAnimationFrame
- `useKeyboard` - Keyboard input handling
- Game utilities for collision detection, entity movement, and AI