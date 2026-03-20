import { useEffect, useRef } from 'react';

export default function ParticleBackground({ theme = 'dark' }) {
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let raf, mx = -9999, my = -9999, isLight = theme === 'light';

    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener('resize', resize, { passive: true });
    const onMove = e => { mx = e.clientX; my = e.clientY; };
    window.addEventListener('mousemove', onMove, { passive: true });

    const N = Math.min(130, Math.floor(window.innerWidth / 11));
    const hues = [192, 262, 295]; // cyan, indigo, purple

    const pts = Array.from({ length: N }, () => {
      const h = hues[Math.floor(Math.random() * hues.length)];
      return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        ox: 0, oy: 0,          // origin offsets
        vx: (Math.random() - .5) * .35,
        vy: (Math.random() - .5) * .35,
        r: Math.random() * 1.6 + .3,
        h, alpha: Math.random() * .55 + .15,
        phase: Math.random() * Math.PI * 2,
      };
    });
    // record origins after first place
    pts.forEach(p => { p.ox = p.x; p.oy = p.y; });

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const baseL = isLight ? 45 : 72;
      const connA = isLight ? .05 : .11;

      pts.forEach(p => {
        // MAGNETIC: attract toward cursor within 200px, repel within 80px
        const dx = p.x - mx, dy = p.y - my;
        const d = Math.sqrt(dx*dx + dy*dy);
        if (d < 200 && d > 0) {
          const force = d < 80
            ? (80 - d) / 80 * 1.8   // repel
            : -(200 - d) / 200 * .6; // attract
          p.vx += (dx / d) * force * .012;
          p.vy += (dy / d) * force * .012;
        }
        // Drift back toward origin
        p.vx += (p.ox - p.x) * .0004;
        p.vy += (p.oy - p.y) * .0004;
        // Friction
        p.vx *= .97; p.vy *= .97;
        p.x += p.vx; p.y += p.vy;
        // Bounds
        if (p.x < 0 || p.x > canvas.width)  p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        p.phase += .016;
        const a = p.alpha * (.72 + .28 * Math.sin(p.phase));

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.h},100%,${baseL}%,${a})`;
        ctx.fill();

        if (p.r > 1.1) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r * 3.5, 0, Math.PI * 2);
          ctx.fillStyle = `hsla(${p.h},100%,${baseL}%,${a * .06})`;
          ctx.fill();
        }
      });

      // Connections
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y;
          const d = Math.sqrt(dx*dx + dy*dy);
          if (d < 118) {
            const a = connA * (1 - d / 118);
            ctx.beginPath();
            ctx.strokeStyle = `hsla(${pts[i].h},100%,${baseL}%,${a})`;
            ctx.lineWidth = .55;
            ctx.moveTo(pts[i].x, pts[i].y);
            ctx.lineTo(pts[j].x, pts[j].y);
            ctx.stroke();
          }
        }
      }
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMove);
    };
  }, [theme]);

  return (
    <canvas ref={ref} style={{
      position:'fixed', top:0, left:0,
      width:'100%', height:'100%',
      zIndex:0, pointerEvents:'none',
      opacity: theme === 'light' ? .28 : .52,
    }} />
  );
}
