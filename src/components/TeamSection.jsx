import { useState, useEffect } from 'react';
import { teamMembers } from '../data/teamData';
import TeamMemberCard from './TeamMemberCard';
import TeamMemberModal from './TeamMemberModal';

export default function TeamSection() {
  const [sel, setSel] = useState(null);
  useEffect(() => {
    const obs = new IntersectionObserver(
      e => e.forEach(x => { if (x.isIntersecting) x.target.classList.add('visible'); }),
      { threshold: .07 }
    );
    document.querySelectorAll('#section-team .reveal').forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);
  return (
    <section className="section" id="section-team">
      <div className="container">
        <h2 className="section-title reveal">Core Team</h2>
        <p className="section-subtitle reveal" style={{transitionDelay:'.1s'}}>The Minds Behind NexaSphere</p>
        <div className="team-grid">
          {teamMembers.map((m,i) => (
            <TeamMemberCard key={m.id} member={m} onClick={setSel}
              extraClass={`ag reveal reveal-delay-${Math.min((i%6)+1,8)}`}/>
          ))}
        </div>
      </div>
      {sel && <TeamMemberModal member={sel} onClose={()=>setSel(null)}/>}
    </section>
  );
}
