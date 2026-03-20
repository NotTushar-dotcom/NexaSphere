import { useEffect, useRef, useState } from 'react';
import { activities } from '../data/activitiesData';

/* ── Reusable cinematic pop observer ── */
function useCinPop(selector, threshold = 0.12) {
  useEffect(() => {
    const els = document.querySelectorAll(selector);
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('fired');
          obs.unobserve(e.target);
        }
      });
    }, { threshold });
    els.forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, [selector, threshold]);
}

function ActivityCard({ a, idx, onNav }) {
  const ref = useRef(null);
  const [hov, setHov] = useState(false);

  const onMove = e => {
    const c = ref.current; if (!c) return;
    const rect = c.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width  - .5;
    const y = (e.clientY - rect.top)  / rect.height - .5;
    // Remove floating animation while tilt is active
    c.style.animation = 'none';
    c.style.transform = `translateY(-16px) rotateX(${-y*16}deg) rotateY(${x*16}deg) scale(1.03)`;
  };
  const onLeave = () => {
    if (ref.current) {
      ref.current.style.transform = '';
      ref.current.style.animation = '';
    }
    setHov(false);
  };
  const onClick = () => {
    const c = ref.current;
    if (c) { c.style.transform='scale(.93)'; setTimeout(()=>{c.style.transform='';},150); }
    setTimeout(()=>onNav('activity', a.title), 180);
  };

  const delay = idx * 0.08;

  return (
    <div
      ref={ref}
      className="activity-card shimmer tilt ag pop-flip cin-container"
      style={{ cursor:'pointer', animationDelay:`${delay}s` }}
      onMouseMove={onMove}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={onLeave}
      onClick={onClick}
    >
      <div className="card-num">{String(idx+1).padStart(2,'0')}</div>
      <div className="activity-icon">{a.icon}</div>
      <div className="activity-title">{a.title}</div>
      <p className="activity-desc">{a.description}</p>
      <div className="activity-cta">
        <span>Explore</span>
        <span style={{transition:'transform .22s',transform:hov?'translateX(6px)':''}}>→</span>
      </div>
      {/* Corner accent lines like hacknovate */}
      <div style={{position:'absolute',top:0,left:0,width:'20px',height:'20px',borderTop:'1px solid var(--c1)',borderLeft:'1px solid var(--c1)',opacity:.5,borderRadius:'var(--r3) 0 0 0'}}/>
      <div style={{position:'absolute',bottom:0,right:0,width:'20px',height:'20px',borderBottom:'1px solid var(--c2)',borderRight:'1px solid var(--c2)',opacity:.5,borderRadius:'0 0 var(--r3) 0'}}/>
    </div>
  );
}

export default function ActivitiesSection({ onNavigate }) {
  useCinPop('#section-activities .pop-flip', 0.1);
  useCinPop('#section-activities .pop-in', 0.15);

  return (
    <section className="section" id="section-activities">
      <div className="container">
        {/* Section header with clip reveal */}
        <div style={{textAlign:'center',marginBottom:'12px',overflow:'hidden'}}>
          <h2 className="section-title pop-in" style={{animationFillMode:'both'}}>Our Activities</h2>
        </div>
        <p className="section-subtitle pop-in" style={{transitionDelay:'.1s'}}>
          Click any activity to explore sessions &amp; events
        </p>
        <div className="activity-grid cin-container">
          {activities.map((a,i) => <ActivityCard key={a.id} a={a} idx={i} onNav={onNavigate}/>)}
        </div>
      </div>
    </section>
  );
}
