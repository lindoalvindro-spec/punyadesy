import React, { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import confetti from 'canvas-confetti';
import { Heart, Sparkles, Music, ArrowRight } from 'lucide-react';

export default function HeartGalaxyScreen({ onContinue, onPlayMusic }) {
  const containerRef = useRef(null);
  const heartRef = useRef(null);
  const auraRef = useRef(null);
  const ripple1Ref = useRef(null);
  const ripple2Ref = useRef(null);
  const buttonRef = useRef(null);

  const [hasTapped, setHasTapped] = useState(false);

  // 1. Background Twinkling Stardust (50 stars scattered across universe)
  const bgStars = Array.from({ length: 50 }).map((_, i) => ({
    id: i,
    top: `${Math.random() * 96}%`,
    left: `${Math.random() * 96}%`,
    size: Math.random() * 2.8 + 1.2,
    duration: Math.random() * 3 + 1.5,
    delay: Math.random() * 2.5,
    opacity: Math.random() * 0.7 + 0.3,
    color: i % 3 === 0 ? '#ffccd5' : i % 3 === 1 ? '#ffffff' : '#fce7f3',
  }));

  // 2. Curving Galactic Arm Stardust (Points along the spiral)
  const spiralParticles = Array.from({ length: 45 }).map((_, i) => {
    // Elliptical spiral formula
    const t = (i / 45) * Math.PI * 2.2 - 0.4;
    const a = 145; // x radius
    const b = 65;  // y radius
    const tilt = -0.32; // tilt angle in radians
    const x0 = Math.cos(t) * a;
    const y0 = Math.sin(t) * b;
    // Rotate by tilt
    const x = x0 * Math.cos(tilt) - y0 * Math.sin(tilt) + 160;
    const y = x0 * Math.sin(tilt) + y0 * Math.cos(tilt) + 140;
    return {
      id: i,
      cx: x + (Math.random() * 16 - 8),
      cy: y + (Math.random() * 14 - 7),
      r: Math.random() * 2 + 1,
      opacity: Math.random() * 0.75 + 0.25,
    };
  });

  useGSAP(() => {
    // Entrance animations
    const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });

    tl.fromTo('.galaxy-header',
      { opacity: 0, y: -25 },
      { opacity: 1, y: 0, duration: 1.1 }
    )
    .fromTo('.galaxy-spiral',
      { opacity: 0, scale: 0.8 },
      { opacity: 1, scale: 1, duration: 1.4, ease: 'sine.out' },
      '-=0.7'
    )
    .fromTo(heartRef.current,
      { scale: 0.3, opacity: 0 },
      { scale: 1, opacity: 1, duration: 1.2, ease: 'back.out(1.8)' },
      '-=0.8'
    )
    .fromTo('.celestial-star',
      { scale: 0, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.8, stagger: 0.15, ease: 'back.out(2)' },
      '-=0.5'
    )
    .fromTo('.orbit-quote',
      { opacity: 0, scale: 0.85 },
      { opacity: 1, scale: 1, duration: 0.8, stagger: 0.18 },
      '-=0.4'
    )
    .fromTo('.tap-prompt',
      { opacity: 0, y: 15 },
      { opacity: 1, y: 0, duration: 0.7 },
      '-=0.2'
    );

    // Continuous heartbeat pulse
    if (heartRef.current) {
      gsap.to(heartRef.current, {
        scale: 1.12,
        duration: 0.75,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
    }

    // Expanding soundwave aura rings
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

    // Glowing stars soft floating and sparkling
    gsap.to('.celestial-star', {
      scale: 1.2,
      rotation: '+=15',
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      stagger: 0.3,
    });

    // Quotes gentle drift
    gsap.to('.orbit-quote', {
      y: '+=5',
      duration: 2.5,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      stagger: 0.25,
    });
  }, { scope: containerRef });

  const handleHeartTap = () => {
    if (!hasTapped) {
      setHasTapped(true);
      if (onPlayMusic) onPlayMusic();

      // Confetti burst of sparkling stars & hearts
      confetti({
        particleCount: 50,
        spread: 80,
        origin: { y: 0.5 },
        colors: ['#ff758f', '#ffffff', '#ffccd5', '#ffd700', '#ff4d6d'],
      });

      // Quick heart beat thump
      gsap.timeline()
        .to(heartRef.current, { scale: 1.35, duration: 0.15, ease: 'back.out(2)' })
        .to(heartRef.current, { scale: 1.12, duration: 0.3 });

      // Pop in the continue button
      requestAnimationFrame(() => {
        gsap.fromTo(buttonRef.current,
          { opacity: 0, y: 25, scale: 0.8 },
          { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: 'back.out(1.8)', delay: 0.3 }
        );
      });
    }
  };

  const handleEnterScrapbook = () => {
    gsap.to(containerRef.current, {
      opacity: 0,
      scale: 1.05,
      duration: 0.7,
      ease: 'power2.inOut',
      onComplete: () => {
        if (onContinue) onContinue();
      },
    });
  };

  return (
    <div
      ref={containerRef}
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 100,
        background: 'radial-gradient(ellipse at 50% 45%, #0c0812 0%, #050308 55%, #020104 100%)',
        color: '#ffffff',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '30px 16px 36px',
        overflow: 'hidden',
        width: '100%',
        height: '100%',
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

      {/* TOP HEADER (Matching Reference Video Exact Wording) */}
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

        <h2
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '2rem',
            fontWeight: '700',
            color: '#ffffff',
            letterSpacing: '0.5px',
            textShadow: '0 0 20px rgba(255, 117, 143, 0.7), 0 0 35px rgba(255, 77, 109, 0.4)',
            marginBottom: '4px',
            lineHeight: '1.2',
          }}
        >
          Untuk DESY EIRLEA DRISELLE
        </h2>

        <p
          style={{
            fontFamily: 'var(--font-handwriting)',
            fontSize: '1.35rem',
            color: '#ff85a2',
            letterSpacing: '0.5px',
            textShadow: '0 0 10px rgba(255, 133, 162, 0.6)',
          }}
        >
          Spesial Untukmu Sayang 🤍
        </p>
      </div>

      {/* CENTER CELESTIAL HEART & GALAXY STARDUST SPIRAL */}
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
        {/* SVG Curved Stardust Nebula Spiral Trail */}
        <svg
          className="galaxy-spiral"
          viewBox="0 0 320 280"
          width="100%"
          height="100%"
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            zIndex: 2,
          }}
        >
          <defs>
            <radialGradient id="nebulaGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ff4d6d" stopOpacity="0.4" />
              <stop offset="50%" stopColor="#ff758f" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#000000" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Faint Nebula Gas Cloud */}
          <ellipse cx="160" cy="140" rx="140" ry="70" fill="url(#nebulaGlow)" transform="rotate(-18 160 140)" />

          {/* Curving Dust Band Particles */}
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

        {/* Expanding Soundwave Ripple Rings */}
        <div
          ref={ripple1Ref}
          style={{
            position: 'absolute',
            width: '110px',
            height: '110px',
            borderRadius: '50%',
            border: '2px solid rgba(255, 117, 143, 0.75)',
            pointerEvents: 'none',
            zIndex: 3,
          }}
        />
        <div
          ref={ripple2Ref}
          style={{
            position: 'absolute',
            width: '110px',
            height: '110px',
            borderRadius: '50%',
            border: '1.5px solid rgba(255, 182, 193, 0.5)',
            pointerEvents: 'none',
            zIndex: 3,
          }}
        />

        {/* Ambient Center Heart Aura */}
        <div
          ref={auraRef}
          style={{
            position: 'absolute',
            width: '160px',
            height: '160px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255, 77, 109, 0.7) 0%, rgba(255, 143, 163, 0.35) 45%, transparent 70%)',
            filter: 'blur(30px)',
            pointerEvents: 'none',
            zIndex: 4,
          }}
        />

        {/* 1. Upper-Left Floating Glowing Heart (Like Reference Video) */}
        <div
          className="celestial-star"
          style={{
            position: 'absolute',
            top: '32px',
            left: '38px',
            zIndex: 8,
            fontSize: '1.3rem',
            filter: 'drop-shadow(0 0 10px #ffffff) drop-shadow(0 0 18px #ff758f)',
            pointerEvents: 'none',
          }}
        >
          🤍
        </div>

        {/* 2. Lower-Left Big 6-Pointed Twinkling Star (Like Reference Video) */}
        <div
          className="celestial-star"
          style={{
            position: 'absolute',
            bottom: '48px',
            left: '60px',
            zIndex: 8,
            filter: 'drop-shadow(0 0 14px #ffffff) drop-shadow(0 0 24px #ff758f)',
            pointerEvents: 'none',
          }}
        >
          <svg viewBox="0 0 24 24" width="28" height="28" fill="#ffffff">
            <polygon points="12,0 15,9 24,12 15,15 12,24 9,15 0,12 9,9" />
          </svg>
        </div>

        {/* 3. Lower-Right Big 6-Pointed Twinkling Star (Like Reference Video) */}
        <div
          className="celestial-star"
          style={{
            position: 'absolute',
            bottom: '40px',
            right: '55px',
            zIndex: 8,
            filter: 'drop-shadow(0 0 14px #ffffff) drop-shadow(0 0 24px #ff758f)',
            pointerEvents: 'none',
          }}
        >
          <svg viewBox="0 0 24 24" width="32" height="32" fill="#ffffff">
            <polygon points="12,0 15,9 24,12 15,15 12,24 9,15 0,12 9,9" />
          </svg>
        </div>

        {/* 4. Upper-Right Mini Celestial Star */}
        <div
          className="celestial-star"
          style={{
            position: 'absolute',
            top: '48px',
            right: '65px',
            zIndex: 8,
            filter: 'drop-shadow(0 0 10px #ffffff) drop-shadow(0 0 18px #ff758f)',
            pointerEvents: 'none',
          }}
        >
          <svg viewBox="0 0 24 24" width="22" height="22" fill="#ffffff">
            <polygon points="12,0 15,9 24,12 15,15 12,24 9,15 0,12 9,9" />
          </svg>
        </div>

        {/* 5. Far-Right Floating Mini Heart in Orbit */}
        <div
          className="celestial-star"
          style={{
            position: 'absolute',
            top: '52%',
            right: '18px',
            zIndex: 8,
            fontSize: '1.1rem',
            filter: 'drop-shadow(0 0 10px #ffccd5)',
            pointerEvents: 'none',
          }}
        >
          🤍
        </div>

        {/* ORBITING ROMANTIC PHRASES (Carefully Arranged Along the Orbit Curve) */}
        {/* Quote 1: Top Right */}
        <div
          className="orbit-quote"
          style={{
            position: 'absolute',
            top: '20px',
            right: '15px',
            fontFamily: 'var(--font-handwriting)',
            fontSize: '1.08rem',
            color: '#fff5f7',
            textShadow: '0 0 12px rgba(255, 117, 143, 0.9), 0 2px 4px rgba(0,0,0,0.9)',
            pointerEvents: 'none',
            zIndex: 9,
            whiteSpace: 'nowrap',
          }}
        >
          ✦ Tiap bintang mengingatkanku padamu
        </div>

        {/* Quote 2: Mid-Left */}
        <div
          className="orbit-quote"
          style={{
            position: 'absolute',
            top: '78px',
            left: '2px',
            fontFamily: 'var(--font-handwriting)',
            fontSize: '1.08rem',
            color: '#fff5f7',
            textShadow: '0 0 12px rgba(255, 117, 143, 0.9), 0 2px 4px rgba(0,0,0,0.9)',
            pointerEvents: 'none',
            zIndex: 9,
            whiteSpace: 'nowrap',
          }}
        >
          ✦ Kamu pusat dari segalanya
        </div>

        {/* Quote 3: Bottom-Left */}
        <div
          className="orbit-quote"
          style={{
            position: 'absolute',
            bottom: '18px',
            left: '8px',
            fontFamily: 'var(--font-handwriting)',
            fontSize: '1.08rem',
            color: '#fff5f7',
            textShadow: '0 0 12px rgba(255, 117, 143, 0.9), 0 2px 4px rgba(0,0,0,0.9)',
            pointerEvents: 'none',
            zIndex: 9,
            whiteSpace: 'nowrap',
          }}
        >
          ✦ Diantara jutaan, aku memilihmu
        </div>

        {/* Quote 4: Bottom-Right */}
        <div
          className="orbit-quote"
          style={{
            position: 'absolute',
            bottom: '12px',
            right: '6px',
            fontFamily: 'var(--font-handwriting)',
            fontSize: '1.08rem',
            color: '#fff5f7',
            textShadow: '0 0 12px rgba(255, 117, 143, 0.9), 0 2px 4px rgba(0,0,0,0.9)',
            pointerEvents: 'none',
            zIndex: 9,
            whiteSpace: 'nowrap',
          }}
        >
          ✦ Kamu, seluruh semestaku
        </div>

        {/* CENTER 3D RADIANT GLOWING HEART */}
        <div
          ref={heartRef}
          style={{
            position: 'relative',
            zIndex: 10,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            filter: 'drop-shadow(0 0 20px #ffffff) drop-shadow(0 0 45px #ff4d6d)',
            cursor: 'pointer',
          }}
        >
          <svg viewBox="0 0 200 200" width="130" height="130">
            <defs>
              {/* Vibrant Radiant Core Gradient (Hot White Core to Soft Blush) */}
              <radialGradient id="centerGlowHeart" cx="45%" cy="38%" r="62%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="30%" stopColor="#ffe4ea" />
                <stop offset="65%" stopColor="#ff758f" />
                <stop offset="88%" stopColor="#ff4d6d" />
                <stop offset="100%" stopColor="#c9184a" />
              </radialGradient>
            </defs>

            {/* Main Heart Path */}
            <path
              d="M 100 175 C 20 120, 10 50, 60 25 C 85 10, 95 30, 100 45 C 105 30, 115 10, 140 25 C 190 50, 180 120, 100 175 Z"
              fill="url(#centerGlowHeart)"
            />

            {/* Inner White Shine Flare */}
            <ellipse cx="80" cy="55" rx="22" ry="14" fill="#ffffff" opacity="0.6" transform="rotate(-30 80 55)" />
            <circle cx="95" cy="65" r="8" fill="#ffffff" opacity="0.8" />
          </svg>
        </div>
      </div>

      {/* FOOTER SECTION: INSTRUCTION OR PROCEED BUTTON */}
      <div style={{ textAlign: 'center', zIndex: 10, width: '100%', maxWidth: '310px' }}>
        {!hasTapped ? (
          <div className="tap-prompt" onClick={handleHeartTap} style={{ cursor: 'pointer' }}>
            <p
              style={{
                fontFamily: 'var(--font-handwriting)',
                fontSize: '1.4rem',
                color: '#ff85a2',
                letterSpacing: '0.8px',
                animation: 'pulseGlow 1.5s infinite alternate',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <span>ketukk dulu ya sayang</span>
              <span style={{ fontSize: '1.2rem' }}>✨</span>
            </p>
          </div>
        ) : (
          <div ref={buttonRef}>
            {/* Animated Audio Equalizer Indicator */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '5px 16px',
                background: 'rgba(255, 117, 143, 0.15)',
                border: '1px solid rgba(255, 182, 193, 0.4)',
                borderRadius: '20px',
                color: '#ffccd5',
                fontSize: '0.82rem',
                marginBottom: '14px',
                boxShadow: '0 0 15px rgba(255, 117, 143, 0.25)',
              }}
            >
              <Music size={14} className="animate-spin" />
              <span>Lagu diputar spesial untukmu 🎵</span>
            </div>

            {/* Glowing CTA Button */}
            <button
              onClick={handleEnterScrapbook}
              style={{
                width: '100%',
                background: 'linear-gradient(135deg, #ff758f 0%, #ff4d6d 50%, #c9184a 100%)',
                color: '#ffffff',
                border: '1.5px solid rgba(255, 255, 255, 0.7)',
                padding: '14px 24px',
                borderRadius: '30px',
                fontSize: '0.98rem',
                fontWeight: '700',
                fontFamily: 'var(--font-body)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 8px 30px rgba(255, 77, 109, 0.6), 0 0 25px rgba(255, 117, 143, 0.5)',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.04)';
                e.currentTarget.style.boxShadow = '0 10px 35px rgba(255, 77, 109, 0.8), 0 0 35px rgba(255, 143, 163, 0.7)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = '0 8px 30px rgba(255, 77, 109, 0.6), 0 0 25px rgba(255, 117, 143, 0.5)';
              }}
            >
              <span>Buka Buku Scrapbook Kenangan 📖</span>
              <ArrowRight size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
