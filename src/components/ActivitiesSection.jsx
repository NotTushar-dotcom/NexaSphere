import { useEffect, useRef, useState } from 'react';
import { activities } from '../data/activitiesData';

function Card({ a, idx, onNav }) {
  const ref = useRef(null);
  const [hov, setHov] = useState(false);

  const onMove = e => {
    const c = ref.current; if (!c) return;
    const rect = c.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width  - .5;
    const y = (e.clientY - rect.top)  / rect.height - .5;
    c.style.transform = `translateY(-14px) rotateX(${-y*15}deg) rotateY(${x*15}deg) scale(1.02)`;
  };
  const onLeave = () => { if (ref.current) ref.current.style.transform = ''; setHov(false); };
  const onClick = () => {
    const c = ref.current;
    if (c) { c.style.transform='scale(.94)'; setTimeout(()=>{c.style.transform='';},150); }
    setTimeout(()=>onNav('activity', a.title), 180);
  };

  return (
    <div ref={ref}
      className={`activity-card shimmer tilt ag reveal reveal-delay-${Math.min(idx+1,8)}`}
      onMouseMove={onMove} onMouseEnter={()=>setHov(true)} onMouseLeave={onLeave}
      onClick={onClick} style={{perspective:'800px',cursor:'pointer'}}
    >
      <div className="card-num">{String(idx+1).padStart(2,'0')}</div>
      <div className="activity-icon">{a.icon}</div>
      <div className="activity-title">{a.title}</div>
      <p className="activity-desc">{a.description}</p>
      <div className="activity-cta">
        <span>Explore</span>
        <span style={{transition:'transform .22s',transform:hov?'translateX(5px)':''}}>→</span>
      </div>
    </div>
  );
}

export default function ActivitiesSection({ onNavigate }) {
  useEffect(() => {
    const obs = new IntersectionObserver(
      e => e.forEach(x => { if (x.isIntersecting) x.target.classList.add('visible'); }),
      { threshold: .06 }
    );
    document.querySelectorAll('#section-activities .reveal').forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <section className="section" id="section-activities">
      <div className="container">
        <h2 className="section-title reveal">Our Activities</h2>
        <p className="section-subtitle reveal" style={{transitionDelay:'.1s'}}>
          Click any activity to explore sessions &amp; events
        </p>
        <div className="activity-grid">
          {activities.map((a,i) => <Card key={a.id} a={a} idx={i} onNav={onNavigate}/>)}
        </div>
      </div>
    </section>
  );
}
