import React, { useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import confetti from 'canvas-confetti';
import { Sparkles, Heart, Gift, Star, ChevronRight } from 'lucide-react';

export default function GinghamBirthdayCard() {
  const cardContainerRef = useRef(null);
  const cardOuterRef = useRef(null);
  const frontCoverRef = useRef(null);
  const badgeRef = useRef(null);
  const photoRef = useRef(null);
  const innerContentRef = useRef(null);

  const [isOpen, setIsOpen] = useState(false);
  const [floatingHearts, setFloatingHearts] = useState([]);

  // Generate 20-point Starburst SVG Path
  const generateStarburstPath = () => {
    const points = [];
    const numPoints = 20;
    const outerRadius = 90;
    const innerRadius = 78;
    const cx = 100;
    const cy = 100;

    for (let i = 0; i < numPoints * 2; i++) {
      const radius = i % 2 === 0 ? outerRadius : innerRadius;
      const angle = (i * Math.PI) / numPoints;
      const x = cx + radius * Math.cos(angle);
      const y = cy + radius * Math.sin(angle);
      points.push(`${x.toFixed(2)},${y.toFixed(2)}`);
    }

    return `M ${points.join(' L ')} Z`;
  };

  // GSAP 3D Hover Parallax Tilt
  const handleMouseMove = (e) => {
    if (isOpen || !cardOuterRef.current) return;
    const rect = cardOuterRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    gsap.to(cardOuterRef.current, {
      rotateY: x * 0.04,
      rotateX: -y * 0.04,
      duration: 0.5,
      ease: 'power1.out',
    });

    gsap.to(badgeRef.current, {
      z: 25,
      x: x * 0.02,
      y: y * 0.02,
      duration: 0.5,
    });

    gsap.to(photoRef.current, {
      z: 20,
      x: x * 0.02,
      y: y * 0.02,
      duration: 0.5,
    });
  };

  const handleMouseLeave = () => {
    if (isOpen || !cardOuterRef.current) return;
    gsap.to(cardOuterRef.current, {
      rotateY: 0,
      rotateX: 0,
      duration: 0.8,
      ease: 'power2.out',
    });

    gsap.to([badgeRef.current, photoRef.current], {
      z: 0,
      x: 0,
      y: 0,
      duration: 0.8,
    });
  };

  // Toggle Open 3D Unfold Animation
  const handleCardClick = () => {
    const nextState = !isOpen;
    setIsOpen(nextState);

    if (nextState) {
      // Trigger Confetti Burst
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#b4001e', '#ff4d6d', '#ffffff', '#ffccd5', '#ffd700'],
      });

      // Spawn floating hearts
      const hearts = Array.from({ length: 12 }).map((_, i) => ({
        id: Date.now() + i,
        left: `${15 + Math.random() * 70}%`,
        size: 16 + Math.random() * 14,
        delay: Math.random() * 0.4,
      }));
      setFloatingHearts(hearts);

      // GSAP 3D Open Timeline
      const tl = gsap.timeline({ defaults: { ease: 'power3.inOut' } });

      tl.to(frontCoverRef.current, {
        rotateY: -160,
        duration: 1.1,
      })
      .fromTo(innerContentRef.current,
        { opacity: 0, scale: 0.9, z: -10 },
        { opacity: 1, scale: 1, z: 1, duration: 0.6, ease: 'back.out(1.5)' },
        '-=0.5'
      );
    } else {
      // Close Card
      const tl = gsap.timeline({ defaults: { ease: 'power3.inOut' } });

      tl.to(frontCoverRef.current, {
        rotateY: 0,
        duration: 0.9,
      })
      .to(innerContentRef.current, {
        opacity: 0,
        duration: 0.3,
      }, '-=0.8');
    }
  };

  useGSAP(() => {
    // Idle pulse animation for Starburst badge
    gsap.to(badgeRef.current, {
      scale: 1.03,
      duration: 1.6,
      yoyo: true,
      repeat: -1,
      ease: 'sine.inOut',
    });
  }, { scope: cardContainerRef });

  return (
    <div
      ref={cardContainerRef}
      style={{
        width: '100%',
        margin: '0 auto 36px',
        padding: '10px 0',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        position: 'relative',
      }}
    >
      {/* Section Header */}
      <div style={{ textAlign: 'center', marginBottom: '18px' }}>
        <p style={{ fontSize: '0.75rem', letterSpacing: '1.5px', color: '#ff4d6d', fontWeight: '600', marginBottom: '4px' }}>
          — SPECIAL BIRTHDAY CARD —
        </p>
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', marginBottom: '4px' }}>
          Interactive Gift Card 🎁
        </h3>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          Tap the card to open Desy's birthday surprise ✨
        </p>
      </div>

      {/* 3D Perspective Card Shell */}
      <div
        style={{
          perspective: '1400px',
          width: '100%',
          maxWidth: '360px',
          height: '240px',
          cursor: 'pointer',
          position: 'relative',
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={handleCardClick}
      >
        {/* Outer 3D Card Base */}
        <div
          ref={cardOuterRef}
          style={{
            width: '100%',
            height: '100%',
            position: 'relative',
            transformStyle: 'preserve-3d',
            borderRadius: '16px',
            boxShadow: isOpen
              ? '0 20px 40px rgba(0,0,0,0.8), 0 0 30px rgba(180, 0, 30, 0.4)'
              : '0 14px 30px rgba(0,0,0,0.6), 0 0 20px rgba(0,0,0,0.4)',
            transition: 'box-shadow 0.4s ease',
          }}
        >
          {/* ================= INNER CARD (INSIDE REVEAL) ================= */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: '16px',
              background: 'linear-gradient(135deg, #fff0f3 0%, #fff 50%, #ffe6ea 100%)',
              color: '#800016',
              padding: '20px 18px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: 'inset 0 0 15px rgba(180, 0, 30, 0.1)',
              border: '2px solid #ffccd5',
              overflow: 'hidden',
            }}
          >
            {/* Background Decorative Hearts */}
            <div style={{ position: 'absolute', top: '10px', right: '12px', opacity: 0.15, fontSize: '3.5rem' }}>
              💖
            </div>

            {/* Inner Content */}
            <div ref={innerContentRef} style={{ opacity: 0, position: 'relative', zIndex: 2 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <Sparkles size={18} color="#b4001e" />
                <span style={{ fontSize: '0.82rem', fontWeight: '700', letterSpacing: '1px', color: '#b4001e' }}>
                  A SPECIAL MESSAGE FOR DESY EIRLEA DRISELLE
                </span>
              </div>

              <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', color: '#73000b', marginBottom: '8px' }}>
                Happy Birthday, Sayang! 🎂✨
              </h4>

              <p style={{ fontSize: '0.85rem', lineHeight: '1.55', color: '#590008', fontWeight: '500' }}>
                You bring so much light, elegance, and warmth into my world. Wishing you a year filled with boundless happiness, radiant health, and the fulfillment of your greatest dreams! 💕
              </p>
            </div>

            {/* Inner Footer */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', zIndex: 2 }}>
              <span style={{ fontSize: '0.78rem', fontStyle: 'italic', color: '#b4001e', fontWeight: '600' }}>
                With all my love 🤍
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: '#73000b', fontWeight: '700' }}>
                <span>Tap to close</span>
                <ChevronRight size={14} />
              </div>
            </div>

            {/* Floating Heart Particles */}
            {floatingHearts.map((h) => (
              <div
                key={h.id}
                style={{
                  position: 'absolute',
                  left: h.left,
                  bottom: '-10px',
                  fontSize: `${h.size}px`,
                  animation: `floatUp 2.8s ease-out forwards`,
                  animationDelay: `${h.delay}s`,
                  pointerEvents: 'none',
                  zIndex: 3,
                }}
              >
                ❤️
              </div>
            ))}
          </div>

          {/* ================= FRONT COVER (TWO-PANEL FLIP) ================= */}
          <div
            ref={frontCoverRef}
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: '16px',
              transformStyle: 'preserve-3d',
              transformOrigin: 'left center',
              display: 'flex',
              overflow: 'hidden',
              boxShadow: '4px 0 15px rgba(0,0,0,0.3)',
              border: '1.5px solid rgba(255, 255, 255, 0.4)',
              zIndex: 10,
            }}
          >
            {/* LEFT PANEL: Deep Crimson Red */}
            <div
              style={{
                width: '50%',
                height: '100%',
                background: 'linear-gradient(150deg, #b4001e 0%, #8b0014 60%, #60000d 100%)',
                padding: '16px 10px 14px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'space-between',
                textAlign: 'center',
                position: 'relative',
                boxShadow: 'inset -3px 0 10px rgba(0,0,0,0.25)',
              }}
            >
              {/* Top Text */}
              <p
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: '0.85rem',
                  fontWeight: '700',
                  color: '#ffffff',
                  lineHeight: '1.3',
                  letterSpacing: '0.3px',
                  textShadow: '0 2px 4px rgba(0,0,0,0.4)',
                  padding: '0 4px',
                }}
              >
                This special gift belongs to you!
              </p>

              {/* Center Circular Photo Cutout with Glow Frame */}
              <div
                ref={photoRef}
                style={{
                  position: 'relative',
                  width: '95px',
                  height: '95px',
                  borderRadius: '50%',
                  padding: '3px',
                  background: 'linear-gradient(135deg, #ffffff 0%, #ffccd5 100%)',
                  boxShadow: '0 8px 20px rgba(0,0,0,0.5), 0 0 15px rgba(255, 255, 255, 0.5)',
                  transformStyle: 'preserve-3d',
                }}
              >
                <img
                  src="/luc 1.jpeg"
                  alt="Desy Eirlea Driselle"
                  style={{
                    width: '100%',
                    height: '100%',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    display: 'block',
                  }}
                />
                
                {/* Mini Heart Badge Overlay */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: '-2px',
                    right: '-2px',
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    background: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 3px 6px rgba(0,0,0,0.3)',
                  }}
                >
                  <Heart size={13} fill="#b4001e" color="#b4001e" />
                </div>
              </div>

              {/* Bottom Hint */}
              <div
                style={{
                  fontSize: '0.65rem',
                  color: 'rgba(255, 255, 255, 0.85)',
                  fontStyle: 'italic',
                  letterSpacing: '0.5px',
                }}
              >
                Tap to open 💌
              </div>
            </div>

            {/* RIGHT PANEL: Authentic Red & White Gingham Plaid Pattern */}
            <div
              style={{
                width: '50%',
                height: '100%',
                backgroundColor: '#ffffff',
                backgroundImage: `
                  linear-gradient(90deg, rgba(180, 0, 30, 0.42) 50%, transparent 50%),
                  linear-gradient(rgba(180, 0, 30, 0.42) 50%, transparent 50%)
                `,
                backgroundSize: '22px 22px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                boxShadow: 'inset 3px 0 10px rgba(0,0,0,0.15)',
              }}
            >
              {/* Starburst Serrated Badge Container */}
              <div
                ref={badgeRef}
                style={{
                  position: 'relative',
                  width: '120px',
                  height: '120px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  filter: 'drop-shadow(0 6px 14px rgba(0, 0, 0, 0.35))',
                  transformStyle: 'preserve-3d',
                }}
              >
                {/* SVG 20-Point Starburst Shape */}
                <svg
                  viewBox="0 0 200 200"
                  width="100%"
                  height="100%"
                  style={{ position: 'absolute', inset: 0 }}
                >
                  <path
                    d={generateStarburstPath()}
                    fill="#ffffff"
                    stroke="#ffe6ea"
                    strokeWidth="2"
                  />
                </svg>

                {/* Badge Text Content */}
                <div
                  style={{
                    position: 'relative',
                    zIndex: 2,
                    textAlign: 'center',
                    padding: '12px 10px',
                    color: '#a80517',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <p
                    style={{
                      fontFamily: "'Playfair Display', serif",
                      fontSize: '0.78rem',
                      fontWeight: '800',
                      lineHeight: '1.25',
                      letterSpacing: '0.2px',
                      color: '#900014',
                    }}
                  >
                    Happy Birthday<br />
                    My Favorite<br />
                    Person
                  </p>
                  <div style={{ marginTop: '3px' }}>
                    <Heart size={14} fill="#a80517" color="#a80517" style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.2))' }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
