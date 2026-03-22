import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { teamMembers } from '../data/teamData';
import TeamMemberModal from './TeamMemberModal';

/* ── Crazy floating team card ── */
function MemberCard({ member, idx, onClick }) {
  const ref = useRef(null);
  const [hov, setHov] = useState(false);
  const [clicking, setClicking] = useState(false);

  // 3D tilt on mouse move
  const onMove = e => {
    const c = ref.current; if (!c || clicking) return;
    const rect = c.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width  - .5;
    const y = (e.clientY - rect.top)  / rect.height - .5;
    // Suspend anti-gravity while tilting
    c.style.animationPlayState = 'paused';
    c.style.transform = `translateY(-14px) rotateX(${-y*18}deg) rotateY(${x*18}deg) scale(1.05)`;
  };
  const onLeave = () => {
    const c = ref.current; if (!c) return;
    c.style.transform = '';
    c.style.animationPlayState = '';
    setHov(false);
  };
  const click = () => {
    setClicking(true);
    const c = ref.current;
    if (c) { c.style.transform='scale(.92)'; setTimeout(()=>{ c.style.transform=''; setClicking(false); },150); }
    setTimeout(()=>onClick(member), 120);
  };

  // Staggered delay for anti-gravity
  const agDelay = [0,-2.1,-4.2,-1.0,-3.3,-5.5,-0.7,-6.1,-2.8,-4.9,-1.6,-3.8][idx % 12];

  return (
    <div
      ref={ref}
      className={`team-card shimmer tilt pop-flip`}
      style={{
        cursor:'pointer', perspective:'800px',
        animation:`ag 7s ease-in-out infinite`,
        animationDelay:`${agDelay}s`,
        willChange:'transform',
      }}
      onMouseMove={onMove}
      onMouseEnter={()=>setHov(true)}
      onMouseLeave={onLeave}
      onClick={click}
      role="button" tabIndex={0}
      onKeyDown={e=>{if(e.key==='Enter'||e.key===' ')click();}}
      aria-label={`View ${member.name}'s profile`}
    >
      {/* Conic spin ring on photo */}
      <div className="team-card-photo-wrap">
        <img src={member.photo} alt={member.name} className="team-card-photo"/>
      </div>

      <div className="team-card-name">{member.name}</div>
      <div className="team-card-role">{member.role}</div>

      {/* Branch + section chips */}
      <div style={{display:'flex',flexWrap:'wrap',gap:'4px',justifyContent:'center',marginTop:'8px'}}>
        <span style={{
          fontSize:'.6rem',padding:'2px 8px',borderRadius:'10px',
          background:'var(--c1a)',color:'var(--c1)',
          border:'1px solid var(--c1b)',fontFamily:"'Space Mono',monospace",
          letterSpacing:'.03em',whiteSpace:'nowrap',
        }}>{member.branch}</span>
        <span style={{
          fontSize:'.6rem',padding:'2px 7px',borderRadius:'10px',
          background:'var(--c2a)',color:'var(--c2)',
          border:'1px solid var(--c2b)',fontFamily:"'Space Mono',monospace",
        }}>§{member.section}</span>
      </div>

      <div className="team-card-click-hint" style={{marginTop:'10px'}}>Click to view ↗</div>

      {/* Corner brackets */}
      <div className="corner-tl"/>
      <div className="corner-br"/>
    </div>
  );
}

export default function TeamSection() {
  const [sel, setSel] = useState(null);

  useEffect(() => {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('fired'); obs.unobserve(e.target); }
      });
    }, { threshold: 0.06 });
    document.querySelectorAll('#section-team .pop-flip, #section-team .pop-in, #section-team .pop-word').forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <section className="section" id="section-team">
      <div className="container">
        <span className="cin-section-label pop-in">GL Bajaj Group of Institutions · Mathura</span>
        <h2 className="section-title pop-word">Core Team</h2>
        <p className="section-subtitle pop-in" style={{animationDelay:'.1s'}}>
          The Minds Behind NexaSphere
        </p>

        <div className="team-grid cin-container">
          {teamMembers.map((m,i) => (
            <MemberCard key={m.id} member={m} idx={i} onClick={setSel}/>
          ))}
        </div>
      </div>

      {sel && createPortal(
        <TeamMemberModal member={sel} onClose={()=>setSel(null)}/>,
        document.body
      )}
    </section>
  );
}
