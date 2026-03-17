import { useEffect, useRef, useState } from 'react';
import { activities } from '../data/activitiesData';

function useReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.classList.add('visible'); obs.disconnect(); } },
      { threshold: 0.12 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

function ActivityCard({ activity, delay, onNavigate }) {
  const ref = useRef(null);
  const [hovered, setHovered] = useState(false);
  const [clicking, setClicking] = useState(false);

  const handleMouseMove = (e) => {
    const card = ref.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `translateY(-10px) rotateX(${-y * 12}deg) rotateY(${x * 12}deg) scale(1.02)`;
  };
  const handleMouseLeave = () => {
    if (ref.current) ref.current.style.transform = '';
    setHovered(false);
  };

  const handleClick = () => {
    setClicking(true);
    setTimeout(() => {
      setClicking(false);
      if (onNavigate) onNavigate('activity', activity.title);
    }, 180);
  };

  return (
    <div
      ref={ref}
      className={`activity-card shimmer-card tilt-card reveal reveal-delay-${delay}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      style={{
        perspective: '600px',
        cursor: 'pointer',
        transform: clicking ? 'scale(0.95)' : '',
        transition: clicking ? 'transform 0.15s ease' : '',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Animated icon */}
      <div className="activity-icon" style={{
        transition: 'transform 0.4s cubic-bezier(0.34,1.56,0.64,1)',
        transform: hovered ? 'scale(1.25) rotate(10deg)' : 'scale(1)',
        display: 'inline-block',
        filter: hovered ? `drop-shadow(0 0 12px currentColor)` : '',
      }}>
        {activity.icon}
      </div>

      <div className="activity-title">{activity.title}</div>
      <p className="activity-desc">{activity.description}</p>

      {/* "Explore" CTA */}
      <div style={{
        marginTop: '14px', display: 'flex', alignItems: 'center', gap: '6px',
        fontSize: '0.78rem', color: 'var(--cyan)', fontWeight: 700,
        letterSpacing: '0.08em', textTransform: 'uppercase',
        opacity: hovered ? 1 : 0.5,
        transition: 'opacity 0.3s, transform 0.3s',
        transform: hovered ? 'translateX(4px)' : '',
      }}>
        Explore {activity.title} →
      </div>

      {/* Corner glow on hover */}
      {hovered && (
        <div style={{
          position: 'absolute', bottom: '-20px', right: '-20px',
          width: '80px', height: '80px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0,212,255,0.15), transparent)',
          pointerEvents: 'none',
        }} />
      )}
    </div>
  );
}

export default function ActivitiesSection({ onNavigate }) {
  const titleRef = useReveal();

  useEffect(() => {
    const cards = document.querySelectorAll('#section-activities .activity-card');
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('visible'); }),
      { threshold: 0.1 }
    );
    cards.forEach((c) => obs.observe(c));
    return () => obs.disconnect();
  }, []);

  return (
    <section className="section" id="section-activities">
      <div className="container">
        <h2 className="section-title reveal" ref={titleRef}>Our Activities</h2>
        <p className="section-subtitle reveal" style={{ transitionDelay: '0.1s' }}>
          Click any activity to explore sessions &amp; events
        </p>
        <div className="activity-grid">
          {activities.map((a, i) => (
            <ActivityCard
              key={a.id}
              activity={a}
              delay={Math.min((i % 4) + 1, 6)}
              onNavigate={onNavigate}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
