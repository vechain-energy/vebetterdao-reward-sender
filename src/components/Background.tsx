import React, { useEffect, useRef } from 'react';

export function Background() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const createBubble = () => {
      const bubble = document.createElement('div');
      bubble.className = 'bubble';
      
      // Random size between 20 and 100px
      const size = Math.random() * 80 + 20;
      bubble.style.width = `${size}px`;
      bubble.style.height = `${size}px`;
      
      // Random horizontal position
      bubble.style.left = `${Math.random() * 100}%`;
      
      // Random rise duration between 4 and 8 seconds
      bubble.style.setProperty('--rise-duration', `${4 + Math.random() * 4}s`);
      
      container.appendChild(bubble);
      
      // Remove bubble after animation
      bubble.addEventListener('animationend', () => {
        bubble.remove();
      });
    };

    // Create new bubbles periodically
    const interval = setInterval(createBubble, 2000);

    return () => {
      clearInterval(interval);
      container.innerHTML = '';
    };
  }, []);

  return <div ref={containerRef} className="absolute inset-0 overflow-hidden pointer-events-none" />;
}