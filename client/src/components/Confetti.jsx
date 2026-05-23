import { useEffect, useRef } from 'react';

const COLORS = ['#6C5CE7', '#00CEC9', '#F59E0B', '#FB7185', '#10B981'];

export default function Confetti({ active = false, type = 'pass', onDone }) {
  const canvasRef = useRef(null);
  const firedRef = useRef(false);

  useEffect(() => {
    if (!active || firedRef.current) return;
    firedRef.current = true;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    if (type === 'pass') {
      import('canvas-confetti').then(({ default: confetti }) => {
        const end = Date.now() + 2000;
        const frame = () => {
          confetti({
            particleCount: 3,
            angle: 60, spread: 55, origin: { x: 0 }, colors: COLORS
          });
          confetti({
            particleCount: 3,
            angle: 120, spread: 55, origin: { x: 1 }, colors: COLORS
          });
          if (Date.now() < end) requestAnimationFrame(frame);
        };
        frame();
        setTimeout(() => { if (onDone) onDone(); }, 2500);
      });
    } else {
      let particles = [];
      for (let i = 0; i < 40; i++) {
        particles.push({
          x: Math.random() * canvas.width, y: -10,
          size: Math.random() * 4 + 2,
          speedY: Math.random() * 1.5 + 0.5,
          speedX: (Math.random() - 0.5) * 0.5,
          color: i % 2 === 0 ? '#FCD34D' : '#FFFFFF',
          opacity: 1
        });
      }
      let frame;
      const animate = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (const p of particles) {
          p.y += p.speedY; p.x += p.speedX;
          p.opacity -= 0.005;
          if (p.opacity <= 0) continue;
          ctx.globalAlpha = p.opacity;
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.globalAlpha = 1;
        if (particles.some(p => p.opacity > 0)) frame = requestAnimationFrame(animate);
        else if (onDone) onDone();
      };
      animate();
      return () => { if (frame) cancelAnimationFrame(frame); };
    }
  }, [active, type]);

  if (!active) return null;
  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-50"
      style={{ width: '100vw', height: '100vh' }}
    />
  );
}
