import { useState, useEffect, useRef, useCallback } from 'react';
import './styles/globals.css';
import './styles/animations.css';
import './styles/components.css';

import ParticleBackground  from './components/ParticleBackground';
import Navbar              from './components/Navbar';
import HeroSection         from './components/HeroSection';
import ActivitiesSection   from './components/ActivitiesSection';
import EventsSection       from './components/EventsSection';
import AboutSection        from './components/AboutSection';
import TeamSection         from './components/TeamSection';
import Footer              from './components/Footer';
import ActivityDetailPage  from './components/ActivityDetailPage';
import EventDetailPage     from './components/EventDetailPage';
import CinematicOpening    from './components/CinematicOpening';

import { activityPages }   from './data/activities/index';
import nexasphereLogo      from './assets/images/logos/nexasphere-logo.png';

const MNH = 88, DNH = 64;
const TABS = ['Home','Activities','Events','About','Team'];

/* ── Page wipe transition ── */
function Wipe({ on, ph }) {
  if (!on) return null;
  return (
    <>
      <div style={{position:'fixed',inset:0,zIndex:8000,background:'var(--bg)',animation:`${ph==='out'?'wipeDown .27s':'wipeUp .30s'} cubic-bezier(.77,0,.18,1) forwards`,pointerEvents:'all'}}/>
      <div style={{position:'fixed',inset:0,zIndex:8001,background:'linear-gradient(90deg,var(--c1),var(--c2),var(--c3))',opacity:.07,animation:`${ph==='out'?'wipeDown .20s .04s':'wipeUp .24s .04s'} cubic-bezier(.77,0,.18,1) forwards`,pointerEvents:'none'}}/>
      {ph==='out'&&<div style={{position:'fixed',top:'50%',left:'50%',transform:'translate(-50%,-50%)',zIndex:8002,pointerEvents:'none',opacity:0,animation:'splashIn .16s .1s ease forwards'}}>
        <img src={nexasphereLogo} style={{height:'46px',mixBlendMode:'screen',filter:'drop-shadow(0 0 12px var(--c1))',opacity:.6}} alt=""/>
      </div>}
    </>
  );
}

/* ── Page enter animation ── */
function PageIn({ children, k }) {
  const [r, setR] = useState(false);
  useEffect(()=>{ const raf=requestAnimationFrame(()=>setR(true)); return()=>cancelAnimationFrame(raf); },[k]);
  return (
    <div style={{opacity:r?1:0,transform:r?'none':'translateY(16px) scale(.99)',transition:'opacity .42s cubic-bezier(.22,1,.36,1),transform .42s cubic-bezier(.22,1,.36,1)',willChange:'opacity,transform'}}>
      {children}
    </div>
  );
}

/* ── Dual cursor ── */
function Cursor() {
  const blob=useRef(null), dot=useRef(null);
  useEffect(()=>{
    if(window.matchMedia('(hover:none)').matches)return;
    let x=0,y=0,tx=0,ty=0,raf;
    const mv=e=>{tx=e.clientX;ty=e.clientY;};
    const tick=()=>{
      x+=(tx-x)*.09;y+=(ty-y)*.09;
      if(blob.current){blob.current.style.left=x+'px';blob.current.style.top=y+'px';}
      if(dot.current) {dot.current.style.left=tx+'px';dot.current.style.top=ty+'px';}
      raf=requestAnimationFrame(tick);
    };
    window.addEventListener('mousemove',mv,{passive:true});
    raf=requestAnimationFrame(tick);
    return()=>{window.removeEventListener('mousemove',mv);cancelAnimationFrame(raf);};
  },[]);
  return (
    <>
      <div ref={blob} style={{position:'fixed',pointerEvents:'none',zIndex:0,width:'380px',height:'380px',borderRadius:'50%',background:'radial-gradient(circle,rgba(0,212,255,.03) 0%,transparent 70%)',transform:'translate(-50%,-50%)'}}/>
      <div ref={dot}  style={{position:'fixed',pointerEvents:'none',zIndex:1,width:'5px',height:'5px',borderRadius:'50%',background:'var(--c1)',opacity:.8,transform:'translate(-50%,-50%)',boxShadow:'0 0 8px rgba(0,212,255,.85)'}}/>
    </>
  );
}

