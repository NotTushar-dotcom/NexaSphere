import { useEffect, useState, useRef } from 'react';

// ── Typewriter Effect ──
function Typewriter({ text, speed = 18, color }) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        let i = 0;
        const timer = setInterval(() => {
          setDisplayed(text.slice(0, i + 1));
          i++;
          if (i >= text.length) { setDone(true); clearInterval(timer); }
        }, speed);
      }
    }, { threshold: 0.5 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [text, speed]);

  return (
    <span ref={ref} style={{ color }}>
      {displayed}
      {!done && <span style={{ animation: 'blink 0.7s step-end infinite', color }}> |</span>}
      <style>{`@keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }`}</style>
    </span>
  );
}

// ── Animated Stat Card ──
function StatCard({ label, value, color }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        const num = parseInt(value) || 0;
        if (isNaN(num) || num === 0) { setCount(value); return; }
        const dur = 1000, step = 16, inc = num / (dur / step);
        let cur = 0;
        const t = setInterval(() => {
          cur += inc;
          if (cur >= num) { setCount(num); clearInterval(t); }
          else setCount(Math.floor(cur));
        }, step);
      }
    }, { threshold: 0.5 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [value]);

  return (
    <div ref={ref} style={{
      background: `rgba(${hexToRgb(color)},0.06)`,
      border: `1px solid rgba(${hexToRgb(color)},0.25)`,
      borderRadius: 'var(--radius-md)', padding: '16px 24px', textAlign: 'center',
      minWidth: '90px', position: 'relative', overflow: 'hidden',
      transition: 'all 0.3s ease',
    }}
      onMouseEnter={e => {
        e.currentTarget.style.background = `rgba(${hexToRgb(color)},0.12)`;
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = `0 12px 32px rgba(${hexToRgb(color)},0.2)`;
      }}
      onMouseLeave={e => {
        e.currentTarget.style.background = `rgba(${hexToRgb(color)},0.06)`;
        e.currentTarget.style.transform = '';
        e.currentTarget.style.boxShadow = '';
      }}
    >
      <div style={{
        fontFamily: 'Orbitron, monospace', fontSize: '1.8rem', fontWeight: 900, color,
        textShadow: `0 0 20px rgba(${hexToRgb(color)},0.5)`,
      }}>
        {typeof count === 'number' && parseInt(value) > 0 ? count + (value.includes('+') ? '+' : '') : value}
      </div>
      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: '4px' }}>
        {label}
      </div>
    </div>
  );
}

// ── Topic Card ──
function TopicCard({ topic, index, color }) {
  const [hovered, setHovered] = useState(false);
  const rgb = hexToRgb(color);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? `linear-gradient(135deg, rgba(${rgb},0.1), var(--bg-card))` : 'var(--bg-card)',
        border: `1px solid ${hovered ? color + '60' : 'var(--border-subtle)'}`,
        borderRadius: 'var(--radius-md)', padding: '22px 24px',
        transition: 'all 0.35s cubic-bezier(0.34,1.56,0.64,1)',
        transform: hovered ? 'translateX(8px)' : '',
        boxShadow: hovered ? `0 8px 32px rgba(${rgb},0.15), -4px 0 0 ${color}` : `-4px 0 0 rgba(${rgb},0.3)`,
        position: 'relative', overflow: 'hidden',
      }}
    >
      {/* Number badge */}
      <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
        <div style={{
          width: '36px', height: '36px', borderRadius: '50%', flexShrink: 0,
          background: `linear-gradient(135deg, ${color}, rgba(${rgb},0.5))`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'Orbitron, monospace', fontWeight: 900, fontSize: '0.85rem', color: '#fff',
          boxShadow: `0 0 16px rgba(${rgb},0.4)`,
          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
          transform: hovered ? 'scale(1.15) rotate(5deg)' : '',
        }}>
          {String(index + 1).padStart(2, '0')}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{
            fontFamily: 'Orbitron, monospace', fontSize: '0.9rem', fontWeight: 700,
            color, marginBottom: '8px',
          }}>
            {topic.title}
          </div>
          <div style={{ display: 'flex', gap: '16px', marginBottom: '10px', flexWrap: 'wrap' }}>
            <span style={{
              fontSize: '0.78rem', color: 'var(--text-muted)',
              display: 'flex', alignItems: 'center', gap: '4px',
            }}>
              🎤 {topic.speaker}
            </span>
            <span style={{
              fontSize: '0.78rem', color: 'var(--text-muted)',
              display: 'flex', alignItems: 'center', gap: '4px',
            }}>
              ⏱ {topic.duration}
            </span>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', margin: 0, lineHeight: 1.65 }}>
            {topic.summary}
          </p>
        </div>
      </div>
    </div>
  );
}

