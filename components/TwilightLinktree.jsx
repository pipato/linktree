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

  // Initialize stars & particles - DENSE NIGHT SKY
  useEffect(() => {
    const starCount = 650;
    const generatedStars = Array.from({ length: starCount }).map((_, i) => ({
      id: i,
      top: Math.random() * 100,
      left: Math.random() * 100,
      size: Math.random() * 1.8 + 0.3,
      duration: Math.random() * 3 + 1.5,
      delay: Math.random() * 10,
      opacity: Math.random() * 0.7 + 0.1,
      color: Math.random() > 0.92 ? '#fcd34d' :  // Gold
             Math.random() > 0.85 ? '#f9a8d4' :  // Pink
             Math.random() > 0.70 ? '#c4b5fd' :  // Violet
             Math.random() > 0.50 ? '#93c5fd' :  // Soft Blue
             '#ffffff'                           // White
    }));
    setStars(generatedStars);

    const particleCount = 45;
    const generatedParticles = Array.from({ length: particleCount }).map((_, i) => ({
      id: i,
      char: ['✧', '·', '⋆', '○', '◇', '♡', '⊹'][Math.floor(Math.random() * 7)],
      left: Math.random() * 100,
      fontSize: Math.random() * 12 + 6,
      duration: Math.random() * 15 + 20,
      delay: Math.random() * 15,
      color: Math.random() > 0.4 
        ? ['#e879f9', '#f472b6', '#f687b3', '#fbbf24'][Math.floor(Math.random() * 4)]
        : ['#818cf8', '#22d3ee'][Math.floor(Math.random() * 2)],
      opacity: Math.random() * 0.3 + 0.05
    }));
    setParticles(generatedParticles);
  }, []);

  // Glitch triggers
  useEffect(() => {
    const uiGlitchInterval = setInterval(() => {
      if (Math.random() > 0.7) {
        setGlitchActive(true);
        setTimeout(() => setGlitchActive(false), 100 + Math.random() * 180);
      }
    }, 2200 + Math.random() * 2000);

    const skyGlitchInterval = setInterval(() => {
      if (Math.random() > 0.58) {
        const severity = Math.random();
        setGlitchType(severity > 0.85 ? 'cascade' : severity > 0.5 ? 'severe' : 'normal');
        setSkyGlitch(true);

        if (severity > 0.85) {
          let pulses = 4 + Math.floor(Math.random() * 3);
          const doPulse = (remaining) => {
            if (remaining <= 0) { setSkyGlitch(false); return; }
            setTimeout(() => {
              setSkyGlitch(false);
              setTimeout(() => {
                setSkyGlitch(true);
                doPulse(remaining - 1);
              }, 60);
            }, 90 + Math.random() * 70);
          };
          doPulse(pulses);
        } else {
          setTimeout(() => setSkyGlitch(false), 140 + Math.random() * 200);
        }
      }
    }, 3800 + Math.random() * 5000);

    return () => {
      clearInterval(uiGlitchInterval);
      clearInterval(skyGlitchInterval);
    };
  }, []);

  // Noise/static canvas
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
            data[i] = Math.random() > 0.5 ? noise : 0;
            data[i + 1] = Math.random() > 0.7 ? noise * 0.5 : 0;
            data[i + 2] = noise;
            data[i + 3] = Math.random() > 0.3 ? 180 : 0;
          } else {
            data[i] = noise;
            data[i + 1] = 0;
            data[i + 2] = noise + 50;
            data[i + 3] = Math.random() > 0.5 ? 150 : 0;
          }
        } else {
          data[i] = noise * 0.3 + 20;
          data[i + 1] = noise * 0.2;
          data[i + 2] = noise * 0.4 + 30;
          data[i + 3] = 15;
        }
      }
      
      ctx.putImageData(imageData, 0, 0);

      const tearChance = skyGlitch ? (glitchType === 'cascade' ? 0.2 : 0.4) : 0.97;
      if (Math.random() > tearChance) {
        const y = Math.random() * h;
        const height = Math.random() * (skyGlitch ? 80 : 15) + 2;
        ctx.fillStyle = skyGlitch 
          ? `rgba(${Math.random() > 0.5 ? '255, 0, 200' : '0, 255, 255'}, 0.4)` 
          : 'rgba(255, 255, 255, 0.08)';
        ctx.fillRect(0, y, w, height);
        if (skyGlitch) {
          const shift = (Math.random() - 0.5) * 30;
          ctx.drawImage(canvas, shift, y, w, height, 0, y, w, height);
        }
      }

      if (skyGlitch && Math.random() > 0.7) {
        const x = Math.random() * w;
        const width = Math.random() * 20 + 5;
        ctx.fillStyle = 'rgba(255, 100, 255, 0.3)';
        ctx.fillRect(x, 0, width, h);
      }

      animationFrameId = requestAnimationFrame(render);
    };

    const handleResize = () => {
      canvas.width = Math.floor(window.innerWidth / 4);
      canvas.height = Math.floor(window.innerHeight / 4);
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
    <div className="relative min-h-screen w-full overflow-hidden font-sans text-slate-200 bg-[#02040a] selection:bg-fuchsia-500/50 selection:text-white">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap');
        body { font-family: 'Space Grotesk', sans-serif; }

        /* DEEP NIGHT DUSK-TO-DAWN GRADIENT */
        /* Stays on the night side (no oranges, no yellows, just deep purples/blues/teals) */
        .twilight-gradient {
          background: linear-gradient(
            180deg, 
            #010208 0%,    /* Deep Space Black */
            #050a24 10%,   /* Dark Midnight Blue */
            #0f172a 25%,   /* Slate Midnight */
            #1e1b4b 45%,   /* Deep Indigo */
            #312e81 60%,   /* Indigo Dawn-side */
            #4c1d95 75%,   /* Deep Violet dusk-side */
            #2e1065 88%,   /* Imperial Purple */
            #1e0a3c 100%   /* Bottom Deep Purple */
          );
          background-size: 100% 300%;
          animation: twilightBreath 45s ease-in-out infinite alternate;
        }

        @keyframes twilightBreath {
          0% { background-position: 50% 0%; }
          50% { background-position: 50% 50%; }
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

      {/* 1. TWILIGHT SKY */}
      <div className={`fixed inset-0 twilight-gradient z-0 ${
        skyGlitch 
          ? (glitchType === 'severe' || glitchType === 'cascade') 
            ? 'reality-failure-severe' 
            : 'reality-failure'
          : ''
      }`} />

      {/* 2. HORIZON GLOW */}
      <div className="fixed inset-0 horizon-glow z-[1] pointer-events-none" />

      {/* 3. ENHANCED DENSE STARS */}
      <div 
        className="fixed z-[2] pointer-events-none"
        style={{
          top: '-50%',
          left: '-50%',
          width: '200%',
          height: '200%',
          animation: 'cosmicDrift 500s linear infinite'
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

      {/* 5. NOISE CANVAS */}
      <canvas 
        ref={canvasRef} 
        className="fixed inset-0 w-full h-full z-[4] mix-blend-screen opacity-60 pointer-events-none"
        style={{ imageRendering: 'pixelated' }} 
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
              <div className="absolute -inset-12 blur-3xl opacity-60">
                <div className="w-80 h-80 rounded-3xl bg-gradient-to-br from-cyan-400/40 via-purple-500/30 to-pink-500/40" />
              </div>
              <div className="absolute -inset-8 blur-2xl opacity-80">
                <div className="w-80 h-80 rounded-3xl bg-gradient-to-br from-purple-600/50 to-fuchsia-600/40" />
              </div>

              {/* Main container - square, thick neon border, hard glow */}
              <div 
                className={`relative w-80 h-80 rounded-3xl overflow-hidden border-8 border-transparent bg-gradient-to-br from-cyan-400/60 via-purple-500/60 to-fuchsia-500/60 p-2 ${glitchActive || skyGlitch ? 'avatar-glitch' : ''}`}
                style={{
                  boxShadow: `
                    0 0 80px rgba(34, 211, 238, 0.7),
                    0 0 140px rgba(168, 85, 247, 0.6),
                    0 0 200px rgba(236, 72, 153, 0.5),
                    inset 0 0 80px rgba(0, 0, 0, 0.4)
                    ${glitchActive || skyGlitch ? ', 0 0 40px rgba(0, 255, 255, 0.8), 0 0 60px rgba(255, 0, 255, 0.6)' : ''}
                  `
                }}
              >
                <div className="w-full h-full rounded-3xl overflow-hidden bg-black/60">
                  <img 
                    src="/profile-normal.png"
                    alt="Profile"
                    className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-200 ${glitchActive || skyGlitch ? 'opacity-0' : 'opacity-100'}`}
                  />
                  <img 
                    src="/profile-glitch.png"
                    alt="Glitch"
                    className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-200 mix-blend-screen ${glitchActive || skyGlitch ? 'opacity-90' : 'opacity-0'}`}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* TITLE */}
          <div className="text-center mb-10">
            <div className="relative h-12 overflow-hidden">
              {/* Normal name */}
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
              {/* Glitch reveal - government name */}
              <h1 
                className={`absolute inset-0 flex items-center justify-center text-3xl sm:text-4xl font-light tracking-wider whitespace-nowrap transition-opacity duration-100 text-glitch ${glitchActive || skyGlitch ? 'opacity-100' : 'opacity-0'}`}
                style={{
                  background: 'linear-gradient(90deg, #00ffff, #ff00ff, #00ffff)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  textShadow: '0 0 30px rgba(0, 255, 255, 0.8), 0 0 60px rgba(255, 0, 255, 0.5)'
                }}
              >
                derek amara
              </h1>
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
                  <div className="flex-1 text-left">
                    <h3 className="text-[15px] font-semibold text-slate-100 tracking-wide">
                      {link.title}
                    </h3>
                    <p className="text-[10px] text-slate-400/60 tracking-widest uppercase">
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
