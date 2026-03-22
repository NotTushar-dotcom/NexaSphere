import { useEffect, useRef, useState, useCallback } from 'react';
import nexasphereLogo from '../assets/images/logos/nexasphere-logo.png';
import heroBg from '../assets/hero-bg.jpg';

const WHATSAPP = 'https://chat.whatsapp.com/Jjc5cuUKENu0RC1vWSEs20';

/* ── Ripple Button ── */
function RippleBtn({ cls, children, onClick, href }) {
  const ref = useRef(null);
  const go = e => {
    const b = ref.current; if (!b) return;
    const r = b.getBoundingClientRect();
    const el = document.createElement('span');
    el.className = 'rpl';
    el.style.left = (e.clientX - r.left) + 'px';
    el.style.top  = (e.clientY - r.top)  + 'px';
    b.appendChild(el);
    setTimeout(() => el.remove(), 750);
    onClick && onClick(e);
  };
  if (href) return <a ref={ref} href={href} target="_blank" rel="noopener noreferrer" className={`btn btn-ripple ${cls}`} onClick={go}>{children}</a>;
  return <button ref={ref} className={`btn btn-ripple ${cls}`} onClick={go}>{children}</button>;
}

/* ── Title with gradient — NO glitch in light mode, safe in both ── */
function HeroTitle({ theme }) {
  const [glitching, setGlitching] = useState(false);
  const isL = theme === 'light';

  useEffect(() => {
    if (isL) return; // no glitch in light mode
    const id = setInterval(() => {
      setGlitching(true);
      setTimeout(() => setGlitching(false), 200);
    }, 5000 + Math.random() * 3000);
    return () => clearInterval(id);
  }, [isL]);

  const text = 'NexaSphere';
  const grad = isL
    ? 'linear-gradient(135deg,#d97706 0%,#7c3aed 60%,#be185d 100%)'
    : 'linear-gradient(135deg,#00e5ff 0%,#7c6eff 50%,#bf5fff 100%)';

  return (
    <div style={{ position:'relative', display:'inline-block' }}>
      <style>{`
        @keyframes ht_g1{0%,100%{clip-path:inset(8% 0 88% 0);transform:translateX(-5px)}30%{clip-path:inset(40% 0 50% 0);transform:translateX(5px)}60%{clip-path:inset(70% 0 20% 0);transform:translateX(-3px)}}
        @keyframes ht_g2{0%,100%{clip-path:inset(75% 0 8% 0);transform:translateX(5px)}40%{clip-path:inset(20% 0 70% 0);transform:translateX(-5px)}70%{clip-path:inset(50% 0 40% 0);transform:translateX(3px)}}
      `}</style>
      {/* Main text */}
      <span style={{
        fontFamily:'Orbitron,monospace',
        fontSize:'clamp(2.6rem,9vw,6rem)',
        fontWeight:900,
        letterSpacing:'.1em',
        lineHeight:1,
        display:'block',
        backgroundImage:grad,
        WebkitBackgroundClip:'text',
        WebkitTextFillColor:'transparent',
        backgroundClip:'text',
        backgroundSize:'200% 200%',
        animation:'gradientShift 5s ease infinite',
      }}>{text}</span>
      {/* Glitch layers — dark only, absolutely positioned */}
      {glitching && !isL && (
        <>
          <span aria-hidden="true" style={{
            position:'absolute',top:0,left:0,
            fontFamily:'Orbitron,monospace',fontSize:'clamp(2.6rem,9vw,6rem)',fontWeight:900,letterSpacing:'.1em',lineHeight:1,
            backgroundImage:'linear-gradient(135deg,#ff2d78,#00e5ff,#7c6eff)',
            WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text',
            animation:'ht_g1 .2s steps(2) infinite', pointerEvents:'none',
          }}>{text}</span>
          <span aria-hidden="true" style={{
            position:'absolute',top:0,left:0,
            fontFamily:'Orbitron,monospace',fontSize:'clamp(2.6rem,9vw,6rem)',fontWeight:900,letterSpacing:'.1em',lineHeight:1,
            backgroundImage:'linear-gradient(135deg,#00e5ff,#bf5fff,#ff2d78)',
            WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text',
            animation:'ht_g2 .2s steps(2) infinite', pointerEvents:'none',
          }}>{text}</span>
        </>
      )}
    </div>
  );
}

