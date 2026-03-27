import { useEffect, useRef, useState } from 'react';

/* ═══════════════════════════════════════════════════════════════
   CINEMATIC SANDSTORM — Full Canvas Multi-Phase
   
   Phase 1  ERUPT   (0–600ms):
     Sand particles shoot from all 4 corners + edges INWARD
     Dust fills the screen from corners toward center
   
   Phase 2  PEAK    (600–1000ms):
     Screen completely buried in sand, full amber blackout
     Theme switches hidden under the sand at 700ms
   
   Phase 3  INHALE  (1000–1500ms):
     All sand gets violently SUCKED back toward the center point
     Vortex spiral effect — sand spins inward to a pinpoint
   
   Phase 4  REVEAL  (1500–2200ms):
     Center EXPLODES with new theme color
     Expanding ring wipes outward, new mode pops out
     Particles scatter off-screen as debris

   Total: ~2200ms
═══════════════════════════════════════════════════════════════ */

const TOTAL_PARTICLES = 380;

function lerp(a, b, t) { return a + (b - a) * t; }
function easeIn(t)  { return t * t; }
function easeOut(t) { return t * (2 - t); }
function easeInOut(t) { return t < 0.5 ? 2*t*t : -1+(4-2*t)*t; }

function spawnParticle(W, H, index, total) {
  // Distribute spawn points around ALL 4 corners + edges
  const zone = index % 8; // 8 spawn zones
  let x, y, targetX, targetY;

  // Spawn position (from corners/edges toward center)
  const cx = W / 2, cy = H / 2;
  const spread = 0.4;

  switch (zone) {
    case 0: x = -30; y = Math.random() * H * 0.5; break;           // left top
    case 1: x = -30; y = H * 0.5 + Math.random() * H * 0.5; break; // left bot
    case 2: x = W + 30; y = Math.random() * H * 0.5; break;         // right top
    case 3: x = W + 30; y = H * 0.5 + Math.random() * H * 0.5; break; // right bot
    case 4: x = Math.random() * W * 0.5; y = -30; break;            // top left
    case 5: x = W * 0.5 + Math.random() * W * 0.5; y = -30; break;  // top right
    case 6: x = Math.random() * W * 0.5; y = H + 30; break;         // bot left
    case 7: x = W * 0.5 + Math.random() * W * 0.5; y = H + 30; break; // bot right
    default: x = -30; y = Math.random() * H;
  }

  // Each particle aims toward a spread cluster near center
  targetX = cx + (Math.random() - 0.5) * W * spread;
  targetY = cy + (Math.random() - 0.5) * H * spread;

  const hue = 22 + Math.random() * 38; // amber 22–60
  const sat = 55 + Math.random() * 40;
  const lit = 35 + Math.random() * 40;

  return {
    // Spawn
    spawnX: x, spawnY: y,
    // Current position
    x, y,
    // Target (center cluster for ERUPT phase)
    targetX, targetY,
    // For INHALE — suck to dead center
    suckX: cx + (Math.random() - 0.5) * 40,
    suckY: cy + (Math.random() - 0.5) * 40,
    // For REVEAL scatter
    scatterVX: (Math.random() - 0.5) * 30,
    scatterVY: (Math.random() - 0.5) * 30,
    // Visuals
    r: Math.random() * 2.2 + 0.4,
    hue, sat, lit,
    alpha: Math.random() * 0.55 + 0.35,
    // Animation timing offset
    delay: (index / total) * 0.35, // stagger spawn
    // Turbulence
    wobble: Math.random() * Math.PI * 2,
    wobbleSpeed: 0.05 + Math.random() * 0.09,
    wobbleAmp: 1 + Math.random() * 4,
  };
}

