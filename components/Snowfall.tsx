import React, { useEffect, useRef } from 'react';

export const Snowfall: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const snowflakes: { x: number; y: number; r: number; d: number }[] = [];
    const maxFlakes = 100;

    for (let i = 0; i < maxFlakes; i++) {
      snowflakes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 3 + 1, // radius (pixel size mostly)
        d: Math.random() * maxFlakes, // density
      });
    }

    let animationFrameId: number;

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      
      // Calculate light source position (approximate center of tree)
      // Tree is centered horizontally, and near the bottom of the viewport
      const lightX = width / 2;
      const lightY = height - 350; 
      const lightRadius = 250; // Radius of the glow

      for (let i = 0; i < maxFlakes; i++) {
        const f = snowflakes[i];

        // Check distance to light source
        const dx = f.x - lightX;
        const dy = f.y - lightY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < lightRadius) {
           // Illuminated snowflake
           ctx.fillStyle = "#FFF59D"; // Warm yellow/gold
        } else {
           // Normal snowflake
           ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
        }
        
        // Draw square for pixel look
        ctx.fillRect(f.x, f.y, f.r, f.r);
      }
      
      move();
      animationFrameId = requestAnimationFrame(draw);
    };

    const move = () => {
      for (let i = 0; i < maxFlakes; i++) {
        const f = snowflakes[i];
        
        // Adjusted speed: multiply by 0.25 to slow it down significantly
        // Original: Math.pow(f.d, 0.3) + 0.5
        const speed = (Math.pow(f.d, 0.3) + 0.5) * 0.25; 
        
        f.y += speed; 
        
        // Drift effect
        f.x += Math.sin(f.y * 0.02) * 0.3;

        // Reset if out of view
        if (f.y > height) {
          snowflakes[i] = {
            x: Math.random() * width,
            y: -10, // Start slightly above visible area
            r: f.r,
            d: f.d,
          };
        }
        // Wrap horizontal
        if (f.x > width) f.x = 0;
        if (f.x < 0) f.x = width;
      }
    };

    draw();

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed top-0 left-0 pointer-events-none z-0 opacity-80" />;
};