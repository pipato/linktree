import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Mail, Disc, Instagram, Globe, Heart } from 'lucide-react';

export default function TwilightMatrixLinktree() {
  const canvasRef = useRef(null);
  
  const [stars, setStars] = useState([]);
  const [particles, setParticles] = useState([]);
  const [glitchActive, setGlitchActive] = useState(false);
  const [skyGlitch, setSkyGlitch] = useState(false);
  const [glitchType, setGlitchType] = useState('normal');
  const [hoveredIndex, setHoveredIndex] = useState(null);

  // Dense stars, particles, shooting stars
  useEffect(() => {
    const starCount = 1200;
    const generatedStars = Array.from({ length: starCount }).map((_, i) => ({
      id: i,
      top: Math.random() * 100,
      left: Math.random() * 100,
      size: Math.random() * 2 + 0.3,
      duration: Math.random() * 4 + 2,
      delay: Math.random() * 10,
      opacity: Math.random() * 0.8 + 0.2,
      color: Math.random() > 0.95 ? '#a78bfa' :  // Violet
             Math.random() > 0.88 ? '#c4b5fd' :  // Soft violet
             Math.random() > 0.75 ? '#93c5fd' :  // Blue
             Math.random() > 0.50 ? '#22d3ee' :  // Cyan
             '#ffffff'
    }));
    setStars(generatedStars);

    const particleCount = 100;
    const generatedParticles = Array.from({ length: particleCount }).map((_, i) => ({
      id: i,
      char: ['✧', '✦', '⋆', '✶', '●', '◇', '♡', '❅', '⊹', '✿'][Math.floor(Math.random() * 10)],
      left: Math.random() * 100,
      fontSize: Math.random() * 16 + 8,
      duration: Math.random() * 20 + 25,
      delay: Math.random() * 20,
      color: ['#e879f9', '#f472b6', '#a78bfa', '#22d3ee', '#c4b5fd', '#f687b3'][Math.floor(Math.random() * 6)],
      opacity: Math.random() * 0.4 + 0.1
    }));
    setParticles(generatedParticles);
  }, []);

  // Cranked glitch triggers
  useEffect(() => {
    const uiGlitchInterval = setInterval(() => {
      if (Math.random() > 0.55) {  // more often
        setGlitchActive(true);
        setTimeout(() => setGlitchActive(false), 120 + Math.random() * 250);
      }
    }, 1800 + Math.random() * 1800);

    const skyGlitchInterval = setInterval(() => {
      if (Math.random() > 0.45) {  // way more often
        const severity = Math.random();
        setGlitchType(severity > 0.8 ? 'cascade' : severity > 0.45 ? 'severe' : 'normal');
        setSkyGlitch(true);

        if (severity > 0.8) {
          let pulses = 6 + Math.floor(Math.random() * 5);
          const doPulse = (remaining) => {
            if (remaining <= 0) { setSkyGlitch(false); return; }
            setTimeout(() => {
              setSkyGlitch(false);
              setTimeout(() => {
                setSkyGlitch(true);
                doPulse(remaining - 1);
              }, 50);
            }, 80 + Math.random() * 80);
          };
          doPulse(pulses);
        } else {
          setTimeout(() => setSkyGlitch(false), 200 + Math.random() * 300);
        }
      }
    }, 3000 + Math.random() * 4000);

    return () => {
      clearInterval(uiGlitchInterval);
      clearInterval(skyGlitchInterval);
    };
  }, []);

  // Amped static canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;

    const render = () => {
      const w = canvas.width;
      const h = canvas.height;
      
      ctx.clearRect(0, 0, w, h);

      const imageData = ctx.createImageData(w, h);
      const data = imageData.data;
      
      for (let i = 0; i < data.length; i += 4) {
        const noise = Math.random() * 255;
        
        if (skyGlitch) {
          if (glitchType === 'severe' || glitchType === 'cascade') {
            data[i] = Math.random() > 0.4 ? noise : 0;
            data[i + 1] = Math.random() > 0.6 ? noise * 0.7 : 0;
            data[i + 2] = noise;
            data[i + 3] = Math.random() > 0.2 ? 220 : 0;
          } else {
            data[i] = noise;
            data[i + 1] = noise * 0.3;
            data[i + 2] = noise + 80;
            data[i + 3] = Math.random() > 0.4 ? 180 : 0;
          }
        } else {
          data[i] = noise * 0.4 + 30;
          data[i + 1] = noise * 0.3;
          data[i + 2] = noise * 0.5 + 40;
          data[i + 3] = 20;
        }
      }
      
      ctx.putImageData(imageData, 0, 0);

      // More tears
      const tearChance = skyGlitch ? (glitchType === 'cascade' ? 0.1 : 0.3) : 0.95;
      if (Math.random() > tearChance) {
        const y = Math.random() * h;
        const height = Math.random() * (skyGlitch ? 120 : 20) + 5;
        ctx.fillStyle = skyGlitch 
          ? `rgba(${Math.random() > 0.5 ? '100, 255, 255' : '255, 100, 255'}, 0.5)` 
          : 'rgba(255, 255, 255, 0.1)';
        ctx.fillRect(0, y, w, height);
        if (skyGlitch) {
          const shift = (Math.random() - 0.5) * 50;
          ctx.drawImage(canvas, shift, y, w, height, 0, y, w, height);
        }
      }

      if (skyGlitch && Math.random() > 0.6) {
        const x = Math.random() * w;
        const width = Math.random() * 40 + 10;
        ctx.fillStyle = 'rgba(255, 150, 255, 0.4)';
        ctx.fillRect(x, 0, width, h);
      }

      animationFrameId = requestAnimationFrame(render);
    };

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [skyGlitch, glitchType]);

  const links = [
    { title: "AERYEOK", subtitle: "Aerial Signal Intelligence", href: "https://aeryeoklabs.io/", icon: "✈️", glow: "group-hover/btn:shadow-violet-500/40" },
    { title: "DAERYEOK", subtitle: "Critical Asset Modernization", href: "https://daeryeok.io/", icon: "⚡", glow: "group-hover/btn:shadow-slate-500/40" },
    { title: "EUMMAE", subtitle: "Analogue Intelligence Pipelines", href: "https://eummae.com/", icon: "🐮", glow: "group-hover/btn:shadow-cyan-500/40" },
    { title: "PIPATO", subtitle: "Precision Thermal Protocols", href: "https://pipa.to/", icon: "🍅", glow: "group-hover/btn:shadow-rose-500/40" },
  ];

  return (
    <div className="relative min-h-screen w-full overflow-hidden font-sans text-slate-200 bg-[#000000] selection:bg-fuchsia-500/50 selection:text-white">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap');
        body { font-family: 'Space Grotesk', sans-serif; }

        /* DARKER DUSK-DAWN CYCLE - COLD ONLY */
        .twilight-gradient {
          background: linear-gradient(
            180deg,
            #000000 0%,
            #0a0020 15%,
            #15053a 30%,
            #200f55 45%,
            #2a1470 60%,
            #3a1a85 75%,
            #331460 90%,
            #1e0a40 100%
          );
          background-size: 100% 400%;
          animation: twilightBreath 70s ease-in-out infinite alternate;
        }

        /* ALTERNATE GLITCH GRADIENT - more cyan/teal */
        .twilight-gradient-alt {
          background: linear-gradient(
            180deg,
            #010208 0%,
            #051a24 12%,
            #0a2a3a 28%,
            #0f3a4a 42%,
            #1a4a5a 55%,
            #2a5a6a 68%,
            #1a3a4a 82%,
            #0a2030 100%
          );
          background-size: 100% 400%;
          animation: twilightBreath 70s ease-in-out infinite alternate;
        }

        @keyframes twilightBreath {
          0% { background-position: 50% 0%; }
          100% { background-position: 50% 100%; }
        }

        /* REALITY TEARING ANIMATIONS */
        .reality-failure {
          animation: realityTear 0.15s steps(2) infinite;
        }

        .reality-failure-severe {
          animation: realityTearSevere 0.12s steps(3) infinite;
        }

        @keyframes realityTear {
          0% { filter: hue-rotate(0deg); transform: scale(1); }
          50% { filter: hue-rotate(40deg) brightness(1.1); transform: translateX(-2px); }
          100% { filter: hue-rotate(0deg); transform: scale(1); }
        }

        @keyframes realityTearSevere {
          0% { filter: hue-rotate(0deg); transform: translate(0); }
          25% { filter: hue-rotate(120deg) invert(0.05); transform: translate(-4px, 1px); }
          75% { filter: hue-rotate(-80deg) brightness(1.3); transform: translate(4px, -1px); }
        }

        /* COSMIC DRIFT */
        @keyframes cosmicDrift {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        /* TWINKLE */
        @keyframes twinkle {
          0%, 100% { opacity: var(--base-opacity, 0.3); transform: scale(1); }
          50% { opacity: 1; transform: scale(1.1); }
        }

        .star {
          animation: twinkle var(--duration) ease-in-out infinite;
          animation-delay: var(--delay);
        }

        /* PARTICLES */
        @keyframes particleRise {
          0% { transform: translateY(100vh) translateX(0) rotate(0deg); opacity: 0; }
          10% { opacity: var(--opacity); }
          90% { opacity: 0.05; }
          100% { transform: translateY(-10vh) translateX(30px) rotate(180deg); opacity: 0; }
        }

        .particle {
          animation: particleRise var(--duration) linear infinite;
          animation-delay: var(--delay);
        }

        /* UI GLITCH */
        .panel-glitch {
          animation: panelShake 0.15s ease;
        }

        @keyframes panelShake {
          0%, 100% { transform: translate(0); filter: hue-rotate(0deg); }
          20% { transform: translate(-3px, 1px); filter: hue-rotate(30deg); }
          40% { transform: translate(3px, -1px); filter: hue-rotate(-30deg); }
          60% { transform: translate(-2px, 2px); }
          80% { transform: translate(2px, -2px); filter: hue-rotate(15deg); }
        }

        .text-glitch {
          animation: rgbSplit 0.1s steps(2) infinite;
        }

        @keyframes rgbSplit {
          0%, 100% { text-shadow: -2px 0 #00ffff, 2px 0 #ff00ff; }
          50% { text-shadow: 2px 0 #00ffff, -2px 0 #ff00ff; }
        }

        /* AVATAR GLITCH */
        .avatar-glitch {
          animation: avatarGlitch 0.15s steps(2) infinite;
        }

        @keyframes avatarGlitch {
          0%, 100% { 
            filter: hue-rotate(0deg) saturate(1);
            transform: translate(0);
          }
          25% { 
            filter: hue-rotate(30deg) saturate(1.4);
            transform: translate(-2px, 1px);
          }
          50% { 
            filter: hue-rotate(-20deg) saturate(1.2) brightness(1.2);
            transform: translate(2px, -1px);
          }
          75% { 
            filter: hue-rotate(15deg) contrast(1.1);
            transform: translate(-1px, -1px);
          }
        }

        /* LINK HOVER */
        .link-hover:hover {
          animation: linkGlitch 0.3s ease;
        }

        @keyframes linkGlitch {
          0%, 100% { transform: translateX(0); }
          15% { transform: translateX(-2px); }
          30% { transform: translateX(3px); }
          45% { transform: translateX(-1px); }
          60% { transform: translateX(2px); }
        }

        /* SCANLINES */
        .scanlines {
          background: repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(0, 0, 0, 0.15) 2px,
            rgba(0, 0, 0, 0.15) 4px
          );
        }

        /* HORIZON GLOW (Soft purple night glow) */
        .horizon-glow {
          background: radial-gradient(
            ellipse 150% 60% at 50% 100%,
            rgba(88, 28, 135, 0.15) 0%,
            rgba(30, 27, 75, 0.1) 40%,
            transparent 80%
          );
        }
      `}</style>

      {/* 1. TWILIGHT SKY - DUAL GRADIENTS */}
      {/* Normal gradient */}
      <div className={`fixed inset-0 twilight-gradient z-0 transition-opacity duration-200 ${
        skyGlitch ? 'opacity-0' : 'opacity-100'
      }`} />
      {/* Glitch gradient - cyan/teal alternate */}
      <div className={`fixed inset-0 twilight-gradient-alt z-0 transition-opacity duration-200 ${
        skyGlitch 
          ? `opacity-100 ${(glitchType === 'severe' || glitchType === 'cascade') ? 'reality-failure-severe' : 'reality-failure'}`
          : 'opacity-0'
      }`} />

      {/* 2. HORIZON GLOW - swaps during glitch */}
      <div className={`fixed inset-0 z-[1] pointer-events-none transition-opacity duration-200 ${skyGlitch ? 'opacity-0' : 'opacity-100'}`} style={{ background: 'radial-gradient(ellipse 180% 70% at 50% 100%, rgba(60, 20, 120, 0.25) 0%, transparent 70%)' }} />
      <div className={`fixed inset-0 z-[1] pointer-events-none transition-opacity duration-200 ${skyGlitch ? 'opacity-100' : 'opacity-0'}`} style={{ background: 'radial-gradient(ellipse 180% 70% at 50% 100%, rgba(20, 120, 120, 0.3) 0%, transparent 70%)' }} />

      {/* 3. ENHANCED DENSE STARS */}
      <div 
        className="fixed z-[2] pointer-events-none"
        style={{
          top: '-50%',
          left: '-50%',
          width: '200%',
          height: '200%',
          animation: 'cosmicDrift 600s linear infinite'
        }}
      >
        {stars.map((star) => (
          <div
            key={star.id}
            className="absolute rounded-full star"
            style={{
              top: `${star.top}%`,
              left: `${star.left}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              backgroundColor: star.color,
              boxShadow: star.size > 1 ? `0 0 ${star.size * 3}px ${star.color}` : 'none',
              '--duration': `${star.duration}s`,
              '--delay': `${star.delay}s`,
              '--base-opacity': star.opacity,
            }}
          />
        ))}
      </div>

      {/* 4. FLOATING PARTICLES */}
      <div className="fixed inset-0 z-[3] pointer-events-none overflow-hidden">
        {particles.map((p) => (
          <div
            key={p.id}
            className="absolute particle"
            style={{
              left: `${p.left}%`,
              bottom: '-30px',
              fontSize: `${p.fontSize}px`,
              color: p.color,
              textShadow: `0 0 12px ${p.color}`,
              '--duration': `${p.duration}s`,
              '--delay': `${p.delay}s`,
              '--opacity': p.opacity,
            }}
          >
            {p.char}
          </div>
        ))}
      </div>

      {/* 5. NOISE CANVAS - HIGHER OPACITY */}
      <canvas 
        ref={canvasRef} 
        className="fixed inset-0 w-full h-full z-[4] mix-blend-screen opacity-75 pointer-events-none"
      />

      {/* 6. SCANLINES & VIGNETTE */}
      <div className="fixed inset-0 z-[5] scanlines pointer-events-none opacity-25" />
      <div className="fixed inset-0 z-[5] bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.7)_100%)] pointer-events-none" />

      {/* 7. MAIN CONTENT */}
      <main className="relative z-10 min-h-screen flex items-center justify-center p-4 py-12">
        
        <div className={`w-full max-w-md backdrop-blur-2xl bg-slate-950/40 border border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden ${glitchActive ? 'panel-glitch' : ''}`}>
          
          {/* Subtle inner glow */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent rounded-3xl pointer-events-none" />

          {/* AVATAR */}
          <div className="relative mb-12 flex justify-center">
            <div className="relative">
              {/* Big soft aura layers */}
              <div className="absolute -inset-8 sm:-inset-12 blur-3xl opacity-60 pointer-events-none">
                <div className="w-full h-full rounded-3xl bg-gradient-to-br from-cyan-400/40 via-purple-500/30 to-pink-500/40" />
              </div>
              <div className="absolute -inset-4 sm:-inset-8 blur-2xl opacity-80 pointer-events-none">
                <div className="w-full h-full rounded-3xl bg-gradient-to-br from-purple-600/50 to-fuchsia-600/40" />
              </div>

              {/* Main container - square, thick neon border, hard glow */}
              <div 
                className={`relative w-64 h-64 sm:w-80 sm:h-80 rounded-3xl overflow-hidden border-4 sm:border-8 border-white/10 ${glitchActive || skyGlitch ? 'avatar-glitch' : ''}`}
                style={{
                  boxShadow: `
                    0 0 60px rgba(34, 211, 238, 0.5),
                    0 0 100px rgba(168, 85, 247, 0.4),
                    0 0 140px rgba(236, 72, 153, 0.3)
                    ${glitchActive || skyGlitch ? ', 0 0 40px rgba(0, 255, 255, 0.8), 0 0 60px rgba(255, 0, 255, 0.6)' : ''}
                  `
                }}
              >
                {/* Normal profile */}
                <img 
                  src="/profile-normal.png"
                  alt="Profile"
                  className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-200 ${glitchActive || skyGlitch ? 'opacity-0' : 'opacity-100'}`}
                />
                {/* Glitch profile */}
                <img 
                  src="/profile-glitch.png"
                  alt="Glitch"
                  className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-200 ${glitchActive || skyGlitch ? 'opacity-100' : 'opacity-0'}`}
                />
              </div>
            </div>
          </div>

          {/* TITLE */}
          <div className="text-center mb-10">
            <div className="relative h-12 overflow-hidden">
              {/* Normal name - the real H1 */}
              <h1 
                className={`absolute inset-0 flex items-center justify-center text-3xl sm:text-4xl font-light tracking-wider whitespace-nowrap transition-opacity duration-100 ${glitchActive || skyGlitch ? 'opacity-0' : 'opacity-100'}`}
                style={{
                  background: 'linear-gradient(90deg, #a0d8ff, #e0b8ff, #ffb8f8)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  textShadow: '0 0 30px rgba(224, 184, 255, 0.8), 0 0 60px rgba(160, 216, 255, 0.5)'
                }}
              >
                daeryeok amara
              </h1>
              {/* Glitch reveal - decorative span, not h1 for SEO */}
              <span 
                aria-hidden="true"
                className={`absolute inset-0 flex items-center justify-center text-3xl sm:text-4xl font-light tracking-wider whitespace-nowrap transition-opacity duration-100 text-glitch ${glitchActive || skyGlitch ? 'opacity-100' : 'opacity-0'}`}
                style={{
                  background: 'linear-gradient(90deg, #00ffff, #ff00ff, #00ffff)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  textShadow: '0 0 30px rgba(0, 255, 255, 0.8), 0 0 60px rgba(255, 0, 255, 0.5)'
                }}
              >
                derek amara
              </span>
            </div>
            
            <div className="text-slate-400 text-[10px] tracking-[0.3em] uppercase h-4 relative overflow-hidden mt-3">
              {/* Normal bio */}
              <span className={`absolute inset-0 flex items-center justify-center transition-opacity duration-75 ${glitchActive || skyGlitch ? 'opacity-0' : 'opacity-100'}`}>
                Operating from Vancouver, BC
              </span>
              {/* Glitch reveal - cosmic truth */}
              <span className={`absolute inset-0 flex items-center justify-center transition-opacity duration-75 text-fuchsia-400/80 ${glitchActive || skyGlitch ? 'opacity-100' : 'opacity-0'}`}>
                Systems Architect
              </span>
            </div>
          </div>

          {/* LINKS */}
          <div className="space-y-3 relative z-10">
            {links.map((link, idx) => (
              <a 
                key={idx}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
                className={`link-hover group/btn block w-full bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-2xl p-4 transition-all duration-300 hover:shadow-lg ${link.glow}`}
              >
                <div className="flex items-center gap-4">
                  {/* Icon */}
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center shadow-lg transition-transform duration-300 group-hover/btn:scale-110" style={{ backgroundColor: '#0B1018' }}>
                    {typeof link.icon === 'string' ? (
                      <span className="text-2xl">{link.icon}</span>
                    ) : (
                      link.icon
                    )}
                  </div>

                  {/* Text */}
                  <div className="flex-1 text-left min-w-0">
                    <h3 className="text-[15px] font-semibold text-slate-100 tracking-wide">
                      {link.title}
                    </h3>
                    <p className="text-[8px] text-slate-400/60 tracking-wider uppercase whitespace-nowrap">
                      {link.subtitle}
                    </p>
                  </div>

                  {/* Arrow/Icon */}
                  <Disc 
                    size={18} 
                    className={`text-slate-500 group-hover/btn:text-white transition-all ${hoveredIndex === idx ? 'animate-spin' : ''}`}
                  />
                </div>
              </a>
            ))}
          </div>

          {/* SOCIAL FOOTER */}
          <div className="mt-10 flex justify-center gap-5">
            {[
              { icon: <Mail size={18} />, href: 'mailto:daeryeok@drkc.ca', hover: 'hover:text-slate-300 hover:shadow-slate-500/30', label: 'Communique' },
              { icon: <Instagram size={18} />, href: 'https://www.instagram.com/aeryeok/', hover: 'hover:text-pink-400 hover:shadow-pink-500/30', label: 'Instagram' },
              { icon: <Globe size={18} />, href: 'https://t.me/aeryeok', hover: 'hover:text-cyan-400 hover:shadow-cyan-500/30', label: 'Signal' },
            ].map((social, idx) => (
              <a 
                key={idx}
                href={social.href}
                target={social.href.startsWith('mailto') ? undefined : '_blank'}
                rel="noopener noreferrer"
                title={social.label}
                className={`w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-500 hover:bg-white/10 hover:border-white/20 hover:scale-110 transition-all duration-300 hover:shadow-lg ${social.hover}`}
              >
                {social.icon}
              </a>
            ))}
          </div>

          {/* STATUS LINE - pure signal */}
          <div className="mt-5 text-center">
            <p className={`text-[8px] tracking-[0.7em] uppercase font-light ${skyGlitch ? 'text-cyan-300 animate-pulse text-glitch' : 'text-purple-600/30'}`}>
              {skyGlitch 
                ? '◈ TRANSMISSION FRACTURED ◈' 
                : '◇ SIGNAL ETERNAL ◇'
              }
            </p>
          </div>
        </div>
      </main>

      {/* FLOATING DECORATIVE ELEMENTS */}
      <div className="fixed top-[15%] left-[8%] text-pink-500/10 pointer-events-none animate-pulse">
        <Heart size={70} />
      </div>
      <div className="fixed bottom-[15%] right-[8%] text-pink-500/10 pointer-events-none animate-pulse" style={{ animationDelay: '1s' }}>
        <Sparkles size={70} />
      </div>
    </div>
  );
}
