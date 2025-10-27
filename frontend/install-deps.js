#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Installing dependencies...');

// Remove pnpm-lock.yaml if it exists
const lockFile = path.join(__dirname, 'pnpm-lock.yaml');
if (fs.existsSync(lockFile)) {
  fs.unlinkSync(lockFile);
  console.log('Removed pnpm-lock.yaml');
}

try {
  // Install using npm
  execSync('npm install', { stdio: 'inherit', cwd: __dirname });
  console.log('Dependencies installed successfully!');
} catch (error) {
  console.error('Failed to install dependencies:', error.message);
  process.exit(1);
}