/* ── Orbit rings ── */
function OrbitRings({ theme }) {
  const isL = theme === 'light';
  const rings = [
    { rx:105,ry:48,  dur:8,  r:2,  col: isL?'217,119,6':'0,229,255',   delay:'0s'  },
    { rx:58, ry:185, dur:13, r:1.5,col: isL?'124,58,237':'124,110,255', delay:'-5s' },
    { rx:165,ry:38,  dur:17, r:1,  col: isL?'190,24,93':'191,95,255',   delay:'-9s' },
    { rx:80, ry:160, dur:6,  r:2,  col: isL?'8,145,178':'0,255,157',    delay:'-2s' },
  ];
  const tilts = ['rotate(-22 250 250)','rotate(14 250 250)','rotate(55 250 250)','rotate(-35 250 250)'];
  return (
    <svg width="280" height="280" viewBox="0 0 500 500"
      style={{position:'absolute',top:'50%',left:'50%',transform:'translate(-50%,-50%)',pointerEvents:'none',zIndex:0}}>
      {rings.map((rg,i) => (
        <g key={i} transform={tilts[i]}>
          <ellipse cx="250" cy="250" rx={rg.rx} ry={rg.ry} fill="none"
            stroke={`rgba(${rg.col},.18)`} strokeWidth="1"/>
          <circle r={rg.r*3.5} fill={`rgba(${rg.col},.95)`}
            style={{filter:`drop-shadow(0 0 ${rg.r*5}px rgba(${rg.col},.9))`}}>
            <animateMotion dur={`${rg.dur}s`} repeatCount="indefinite" begin={rg.delay}>
              <mpath href={`#op${i}`}/>
            </animateMotion>
          </circle>
          <path id={`op${i}`} d={`M ${250-rg.rx} 250 a ${rg.rx} ${rg.ry} 0 1 1 ${rg.rx*2} 0 a ${rg.rx} ${rg.ry} 0 1 1 -${rg.rx*2} 0`} fill="none"/>
        </g>
      ))}
    </svg>
  );
}

/* ── Logo with 3D tilt ── */
function Logo3D({ mounted, theme }) {
  const ref = useRef(null);
  const isL = theme === 'light';
  const onMove = useCallback(e => {
    const el = ref.current; if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width/2, cy = rect.top + rect.height/2;
    const dx = (e.clientX - cx)/220, dy = (e.clientY - cy)/220;
    el.style.transform = `perspective(700px) rotateX(${-dy*16}deg) rotateY(${dx*16}deg) scale(1.04)`;
  }, []);
  const onLeave = useCallback(() => { if (ref.current) ref.current.style.transform = ''; }, []);

  return (
    <div ref={ref} onMouseMove={onMove} onMouseLeave={onLeave}
      style={{
        position:'relative', display:'inline-block', marginBottom:'28px',
        transformStyle:'preserve-3d', transition:'transform .14s ease',
        opacity:mounted?1:0, transform:mounted?'scale(1)':'scale(.3) rotateY(180deg)',
        transitionProperty:'opacity,transform', transitionDuration:'1.1s',
        transitionTimingFunction:'cubic-bezier(.34,1.56,.64,1)',
        width:'160px', height:'160px',
      }}>
      <OrbitRings theme={theme}/>
      <img
        src={nexasphereLogo}
        alt="NexaSphere"
        style={{
          position:'relative', zIndex:1,
          width:'110px', height:'110px', objectFit:'contain',
          margin:'25px auto 0', display:'block',
          /* KEY: screen blend removes black bg in dark; multiply in light */
          mixBlendMode: isL ? 'multiply' : 'screen',
          filter: isL
            ? 'drop-shadow(0 2px 14px rgba(0,0,0,.12)) saturate(1.2)'
            : 'drop-shadow(0 0 24px rgba(0,229,255,.5)) drop-shadow(0 0 48px rgba(124,110,255,.3)) brightness(1.3)',
          animation:'float 5s ease-in-out infinite',
        }}
      />
      <div style={{
        position:'absolute',bottom:'-10px',left:'50%',transform:'translateX(-50%)',
        width:'55px',height:'12px',borderRadius:'50%',
        background:`radial-gradient(ellipse,${isL?'rgba(0,0,0,.1)':'rgba(0,229,255,.18)'},transparent 70%)`,
        filter:'blur(4px)', animation:'float 5s ease-in-out infinite',
      }}/>
    </div>
  );
}