// ── Media Button ──
function MediaBtn({ href, icon, label, color }) {
  const [hovered, setHovered] = useState(false);
  const rgb = hexToRgb(color);

  if (!href) {
    return (
      <div style={{
        background: 'var(--bg-card)', border: '1px dashed var(--border-subtle)',
        borderRadius: 'var(--radius-md)', padding: '24px 32px',
        color: 'var(--text-muted)', textAlign: 'center', flex: 1, minWidth: '160px',
      }}>
        <div style={{ fontSize: '2rem', marginBottom: '8px' }}>{icon}</div>
        <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '4px' }}>{label}</div>
        <div style={{ fontSize: '0.75rem' }}>Coming soon</div>
      </div>
    );
  }

  return (
    <a
      href={href} target="_blank" rel="noopener noreferrer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        flex: 1, minWidth: '160px', textDecoration: 'none',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        gap: '10px', padding: '24px 32px', borderRadius: 'var(--radius-md)',
        background: hovered ? `rgba(${rgb},0.12)` : 'var(--bg-card)',
        border: `1px solid ${hovered ? color : 'var(--border-subtle)'}`,
        color: hovered ? color : 'var(--text-primary)',
        transition: 'all 0.3s cubic-bezier(0.34,1.56,0.64,1)',
        transform: hovered ? 'translateY(-6px) scale(1.02)' : '',
        boxShadow: hovered ? `0 16px 40px rgba(${rgb},0.25)` : '',
        cursor: 'pointer',
      }}
    >
      <div style={{ fontSize: '2.2rem', transition: 'transform 0.3s ease', transform: hovered ? 'scale(1.2) rotate(-5deg)' : '' }}>
        {icon}
      </div>
      <div style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: '0.95rem', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
        {label}
      </div>
    </a>
  );
}

function hexToRgb(hex) {
  if (!hex || !hex.startsWith('#')) return '0,212,255';
  const r = parseInt(hex.slice(1,3),16);
  const g = parseInt(hex.slice(3,5),16);
  const b = parseInt(hex.slice(5,7),16);
  return `${r},${g},${b}`;
}

