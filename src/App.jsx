import { useState, useEffect, useRef } from 'react';
import './styles/globals.css';
import './styles/animations.css';
import './styles/components.css';

import ParticleBackground from './components/ParticleBackground';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import ActivitiesSection from './components/ActivitiesSection';
import EventsSection from './components/EventsSection';
import AboutSection from './components/AboutSection';
import TeamSection from './components/TeamSection';
import Footer from './components/Footer';
import InsightSessionsPage from './components/InsightSessionsPage';
import KSSDetailPage from './components/KSSDetailPage';

import nexasphereLogo from './assets/images/logos/nexasphere-logo.png';

const MOBILE_NAV_HEIGHT = 88;
const DESKTOP_NAV_HEIGHT = 64;
const SECTIONS = ['Home', 'Activities', 'Events', 'About', 'Team'];

export default function App() {
  const [splashDone, setSplashDone] = useState(false);
  const [splashFading, setSplashFading] = useState(false);
  const [activeTab, setActiveTab] = useState('Home');
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [subPage, setSubPage] = useState(null);       // 'insight-sessions' | null
  const [selectedSession, setSelectedSession] = useState(null); // session object | null
  const cursorRef = useRef(null);

  // ── Splash Screen ──
  useEffect(() => {
    const t1 = setTimeout(() => setSplashFading(true), 1400);
    const t2 = setTimeout(() => setSplashDone(true), 1900);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  // ── Scroll Progress Bar ──
  useEffect(() => {
    const bar = document.getElementById('scroll-progress');
    if (!bar) return;
    const update = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.width = docHeight > 0 ? `${(scrollTop / docHeight) * 100}%` : '0%';
    };
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, []);

  // ── Back-to-Top ──
  useEffect(() => {
    const btn = document.getElementById('back-to-top');
    if (!btn) return;
    const toggle = () => btn.classList.toggle('visible', window.scrollY > 400);
    window.addEventListener('scroll', toggle, { passive: true });
    btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    return () => window.removeEventListener('scroll', toggle);
  }, []);

  // ── Cursor Glow ──
  useEffect(() => {
    const glow = cursorRef.current;
    if (!glow) return;
    const move = (e) => {
      glow.style.left = e.clientX + 'px';
      glow.style.top = e.clientY + 'px';
    };
    window.addEventListener('mousemove', move);
    return () => window.removeEventListener('mousemove', move);
  }, []);

  // ── Active tab from scroll (only on main page) ──
  useEffect(() => {
    if (subPage) return;
    const navH = isMobile ? MOBILE_NAV_HEIGHT : DESKTOP_NAV_HEIGHT;
    const onScroll = () => {
      const scrollY = window.scrollY + navH + 32;
      for (let i = SECTIONS.length - 1; i >= 0; i--) {
        const el = document.getElementById(`section-${SECTIONS[i].toLowerCase()}`);
        if (el && el.offsetTop <= scrollY) {
          setActiveTab(SECTIONS[i]);
          break;
        }
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [isMobile, subPage]);

  // ── Resize ──
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // ── Tab navigation ──
  const handleTabChange = (tab) => {
    // If on a sub-page, go back to main first
    if (subPage) {
      setSubPage(null);
      setSelectedSession(null);
    }
    setActiveTab(tab);
    setTimeout(() => {
      const el = document.getElementById(`section-${tab.toLowerCase()}`);
      if (!el) return;
      const navH = isMobile ? MOBILE_NAV_HEIGHT : DESKTOP_NAV_HEIGHT;
      window.scrollTo({ top: el.offsetTop - navH, behavior: 'smooth' });
    }, 50);
  };

  // ── Sub-page navigation ──
  const handleNavigate = (page) => {
    setSubPage(page);
    setSelectedSession(null);
    window.scrollTo({ top: 0 });
  };

  const handleSelectSession = (session) => {
    setSelectedSession(session);
    window.scrollTo({ top: 0 });
  };

  const handleBackToInsight = () => {
    setSelectedSession(null);
    window.scrollTo({ top: 0 });
  };

  const handleBackToMain = () => {
    setSubPage(null);
    setSelectedSession(null);
    // Scroll back to activities section
    setTimeout(() => {
      const el = document.getElementById('section-activities');
      if (!el) return;
      const navH = isMobile ? MOBILE_NAV_HEIGHT : DESKTOP_NAV_HEIGHT;
      window.scrollTo({ top: el.offsetTop - navH, behavior: 'smooth' });
    }, 50);
  };

  // ── Global scroll reveal ──
  useEffect(() => {
    if (!splashDone) return;
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('visible'); }),
      { threshold: 0.1 }
    );
    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [splashDone, subPage]);

  const navH = isMobile ? MOBILE_NAV_HEIGHT : DESKTOP_NAV_HEIGHT;

  return (
    <>
      <div id="scroll-progress" />
      <div id="cursor-glow" ref={cursorRef} />

      {/* Splash Screen */}
      {!splashDone && (
        <div className={`splash-screen${splashFading ? ' fade-out' : ''}`}>
          <img src={nexasphereLogo} alt="NexaSphere" className="splash-logo" />
          <div className="splash-brand animated-gradient-text">NexaSphere</div>
          <div className="splash-spinner" />
        </div>
      )}

      <ParticleBackground />
      <Navbar activeTab={activeTab} onTabChange={handleTabChange} />

      <main style={{ paddingTop: navH, position: 'relative', zIndex: 1 }}>

        {/* ── Sub Pages ── */}
        {subPage === 'insight-sessions' && !selectedSession && (
          <InsightSessionsPage
            onSelectSession={handleSelectSession}
            onBack={handleBackToMain}
          />
        )}

        {subPage === 'insight-sessions' && selectedSession && (
          <KSSDetailPage
            session={selectedSession}
            onBack={handleBackToInsight}
          />
        )}

        {/* ── Main Page ── */}
        {!subPage && (
          <>
            <HeroSection onTabChange={handleTabChange} />
            <ActivitiesSection onNavigate={handleNavigate} />
            <EventsSection />
            <AboutSection />
            <TeamSection />
            <Footer />
          </>
        )}
      </main>

      <button id="back-to-top" aria-label="Back to top">↑</button>
    </>
  );
}
