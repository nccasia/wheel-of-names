import { WinnerModalContext } from '@/context/winner';
import React, { useRef, useEffect, useContext } from 'react';

interface Confetti {
  x: number;
  y: number;
  color: string;
  sizeX: number;
  sizeY: number;
  speedX: number;
  speedY: number;
  gravity: number;
  rotation: number;
  rotationSpeed: number;
}

const createConfetti = (
  x: number,
  y: number,
  color: string,
  angle: number
): Confetti => {
  const sizeX = Math.random() * 8 + 8; // Ellipse width
  const sizeY = sizeX / 2; // Ellipse height
  const speed = Math.random() * 4 + 9; // Faster initial speed for higher arc
  const speedX = Math.cos(angle) * speed;
  const speedY = Math.sin(angle) * speed;
  const gravity = 0.08; // Reduced gravity for slower fall
  const rotation = Math.random() * 360;
  const rotationSpeed = Math.random() * 10 - 5;

  return {
    x,
    y,
    color,
    sizeX,
    sizeY,
    speedX,
    speedY,
    gravity,
    rotation,
    rotationSpeed,
  };
};

const drawConfetti = (ctx: CanvasRenderingContext2D, confetti: Confetti) => {
  ctx.save();
  ctx.translate(confetti.x, confetti.y);
  ctx.rotate((confetti.rotation * Math.PI) / 180);
  ctx.fillStyle = confetti.color;
  ctx.beginPath();
  ctx.ellipse(0, 0, confetti.sizeX / 2, confetti.sizeY / 2, 0, 0, 2 * Math.PI);
  ctx.fill();
  ctx.restore();
};

const updateConfetti = (confetti: Confetti) => {
  confetti.x += confetti.speedX;
  confetti.y += confetti.speedY;
  confetti.speedY += confetti.gravity; // Apply gravity
  confetti.rotation += confetti.rotationSpeed;
};

const ConfettiCanvas: React.FC = () => {
  const context = useContext(WinnerModalContext);
  if (!context) return null;
  const { isOpenConfetti, closeModalConfetti } = context;

  if (!isOpenConfetti) return null;
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const confettis = useRef<Confetti[]>([]);

  const createConfettiBurst = (canvas: HTMLCanvasElement) => {
    const colors = [
      'rgba(255, 0, 0, 0.7)',
      'rgba(0, 255, 0, 0.7)',
      'rgba(0, 0, 255, 0.7)',
      'rgba(255, 255, 0, 0.7)',
      'rgba(255, 0, 255, 0.7)',
      'rgba(0, 255, 255, 0.7)',
    ];
    const bottomY = canvas.height * 0.9; // Start from 90% height
    const leftX = 50;
    const rightX = canvas.width - 50;

    for (let i = 0; i < 150; i++) {
      const color = colors[Math.floor(Math.random() * colors.length)];
      const angleLeft = -Math.PI / 3 + (Math.random() * Math.PI) / 6; // Arcing left burst
      const angleRight = (-2 * Math.PI) / 3 - (Math.random() * Math.PI) / 6; // Arcing right burst
      confettis.current.push(createConfetti(leftX, bottomY, color, angleLeft));
      confettis.current.push(
        createConfetti(rightX, bottomY, color, angleRight)
      );
    }
  };

  const animate = (
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement
  ) => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = confettis.current.length - 1; i >= 0; i--) {
      const confetti = confettis.current[i];
      updateConfetti(confetti);
      drawConfetti(ctx, confetti);

      if (
        confetti.y > canvas.height + 50 ||
        confetti.x < -50 ||
        confetti.x > canvas.width + 50
      ) {
        confettis.current.splice(i, 1);
      }
    }

    requestAnimationFrame(() => animate(ctx, canvas));
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    createConfettiBurst(canvas);
    animate(ctx, canvas);

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  useEffect(() => {
    const timer = setTimeout(() => {
      closeModalConfetti();
    }, 3000);

    return () => clearTimeout(timer);
  }, [closeModalConfetti]);
  return (
    <canvas
      ref={canvasRef}
      style={{
        display: 'block',
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 1000,
      }}
      className="bg-transparent"
    />
  );
};

export default ConfettiCanvas;
