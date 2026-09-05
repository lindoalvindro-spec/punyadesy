import React, { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import confetti from 'canvas-confetti';
import { 
  Heart, Sparkles, X, Calendar, MapPin, ZoomIn, 
  Music, Volume2, VolumeX, Cake, ChevronDown, Mail, ArrowRight 
} from 'lucide-react';

export default function ScrapbookMuseum({ isPlaying, onToggleMusic, onRestart, audioRef }) {
  const containerRef = useRef(null);
  const heartRef = useRef(null);
  const auraRef = useRef(null);
  const ripple1Ref = useRef(null);
  const ripple2Ref = useRef(null);
  const envelopeFlapRef = useRef(null);
  const letterRef = useRef(null);
  const sealRef = useRef(null);

  const [hasTappedHeart, setHasTappedHeart] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [isEnvelopeOpen, setIsEnvelopeOpen] = useState(false);
  const [showCakeModal, setShowCakeModal] = useState(false);
  const [candleBlown, setCandleBlown] = useState(false);

  // Background Twinkling Galaxy Stars (45 stars)
  const bgStars = Array.from({ length: 45 }).map((_, i) => ({
    id: i,
    top: `${Math.random() * 95}%`,
    left: `${Math.random() * 95}%`,
    size: Math.random() * 2.8 + 1.2,
    duration: Math.random() * 3 + 1.5,
    delay: Math.random() * 2.5,
    opacity: Math.random() * 0.7 + 0.3,
    color: i % 3 === 0 ? '#ffccd5' : i % 3 === 1 ? '#ffffff' : '#fce7f3',
  }));

  // Curving Galactic Arm Stardust (Points along the spiral)
  const spiralParticles = Array.from({ length: 40 }).map((_, i) => {
    const t = (i / 40) * Math.PI * 2.2 - 0.4;
    const a = 140;
    const b = 60;
    const tilt = -0.32;
    const x0 = Math.cos(t) * a;
    const y0 = Math.sin(t) * b;
    const x = x0 * Math.cos(tilt) - y0 * Math.sin(tilt) + 160;
    const y = x0 * Math.sin(tilt) + y0 * Math.cos(tilt) + 140;
    return {
      id: i,
      cx: x + (Math.random() * 14 - 7),
      cy: y + (Math.random() * 12 - 6),
      r: Math.random() * 2 + 1,
      opacity: Math.random() * 0.75 + 0.25,
    };
  });

  // Polaroid Photos for Pameran 03
  const polaroids = [
    {
      id: 1,
      src: '/luc 1.jpeg',
      caption: 'Momen terindah bersamamu di alam terbuka ⛰️🤍',
      note: 'Hari penuh senyum & udara sejuk!',
      date: 'Special Date with Desy',
      location: 'Together in Nature',
      rotation: '-3.2deg',
      tapeColor: 'repeating-linear-gradient(45deg, rgba(255, 182, 193, 0.85), rgba(255, 182, 193, 0.85) 6px, rgba(255, 220, 230, 0.85) 6px, rgba(255, 220, 230, 0.85) 12px)',
      pinColor: '#ff4d6d',
      stamp: 'BEST MEMORY',
      flowerDeco: '/bunga no bg 2.png',
    },
    {
      id: 2,
      src: '/luc 2.jpeg',
      caption: 'Ribuan mil di peta, sedekat detak jantung di hatiku 🌍💕',
      note: 'Poland ✈ Indonesia (Heart to Heart)',
      date: 'Endless Distance, Endless Love',
      location: 'Poland ⟷ Indonesia',
      rotation: '2.8deg',
      tapeColor: 'rgba(255, 192, 203, 0.9)',
      pinColor: '#38bdf8',
      stamp: 'LOVE MAIL · AIR MAIL',
      flowerDeco: null,
    },
    {
      id: 3,
      src: '/Blue LILY 🌊🦋.jpg',
      caption: 'Bunga lily abadi yang mekar seindah ketulusanmu 🌸✨',
      note: 'A flower that never fades for you',
      date: 'Blooming For You',
      location: 'Always In My Heart',
      rotation: '-2.2deg',
      tapeColor: 'rgba(255, 218, 225, 0.92)',
      pinColor: '#ff758f',
      stamp: 'FOREVER CHERISHED',
      flowerDeco: '/bunga 1 no bg.png',
    },
  ];

  useGSAP(() => {
    // 1. Heart Galaxy Hero Entrance
    gsap.fromTo('.galaxy-header',
      { opacity: 0, y: -25 },
      { opacity: 1, y: 0, duration: 1.1 }
    );

    if (heartRef.current) {
      gsap.fromTo(heartRef.current,
        { scale: 0.3, opacity: 0 },
        { scale: 1, opacity: 1, duration: 1.2, ease: 'back.out(1.8)' }
      );

      // Continuous heartbeat
      gsap.to(heartRef.current, {
        scale: 1.12,
        duration: 0.75,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
    }

    // Expanding shockwave rings
    if (ripple1Ref.current) {
      gsap.to(ripple1Ref.current, {
        scale: 2.2,
        opacity: 0,
        duration: 2.2,
        repeat: -1,
        ease: 'power1.out',
      });
    }
    if (ripple2Ref.current) {
      gsap.to(ripple2Ref.current, {
        scale: 2.6,
        opacity: 0,
        duration: 2.2,
        repeat: -1,
        delay: 1.1,
        ease: 'power1.out',
      });
    }

    // Stars floating
    gsap.to('.celestial-star', {
      scale: 1.2,
      rotation: '+=15',
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      stagger: 0.3,
    });

    // Scroll bouncing indicator
    gsap.to('.scroll-bounce-arrow', {
      y: 8,
      duration: 1.2,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    });
  }, { scope: containerRef });

  const handleHeartTap = () => {
    if (!hasTappedHeart) {
      setHasTappedHeart(true);
      if (audioRef && audioRef.current) {
        audioRef.current.play().catch(() => {});
      }

      confetti({
        particleCount: 50,
        spread: 80,
        origin: { y: 0.35 },
        colors: ['#ff758f', '#ffffff', '#ffccd5', '#ffd700', '#ff4d6d'],
      });

      gsap.timeline()
        .to(heartRef.current, { scale: 1.35, duration: 0.15, ease: 'back.out(2)' })
        .to(heartRef.current, { scale: 1.12, duration: 0.3 });
    }
  };

  const handleScrollToScrapbook = () => {
    handleHeartTap();
    const target = document.getElementById('pameran-start');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleOpenZoom = (photo) => {
    setSelectedPhoto(photo);
    requestAnimationFrame(() => {
      gsap.fromTo('.zoom-modal-content',
        { scale: 0.7, opacity: 0, y: 30 },
        { scale: 1, opacity: 1, y: 0, duration: 0.45, ease: 'back.out(1.6)' }
      );
    });
  };

  const handleCloseZoom = () => {
    gsap.to('.zoom-modal-content', {
      scale: 0.75,
      opacity: 0,
      duration: 0.25,
      ease: 'power2.in',
      onComplete: () => setSelectedPhoto(null),
    });
  };

  const handleOpenEnvelope = () => {
    if (isEnvelopeOpen) return;
    setIsEnvelopeOpen(true);

    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#ff758f', '#ffccd5', '#ffffff', '#ff4d6d', '#ffd700'],
    });

    const tl = gsap.timeline({ defaults: { ease: 'power2.inOut' } });
    tl.to(sealRef.current, {
      scale: 1.4,
      opacity: 0,
      duration: 0.3,
    })
    .to(envelopeFlapRef.current, {
      rotateX: 180,
      duration: 0.6,
    })
    .to(letterRef.current, {
      y: -140,
      scale: 1.04,
      zIndex: 30,
      duration: 0.7,
      ease: 'power2.out',
    }, '-=0.2')
    .to(letterRef.current, {
      y: 0,
      scale: 1,
      duration: 0.5,
      ease: 'back.out(1.4)',
    });
  };

  const handleOpenCake = () => {
    setShowCakeModal(true);
    confetti({
      particleCount: 90,
      spread: 80,
      origin: { y: 0.55 },
      colors: ['#ff758f', '#ffccd5', '#ffffff', '#ffd700', '#ff4d6d'],
    });
  };

  const handleBlowCandle = () => {
    setCandleBlown(true);
    confetti({
      particleCount: 120,
      spread: 100,
      origin: { y: 0.5 },
      colors: ['#ff758f', '#10b981', '#ffffff', '#ffd700', '#f472b6'],
    });
  };

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        minHeight: '100%',
        position: 'relative',
        background: '#fdf8fa',
        overflowX: 'hidden',
      }}
    >
      {/* Floating Audio Control Button */}
      <button
        onClick={onToggleMusic}
        style={{
          position: 'fixed',
          bottom: '22px',
          right: '22px',
          zIndex: 90,
          width: '46px',
          height: '46px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #ff758f 0%, #ff4d6d 100%)',
          border: '2px solid #ffffff',
          color: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 6px 20px rgba(255, 77, 109, 0.4)',
          cursor: 'pointer',
          transition: 'transform 0.2s ease',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.08)')}
        onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
      >
        {isPlaying ? <Volume2 size={20} /> : <VolumeX size={20} />}
      </button>

      {/* ========================================================= */}
      {/* SECTION 1: BLACK STARRY GALAXY (SEBUAH SEMESTA KECIL UNTUKMU) */}
      {/* ========================================================= */}
      <div
        style={{
          minHeight: '100vh',
          background: 'radial-gradient(ellipse at 50% 45%, #0c0812 0%, #050308 55%, #020104 100%)',
          color: '#ffffff',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '36px 16px 40px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Background Twinkling Space Stars */}
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
          {bgStars.map((s) => (
            <div
              key={s.id}
              style={{
                position: 'absolute',
                top: s.top,
                left: s.left,
                width: `${s.size}px`,
                height: `${s.size}px`,
                borderRadius: '50%',
                backgroundColor: s.color,
                boxShadow: `0 0 ${s.size * 2}px ${s.color}`,
                opacity: s.opacity,
                animation: `pulseGlow ${s.duration}s infinite alternate`,
                animationDelay: `${s.delay}s`,
              }}
            />
          ))}
        </div>

        {/* Top Title */}
        <div className="galaxy-header" style={{ textAlign: 'center', zIndex: 10, marginTop: '8px' }}>
          <p
            style={{
              fontSize: '0.74rem',
              letterSpacing: '3.5px',
              color: 'rgba(255, 204, 213, 0.85)',
              textTransform: 'uppercase',
              marginBottom: '6px',
              fontFamily: 'var(--font-body)',
              fontWeight: '600',
            }}
          >
            SEBUAH SEMESTA KECIL UNTUKMU
          </p>

          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '2.1rem',
              fontWeight: '700',
              color: '#ffffff',
              letterSpacing: '0.5px',
              textShadow: '0 0 20px rgba(255, 117, 143, 0.7), 0 0 35px rgba(255, 77, 109, 0.4)',
              marginBottom: '4px',
              lineHeight: '1.2',
            }}
          >
            Untuk DESY EIRLEA DRISELLE
          </h1>

          <p
            style={{
              fontFamily: 'var(--font-handwriting)',
              fontSize: '1.4rem',
              color: '#ff85a2',
              letterSpacing: '0.5px',
              textShadow: '0 0 10px rgba(255, 133, 162, 0.6)',
            }}
          >
            Spesial Untukmu Sayang 🤍
          </p>
        </div>

        {/* Center Radiant Glowing Beating Heart & Stardust Spiral */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            maxWidth: '350px',
            height: '290px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
          }}
          onClick={handleHeartTap}
        >
          {/* Stardust Nebula Spiral */}
          <svg
            viewBox="0 0 320 280"
            width="100%"
            height="100%"
            style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 2 }}
          >
            <ellipse cx="160" cy="140" rx="140" ry="70" fill="rgba(255, 77, 109, 0.12)" transform="rotate(-18 160 140)" />
            {spiralParticles.map((p) => (
              <circle
                key={p.id}
                cx={p.cx}
                cy={p.cy}
                r={p.r}
                fill={p.id % 2 === 0 ? '#ffffff' : '#ffd1dc'}
                opacity={p.opacity}
                filter="drop-shadow(0 0 3px #ff758f)"
              />
            ))}
          </svg>

          {/* Soundwave Shockwave Rings */}
          <div ref={ripple1Ref} style={{ position: 'absolute', width: '110px', height: '110px', borderRadius: '50%', border: '2px solid rgba(255, 117, 143, 0.75)', pointerEvents: 'none', zIndex: 3 }} />
          <div ref={ripple2Ref} style={{ position: 'absolute', width: '110px', height: '110px', borderRadius: '50%', border: '1.5px solid rgba(255, 182, 193, 0.5)', pointerEvents: 'none', zIndex: 3 }} />
          <div ref={auraRef} style={{ position: 'absolute', width: '160px', height: '160px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(255, 77, 109, 0.7) 0%, rgba(255, 143, 163, 0.35) 45%, transparent 70%)', filter: 'blur(30px)', pointerEvents: 'none', zIndex: 4 }} />

          {/* Orbiting Celestial Elements */}
          <div className="celestial-star" style={{ position: 'absolute', top: '32px', left: '38px', zIndex: 8, fontSize: '1.3rem', filter: 'drop-shadow(0 0 10px #ffffff)', pointerEvents: 'none' }}>🤍</div>
          <div className="celestial-star" style={{ position: 'absolute', bottom: '48px', left: '60px', zIndex: 8, filter: 'drop-shadow(0 0 14px #ffffff)', pointerEvents: 'none' }}>
            <svg viewBox="0 0 24 24" width="28" height="28" fill="#ffffff"><polygon points="12,0 15,9 24,12 15,15 12,24 9,15 0,12 9,9" /></svg>
          </div>
          <div className="celestial-star" style={{ position: 'absolute', bottom: '40px', right: '55px', zIndex: 8, filter: 'drop-shadow(0 0 14px #ffffff)', pointerEvents: 'none' }}>
            <svg viewBox="0 0 24 24" width="32" height="32" fill="#ffffff"><polygon points="12,0 15,9 24,12 15,15 12,24 9,15 0,12 9,9" /></svg>
          </div>
          <div className="celestial-star" style={{ position: 'absolute', top: '48px', right: '65px', zIndex: 8, filter: 'drop-shadow(0 0 10px #ffffff)', pointerEvents: 'none' }}>
            <svg viewBox="0 0 24 24" width="22" height="22" fill="#ffffff"><polygon points="12,0 15,9 24,12 15,15 12,24 9,15 0,12 9,9" /></svg>
          </div>

          {/* 4 Quotes Along the Orbit Curve */}
          <div style={{ position: 'absolute', top: '20px', right: '15px', fontFamily: 'var(--font-handwriting)', fontSize: '1.08rem', color: '#fff5f7', textShadow: '0 0 12px rgba(255, 117, 143, 0.9)', pointerEvents: 'none', zIndex: 9, whiteSpace: 'nowrap' }}>
            ✦ Tiap bintang mengingatkanku padamu
          </div>
          <div style={{ position: 'absolute', top: '78px', left: '2px', fontFamily: 'var(--font-handwriting)', fontSize: '1.08rem', color: '#fff5f7', textShadow: '0 0 12px rgba(255, 117, 143, 0.9)', pointerEvents: 'none', zIndex: 9, whiteSpace: 'nowrap' }}>
            ✦ Kamu pusat dari segalanya
          </div>
          <div style={{ position: 'absolute', bottom: '18px', left: '8px', fontFamily: 'var(--font-handwriting)', fontSize: '1.08rem', color: '#fff5f7', textShadow: '0 0 12px rgba(255, 117, 143, 0.9)', pointerEvents: 'none', zIndex: 9, whiteSpace: 'nowrap' }}>
            ✦ Diantara jutaan, aku memilihmu
          </div>
          <div style={{ position: 'absolute', bottom: '12px', right: '6px', fontFamily: 'var(--font-handwriting)', fontSize: '1.08rem', color: '#fff5f7', textShadow: '0 0 12px rgba(255, 117, 143, 0.9)', pointerEvents: 'none', zIndex: 9, whiteSpace: 'nowrap' }}>
            ✦ Kamu, seluruh semestaku
          </div>

          {/* 3D Heart SVG */}
          <div ref={heartRef} style={{ position: 'relative', zIndex: 10, filter: 'drop-shadow(0 0 20px #ffffff) drop-shadow(0 0 45px #ff4d6d)', cursor: 'pointer' }}>
            <svg viewBox="0 0 200 200" width="130" height="130">
              <defs>
                <radialGradient id="museumHeartGrad" cx="45%" cy="38%" r="62%">
                  <stop offset="0%" stopColor="#ffffff" />
                  <stop offset="30%" stopColor="#ffe4ea" />
                  <stop offset="65%" stopColor="#ff758f" />
                  <stop offset="88%" stopColor="#ff4d6d" />
                  <stop offset="100%" stopColor="#c9184a" />
                </radialGradient>
              </defs>
              <path d="M 100 175 C 20 120, 10 50, 60 25 C 85 10, 95 30, 100 45 C 105 30, 115 10, 140 25 C 190 50, 180 120, 100 175 Z" fill="url(#museumHeartGrad)" />
              <ellipse cx="80" cy="55" rx="22" ry="14" fill="#ffffff" opacity="0.6" transform="rotate(-30 80 55)" />
              <circle cx="95" cy="65" r="8" fill="#ffffff" opacity="0.8" />
            </svg>
          </div>
        </div>

        {/* Bottom Prompts: Tap to Play & Scroll Down to Scrapbook */}
        <div style={{ textAlign: 'center', zIndex: 10, width: '100%', maxWidth: '320px' }}>
          <div onClick={handleHeartTap} style={{ cursor: 'pointer', marginBottom: '14px' }}>
            <p style={{ fontFamily: 'var(--font-handwriting)', fontSize: '1.4rem', color: '#ff85a2', letterSpacing: '0.8px', animation: 'pulseGlow 1.5s infinite alternate' }}>
              ketukk dulu ya sayang ✨
            </p>
          </div>

          {/* Button to Scroll into Scrapbook */}
          <button
            onClick={handleScrollToScrapbook}
            style={{
              width: '100%',
              background: 'linear-gradient(135deg, #ff758f 0%, #ff4d6d 50%, #c9184a 100%)',
              color: '#ffffff',
              border: '1.5px solid rgba(255, 255, 255, 0.7)',
              padding: '13px 22px',
              borderRadius: '30px',
              fontSize: '0.96rem',
              fontWeight: '700',
              fontFamily: 'var(--font-body)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: '0 8px 30px rgba(255, 77, 109, 0.6)',
              marginBottom: '14px',
            }}
          >
            <span>Buka Scrapbook Kenangan 📖</span>
            <ChevronDown size={18} className="scroll-bounce-arrow" />
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* SECTION 2: AUTHENTIC HANDCRAFTED SCRAPBOOK ALBUM */}
      {/* ========================================================= */}
      <div
        id="pameran-start"
        style={{
          padding: '30px 14px 80px',
          background: 'linear-gradient(180deg, #fdf8fa 0%, #fff6f8 100%)',
          position: 'relative',
        }}
      >
        {/* Notebook Spiral Binding Coils on Top */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', marginBottom: '20px' }}>
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              style={{
                width: '12px',
                height: '24px',
                borderRadius: '8px',
                background: 'linear-gradient(180deg, #d1d5db 0%, #9ca3af 45%, #4b5563 80%, #1f2937 100%)',
                boxShadow: '0 3px 6px rgba(0,0,0,0.25), inset 0 1px 2px rgba(255,255,255,0.7)',
              }}
            />
          ))}
        </div>

        {/* PAMERAN 01: VINTAGE SCALLOPED BANNER + PHOTO COLLAGE (LIKE VIDEO FRAME 393) */}
        <div style={{ marginBottom: '40px', textAlign: 'center' }}>
          {/* Vintage Scalloped Oval Badge */}
          <div
            style={{
              display: 'inline-block',
              padding: '14px 24px',
              borderRadius: '24px',
              border: '2px double #b05d6f',
              background: '#fff9fa',
              boxShadow: '0 4px 15px rgba(176, 93, 111, 0.15)',
              marginBottom: '20px',
              maxWidth: '320px',
            }}
          >
            <p style={{ fontSize: '0.72rem', letterSpacing: '2px', color: '#b05d6f', fontWeight: '800', textTransform: 'uppercase', margin: '0 0 4px 0' }}>
              PAMERAN 01
            </p>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', color: '#2e1c24', margin: '0 0 4px 0' }}>
              Awalan baru buat aku yaitu kenal kamu lebih dalam
            </h3>
            <p style={{ fontSize: '0.75rem', color: '#8c6571', margin: 0, fontStyle: 'italic' }}>
              11 Desember 2025
            </p>
          </div>

          {/* 4-Photo Polaroid Grid Collage */}
          <div
            className="polaroid-card"
            style={{
              width: '100%',
              maxWidth: '315px',
              margin: '0 auto 20px',
              padding: '12px 12px 24px',
              transform: 'rotate(-2deg)',
            }}
          >
            {/* Washi Tape */}
            <div
              className="washi-tape washi-tape-pink"
              style={{ top: '-10px', left: '50%', marginLeft: '-40px' }}
            />

            {/* 2x2 Grid of Photos */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '6px',
                borderRadius: '4px',
                overflow: 'hidden',
                backgroundColor: '#f3f4f6',
              }}
            >
              <img src="/luc 1.jpeg" alt="Memory 1" style={{ width: '100%', height: '110px', objectFit: 'cover' }} />
              <img src="/luc 2.jpeg" alt="Memory 2" style={{ width: '100%', height: '110px', objectFit: 'cover' }} />
              <img src="/Blue LILY 🌊🦋.jpg" alt="Memory 3" style={{ width: '100%', height: '110px', objectFit: 'cover' }} />
              <img src="/blue 2.jpg" alt="Memory 4" style={{ width: '100%', height: '110px', objectFit: 'cover' }} />
            </div>

            <p className="polaroid-caption" style={{ marginTop: '14px', fontSize: '1.2rem' }}>
              "Momen-momen pertama yang membuka kisah indah kita ♡"
            </p>
          </div>

          {/* Story Text */}
          <p
            style={{
              fontFamily: 'var(--font-handwriting)',
              fontSize: '1.2rem',
              lineHeight: '1.6',
              color: '#4a363f',
              maxWidth: '310px',
              margin: '0 auto',
            }}
          >
            Melihat tawamu pertama kali, mendengar ceritamu, dan menyadari bahwa di dunia yang begitu luas ini, aku beruntung sekali bisa mengenalmu.
          </p>
        </div>

        {/* PAMERAN 02: TORN NOTEBOOK PAPER MEMO + MULTI-PHOTO SPREAD (LIKE VIDEO FRAME 524) */}
        <div style={{ marginBottom: '44px', textAlign: 'center' }}>
          {/* Gold Coin / Wax Seal Ornament at Top */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '-14px', zIndex: 10, position: 'relative' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: 'radial-gradient(circle at 35% 35%, #fef08a 0%, #ca8a04 70%, #713f12 100%)',
                boxShadow: '0 4px 10px rgba(0,0,0,0.25)',
                border: '1.5px solid #ffffff',
              }}
            />
          </div>

          {/* Torn Edge Notebook Sheet */}
          <div
            style={{
              background: '#ffffff',
              borderRadius: '16px',
              padding: '24px 20px',
              border: '1.5px solid rgba(220, 200, 210, 0.8)',
              boxShadow: '0 12px 30px rgba(180, 130, 150, 0.15)',
              maxWidth: '325px',
              margin: '0 auto 24px',
              textAlign: 'left',
              position: 'relative',
            }}
          >
            <p style={{ fontSize: '0.72rem', letterSpacing: '2px', color: '#b05d6f', fontWeight: '800', textTransform: 'uppercase', marginBottom: '4px' }}>
              PAMERAN 02
            </p>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.35rem', color: '#2e1c24', marginBottom: '12px' }}>
              Hal kecil yang slalu ku ingat
            </h3>
            <p
              style={{
                fontFamily: 'var(--font-handwriting)',
                fontSize: '1.25rem',
                lineHeight: '1.65',
                color: '#423139',
                margin: 0,
              }}
            >
              Mungkin kamu sering dengar ini, tapi aku tidak pernah bosan untuk bilang bahwa kebaikan hatimu, senyum tulusmu, dan caramu selalu peduli selalu tersimpan rapi di dalam ingatanku. Kamu begitu berarti bagiku.
            </p>
          </div>

          {/* Overlapping Photos with Washi Tape (Like Bottom of Video Frame 524) */}
          <div
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: '320px',
              height: '160px',
              margin: '0 auto',
            }}
          >
            {/* Photo 1: Left */}
            <div
              onClick={() => handleOpenZoom(polaroids[0])}
              style={{
                position: 'absolute',
                left: '10px',
                top: '0',
                width: '140px',
                padding: '6px 6px 14px',
                background: '#ffffff',
                boxShadow: '0 8px 20px rgba(0,0,0,0.18)',
                transform: 'rotate(-6deg)',
                borderRadius: '4px',
                cursor: 'pointer',
                zIndex: 2,
              }}
            >
              <img src="/luc 1.jpeg" alt="Thumb 1" style={{ width: '100%', height: '100px', objectFit: 'cover' }} />
              <p style={{ fontFamily: 'var(--font-handwriting)', fontSize: '0.85rem', textAlign: 'center', margin: '4px 0 0 0', color: '#333' }}>Momen Kita ♡</p>
            </div>

            {/* Photo 2: Right Overlapping */}
            <div
              onClick={() => handleOpenZoom(polaroids[1])}
              style={{
                position: 'absolute',
                right: '10px',
                top: '12px',
                width: '145px',
                padding: '6px 6px 14px',
                background: '#ffffff',
                boxShadow: '0 10px 24px rgba(0,0,0,0.22)',
                transform: 'rotate(5deg)',
                borderRadius: '4px',
                cursor: 'pointer',
                zIndex: 3,
              }}
            >
              {/* Green/Cyan Washi Tape holding it */}
              <div
                style={{
                  position: 'absolute',
                  top: '-8px',
                  left: '50%',
                  marginLeft: '-25px',
                  width: '50px',
                  height: '18px',
                  background: 'rgba(52, 211, 153, 0.75)',
                  transform: 'rotate(-4deg)',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                }}
              />
              <img src="/luc 2.jpeg" alt="Thumb 2" style={{ width: '100%', height: '100px', objectFit: 'cover' }} />
              <p style={{ fontFamily: 'var(--font-handwriting)', fontSize: '0.85rem', textAlign: 'center', margin: '4px 0 0 0', color: '#333' }}>4,000+ KM ♡</p>
            </div>
          </div>
        </div>

        {/* PAMERAN 03: FULL POLAROID EXHIBITION WITH CLICK TO ZOOM (LIKE VIDEO FRAME 655) */}
        <div style={{ marginBottom: '44px', textAlign: 'center' }}>
          <div
            style={{
              display: 'inline-block',
              padding: '14px 24px',
              borderRadius: '24px',
              border: '2px double #b05d6f',
              background: '#fff9fa',
              boxShadow: '0 4px 15px rgba(176, 93, 111, 0.15)',
              marginBottom: '26px',
              maxWidth: '320px',
            }}
          >
            <p style={{ fontSize: '0.72rem', letterSpacing: '2px', color: '#b05d6f', fontWeight: '800', textTransform: 'uppercase', margin: '0 0 4px 0' }}>
              PAMERAN 03
            </p>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', color: '#2e1c24', margin: 0 }}>
              Potongan memori favoritku 📸
            </h3>
          </div>

          {/* Stack of Tilted Polaroids with Thumbtacks and Stamps */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '34px', alignItems: 'center' }}>
            {polaroids.map((item, index) => (
              <div
                key={item.id}
                className="polaroid-card"
                onClick={() => handleOpenZoom(item)}
                style={{
                  position: 'relative',
                  width: '100%',
                  maxWidth: '310px',
                  padding: '14px 14px 28px',
                  transform: `rotate(${item.rotation})`,
                }}
              >
                {/* 3D Pushpin on Top */}
                <div
                  style={{
                    position: 'absolute',
                    top: '-12px',
                    left: '50%',
                    marginLeft: '-10px',
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    background: `radial-gradient(circle at 35% 35%, #ffffff 0%, ${item.pinColor} 60%, #881337 100%)`,
                    boxShadow: '0 4px 8px rgba(0,0,0,0.35)',
                    zIndex: 20,
                    border: '1px solid rgba(255,255,255,0.8)',
                  }}
                />

                {/* Corner Washi Tape */}
                <div
                  style={{
                    position: 'absolute',
                    top: '-8px',
                    left: index % 2 === 0 ? '-10px' : 'auto',
                    right: index % 2 === 0 ? 'auto' : '-10px',
                    width: '75px',
                    height: '24px',
                    background: item.tapeColor,
                    transform: index % 2 === 0 ? 'rotate(-25deg)' : 'rotate(25deg)',
                    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                    zIndex: 15,
                  }}
                />

                {/* Pressed Flower Deco */}
                {item.flowerDeco && (
                  <img
                    src={item.flowerDeco}
                    alt="Flower Deco"
                    style={{
                      position: 'absolute',
                      bottom: '-16px',
                      right: '-14px',
                      width: '60px',
                      height: 'auto',
                      filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))',
                      zIndex: 25,
                      pointerEvents: 'none',
                    }}
                  />
                )}

                {/* Photo Image Frame */}
                <div style={{ width: '100%', height: '240px', borderRadius: '4px', overflow: 'hidden', backgroundColor: '#f3f4f6', position: 'relative' }}>
                  <img src={item.src} alt={item.caption} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div
                    style={{
                      position: 'absolute',
                      bottom: '8px',
                      right: '8px',
                      background: 'rgba(255, 255, 255, 0.9)',
                      borderRadius: '12px',
                      padding: '3px 8px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '0.72rem',
                      color: '#ff4d6d',
                      fontWeight: '700',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                    }}
                  >
                    <ZoomIn size={12} />
                    <span>Zoom</span>
                  </div>
                </div>

                {/* Handwritten Polaroid Caption */}
                <p className="polaroid-caption" style={{ marginTop: '12px', fontSize: '1.25rem' }}>
                  {item.caption}
                </p>

                {/* Date / Love note */}
                <p style={{ fontFamily: 'var(--font-handwriting)', fontSize: '0.9rem', color: '#b05d6f', margin: '4px 0 0 0', fontStyle: 'italic' }}>
                  ♡ {item.note} ♡
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* PAMERAN 04: AUDIO GUIDE / SPOTIFY CARD (MATCHING VIDEO FRAME 655 & 786) */}
        <div
          style={{
            background: '#ffffff',
            borderRadius: '24px',
            padding: '24px 18px',
            border: '1.5px solid rgba(255, 182, 193, 0.7)',
            boxShadow: '0 12px 30px rgba(180, 100, 120, 0.12)',
            maxWidth: '340px',
            margin: '0 auto 44px',
            textAlign: 'center',
            position: 'relative',
          }}
        >
          {/* Top Washi Tape */}
          <div
            style={{
              position: 'absolute',
              top: '-10px',
              left: '50%',
              marginLeft: '-45px',
              width: '90px',
              height: '22px',
              background: 'rgba(255, 182, 193, 0.85)',
              transform: 'rotate(-1deg)',
              boxShadow: '0 2px 4px rgba(0,0,0,0.08)',
            }}
          />

          <p style={{ fontSize: '0.72rem', letterSpacing: '2px', color: '#ff758f', fontWeight: '700', textTransform: 'uppercase', marginBottom: '4px' }}>
            AUDIO GUIDE · NO. 04
          </p>

          <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '1.35rem', color: '#33222a', marginBottom: '8px' }}>
            Lagu yg membawa kamu ke aku 🎵
          </h4>

          <p style={{ fontFamily: 'var(--font-handwriting)', fontSize: '1.18rem', color: '#5c4852', marginBottom: '16px' }}>
            "Kamu juga kayaknya sudah tahu, kalau satu lagu ini bisa bikin aku selalu teringat kamu..."
          </p>

          {/* Spotify Player Box Styled Like in Video */}
          <div
            style={{
              background: 'linear-gradient(135deg, #2e1065 0%, #3b0764 100%)',
              borderRadius: '20px',
              padding: '16px 18px',
              color: '#ffffff',
              boxShadow: '0 10px 25px rgba(59, 7, 100, 0.25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #ff758f 0%, #ff4d6d 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 12px rgba(255, 77, 109, 0.4)',
                }}
              >
                <Music size={22} color="#ffffff" className={isPlaying ? 'animate-spin' : ''} />
              </div>
              <div style={{ textAlign: 'left' }}>
                <p style={{ fontSize: '0.9rem', fontWeight: '700', margin: 0 }}>
                  Soundtrack Khusus Desy
                </p>
                <p style={{ fontSize: '0.74rem', color: '#e9d5ff', margin: '2px 0 0 0' }}>
                  Diputar spesial untukmu 🤍
                </p>
              </div>
            </div>

            <button
              onClick={onToggleMusic}
              style={{
                padding: '8px 16px',
                borderRadius: '18px',
                background: 'rgba(255, 255, 255, 0.2)',
                border: '1px solid rgba(255, 255, 255, 0.4)',
                color: '#ffffff',
                fontSize: '0.78rem',
                fontWeight: '600',
                cursor: 'pointer',
              }}
            >
              {isPlaying ? 'Jeda ⏸' : 'Putar ▶'}
            </button>
          </div>
        </div>

        {/* PAMERAN TERAKHIR: BUKA SURAT (MATCHING VIDEO FRAME 786) */}
        <div style={{ textAlign: 'center', marginBottom: '44px' }}>
          <p style={{ fontSize: '0.74rem', letterSpacing: '3px', color: '#b05d6f', fontWeight: '800', textTransform: 'uppercase', marginBottom: '6px' }}>
            PAMERAN TERAKHIR
          </p>

          <h3
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.55rem',
              color: '#33222a',
              marginBottom: '20px',
            }}
          >
            Ado satu hal yang emang pengen aku bilang.. 💌
          </h3>

          {/* Interactive 3D Envelope */}
          {!isEnvelopeOpen ? (
            <div
              onClick={handleOpenEnvelope}
              style={{
                position: 'relative',
                width: '280px',
                height: '190px',
                perspective: '1000px',
                cursor: 'pointer',
                margin: '0 auto 24px',
              }}
            >
              {/* Glow */}
              <div style={{ position: 'absolute', inset: '-15px', borderRadius: '24px', background: 'radial-gradient(circle, rgba(255, 182, 193, 0.5) 0%, transparent 70%)', filter: 'blur(20px)', pointerEvents: 'none' }} />

              {/* Envelope Body */}
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, #fff0f3 0%, #ffd6df 100%)', borderRadius: '16px', border: '2px solid rgba(255, 182, 193, 0.9)', boxShadow: '0 15px 35px rgba(255, 117, 143, 0.25)', overflow: 'hidden' }}>
                <svg viewBox="0 0 280 190" width="100%" height="100%" style={{ position: 'absolute', inset: 0 }}>
                  <path d="M 0 190 L 140 100 L 280 190 Z" fill="#ffccd5" opacity="0.6" />
                  <path d="M 0 0 L 140 100 L 0 190 Z" fill="#ffd1dc" opacity="0.4" />
                  <path d="M 280 0 L 140 100 L 280 190 Z" fill="#ffd1dc" opacity="0.4" />
                </svg>
              </div>

              {/* Flap */}
              <div ref={envelopeFlapRef} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100px', transformOrigin: 'top center', transformStyle: 'preserve-3d', zIndex: 15 }}>
                <svg viewBox="0 0 280 100" width="100%" height="100%">
                  <path d="M 0 0 L 140 95 L 280 0 Z" fill="#ffd1dc" stroke="rgba(255, 182, 193, 0.8)" strokeWidth="1.5" />
                </svg>
              </div>

              {/* Wax Seal */}
              <div ref={sealRef} style={{ position: 'absolute', top: '72px', left: '50%', marginLeft: '-25px', width: '50px', height: '50px', borderRadius: '50%', background: 'linear-gradient(135deg, #c9184a 0%, #800f2f 100%)', border: '2px solid #ffffff', boxShadow: '0 6px 16px rgba(128, 15, 47, 0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 25 }}>
                <Heart size={24} color="#ffffff" fill="#ffffff" />
              </div>
            </div>
          ) : (
            /* Open Letter Paper */
            <div
              ref={letterRef}
              style={{
                width: '100%',
                maxWidth: '335px',
                background: '#ffffff',
                borderRadius: '24px',
                padding: '28px 22px 24px',
                border: '2px solid rgba(255, 182, 193, 0.7)',
                boxShadow: '0 20px 50px rgba(255, 143, 163, 0.25)',
                margin: '0 auto 24px',
                textAlign: 'left',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.78rem', color: '#806b74', marginBottom: '14px', borderBottom: '1px dashed #ffccd5', paddingBottom: '8px' }}>
                <span>Surat Cinta Untukmu</span>
                <span>🤍 Desy Eirlea Driselle</span>
              </div>

              <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', color: '#c9184a', marginBottom: '12px' }}>
                Happy Birthday, Sayang ❤️
              </h4>

              <div style={{ fontFamily: 'var(--font-handwriting)', fontSize: '1.25rem', lineHeight: '1.6', color: '#382b31' }}>
                <p style={{ marginBottom: '12px' }}>
                  makasii banyak sudah milih buat jalani hidup bersamaku, makasii banyak sudah selalu ada mendengarkan keluh kesahku, dan makasii banyak sudah masukin aku ke cerita kecilmu 🤍
                </p>
                <p style={{ marginBottom: '12px' }}>
                  Doa dan rasa sayangku selalu menyertaimu di setiap helaan nafas. Semoga tahun ini membawa limpahan kesehatan, kebahagiaan sejati, dan semua impianmu terwujud.
                </p>
                <p style={{ fontStyle: 'italic', color: '#a51d38', margin: 0 }}>
                  Happy birthday, my dearest Desy. You deserve everything beautiful in this world.
                </p>
              </div>

              <div style={{ marginTop: '18px', textAlign: 'right', borderTop: '1px dashed #ffccd5', paddingTop: '10px' }}>
                <p style={{ fontSize: '0.75rem', color: '#806b74', margin: '0 0 2px 0' }}>With all my love,</p>
                <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', color: '#ff4d6d', fontWeight: '700', margin: 0 }}>
                  🤍
                </p>
              </div>
            </div>
          )}

          {!isEnvelopeOpen && (
            <button
              onClick={handleOpenEnvelope}
              style={{
                background: 'linear-gradient(135deg, #b05d6f 0%, #8c3f52 100%)',
                color: '#ffffff',
                border: 'none',
                padding: '12px 32px',
                borderRadius: '30px',
                fontSize: '0.94rem',
                fontWeight: '700',
                cursor: 'pointer',
                boxShadow: '0 6px 20px rgba(176, 93, 111, 0.4)',
              }}
            >
              BUKA SURAT 💌
            </button>
          )}
        </div>

        {/* PENUTUP & BUKET APRESIASI (MATCHING VIDEO FRAME 917 & 1048) */}
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <p style={{ fontSize: '0.74rem', letterSpacing: '3px', color: '#b05d6f', fontWeight: '800', textTransform: 'uppercase', marginBottom: '8px' }}>
            PENUTUP
          </p>

          <p
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.15rem',
              lineHeight: '1.6',
              color: '#382b31',
              maxWidth: '320px',
              margin: '0 auto 24px',
              fontStyle: 'italic',
            }}
          >
            "Kalau museum ini adalah caraku mengingatmu, maka bagian selanjutnya adalah cara kecilku memberimu sesuatu."
          </p>

          {/* Bouquet Appreciation Card (Like Video Frame 1048) */}
          <div
            style={{
              background: '#ffffff',
              borderRadius: '28px',
              padding: '26px 18px 22px',
              border: '1.5px solid rgba(255, 182, 193, 0.7)',
              boxShadow: '0 15px 35px rgba(255, 143, 163, 0.2)',
              maxWidth: '335px',
              margin: '0 auto 24px',
            }}
          >
            {/* Bouquet Image */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '14px' }}>
              <img
                src="/bucket bunga 2 no bg.png"
                alt="Bouquet Bunga"
                style={{ width: '100px', height: 'auto', filter: 'drop-shadow(0 8px 18px rgba(255, 117, 143, 0.45))' }}
              />
            </div>

            <p style={{ fontSize: '0.72rem', letterSpacing: '2px', color: '#c9184a', fontWeight: '700', textTransform: 'uppercase', marginBottom: '4px' }}>
              APRESIASI
            </p>

            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.35rem', color: '#33222a', marginBottom: '6px', fontStyle: 'italic' }}>
              Thank You for Staying untuk Desy...
            </h3>

            <p style={{ fontSize: '0.82rem', color: '#806b74', marginBottom: '16px' }}>
              Terima kasih karena tetap ada dan mewarnai duniaku 🤍
            </p>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', flexWrap: 'wrap', marginBottom: '18px' }}>
              <span style={{ fontSize: '0.74rem', background: '#fff0f3', color: '#c9184a', padding: '4px 10px', borderRadius: '12px', fontWeight: '600' }}>Pink rose · Gratitude</span>
              <span style={{ fontSize: '0.74rem', background: '#f0f9ff', color: '#0284c7', padding: '4px 10px', borderRadius: '12px', fontWeight: '600' }}>Blue hydrangea · Gratitude</span>
              <span style={{ fontSize: '0.74rem', background: '#fefce8', color: '#ca8a04', padding: '4px 10px', borderRadius: '12px', fontWeight: '600' }}>White daisy · Innocence</span>
            </div>

            {/* Birthday Cake Celebration Toast Button */}
            <button
              onClick={handleOpenCake}
              style={{
                width: '100%',
                background: 'linear-gradient(135deg, #b05d6f 0%, #8c3f52 100%)',
                color: '#ffffff',
                border: 'none',
                padding: '12px 20px',
                borderRadius: '24px',
                fontSize: '0.94rem',
                fontWeight: '700',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 6px 20px rgba(176, 93, 111, 0.4)',
              }}
            >
              <Cake size={18} />
              <span>Tiup Lilin & Toast Bersama 💕</span>
            </button>
          </div>

          {/* Replay Button */}
          <button
            onClick={onRestart}
            style={{
              background: 'none',
              border: 'none',
              color: '#806b74',
              fontSize: '0.85rem',
              fontWeight: '600',
              cursor: 'pointer',
              textDecoration: 'underline',
              padding: '6px 12px',
            }}
          >
            Ulangi Dari Awal ↺
          </button>
        </div>
      </div>

      {/* FULL-SCREEN ZOOM LIGHTBOX MODAL */}
      {selectedPhoto && (
        <div
          onClick={handleCloseZoom}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 999,
            background: 'rgba(25, 12, 18, 0.88)',
            backdropFilter: 'blur(10px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
        >
          <div
            className="zoom-modal-content polaroid-card"
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: '350px',
              padding: '14px 14px 26px',
              position: 'relative',
              boxShadow: '0 25px 60px rgba(0,0,0,0.55), 0 0 30px rgba(255, 117, 143, 0.35)',
            }}
          >
            <button
              onClick={handleCloseZoom}
              style={{
                position: 'absolute',
                top: '-14px',
                right: '-14px',
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: '#ff4d6d',
                color: '#ffffff',
                border: '2px solid #ffffff',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
                zIndex: 30,
              }}
            >
              <X size={20} />
            </button>

            <img
              src={selectedPhoto.src}
              alt={selectedPhoto.caption}
              style={{ width: '100%', maxHeight: '380px', objectFit: 'cover', borderRadius: '4px', display: 'block', marginBottom: '14px' }}
            />

            <p style={{ fontFamily: 'var(--font-handwriting)', fontSize: '1.45rem', color: '#33222a', textAlign: 'center', margin: '0 0 8px 0', lineHeight: '1.3' }}>
              {selectedPhoto.caption}
            </p>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', fontSize: '0.78rem', color: '#806b74' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Calendar size={13} color="#ff758f" />{selectedPhoto.date}</span>
              {selectedPhoto.location && <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><MapPin size={13} color="#ff758f" />{selectedPhoto.location}</span>}
            </div>
          </div>
        </div>
      )}

      {/* BIRTHDAY CAKE MODAL */}
      {showCakeModal && (
        <div
          onClick={() => setShowCakeModal(false)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 999,
            background: 'rgba(25, 12, 18, 0.85)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#ffffff',
              borderRadius: '28px',
              padding: '28px 20px',
              maxWidth: '320px',
              width: '100%',
              textAlign: 'center',
              border: '2px solid rgba(255, 182, 193, 0.8)',
              boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
              position: 'relative',
            }}
          >
            <button
              onClick={() => setShowCakeModal(false)}
              style={{
                position: 'absolute',
                top: '-12px',
                right: '-12px',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: '#ff4d6d',
                color: '#ffffff',
                border: '2px solid #ffffff',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <X size={18} />
            </button>

            <div style={{ fontSize: '3.8rem', marginBottom: '8px', position: 'relative' }}>
              🎂
              {!candleBlown && (
                <div style={{ position: 'absolute', top: '-6px', left: '50%', transform: 'translateX(-50%)', fontSize: '1.2rem', animation: 'pulseGlow 0.8s infinite alternate' }}>
                  🔥
                </div>
              )}
            </div>

            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.45rem', color: '#33222a', marginBottom: '6px' }}>
              Happy Birthday, Desy Eirlea Driselle! 🎂✨
            </h3>

            <p style={{ fontSize: '0.88rem', color: '#806b74', marginBottom: '20px', lineHeight: '1.5' }}>
              {candleBlown ? 'Semoga setiap doa dan impian indahmu terkabul! 💖' : 'Ketuk tombol di bawah untuk meniup lilinnya 🕯️'}
            </p>

            {!candleBlown ? (
              <button
                onClick={handleBlowCandle}
                style={{
                  background: 'linear-gradient(135deg, #ff758f 0%, #ff4d6d 100%)',
                  color: '#ffffff',
                  border: 'none',
                  padding: '10px 24px',
                  borderRadius: '24px',
                  fontSize: '0.92rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  boxShadow: '0 4px 15px rgba(255, 77, 109, 0.4)',
                }}
              >
                Tiup Lilin 💨
              </button>
            ) : (
              <button
                onClick={() => setShowCakeModal(false)}
                style={{
                  background: '#10b981',
                  color: '#ffffff',
                  border: 'none',
                  padding: '10px 24px',
                  borderRadius: '24px',
                  fontSize: '0.92rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                }}
              >
                Tutup & Rayakan 💕
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
