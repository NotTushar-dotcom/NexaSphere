import { useEffect, useRef, useState } from 'react';
import nexasphereLogo from '../assets/images/logos/nexasphere-logo.png';

export default function CinematicOpening({ onDone, theme = 'dark' }) {
  const [phase,   setPhase]   = useState(0);
  const [count,   setCount]   = useState(0);
  const [tagline, setTagline] = useState(false);
  const [exiting, setExiting] = useState(false);
  const countRef = useRef(0);
  const ivRef    = useRef(null);

  const WORD = 'NEXASPHERE';
  const isL  = theme === 'light';

  useEffect(() => {
    const ts = [];
    ts.push(setTimeout(()=>setPhase(1), 280));
    ts.push(setTimeout(()=>{
      setPhase(2);
      ivRef.current = setInterval(()=>{
        countRef.current += 1;
        setCount(countRef.current);
        if (countRef.current >= WORD.length) clearInterval(ivRef.current);
      }, 70);
    }, 650));
    ts.push(setTimeout(()=>setTagline(true), 1680));
    ts.push(setTimeout(()=>setExiting(true), 2600));
    ts.push(setTimeout(()=>onDone(), 3200));
    return ()=>{ ts.forEach(t=>clearTimeout(t)); clearInterval(ivRef.current); };
  }, []);

  const bg     = isL ? '#faf8f5' : '#020509';
  const accent  = isL ? '#c2770a' : '#00d4ff';
  const accent2 = isL ? '#6d28d9' : '#7b6fff';
  const muted   = isL ? '#a8a29e' : '#3d4f6e';

  const grad = isL
    ? 'linear-gradient(135deg,#c2770a 0%,#6d28d9 50%,#be185d 100%)'
    : 'linear-gradient(135deg,#00d4ff 0%,#7b6fff 50%,#bd5cff 100%)';

  return (
    <>
      <style>{`
        @keyframes cinLetterIn{from{opacity:0;transform:translateY(-55px) rotateX(90deg) scale(.5)}to{opacity:1;transform:none}}
        @keyframes cinLogoIn  {from{opacity:0;transform:scale(.35) translateY(-22px)}to{opacity:1;transform:none}}
        @keyframes cinGlow    {0%,100%{opacity:.3}50%{opacity:.8}}
        @keyframes cinProg    {from{transform:scaleX(0)}to{transform:scaleX(1)}}
        @keyframes cinExit    {from{transform:translateY(0);opacity:1}to{transform:translateY(-100%);opacity:.7}}
      `}</style>
      <div style={{
        position:'fixed',inset:0,zIndex:9999,background:bg,
        display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',
        overflow:'hidden',
        animation:exiting?'cinExit .62s cubic-bezier(.77,0,.18,1) forwards':'none',
      }}>
        {/* Grid — dark only */}
        {!isL&&<div style={{position:'absolute',inset:0,pointerEvents:'none',backgroundImage:`linear-gradient(rgba(0,212,255,.025) 1px,transparent 1px),linear-gradient(90deg,rgba(0,212,255,.025) 1px,transparent 1px)`,backgroundSize:'50px 50px'}}/>}

        {/* Ambient glow */}
        <div style={{position:'absolute',top:'50%',left:'50%',transform:'translate(-50%,-58%)',width:'520px',height:'520px',borderRadius:'50%',background:`radial-gradient(circle,${isL?'rgba(194,119,10,.07)':'rgba(0,212,255,.07)'} 0%,transparent 70%)`,pointerEvents:'none',animation:'cinGlow 3s ease-in-out infinite'}}/>

        {/* Corner brackets */}
        {[{t:26,l:26,bt:true,bl:true},{t:26,r:26,bt:true,br:true},{b:26,l:26,bb:true,bl:true},{b:26,r:26,bb:true,br:true}].map((c,i)=>(
          <div key={i} style={{
            position:'absolute',
            ...(c.t!==undefined?{top:c.t}:{}), ...(c.b!==undefined?{bottom:c.b}:{}),
            ...(c.l!==undefined?{left:c.l}:{}), ...(c.r!==undefined?{right:c.r}:{}),
            width:28,height:28,
            borderTop:    c.bt?`1.5px solid ${accent}`:'none',
            borderBottom: c.bb?`1.5px solid ${accent}`:'none',
            borderLeft:   c.bl?`1.5px solid ${accent}`:'none',
            borderRight:  c.br?`1.5px solid ${accent}`:'none',
            opacity:phase>=1?.55:0,
            transition:'opacity .5s ease',transitionDelay:`${i*.07}s`,
          }}/>
        ))}

        {/* Logo */}
        <div style={{marginBottom:'20px',opacity:phase>=1?1:0,animation:phase>=1?'cinLogoIn .75s cubic-bezier(.34,1.56,.64,1) both':'none'}}>
          <img src={nexasphereLogo} alt="NexaSphere" style={{
            width:'72px',height:'72px',objectFit:'contain',
            mixBlendMode:isL?'multiply':'luminosity',
            filter:isL
              ?'drop-shadow(0 2px 10px rgba(0,0,0,.14))'
              :'drop-shadow(0 0 18px rgba(0,212,255,.7)) drop-shadow(0 0 36px rgba(123,111,255,.4)) brightness(1.35)',
            animation:phase>=1?'float 3s ease-in-out infinite':'none',
          }}/>
        </div>

        {/* Letter-drop title */}
        <div style={{
          display:'flex',gap:'1px',alignItems:'center',height:'1.25em',overflow:'visible',
          marginBottom:'13px',perspective:'600px',
          fontFamily:'Orbitron,monospace',
          fontSize:'clamp(2rem,6vw,4.2rem)',
          fontWeight:900,letterSpacing:'.15em',
        }}>
          {WORD.split('').map((ch,i)=>(
            <span key={i} style={{
              display:i<count?'inline-block':'none',
              backgroundImage:grad,
              WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text',
              color:'transparent',
              animation:'cinLetterIn .48s cubic-bezier(.22,1,.36,1) both',
            }}>{ch}</span>
          ))}
          {count<WORD.length&&phase>=2&&(
            <span style={{display:'inline-block',width:'2.5px',height:'.78em',background:accent,borderRadius:'1px',animation:'blink .5s step-end infinite',alignSelf:'center'}}/>
          )}
        </div>

        {/* Tagline */}
        <div style={{fontFamily:"'Space Mono',monospace",fontSize:'.65rem',letterSpacing:'.28em',textTransform:'uppercase',color:muted,opacity:tagline?1:0,transform:tagline?'none':'translateY(10px)',transition:'all .55s ease',marginBottom:'4px'}}>
          GL Bajaj Group of Institutions · Mathura
        </div>

        <div style={{position:'absolute',bottom:16,fontFamily:"'Space Mono',monospace",fontSize:'.48rem',letterSpacing:'.2em',textTransform:'uppercase',color:muted,opacity:tagline?.45:0,transition:'opacity .5s .35s'}}>
          POWERED BY REACT + VITE
        </div>

        {/* Progress bar */}
        <div style={{position:'absolute',bottom:0,left:0,right:0,height:'2px',background:`linear-gradient(90deg,${accent},${accent2})`,transformOrigin:'left',animation:'cinProg 2.4s ease-out forwards'}}/>
      </div>
    </>
  );
}