export default function App() {
  const [cinDone,  setCinDone]  = useState(false);
  const [activeTab,setActiveTab]= useState('Home');
  const [mobile,   setMobile]   = useState(window.innerWidth<=768);
  const [wipeOn,   setWipeOn]   = useState(false);
  const [wipePh,   setWipePh]   = useState('out');
  const [page,     setPage]     = useState(null); // null=main, {type,activityKey,event}
  const [theme,    setTheme]    = useState(()=>localStorage.getItem('ns-theme')||'dark');

  // Apply theme to html element
  useEffect(()=>{
    document.documentElement.setAttribute('data-theme',theme);
    localStorage.setItem('ns-theme',theme);
  },[theme]);

  // Scroll progress bar
  useEffect(()=>{
    const bar=document.getElementById('scroll-progress');
    if(!bar)return;
    let ticking=false;
    const fn=()=>{
      if(!ticking){requestAnimationFrame(()=>{
        const s=window.scrollY,d=document.documentElement.scrollHeight-window.innerHeight;
        bar.style.width=d>0?`${(s/d)*100}%`:'0%';
        ticking=false;
      });ticking=true;}
    };
    window.addEventListener('scroll',fn,{passive:true});
    return()=>window.removeEventListener('scroll',fn);
  },[]);

  // Back to top button
  useEffect(()=>{
    const btn=document.getElementById('back-to-top');
    if(!btn)return;
    const fn=()=>btn.classList.toggle('visible',window.scrollY>400);
    window.addEventListener('scroll',fn,{passive:true});
    btn.addEventListener('click',()=>window.scrollTo({top:0,behavior:'smooth'}));
    return()=>window.removeEventListener('scroll',fn);
  },[]);

  // Active tab highlight from scroll
  useEffect(()=>{
    if(page)return;
    const nh=mobile?MNH:DNH;
    const fn=()=>{
      const sy=window.scrollY+nh+30;
      for(let i=TABS.length-1;i>=0;i--){
        const el=document.getElementById(`section-${TABS[i].toLowerCase()}`);
        if(el&&el.offsetTop<=sy){setActiveTab(TABS[i]);break;}
      }
    };
    window.addEventListener('scroll',fn,{passive:true});
    return()=>window.removeEventListener('scroll',fn);
  },[mobile,page]);

  // Resize
  useEffect(()=>{
    const fn=()=>setMobile(window.innerWidth<=768);
    window.addEventListener('resize',fn,{passive:true});
    return()=>window.removeEventListener('resize',fn);
  },[]);

  // Scroll reveal + cinematic pop + magnetic buttons
  useEffect(()=>{
    if(!cinDone)return;
    // Pop observer
    const obs=new IntersectionObserver(entries=>{
      entries.forEach(e=>{
        if(e.isIntersecting){e.target.classList.add('fired');obs.unobserve(e.target);}
      });
    },{threshold:.09,rootMargin:'0px 0px -36px 0px'});
    document.querySelectorAll('.pop-in,.pop-left,.pop-right,.pop-scale,.pop-flip,.pop-word,.pop-num').forEach(el=>obs.observe(el));
    // Magnetic buttons
    const btns=document.querySelectorAll('.mag-btn');
    const onMove=e=>{
      btns.forEach(btn=>{
        const rect=btn.getBoundingClientRect();
        const dx=e.clientX-(rect.left+rect.width/2);
        const dy=e.clientY-(rect.top+rect.height/2);
        const d=Math.sqrt(dx*dx+dy*dy);
        btn.style.transform=d<88?`translate(${dx*(88-d)/88*.32}px,${dy*(88-d)/88*.32}px)`:'';
      });
    };
    window.addEventListener('mousemove',onMove,{passive:true});
    return()=>{obs.disconnect();window.removeEventListener('mousemove',onMove);};
  },[cinDone,page]);

  // Navigation with wipe transition
  const nav=useCallback((fn)=>{
    setWipeOn(true);setWipePh('out');
    setTimeout(()=>{
      fn();window.scrollTo({top:0});
      requestAnimationFrame(()=>{
        setWipePh('in');
        setTimeout(()=>setWipeOn(false),340);
      });
    },275);
  },[]);

  const onTab=useCallback(tab=>{
    nav(()=>{
      setPage(null);setActiveTab(tab);
      setTimeout(()=>{
        const el=document.getElementById(`section-${tab.toLowerCase()}`);
        if(!el)return;
        window.scrollTo({top:el.offsetTop-(mobile?MNH:DNH),behavior:'smooth'});
      },50);
    });
  },[nav,mobile]);

  const onNavigate=useCallback((type,title)=>{
    if(type==='activity') nav(()=>setPage({type:'activity',activityKey:title}));
  },[nav]);

  const onEvent=useCallback(ev=>{
    nav(()=>setPage(p=>({...p,type:'event',event:ev})));
  },[nav]);

  const onBackAct=useCallback(()=>{
    nav(()=>setPage(p=>({type:'activity',activityKey:p.activityKey})));
  },[nav]);

  const onBackMain=useCallback(()=>{
    nav(()=>{
      setPage(null);
      setTimeout(()=>{
        const el=document.getElementById('section-activities');
        if(!el)return;
        window.scrollTo({top:el.offsetTop-(mobile?MNH:DNH),behavior:'smooth'});
      },50);
    });
  },[nav,mobile]);

  const nh=mobile?MNH:DNH;
  const cur=page?.activityKey?activityPages[page.activityKey]:null;

  return (
    <>
      {/* Cinematic opening — plays once on load */}
      {!cinDone&&<CinematicOpening theme={theme} onDone={()=>setCinDone(true)}/>}

      <div id="scroll-progress"/>
      <Cursor/>
      <Wipe on={wipeOn} ph={wipePh}/>

      {/* Theme toggle */}
      <button id="theme-toggle" className="mag-btn"
        onClick={()=>setTheme(t=>t==='dark'?'light':'dark')}
        aria-label="Toggle theme" title={`Switch to ${theme==='dark'?'light':'dark'} mode`}>
        {theme==='dark'?'☀️':'🌙'}
      </button>

      {cinDone&&<ParticleBackground theme={theme}/>}
      <Navbar activeTab={activeTab} onTabChange={onTab}/>

      <main style={{paddingTop:nh,position:'relative',zIndex:1}}>
        {page?.type==='activity'&&cur&&(
          <PageIn k={`a-${page.activityKey}`}>
            <ActivityDetailPage activity={cur} onBack={onBackMain} onSelectEvent={onEvent}/>
          </PageIn>
        )}
        {page?.type==='event'&&page.event&&cur&&(
          <PageIn k={`e-${page.event?.id}`}>
            <EventDetailPage event={page.event} activityColor={cur.color} activityIcon={cur.icon} onBack={onBackAct}/>
          </PageIn>
        )}
        {!page&&(
          <PageIn k="main">
            <HeroSection onTabChange={onTab} theme={theme}/>
            <ActivitiesSection onNavigate={onNavigate}/>
            <EventsSection/>
            <AboutSection/>
            <TeamSection/>
            <Footer/>
          </PageIn>
        )}
      </main>

      <button id="back-to-top" aria-label="Back to top">↑</button>
    </>
  );
}
