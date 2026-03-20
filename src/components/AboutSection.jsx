import { useEffect } from 'react';

const WHATSAPP = 'https://chat.whatsapp.com/Jjc5cuUKENu0RC1vWSEs20';
const LINKEDIN = 'https://www.linkedin.com/showcase/glbajaj-nexasphere/';

const values = ['Innovation','Collaboration','Learning','Growth','Community','Technology'];

function Pill({ text }) {
  return (
    <span style={{
      display:'inline-flex',alignItems:'center',padding:'5px 14px',margin:'4px',
      borderRadius:'50px',background:'var(--c1a)',border:'1px solid var(--c1b)',
      color:'var(--c1)',fontSize:'.78rem',fontWeight:700,letterSpacing:'.07em',textTransform:'uppercase',
      transition:'all .2s',cursor:'default',
    }}
      onMouseEnter={e=>{e.target.style.background='var(--c1b)';e.target.style.transform='translateY(-2px)';}}
      onMouseLeave={e=>{e.target.style.background='var(--c1a)';e.target.style.transform='';}}
    >{text}</span>
  );
}

export default function AboutSection() {
  useEffect(() => {
    const obs = new IntersectionObserver(entries=>{
      entries.forEach(e=>{
        if(e.isIntersecting){e.target.classList.add('fired'); obs.unobserve(e.target);}
      });
    },{threshold:.1});
    document.querySelectorAll('#section-about .pop-in,.pop-left,.pop-right,.pop-word,.pop-scale').forEach(el=>obs.observe(el));
    return ()=>obs.disconnect();
  }, []);

  return (
    <section className="section" id="section-about" style={{position:'relative',overflow:'hidden'}}>
      <div style={{position:'absolute',top:'50%',left:'50%',transform:'translate(-50%,-50%)',width:'600px',height:'600px',borderRadius:'50%',background:'radial-gradient(circle,rgba(124,110,255,.03) 0%,transparent 70%)',pointerEvents:'none'}}/>
      <div className="container" style={{position:'relative',zIndex:1}}>
        <h2 className="section-title pop-word">About NexaSphere</h2>
        <p className="section-subtitle pop-in" style={{transitionDelay:'.1s'}}>Building Tomorrow&apos;s Tech Leaders Today</p>

        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'48px',alignItems:'center',maxWidth:'940px',margin:'0 auto 48px'}}>
          <div>
            <p className="about-text pop-left" style={{transitionDelay:'.1s'}}>
              <strong style={{color:'var(--c1)'}}>NexaSphere</strong> is a student-driven tech ecosystem at{' '}
              <strong style={{color:'var(--c2)'}}>GL Bajaj Group of Institutions, Mathura</strong>.
              Founded to create a thriving community of passionate engineers and innovators,
              we bridge the gap between academic learning and real-world technology.
            </p>
            <p className="about-text pop-left" style={{marginTop:'14px',transitionDelay:'.2s'}}>
              From intense hackathons to insightful knowledge sessions, NexaSphere is where
              curiosity meets collaboration. We believe the best learning happens when you
              build, share, and grow together.
            </p>
            <div style={{marginTop:'16px',paddingTop:'16px',borderTop:'1px solid var(--bdr)',transitionDelay:'.25s'}} className="pop-left">
              <div style={{fontFamily:'Orbitron,monospace',fontSize:'.75rem',color:'var(--c2)',fontWeight:700,letterSpacing:'.1em',marginBottom:'5px',textTransform:'uppercase'}}>Proposed by</div>
              <div style={{color:'var(--t2)',fontSize:'.9rem'}}>Tanishk Bansal &amp; Ayush Sharma</div>
            </div>
          </div>

          <div className="pop-right" style={{transitionDelay:'.15s'}}>
            <div className="about-card-inner ag"
              onMouseEnter={e=>{e.currentTarget.style.borderColor='var(--c1b)';e.currentTarget.style.boxShadow='var(--sh1)';}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor='var(--bdr)';e.currentTarget.style.boxShadow='';}}
            >
              <div style={{position:'absolute',top:'-18px',right:'-18px',width:'110px',height:'110px',background:'radial-gradient(circle,rgba(0,229,255,.07),transparent)',borderRadius:'50%',pointerEvents:'none'}}/>
              <div style={{fontFamily:'Orbitron,monospace',fontSize:'.77rem',color:'var(--c1)',fontWeight:700,letterSpacing:'.1em',marginBottom:'14px',textTransform:'uppercase'}}>Our Values</div>
              <div style={{display:'flex',flexWrap:'wrap'}}>
                {values.map(v=><Pill key={v} text={v}/>)}
              </div>
            </div>
          </div>
        </div>

        <div className="about-actions pop-in" style={{transitionDelay:'.3s'}}>
          <a href={WHATSAPP} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp">💬 Join WhatsApp</a>
          <a href={LINKEDIN} target="_blank" rel="noopener noreferrer" className="btn btn-linkedin">🔗 LinkedIn</a>
        </div>
      </div>
    </section>
  );
}
