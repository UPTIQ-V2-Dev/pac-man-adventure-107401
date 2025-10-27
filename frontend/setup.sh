#!/bin/bash

# Setup script for Pac-Man game
echo "Setting up Pac-Man game project..."

# Remove pnpm lock file if it exists
if [ -f "pnpm-lock.yaml" ]; then
    echo "Removing pnpm-lock.yaml..."
    rm -f pnpm-lock.yaml
fi

# Install dependencies using npm
echo "Installing dependencies with npm..."
npm install

echo "Setup complete! You can now run:"
echo "  npm run dev     - Start development server"
echo "  npm run build   - Build for production"
echo "  npm run preview - Preview production build"