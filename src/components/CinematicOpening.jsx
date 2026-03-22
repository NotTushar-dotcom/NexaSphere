import { useEffect, useRef, useState } from 'react';
import nexasphereLogo from '../assets/images/logos/nexasphere-logo.png';

export default function CinematicOpening({ onDone, theme = 'dark' }) {
  const [phase,   setPhase]   = useState(0); // 0=init 1=logo 2=title 3=tag 4=exit 5=gone
  const [count,   setCount]   = useState(0); // how many letters shown
  const [tagline, setTagline] = useState(false);
  const [exiting, setExiting] = useState(false);
  const countRef = useRef(0);

  const WORD = 'NEXASPHERE';
  const isL = theme === 'light';

  useEffect(() => {
    const ts = [];
    // 0 → 1 : flash logo in
    ts.push(setTimeout(() => setPhase(1), 300));
    // 1 → 2 : start typing letters
    ts.push(setTimeout(() => {
      setPhase(2);
      const iv = setInterval(() => {
        countRef.current += 1;
        setCount(countRef.current);
        if (countRef.current >= WORD.length) clearInterval(iv);
      }, 75);
      ts.push(iv); // so we can clear if unmounted
    }, 700));
    // 3 : tagline
    ts.push(setTimeout(() => setTagline(true), 1750));
    // 4 : begin exit
    ts.push(setTimeout(() => setExiting(true), 2700));
    // 5 : done
    ts.push(setTimeout(() => onDone(), 3350));
    return () => ts.forEach(t => { clearTimeout(t); clearInterval(t); });
  }, []);

  if (phase === 5) return null;

  const bg     = isL ? '#faf8f5' : '#020408';
  const accent = isL ? '#d97706' : '#00e5ff';
  const accent2= isL ? '#7c3aed' : '#7c6eff';
  const muted  = isL ? '#9ca3af' : '#4a5568';

  return (
    <>
      <style>{`
        @keyframes cinLetterIn {
          from { opacity:0; transform:translateY(-60px) rotateX(90deg) scale(.5); }
          to   { opacity:1; transform:none; }
        }
        @keyframes cinLogoIn {
          from { opacity:0; transform:scale(.4) translateY(-30px); }
          to   { opacity:1; transform:none; }
        }
        @keyframes cinTagIn {
          from { opacity:0; transform:translateY(16px); }
          to   { opacity:1; transform:none; }
        }
        @keyframes cinGlow {
          0%,100% { opacity:.4; }
          50%      { opacity:.9; }
        }
        @keyframes cinProg {
          from { transform:scaleX(0); }
          to   { transform:scaleX(1); }
        }
        @keyframes cinBracket {
          from { opacity:0; transform:scale(1.3); }
          to   { opacity:.55; transform:none; }
        }
        @keyframes cinExit {
          from { transform:translateY(0); opacity:1; }
          to   { transform:translateY(-100%); opacity:.8; }
        }
      `}</style>

      <div style={{
        position:'fixed', inset:0, zIndex:9999,
        background:bg,
        display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
        overflow:'hidden',
        animation: exiting ? 'cinExit .65s cubic-bezier(.77,0,.18,1) forwards' : 'none',
      }}>

        {/* Grid bg - dark only */}
        {!isL && <div style={{
          position:'absolute', inset:0, pointerEvents:'none',
          backgroundImage:`linear-gradient(rgba(0,229,255,.025) 1px,transparent 1px),linear-gradient(90deg,rgba(0,229,255,.025) 1px,transparent 1px)`,
          backgroundSize:'52px 52px',
        }}/>}

        {/* Radial glow */}
        <div style={{
          position:'absolute', top:'50%', left:'50%',
          transform:'translate(-50%,-60%)',
          width:'560px', height:'560px', borderRadius:'50%',
          background:`radial-gradient(circle,${isL?'rgba(217,119,6,.07)':'rgba(0,229,255,.07)'} 0%,transparent 70%)`,
          pointerEvents:'none',
          animation:'cinGlow 3s ease-in-out infinite',
        }}/>

        {/* Corner brackets */}
        {[
          { t:28, l:28, bt:true,  bl:true  },
          { t:28, r:28, bt:true,  br:true  },
          { b:28, l:28, bb:true,  bl:true  },
          { b:28, r:28, bb:true,  br:true  },
        ].map((c,i) => (
          <div key={i} style={{
            position:'absolute',
            ...(c.t!==undefined?{top:c.t}:{}),
            ...(c.b!==undefined?{bottom:c.b}:{}),
            ...(c.l!==undefined?{left:c.l}:{}),
            ...(c.r!==undefined?{right:c.r}:{}),
            width:30, height:30,
            borderTop:    c.bt ? `1.5px solid ${accent}` : 'none',
            borderBottom: c.bb ? `1.5px solid ${accent}` : 'none',
            borderLeft:   c.bl ? `1.5px solid ${accent}` : 'none',
            borderRight:  c.br ? `1.5px solid ${accent}` : 'none',
            opacity: phase >= 1 ? .55 : 0,
            transition:'opacity .6s ease',
            transitionDelay:`${i*.08}s`,
          }}/>
        ))}

        {/* Scanline - dark only */}
        {!isL && <div style={{
          position:'absolute', left:0, right:0, height:'1px',
          background:`linear-gradient(90deg,transparent,${accent},transparent)`,
          opacity:.2, animation:'cinProg 2.4s ease forwards',
          top:'50%',
        }}/>}

        {/* Logo */}
        <div style={{
          marginBottom:'22px',
          opacity: phase >= 1 ? 1 : 0,
          animation: phase >= 1 ? 'cinLogoIn .8s cubic-bezier(.34,1.56,.64,1) both' : 'none',
        }}>
          <img
            src={nexasphereLogo}
            alt="NexaSphere"
            style={{
              width:'78px', height:'78px',
              objectFit:'contain',
              mixBlendMode: isL ? 'multiply' : 'luminosity',
              filter: isL
                ? 'drop-shadow(0 2px 12px rgba(0,0,0,.15))'
                : 'drop-shadow(0 0 20px rgba(0,229,255,.7)) drop-shadow(0 0 40px rgba(124,110,255,.4)) brightness(1.4) contrast(1.1)',
              animation: phase >= 1 ? 'float 3s ease-in-out infinite' : 'none',
            }}
          />
        </div>

        {/* Title — letter by letter */}
        <div style={{
          display:'flex', gap:'2px', alignItems:'center',
          height:'1.3em', overflow:'visible',
          marginBottom:'14px',
          fontFamily:'Orbitron,monospace',
          fontSize:'clamp(2.2rem,6vw,4.5rem)',
          fontWeight:900,
          letterSpacing:'.15em',
          perspective:'600px',
        }}>
          {WORD.split('').map((ch, i) => (
            <span
              key={i}
              style={{
                display: i < count ? 'inline-block' : 'none',
                color: 'transparent',
                backgroundImage: isL
                  ? 'linear-gradient(135deg,#d97706 0%,#7c3aed 50%,#be185d 100%)'
                  : 'linear-gradient(135deg,#00e5ff 0%,#7c6eff 50%,#bf5fff 100%)',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                animation: 'cinLetterIn .5s cubic-bezier(.22,1,.36,1) both',
                animationDelay: '0s',
                textShadow: 'none',
              }}
            >{ch}</span>
          ))}
          {/* blinking cursor while typing */}
          {count < WORD.length && phase >= 2 && (
            <span style={{
              display:'inline-block', width:'3px', height:'.8em',
              background:accent, borderRadius:'1px',
              animation:'blink .55s step-end infinite', alignSelf:'center',
            }}/>
          )}
        </div>

        {/* Tagline */}
        <div style={{
          fontFamily:"'Space Mono',monospace",
          fontSize:'.68rem',
          letterSpacing:'.3em',
          textTransform:'uppercase',
          color: muted,
          opacity: tagline ? 1 : 0,
          transform: tagline ? 'none' : 'translateY(12px)',
          transition:'opacity .6s ease, transform .6s ease',
          marginBottom:'4px',
        }}>
          GL Bajaj Group of Institutions · Mathura
        </div>

        {/* Powered by */}
        <div style={{
          position:'absolute', bottom:18,
          fontFamily:"'Space Mono',monospace",
          fontSize:'.5rem', letterSpacing:'.22em',
          textTransform:'uppercase', color:muted,
          opacity: tagline ? .5 : 0,
          transition:'opacity .5s .4s',
        }}>
          POWERED BY REACT + VITE
        </div>

        {/* Progress bar */}
        <div style={{
          position:'absolute', bottom:0, left:0, right:0, height:'2px',
          background:`linear-gradient(90deg,${accent},${accent2})`,
          transformOrigin:'left',
          animation:'cinProg 2.5s ease-out forwards',
        }}/>

      </div>
    </>
  );
}
