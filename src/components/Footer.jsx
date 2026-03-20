import nexasphereLogo from '../assets/images/logos/nexasphere-logo.png';
import glbajajLogo    from '../assets/images/logos/glbajaj-logo.png';

export default function Footer() {
  return (
    <footer className="ns-footer">
      <div className="container">
        <div className="ns-footer-inner">
          <div style={{width:'100%',height:'1px',background:'linear-gradient(90deg,transparent,rgba(0,229,255,.25),rgba(124,110,255,.25),transparent)',marginBottom:'20px'}}/>
          <div className="ns-footer-logos">
            <img src={nexasphereLogo} alt="NexaSphere" className="ns-footer-logo"/>
            <div style={{width:1,height:26,background:'var(--bdr2)'}}/>
            <img src={glbajajLogo} alt="GL Bajaj" className="ns-footer-logo"/>
          </div>
          <p className="ns-footer-text">© {new Date().getFullYear()} <span>NexaSphere</span> — GL Bajaj Group of Institutions, Mathura</p>
          <p className="ns-footer-text" style={{fontSize:'.74rem',opacity:.6}}>Built with ❤️ by the NexaSphere Core Team · Proposed by Tanishk Bansal &amp; Ayush Sharma</p>
          <div style={{fontFamily:"'Space Mono',monospace",fontSize:'.58rem',color:'rgba(0,229,255,.18)',letterSpacing:'.22em',marginTop:'6px'}}>REACT + VITE + NETLIFY · v3.0</div>
        </div>
      </div>
    </footer>
  );
}