/* ── Floating hex shapes ── */
function HexBG({ theme }) {
  const isL = theme === 'light';
  const cols = isL ? ['#d97706','#7c3aed','#be185d'] : ['#00e5ff','#7c6eff','#bf5fff'];
  const hexes = [
    {s:88,t:'11%',l:'5%',d:'0s',dur:'10s'},{s:56,t:'68%',l:'3%',d:'-4s',dur:'13s'},
    {s:74,t:'18%',r:'4%',d:'-7s',dur:'9s'},{s:44,t:'74%',r:'6%',d:'-2s',dur:'12s'},
    {s:66,t:'84%',l:'20%',d:'-9s',dur:'14s'},{s:40,t:'7%',r:'22%',d:'-5s',dur:'8s'},
  ];
  return <>
    {hexes.map((h,i)=>(
      <div key={i} style={{
        position:'absolute',top:h.t,left:h.l,right:h.r,
        width:h.s,height:h.s*.866,
        background:cols[i%3],
        clipPath:'polygon(25% 0%,75% 0%,100% 50%,75% 100%,25% 100%,0% 50%)',
        opacity: isL ? .04 : .05,
        filter:`drop-shadow(0 0 ${h.s*.1}px ${cols[i%3]})`,
        animation:`float ${h.dur} ease-in-out infinite`,animationDelay:h.d,
        pointerEvents:'none',
      }}/>
    ))}
  </>;
}

/* ── Stats bar ── */
function Stats({ vis, theme }) {
  const isL = theme === 'light';
  const items = [{v:'12',l:'Members',i:'👥'},{v:'7',l:'Activities',i:'⚡'},{v:'1',l:'KSS Done',i:'🧠'},{v:'∞',l:'Ideas',i:'💡'}];
  return (
    <div style={{
      display:'flex',maxWidth:'520px',margin:'44px auto 0',
      background: isL ? 'rgba(28,25,23,.04)' : 'rgba(0,229,255,.03)',
      border: `1px solid ${isL?'rgba(28,25,23,.09)':'rgba(0,229,255,.09)'}`,
      borderRadius:'16px',overflow:'hidden',
      backdropFilter: isL ? 'none' : 'blur(12px)',
      opacity:vis?1:0,transform:vis?'none':'translateY(24px)',
      transition:'all .9s cubic-bezier(.22,1,.36,1)',transitionDelay:'.4s',
    }}>
      {items.map((s,i)=>(
        <div key={i} style={{
          flex:1,padding:'14px 8px',textAlign:'center',cursor:'default',
          borderRight:i<3?`1px solid ${isL?'rgba(28,25,23,.07)':'rgba(0,229,255,.08)'}`:'none',
          transition:'background .2s',
        }}
          onMouseEnter={e=>e.currentTarget.style.background=isL?'rgba(28,25,23,.06)':'rgba(0,229,255,.07)'}
          onMouseLeave={e=>e.currentTarget.style.background='transparent'}
        >
          <div style={{fontSize:'1rem',marginBottom:'2px'}}>{s.i}</div>
          <div style={{
            fontFamily:'Orbitron,monospace',fontSize:'clamp(1.1rem,3vw,1.8rem)',fontWeight:900,
            backgroundImage: isL?'linear-gradient(135deg,#d97706,#7c3aed)':'linear-gradient(135deg,#00e5ff,#7c6eff)',
            WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text',
            animation:vis?`countUp .55s ${.4+i*.1}s both`:'none',
          }}>{s.v}</div>
          <div style={{fontSize:'.62rem',color:'var(--t2)',textTransform:'uppercase',letterSpacing:'.1em',marginTop:'1px',fontFamily:"'Space Mono',monospace"}}>{s.l}</div>
        </div>
      ))}
    </div>
  );
}

