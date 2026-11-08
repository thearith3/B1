import React, { useEffect, useRef } from 'react';

interface PetalsCanvasProps {
  active: boolean;
}

export const PetalsCanvas: React.FC<PetalsCanvasProps> = ({ active }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Rose petals configuration
    const petalColors = [
      'rgba(235, 87, 119, 0.7)',
      'rgba(244, 143, 177, 0.65)',
      'rgba(197, 48, 89, 0.75)',
      'rgba(255, 182, 193, 0.6)',
      'rgba(218, 165, 32, 0.45)' // subtle gold flecks
    ];

    interface Petal {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      angle: number;
      angularSpeed: number;
      color: string;
      swayRadius: number;
      swayOffset: number;
    }

    const count = Math.min(32, Math.floor(width / 35));
    const petals: Petal[] = [];

    for (let i = 0; i < count; i++) {
      petals.push({
        x: Math.random() * width,
        y: Math.random() * height - height,
        size: Math.random() * 8 + 8,
        speedX: Math.random() * 1 - 0.5,
        speedY: Math.random() * 1.2 + 0.8,
        angle: Math.random() * Math.PI * 2,
        angularSpeed: (Math.random() - 0.5) * 0.03,
        color: petalColors[Math.floor(Math.random() * petalColors.length)],
        swayRadius: Math.random() * 1.5 + 0.5,
        swayOffset: Math.random() * Math.PI * 2
      });
    }

    let time = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      time += 0.02;

      petals.forEach((p) => {
        p.y += p.speedY;
        p.x += Math.sin(time + p.swayOffset) * p.swayRadius + p.speedX;
        p.angle += p.angularSpeed;

        if (p.y > height + 20) {
          p.y = -20;
          p.x = Math.random() * width;
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.angle);

        // Draw organic petal shape
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(-p.size / 2, -p.size / 2, -p.size, p.size / 3, 0, p.size);
        ctx.bezierCurveTo(p.size, p.size / 3, p.size / 2, -p.size / 2, 0, 0);
        ctx.fill();

        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [active]);

  if (!active) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-20"
      style={{ opacity: 0.85 }}
    />
  );
};
