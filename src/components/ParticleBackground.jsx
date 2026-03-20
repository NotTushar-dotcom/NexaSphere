import { useEffect, useRef } from 'react';

export default function ParticleBackground({ theme = 'dark' }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId, mouseX = -9999, mouseY = -9999;

    const isLight = theme === 'light';

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize, { passive: true });

    const onMouse = e => { mouseX = e.clientX; mouseY = e.clientY; };
    window.addEventListener('mousemove', onMouse, { passive: true });

    const COUNT = Math.min(110, Math.floor(window.innerWidth / 12));

    const particles = Array.from({ length: COUNT }, () => ({
      x:     Math.random() * window.innerWidth,
      y:     Math.random() * window.innerHeight,
      r:     Math.random() * 1.6 + 0.3,
      dx:    (Math.random() - 0.5) * 0.38,
      dy:    (Math.random() - 0.5) * 0.38,
      alpha: Math.random() * 0.5 + 0.15,
      hue:   Math.random() > 0.55 ? 192 : (Math.random() > 0.5 ? 262 : 295),
      pulse: Math.random() * Math.PI * 2,
    }));

    const opacity = isLight ? 0.3 : 0.55;
    const connAlpha = isLight ? 0.07 : 0.12;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Mouse repel
      particles.forEach(p => {
        const dx = p.x - mouseX, dy = p.y - mouseY;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < 100) { p.x += (dx/dist)*0.7; p.y += (dy/dist)*0.7; }
      });

      // Connections
      for (let i=0; i<particles.length; i++) {
        for (let j=i+1; j<particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const d = Math.sqrt(dx*dx + dy*dy);
          if (d < 115) {
            ctx.beginPath();
            ctx.strokeStyle = `hsla(${particles[i].hue},100%,70%,${connAlpha*(1-d/115)})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // Dots
      particles.forEach(p => {
        p.pulse += 0.018;
        const a = p.alpha * (0.7 + 0.3*Math.sin(p.pulse)) * opacity;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
        ctx.fillStyle = `hsla(${p.hue},100%,${isLight?55:75}%,${a})`;
        ctx.fill();

        if (p.r > 1.2) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r*3, 0, Math.PI*2);
          ctx.fillStyle = `hsla(${p.hue},100%,${isLight?55:75}%,${a*0.06})`;
          ctx.fill();
        }

        p.x += p.dx; p.y += p.dy;
        if (p.x < 0 || p.x > canvas.width)  p.dx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
      });

      animId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouse);
    };
  }, [theme]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed', top:0, left:0,
        width:'100%', height:'100%',
        zIndex:0, pointerEvents:'none',
        opacity: 1,
      }}
    />
  );
}