export default function HeroSection({ onTabChange, theme = 'dark' }) {
  const [mounted, setMounted]   = useState(false);
  const [statsVis, setStatsVis] = useState(false);
  const isL = theme === 'light';

  useEffect(() => {
    const t1 = setTimeout(() => setMounted(true), 80);
    const t2 = setTimeout(() => setStatsVis(true), 900);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  return (
    <section className="hero-section" id="section-home">
      {/* BG image — very dark */}
      <div className="hero-bg" style={{backgroundImage:`url(${heroBg})`}}/>
      <div className="hero-overlay"/>

      {/* Dark-only atmosphere */}
      {!isL && (
        <div style={{position:'absolute',inset:0,overflow:'hidden',zIndex:0,pointerEvents:'none'}}>
          {Array.from({length:9},(_,i)=>(
            <div key={i} style={{
              position:'absolute',left:`${6+i*11}%`,top:0,
              fontFamily:"'Space Mono',monospace",fontSize:'9px',
              color:'var(--c1)',lineHeight:1.9,userSelect:'none',
              animation:`dataStream ${4.5+i*.7}s linear infinite`,
              animationDelay:`${-i*1.3}s`,opacity:.065,
            }}>
              {Array.from({length:28},()=>Math.random()>.5?'1':'0').join('\n')}
            </div>
          ))}
        </div>
      )}

      {/* Light-only soft pattern */}
      {isL && (
        <div style={{
          position:'absolute',inset:0,zIndex:0,pointerEvents:'none',
          backgroundImage:`radial-gradient(circle at 60% 40%, rgba(217,119,6,.05) 0%, transparent 60%),
                           radial-gradient(circle at 30% 70%, rgba(124,58,237,.04) 0%, transparent 50%)`,
        }}/>
      )}

      <HexBG theme={theme}/>

      {/* Scanline dark only */}
      {!isL && (
        <div style={{position:'absolute',inset:0,overflow:'hidden',zIndex:1,pointerEvents:'none'}}>
          <div style={{position:'absolute',left:0,right:0,height:'1.5px',background:'linear-gradient(90deg,transparent,rgba(0,229,255,.4),rgba(124,110,255,.4),transparent)',animation:'scanline 8s linear infinite'}}/>
          <div style={{position:'absolute',inset:0,backgroundImage:'repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,229,255,.005) 2px,rgba(0,229,255,.005) 4px)'}}/>
        </div>
      )}

      <div className="hero-content" style={{position:'relative',zIndex:2}}>
        <Logo3D mounted={mounted} theme={theme}/>

        <HeroTitle theme={theme}/>

        <p className="hero-tagline" style={{
          animationName:'letterDrop',animationDuration:'.8s',animationDelay:'.5s',
          animationFillMode:'both',animationTimingFunction:'cubic-bezier(.22,1,.36,1)',opacity:0,
          color: isL ? '#6b6660' : 'var(--t2)',
        }}>
          GL Bajaj&apos;s Student-Driven Tech Ecosystem
          <span style={{animation:'blink 1s step-end infinite',color:'var(--c1)',marginLeft:'2px'}}>_</span>
        </p>

        <div className="hero-buttons" style={{
          animationName:'letterDrop',animationDuration:'.8s',animationDelay:'.8s',
          animationFillMode:'both',animationTimingFunction:'cubic-bezier(.22,1,.36,1)',opacity:0,
        }}>
          <RippleBtn cls="btn-primary" href={WHATSAPP}>💬 Join Community</RippleBtn>
          <RippleBtn cls="btn-outline" onClick={()=>onTabChange('Team')}>👥 Core Team</RippleBtn>
        </div>

        <Stats vis={statsVis} theme={theme}/>
      </div>

      {/* Bottom gradient fade into page bg */}
      <div style={{position:'absolute',bottom:0,left:0,right:0,height:'160px',background:'linear-gradient(to bottom,transparent,var(--bg))',pointerEvents:'none',zIndex:2}}/>

      <div style={{position:'absolute',bottom:'24px',left:'50%',transform:'translateX(-50%)',zIndex:3,display:'flex',flexDirection:'column',alignItems:'center',gap:'5px',opacity:.4,animation:'float 2.5s ease-in-out infinite'}}>
        <div style={{fontSize:'.58rem',color:isL?'#9ca3af':'var(--t3)',letterSpacing:'.22em',fontFamily:"'Space Mono',monospace"}}>SCROLL</div>
        <div style={{width:'1px',height:'32px',background:`linear-gradient(to bottom,${isL?'#d97706':'var(--c1)'},transparent)`}}/>
      </div>
    </section>
  );
}
