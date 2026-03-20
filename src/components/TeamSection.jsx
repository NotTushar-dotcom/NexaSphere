import { useState, useEffect } from 'react';
import { teamMembers } from '../data/teamData';
import TeamMemberCard from './TeamMemberCard';
import TeamMemberModal from './TeamMemberModal';

export default function TeamSection() {
  const [sel, setSel] = useState(null);

  useEffect(() => {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('fired'); obs.unobserve(e.target); }
      });
    }, { threshold: 0.07 });
    document.querySelectorAll('#section-team .pop-flip, #section-team .pop-in').forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <section className="section" id="section-team">
      <div className="container">
        <h2 className="section-title pop-in">Core Team</h2>
        <p className="section-subtitle pop-in" style={{animationDelay:'.1s'}}>The Minds Behind NexaSphere</p>

        {/* Hacknovate-style label */}
        <div style={{textAlign:'center',marginBottom:'32px',marginTop:'-40px'}}>
          <span style={{fontFamily:"'Space Mono',monospace",fontSize:'.65rem',color:'var(--t3)',letterSpacing:'.3em',textTransform:'uppercase'}}>GL Bajaj Group of Institutions · Mathura</span>
        </div>

        <div className="team-grid cin-container">
          {teamMembers.map((m,i) => (
            <TeamMemberCard key={m.id} member={m} onClick={setSel}
              extraClass={`ag pop-flip`}
              style={{animationDelay:`${i*.07}s`}}/>
          ))}
        </div>
      </div>
      {sel && <TeamMemberModal member={sel} onClose={()=>setSel(null)}/>}
    </section>
  );
}
