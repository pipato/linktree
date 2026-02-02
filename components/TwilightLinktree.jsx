import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Tv, Mail, PenTool, Disc, Zap, Instagram, Globe } from 'lucide-react';

export default function TwilightMatrixLinktree() {
  const canvasRef = useRef(null);
  
  const [stars, setStars] = useState([]);
  const [particles, setParticles] = useState([]);
  const [glitchActive, setGlitchActive] = useState(false);
  const [skyGlitch, setSkyGlitch] = useState(false);
  const [glitchType, setGlitchType] = useState('normal');
  const [hoveredIndex, setHoveredIndex] = useState(null);

  // Initialize stars & particles
  useEffect(() => {
    const starCount = 180;
    const generatedStars = Array.from({ length: starCount }).map((_, i) => ({
      id: i,
      top: Math.random() * 100,
      left: Math.random() * 100,
      size: Math.random() * 2.5 + 0.5,
      duration: Math.random() * 4 + 2,
      delay: Math.random() * 6,
      opacity: Math.random() * 0.6 + 0.2,
      color: Math.random() > 0.9 ? '#fcd34d' : 
             Math.random() > 0.75 ? '#f9a8d4' : 
             Math.random() > 0.5 ? '#c4b5fd' : '#ffffff'
    }));
    setStars(generatedStars);

    const particleCount = 30;
    const generatedParticles = Array.from({ length: particleCount }).map((_, i) => ({
      id: i,
      char: ['✧', '·', '⋆', '○', '◇', '♡'][Math.floor(Math.random() * 6)],
      left: Math.random() * 100,
      fontSize: Math.random() * 14 + 8,
      duration: Math.random() * 20 + 25,
      delay: Math.random() * 15,
      color: Math.random() > 0.4 
        ? ['#e879f9', '#f472b6', '#f687b3', '#fbbf24'][Math.floor(Math.random() * 4)]
        : ['#818cf8', '#22d3ee'][Math.floor(Math.random() * 2)],
      opacity: Math.random() * 0.35 + 0.1
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
    { title: "DAERYEOK CORP", subtitle: "Critical Infrastructure & Legacy Remediation", href: "https://daeryeok.io/", icon: <Zap size={20} />, gradient: "from-slate-500 to-slate-700", glow: "group-hover/btn:shadow-slate-500/40" },
    { title: "EUMMAE", subtitle: "Cognitive Search & Handwriting OCR", href: "https://eummae.com/", icon: <Sparkles size={20} />, gradient: "from-cyan-500 to-teal-600", glow: "group-hover/btn:shadow-cyan-500/40" },
    { title: "PIPATO PROTOCOLS", subtitle: "Standard Operating Procedures & Thermal Workflows", href: "https://pipa.to/", icon: <PenTool size={20} />, gradient: "from-rose-500 to-pink-600", glow: "group-hover/btn:shadow-rose-500/40" },
    { title: "AERYEOK LABS", subtitle: "Signal Intelligence & Aerial Telemetry", href: "https://aeryeoklabs.io/", icon: <Tv size={20} />, gradient: "from-violet-500 to-purple-600", glow: "group-hover/btn:shadow-violet-500/40" },
  ];

  return (
    <div className="relative min-h-screen w-full overflow-hidden font-sans text-slate-200 bg-black selection:bg-fuchsia-500/50 selection:text-white">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap');
        body { font-family: 'Space Grotesk', sans-serif; }

        /* PERPETUAL TWILIGHT */
        .twilight-gradient {
          background: linear-gradient(
            180deg, 
            #020617 0%,
            #0f0720 15%,
            #1e1b4b 35%,
            #312e81 50%,
            #4c1d95 65%,
            #6b2176 80%,
            #831843 92%,
            #9f1239 100%
          );
          background-size: 100% 200%;
          animation: twilightBreath 30s ease-in-out infinite alternate;
        }

        @keyframes twilightBreath {
          0% { background-position: 50% 0%; }
          100% { background-position: 50% 35%; }
        }

        /* SKY GLITCH - Reality breaking */
        .reality-failure {
          animation: realityTear 0.12s steps(3) infinite;
        }

        .reality-failure-severe {
          animation: realityTearSevere 0.1s steps(4) infinite;
        }

        @keyframes realityTear {
          0% { filter: hue-rotate(0deg); transform: scale(1); }
          33% { filter: hue-rotate(60deg) brightness(1.2); transform: scale(1.01) translateX(-3px); }
          66% { filter: hue-rotate(-60deg) contrast(1.3); transform: scale(0.99) translateX(3px); }
          100% { filter: hue-rotate(0deg); transform: scale(1); }
        }

        @keyframes realityTearSevere {
          0% { filter: hue-rotate(0deg) invert(0); transform: scale(1); }
          25% { filter: hue-rotate(90deg) invert(0.1) saturate(2); transform: scale(1.02) translateX(-5px) skewX(1deg); }
          50% { filter: hue-rotate(-90deg) brightness(1.5); transform: scale(0.98) translateX(5px) skewX(-1deg); }
          75% { filter: hue-rotate(180deg) invert(0.05); transform: scale(1.01) skewY(0.5deg); }
          100% { filter: hue-rotate(0deg) invert(0); transform: scale(1); }
        }

        /* COSMIC DRIFT */
        @keyframes cosmicDrift {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        /* TWINKLE */
        @keyframes twinkle {
          0%, 100% { opacity: var(--base-opacity, 0.3); transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.25); }
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

        /* HORIZON GLOW */
        .horizon-glow {
          background: radial-gradient(
            ellipse 150% 50% at 50% 100%,
            rgba(251, 113, 133, 0.15) 0%,
            rgba(167, 139, 250, 0.1) 30%,
            transparent 70%
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

      {/* 3. COSMIC DRIFT STARS */}
      <div 
        className="fixed z-[2] pointer-events-none"
        style={{
          top: '-50%',
          left: '-50%',
          width: '200%',
          height: '200%',
          animation: 'cosmicDrift 300s linear infinite'
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
              boxShadow: `0 0 ${star.size * 4}px ${star.color}`,
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
          <div className="relative mb-8 flex justify-center">
            <div className="relative">
              {/* Rotating rings */}
              <div className="absolute -inset-4 rounded-full border border-dashed border-purple-400/30 animate-[spin_12s_linear_infinite]" />
              <div className="absolute -inset-8 rounded-full border border-violet-400/20 animate-[spin_20s_linear_infinite_reverse]" />
              
              {/* Avatar container with swapping images */}
              <div className={`relative w-28 h-28 rounded-full bg-gradient-to-br from-violet-600 via-purple-600 to-fuchsia-600 p-[2px] shadow-lg shadow-purple-500/30 ${glitchActive ? 'avatar-glitch' : ''}`}>
                <div className="w-full h-full rounded-full overflow-hidden relative">
                  {/* Normal profile */}
                  <img 
                    src="/profile-normal.png"
                    alt="Profile"
                    className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-75 ${glitchActive || skyGlitch ? 'opacity-0' : 'opacity-100'}`}
                  />
                  {/* Glitch profile - shows during reality breaks */}
                  <img 
                    src="/profile-glitch.png"
                    alt="Profile Glitch"
                    className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-75 ${glitchActive || skyGlitch ? 'opacity-100' : 'opacity-0'}`}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* TITLE */}
          <div className="text-center mb-10">
            <h1 className={`text-2xl font-medium tracking-tight mb-3 ${glitchActive ? 'text-glitch' : ''}`}
                style={{
                  background: 'linear-gradient(90deg, #94a3b8, #c4b5fd, #94a3b8)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}>
              daeryeok amara
            </h1>
            
            <div className="text-slate-400 text-[10px] tracking-[0.3em] uppercase h-4 relative overflow-hidden">
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
                  <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${link.gradient} flex items-center justify-center text-white shadow-lg transition-transform duration-300 group-hover/btn:scale-110`}>
                    {link.icon}
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

          {/* FOOTER */}
          <div className="mt-8 text-center space-y-1">
            <p className={`text-[9px] text-slate-500/60 tracking-[0.4em] uppercase transition-opacity duration-75 ${glitchActive ? 'text-glitch' : ''}`}>
              MANAGING DIRECTOR // KALA VRIKA
            </p>
            <p className="text-[8px] text-slate-600/40 tracking-[0.3em]">
              666 Burrard St, Vancouver
            </p>
          </div>

          {/* STATUS LINE */}
          <div className="mt-4 text-center">
            <p className="text-[8px] text-slate-500/30 tracking-[0.5em] uppercase">
              {skyGlitch ? '◈ signal_interrupted ◈' : '◇ perpetual dusk ◇'}
            </p>
          </div>
        </div>
      </main>

      {/* FLOATING DECORATIVE ELEMENTS */}
      <div className="fixed top-[15%] left-[8%] text-purple-500/10 pointer-events-none animate-pulse">
        <Zap size={80} />
      </div>
      <div className="fixed bottom-[15%] right-[8%] text-pink-500/10 pointer-events-none animate-pulse" style={{ animationDelay: '1s' }}>
        <Sparkles size={70} />
      </div>
    </div>
  );
}