// ════════════════════════════════════════
export default function EventDetailPage({ event, activityColor, activityIcon, onBack }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0 });
    setTimeout(() => setMounted(true), 60);
  }, []);

  const color = activityColor || '#00d4ff';
  const rgb = hexToRgb(color);

  return (
    <div style={{ minHeight: '100vh', paddingBottom: '100px' }}>

      {/* ── Cinematic Hero ── */}
      <div style={{
        position: 'relative', overflow: 'hidden',
        background: `linear-gradient(160deg, rgba(${rgb},0.12) 0%, rgba(${rgb},0.03) 50%, transparent 100%)`,
        borderBottom: `1px solid rgba(${rgb},0.2)`,
        padding: '64px 0 56px',
      }}>
        {/* Grid pattern bg */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 0,
          backgroundImage: `linear-gradient(rgba(${rgb},0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(${rgb},0.05) 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
          maskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%)',
        }} />

        {/* Glow orb */}
        <div style={{
          position: 'absolute', top: '-30%', left: '50%', transform: 'translateX(-50%)',
          width: '600px', height: '600px', borderRadius: '50%',
          background: `radial-gradient(circle, rgba(${rgb},0.12) 0%, transparent 70%)`,
          pointerEvents: 'none', zIndex: 0,
        }} />

        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          {/* Back button */}
          <button
            onClick={onBack}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              background: 'none', border: `1px solid rgba(${rgb},0.3)`,
              color, borderRadius: '20px', padding: '6px 18px',
              fontSize: '0.85rem', cursor: 'pointer', marginBottom: '40px',
              transition: 'all 0.2s', fontFamily: 'Rajdhani, sans-serif', fontWeight: 600,
            }}
            onMouseEnter={e => { e.target.style.background = `rgba(${rgb},0.12)`; e.target.style.transform = 'translateX(-4px)'; }}
            onMouseLeave={e => { e.target.style.background = 'none'; e.target.style.transform = ''; }}
          >
            ← Back
          </button>

          {/* Title block */}
          <div style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? 'translateY(0)' : 'translateY(40px)',
            transition: 'all 0.8s cubic-bezier(0.22,1,0.36,1)',
          }}>
            {/* Activity label */}
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              background: `rgba(${rgb},0.1)`, border: `1px solid rgba(${rgb},0.3)`,
              borderRadius: '20px', padding: '4px 14px', marginBottom: '20px',
              fontSize: '0.78rem', color, fontFamily: 'Rajdhani, sans-serif',
              fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em',
            }}>
              {activityIcon} Insight Session
            </div>

            <h1 style={{
              fontFamily: 'Orbitron, monospace',
              fontSize: 'clamp(1.6rem, 5vw, 3rem)',
              fontWeight: 900, marginBottom: '12px', lineHeight: 1.15,
              background: `linear-gradient(135deg, ${color}, #ffffff80)`,
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>
              {event.name}
            </h1>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', marginBottom: '32px' }}>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>📅 {event.date}</span>
              <span style={{
                fontSize: '0.72rem', padding: '3px 12px', borderRadius: '20px',
                background: 'rgba(34,197,94,0.12)', color: '#22c55e',
                border: '1px solid rgba(34,197,94,0.3)', fontWeight: 700,
                textTransform: 'uppercase', letterSpacing: '0.05em',
              }}>✅ Completed</span>
            </div>

            {/* Stats */}
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              {event.stats?.map(s => (
                <StatCard key={s.label} label={s.label} value={s.value} color={color} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="container" style={{ paddingTop: '56px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '48px' }}>

          {/* Overview */}
          <section>
            <h2 style={{
              fontFamily: 'Orbitron, monospace', fontSize: '0.95rem', fontWeight: 700,
              textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '20px',
              display: 'flex', alignItems: 'center', gap: '12px',
            }}>
              <span style={{
                width: '28px', height: '28px', borderRadius: '50%', flexShrink: 0,
                background: `linear-gradient(135deg, ${color}, rgba(${rgb},0.5))`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.75rem',
              }}>📋</span>
              <span style={{ color }}>Session Overview</span>
            </h2>
            <div style={{
              background: 'var(--bg-card)',
              borderLeft: `3px solid ${color}`,
              borderRadius: '0 var(--radius-md) var(--radius-md) 0',
              padding: '28px 32px',
              border: `1px solid rgba(${rgb},0.15)`,
              borderLeftWidth: '3px',
              position: 'relative', overflow: 'hidden',
            }}>
              <div style={{
                position: 'absolute', top: 0, right: 0, width: '120px', height: '120px',
                background: `radial-gradient(circle, rgba(${rgb},0.08), transparent)`,
                pointerEvents: 'none',
              }} />
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.85, fontSize: '1rem', margin: 0 }}>
                <Typewriter text={event.overview} color="var(--text-secondary)" speed={8} />
              </p>
            </div>
          </section>

          {/* Topics */}
          {event.topics && event.topics.length > 0 && (
            <section>
              <h2 style={{
                fontFamily: 'Orbitron, monospace', fontSize: '0.95rem', fontWeight: 700,
                textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '20px',
                display: 'flex', alignItems: 'center', gap: '12px',
              }}>
                <span style={{
                  width: '28px', height: '28px', borderRadius: '50%', flexShrink: 0,
                  background: `linear-gradient(135deg, ${color}, rgba(${rgb},0.5))`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.75rem',
                }}>🎯</span>
                <span style={{ color }}>Topics Covered</span>
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {event.topics.map((topic, i) => (
                  <TopicCard key={i} topic={topic} index={i} color={color} />
                ))}
              </div>
            </section>
          )}

          {/* Photos & Videos */}
          <section>
            <h2 style={{
              fontFamily: 'Orbitron, monospace', fontSize: '0.95rem', fontWeight: 700,
              textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '20px',
              display: 'flex', alignItems: 'center', gap: '12px',
            }}>
              <span style={{
                width: '28px', height: '28px', borderRadius: '50%', flexShrink: 0,
                background: `linear-gradient(135deg, ${color}, rgba(${rgb},0.5))`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.75rem',
              }}>📸</span>
              <span style={{ color }}>Photos & Videos</span>
            </h2>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <MediaBtn href={event.photoLink} icon="📷" label="View Photos" color={color} />
              <MediaBtn href={event.videoLink} icon="🎥" label="Watch Recording" color={color} />
            </div>
            {!event.photoLink && !event.videoLink && (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.78rem', marginTop: '12px', fontStyle: 'italic' }}>
                To add links: open <code style={{ color }}>src/data/activityPagesData.js</code> → find this event → set <code style={{ color }}>photoLink</code> and <code style={{ color }}>videoLink</code>
              </p>
            )}
          </section>

        </div>
      </div>
    </div>
  );
}