export default function StormOverlay({ toTheme, onMidpoint, onDone }) {
  const canvasRef  = useRef(null);
  const stateRef   = useRef({ phase: 'erupt', phaseProgress: 0, themeApplied: false });
  const [revealVisible, setRevealVisible] = useState(false);
  const [revealScale,   setRevealScale]   = useState(0);
  const [done,          setDone]          = useState(false);
  const midFiredRef = useRef(false);

  // Reveal pop animation (CSS driven after canvas storm ends)
  useEffect(() => {
    // Phase timing (ms):
    // 0       → start erupt
    // 600     → peak begins
    // 700     → theme switches (hidden under sand)
    // 1000    → inhale begins
    // 1500    → reveal pop starts
    // 2200    → done

    const t1 = setTimeout(() => {
      stateRef.current.phase = 'peak';
    }, 600);

    const t2 = setTimeout(() => {
      if (!midFiredRef.current) { midFiredRef.current = true; onMidpoint(); }
    }, 700);

    const t3 = setTimeout(() => {
      stateRef.current.phase = 'inhale';
    }, 1000);

    const t4 = setTimeout(() => {
      stateRef.current.phase = 'reveal';
      setRevealVisible(true);
      requestAnimationFrame(() => {
        setTimeout(() => setRevealScale(1), 20);
      });
    }, 1500);

    const t5 = setTimeout(() => {
      stateRef.current.phase = 'scatter';
    }, 1800);

    const t6 = setTimeout(() => {
      setDone(true);
      onDone();
    }, 2200);

    return () => { [t1,t2,t3,t4,t5,t6].forEach(clearTimeout); };
  }, []); // eslint-disable-line

  // Canvas animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    const W = canvas.width, H = canvas.height;
    const cx = W / 2, cy = H / 2;

    const particles = Array.from({ length: TOTAL_PARTICLES }, (_, i) =>
      spawnParticle(W, H, i, TOTAL_PARTICLES)
    );

    let raf;
    let startTime = performance.now();
    let frameCount = 0;

    const draw = (now) => {
      frameCount++;
      const elapsed = now - startTime;
      const phase = stateRef.current.phase;
      ctx.clearRect(0, 0, W, H);

      // ── DUST HAZE OVERLAY ──
      const hazeAlpha =
        phase === 'erupt'   ? Math.min(elapsed / 600, 1) * 0.78 :
        phase === 'peak'    ? 0.88 :
        phase === 'inhale'  ? Math.max(0.88 - (elapsed - 1000) / 500 * 0.88, 0) :
        phase === 'reveal'  ? 0 :
        phase === 'scatter' ? 0 : 0;

      if (hazeAlpha > 0) {
        // Multi-layer sandy haze
        const grd = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(W, H) * 0.85);
        grd.addColorStop(0,   `rgba(195,130,40,${hazeAlpha * 0.92})`);
        grd.addColorStop(0.4, `rgba(170,105,25,${hazeAlpha})`);
        grd.addColorStop(0.7, `rgba(140,80,15,${hazeAlpha * 0.95})`);
        grd.addColorStop(1,   `rgba(100,55,8,${hazeAlpha * 0.85})`);
        ctx.fillStyle = grd;
        ctx.fillRect(0, 0, W, H);
      }

      // ── INHALE VORTEX GLOW ──
      if (phase === 'inhale' || phase === 'reveal') {
        const t = Math.min((elapsed - 1000) / 500, 1);
        const vortexAlpha = easeOut(t) * 0.9;
        const vortexR = lerp(300, 20, easeIn(t));
        const vg = ctx.createRadialGradient(cx, cy, 0, cx, cy, vortexR);
        vg.addColorStop(0,   `rgba(220,155,50,${vortexAlpha})`);
        vg.addColorStop(0.5, `rgba(180,110,25,${vortexAlpha * 0.6})`);
        vg.addColorStop(1,   'rgba(0,0,0,0)');
        ctx.fillStyle = vg;
        ctx.fillRect(0, 0, W, H);
      }

      // ── PARTICLES ──
      particles.forEach((p, idx) => {
        p.wobble += p.wobbleSpeed;

        if (phase === 'erupt') {
          // Fly from spawn to target
          const t = Math.min(Math.max((elapsed / 600 - p.delay) / (1 - p.delay), 0), 1);
          const te = easeOut(t);
          p.x = lerp(p.spawnX, p.targetX, te) + Math.sin(p.wobble) * p.wobbleAmp * (1 - te);
          p.y = lerp(p.spawnY, p.targetY, te) + Math.cos(p.wobble) * p.wobbleAmp * (1 - te);
        }
        else if (phase === 'peak') {
          // Swirl in place near target
          p.x = p.targetX + Math.sin(p.wobble * 0.7 + idx) * p.wobbleAmp * 2.5;
          p.y = p.targetY + Math.cos(p.wobble * 0.7 + idx) * p.wobbleAmp * 2.5;
        }
        else if (phase === 'inhale') {
          // Suck TOWARD center in a vortex spiral
          const t = Math.min((elapsed - 1000) / 500, 1);
          const te = easeIn(t);
          // Spiral: orbit then collapse
          const angle = p.wobble * 3 + idx * 0.15;
          const orbitR = lerp(
            Math.sqrt((p.targetX - cx) ** 2 + (p.targetY - cy) ** 2),
            5,
            te
          );
          p.x = cx + Math.cos(angle) * orbitR * (1 - te * 0.85) + lerp(p.targetX - cx, 0, te);
          p.y = cy + Math.sin(angle) * orbitR * (1 - te * 0.85) + lerp(p.targetY - cy, 0, te);
        }
        else if (phase === 'reveal' || phase === 'scatter') {
          // Explode outward from center
          const t = Math.min((elapsed - 1500) / 400, 1);
          const te = easeOut(t);
          p.x = cx + p.scatterVX * te * 6;
          p.y = cy + p.scatterVY * te * 6;
          p.alpha = Math.max(0, p.alpha - 0.04);
        }

        if (p.alpha <= 0) return;

        // Draw elongated grain in direction of motion
        const dx = p.x - (p.x - p.wobbleAmp);
        const len = phase === 'erupt' || phase === 'scatter'
          ? p.r * 3.5
          : p.r * 1.5;

        ctx.save();
        ctx.translate(p.x, p.y);
        if (phase === 'erupt') {
          const angle = Math.atan2(p.targetY - p.spawnY, p.targetX - p.spawnX);
          ctx.rotate(angle);
        } else if (phase === 'scatter') {
          ctx.rotate(Math.atan2(p.scatterVY, p.scatterVX));
        } else {
          ctx.rotate(p.wobble);
        }

        ctx.beginPath();
        ctx.ellipse(0, 0, len, p.r * 0.55, 0, 0, Math.PI * 2);

        // Glow for particles near center during inhale
        const distToCenter = Math.sqrt((p.x - cx) ** 2 + (p.y - cy) ** 2);
        const glowBoost = phase === 'inhale' && distToCenter < 150
          ? (1 - distToCenter / 150) * 0.5
          : 0;

        ctx.fillStyle = `hsla(${p.hue},${p.sat}%,${Math.min(p.lit + glowBoost * 40, 90)}%,${p.alpha})`;
        ctx.fill();
        ctx.restore();
      });

      // ── HORIZONTAL SAND STREAKS ──
      if (phase === 'erupt' || phase === 'peak') {
        const streakIntensity = phase === 'peak' ? 1 : Math.min(elapsed / 600, 1);
        const numStreaks = Math.floor(streakIntensity * 18);
        for (let i = 0; i < numStreaks; i++) {
          const y = (H / (numStreaks + 1)) * (i + 1) + Math.sin(frameCount * 0.03 + i) * 12;
          const len = 120 + Math.random() * 300;
          const x = ((frameCount * (3 + i % 4) * 4) % (W + len * 2)) - len;
          const alpha = (0.05 + Math.random() * 0.12) * streakIntensity;
          const hue = 28 + Math.random() * 28;

          const sg = ctx.createLinearGradient(x, y, x + len, y);
          sg.addColorStop(0,   `hsla(${hue},75%,55%,0)`);
          sg.addColorStop(0.3, `hsla(${hue},75%,55%,${alpha})`);
          sg.addColorStop(0.7, `hsla(${hue},75%,55%,${alpha * 0.8})`);
          sg.addColorStop(1,   `hsla(${hue},75%,55%,0)`);
          ctx.strokeStyle = sg;
          ctx.lineWidth = 0.8 + Math.random() * 2;
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(x + len, y);
          ctx.stroke();
        }
      }

      // ── CORNER DUST JETS (burst at ERUPT start) ──
      if (phase === 'erupt' && elapsed < 400) {
        const t = elapsed / 400;
        const corners = [[0,0],[W,0],[0,H],[W,H]];
        corners.forEach(([bx, by]) => {
          const jetGrd = ctx.createRadialGradient(bx, by, 0, bx, by, W * 0.45 * t);
          jetGrd.addColorStop(0,   `rgba(210,145,45,${0.7 * (1-t)})`);
          jetGrd.addColorStop(0.5, `rgba(175,110,28,${0.4 * (1-t)})`);
          jetGrd.addColorStop(1,   'rgba(0,0,0,0)');
          ctx.fillStyle = jetGrd;
          ctx.fillRect(0, 0, W, H);
        });
      }

      raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, []);

  if (done) return null;

  // Reveal ring color based on target theme
  const isDarkTarget = toTheme === 'dark';
  const revealColor  = isDarkTarget ? '#030810' : '#faf8f5';
  const revealAccent = isDarkTarget ? 'rgba(0,212,255,0.6)' : 'rgba(194,119,10,0.6)';

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9500,
      pointerEvents: 'all', overflow: 'hidden',
    }}>
      {/* Sand canvas */}
      <canvas
        ref={canvasRef}
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
      />

      {/* ── REVEAL BURST — expanding circle from center ── */}
      {revealVisible && (
        <div style={{
          position: 'absolute',
          left: '50%', top: '50%',
          width: '20px', height: '20px',
          borderRadius: '50%',
          background: revealColor,
          transform: `translate(-50%, -50%) scale(${revealScale ? Math.max(window.innerWidth, window.innerHeight) * 0.14 : 0})`,
          transition: 'transform 0.55s cubic-bezier(0.4, 0, 0.2, 1)',
          boxShadow: revealScale
            ? `0 0 0 8px ${revealAccent}, 0 0 0 20px ${isDarkTarget ? 'rgba(123,111,255,0.3)' : 'rgba(109,40,217,0.25)'}`
            : 'none',
          zIndex: 10,
        }}/>
      )}
    </div>
  );
}
