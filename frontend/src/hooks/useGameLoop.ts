import { useEffect, useRef, useCallback } from 'react';

export const useGameLoop = (gameLoop: () => void, running: boolean, fps: number = 60) => {
  const frameId = useRef<number>();
  const lastTime = useRef<number>(0);
  const targetInterval = 1000 / fps;

  const animate = useCallback((currentTime: number) => {
    if (currentTime - lastTime.current >= targetInterval) {
      gameLoop();
      lastTime.current = currentTime;
    }
    
    if (running) {
      frameId.current = requestAnimationFrame(animate);
    }
  }, [gameLoop, running, targetInterval]);

  useEffect(() => {
    if (running) {
      lastTime.current = performance.now();
      frameId.current = requestAnimationFrame(animate);
    } else {
      if (frameId.current) {
        cancelAnimationFrame(frameId.current);
      }
    }

    return () => {
      if (frameId.current) {
        cancelAnimationFrame(frameId.current);
      }
    };
  }, [animate, running]);
};