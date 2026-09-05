import React, { useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { Heart, Delete, X, Sparkles, Lock } from 'lucide-react';

export default function PasscodeScreen({ onUnlock }) {
  const containerRef = useRef(null);
  const cardRef = useRef(null);
  const titleRef = useRef(null);
  const dotsRef = useRef(null);
  const keypadRef = useRef(null);
  const iconRingRef = useRef(null);
  
  const [pin, setPin] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  
  const CORRECT_PIN = '111225';
  const PIN_LENGTH = 6;

  const bgParticles = Array.from({ length: 16 }).map((_, i) => ({
    id: i,
    left: `${Math.random() * 92}%`,
    size: Math.random() * 14 + 10,
    duration: Math.random() * 6 + 5,
    delay: Math.random() * 4,
    symbol: i % 3 === 0 ? '🌸' : i % 3 === 1 ? '✨' : '💖',
  }));

  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: 'back.out(1.5)', duration: 0.7 } });
    
    tl.fromTo(cardRef.current, 
      { opacity: 0, scale: 0.88, y: 25 },
      { opacity: 1, scale: 1, y: 0 }
    )
    .fromTo(titleRef.current,
      { opacity: 0, y: -15 },
      { opacity: 1, y: 0, duration: 0.45 },
      '-=0.4'
    )
    .fromTo(dotsRef.current,
      { opacity: 0, scale: 0.75 },
      { opacity: 1, scale: 1, duration: 0.35 },
      '-=0.25'
    )
    .fromTo('.keypad-btn-pink',
      { opacity: 0, scale: 0.5, y: 15 },
      { opacity: 1, scale: 1, y: 0, stagger: 0.03, duration: 0.4 },
      '-=0.2'
    );

    gsap.to(iconRingRef.current, {
      rotation: 360,
      duration: 12,
      repeat: -1,
      ease: 'none',
    });
  }, { scope: containerRef });

  const handleKeyPress = (e, num) => {
    if (pin.length < PIN_LENGTH) {
      const newPin = pin + num;
      setPin(newPin);
      setErrorMsg('');

      const btn = e.currentTarget;
      gsap.timeline()
        .to(btn, { scale: 0.88, backgroundColor: '#ffe4ea', duration: 0.1 })
        .to(btn, { scale: 1, backgroundColor: '#ffffff', duration: 0.25, ease: 'back.out(2)' });

      const targetDot = dotsRef.current?.children[pin.length];
      if (targetDot) {
        gsap.fromTo(targetDot,
          { scale: 0.6, rotate: -20 },
          { scale: 1.3, rotate: 0, duration: 0.2, yoyo: true, repeat: 1 }
        );
      }

      if (newPin.length === PIN_LENGTH) {
        verifyPin(newPin);
      }
    }
  };

  const handleDelete = () => {
    if (pin.length > 0) {
      setPin(pin.slice(0, -1));
      setErrorMsg('');
    }
  };

  const handleClear = () => {
    setPin('');
    setErrorMsg('');
  };

  const verifyPin = (enteredPin) => {
    if (enteredPin === CORRECT_PIN || enteredPin === '111225' || enteredPin === '1112' || enteredPin === '1234') {
      const tl = gsap.timeline();
      
      tl.to(dotsRef.current, {
        scale: 1.15,
        filter: 'drop-shadow(0 0 15px #ff758f)',
        duration: 0.3,
      })
      .to(cardRef.current, {
        scale: 1.03,
        boxShadow: '0 20px 50px rgba(255, 117, 143, 0.4)',
        duration: 0.3,
      })
      .to(containerRef.current, {
        opacity: 0,
        scale: 1.05,
        duration: 0.6,
        ease: 'power2.inOut',
        onComplete: () => {
          if (onUnlock) onUnlock();
        }
      });
    } else {
      setErrorMsg('Kode sandi belum tepat, coba lagi ya sayang 🤍');
      
      gsap.to(dotsRef.current, {
        x: [-12, 12, -8, 8, -4, 4, 0],
        duration: 0.45,
        ease: 'power2.inOut',
      });
      
      gsap.fromTo(cardRef.current,
        { border: '1.5px solid #ff4d6d', boxShadow: '0 0 25px rgba(255, 77, 109, 0.35)' },
        { border: '1.5px solid rgba(255, 182, 193, 0.7)', boxShadow: '0 16px 40px rgba(255, 143, 163, 0.2)', duration: 0.8 }
      );
      
      setTimeout(() => {
        setPin('');
      }, 700);
    }
  };

  return (
    <div
      ref={containerRef}
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 100,
        background: 'radial-gradient(circle at 50% 35%, #fffbfd 0%, #fff0f5 55%, #fce7f3 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px 14px',
        overflowY: 'auto',
        overflowX: 'hidden',
        width: '100%',
        height: '100%',
      }}
    >
      {/* Background Floating Petals & Hearts */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
        {bgParticles.map((p) => (
          <div
            key={p.id}
            style={{
              position: 'absolute',
              left: p.left,
              bottom: '-20px',
              fontSize: `${p.size}px`,
              opacity: 0.5,
              animation: `floatPetal ${p.duration}s linear infinite`,
              animationDelay: `${p.delay}s`,
            }}
          >
            {p.symbol}
          </div>
        ))}
      </div>

      {/* Gentle Pink Backdrop Aura */}
      <div
        style={{
          position: 'absolute',
          width: '280px',
          height: '280px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255, 182, 193, 0.45) 0%, transparent 70%)',
          filter: 'blur(35px)',
          pointerEvents: 'none',
        }}
      />

      {/* Main White-Pink Passcode Card */}
      <div
        ref={cardRef}
        style={{
          width: '100%',
          maxWidth: '330px',
          background: 'rgba(255, 255, 255, 0.92)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderRadius: '32px',
          border: '1.5px solid rgba(255, 182, 193, 0.7)',
          boxShadow: '0 20px 45px rgba(255, 143, 163, 0.22), 0 4px 15px rgba(0,0,0,0.03)',
          padding: '24px 18px 20px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          position: 'relative',
          margin: 'auto 0',
        }}
      >
        {/* Decorative Sparkles */}
        <div style={{ position: 'absolute', top: '16px', left: '18px', opacity: 0.75 }}>
          <Sparkles size={16} color="#ff758f" />
        </div>
        <div style={{ position: 'absolute', top: '16px', right: '18px', opacity: 0.75 }}>
          <Sparkles size={16} color="#ff758f" />
        </div>

        {/* Top Animated Icon Container */}
        <div
          style={{
            position: 'relative',
            width: '60px',
            height: '60px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '12px',
          }}
        >
          {/* Rotating Dashed Orbit Ring */}
          <div
            ref={iconRingRef}
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: '50%',
              border: '1.5px dashed rgba(255, 117, 143, 0.5)',
            }}
          />

          {/* Soft Pink Glowing Center Badge */}
          <div
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #ff758f 0%, #ff4d6d 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 20px rgba(255, 77, 109, 0.35)',
            }}
          >
            <Lock size={20} color="#ffffff" />
          </div>
        </div>

        {/* Title Header */}
        <div ref={titleRef} style={{ textAlign: 'center', marginBottom: '18px' }}>
          <h2
            style={{
              fontSize: '1.45rem',
              fontWeight: '700',
              fontFamily: 'var(--font-display)',
              color: '#33222a',
              marginBottom: '3px',
              letterSpacing: '0.3px',
            }}
          >
            For You, Desy 🤍
          </h2>
          <p
            style={{
              fontSize: '0.85rem',
              color: '#806b74',
              fontFamily: 'var(--font-body)',
            }}
          >
            Enter our secret passcode
          </p>
          <p
            style={{
              fontSize: '0.78rem',
              color: '#ff4d6d',
              fontWeight: '600',
              fontFamily: 'var(--font-body)',
              marginTop: '5px',
              background: '#fff0f3',
              padding: '3px 12px',
              borderRadius: '12px',
              display: 'inline-block',
            }}
          >
            Clue: 111225 ❤️
          </p>
        </div>

        {/* 6-PIN Dots Container */}
        <div
          ref={dotsRef}
          style={{
            display: 'flex',
            gap: '12px',
            marginBottom: '20px',
            padding: '10px 18px',
            background: '#fff5f7',
            borderRadius: '24px',
            border: '1px solid rgba(255, 182, 193, 0.5)',
            boxShadow: 'inset 0 2px 5px rgba(0,0,0,0.03)',
          }}
        >
          {Array.from({ length: 6 }).map((_, idx) => {
            const isFilled = idx < pin.length;
            return (
              <div
                key={idx}
                style={{
                  width: '14px',
                  height: '14px',
                  borderRadius: '50%',
                  border: isFilled ? '1.5px solid #ff4d6d' : '1.5px solid #ffccd5',
                  background: isFilled
                    ? 'linear-gradient(135deg, #ff758f 0%, #ff4d6d 100%)'
                    : '#ffffff',
                  boxShadow: isFilled
                    ? '0 0 10px rgba(255, 77, 109, 0.5)'
                    : 'none',
                  transition: 'all 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                }}
              />
            );
          })}
        </div>

        {/* Error Feedback Message */}
        {errorMsg && (
          <p
            style={{
              fontSize: '0.78rem',
              color: '#e11d48',
              marginBottom: '10px',
              textAlign: 'center',
              fontWeight: '600',
            }}
          >
            {errorMsg}
          </p>
        )}

        {/* Keypad Grid 3x4 */}
        <div
          ref={keypadRef}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '12px',
            width: '100%',
            maxWidth: '245px',
            marginBottom: '10px',
          }}
        >
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <button
              key={num}
              className="keypad-btn-pink"
              onClick={(e) => handleKeyPress(e, num.toString())}
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                background: '#ffffff',
                border: '1.5px solid rgba(255, 182, 193, 0.6)',
                color: '#33222a',
                fontSize: '1.35rem',
                fontWeight: '600',
                fontFamily: 'var(--font-body)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto',
                boxShadow: '0 4px 10px rgba(255, 182, 193, 0.25)',
                transition: 'all 0.15s ease',
              }}
            >
              {num}
            </button>
          ))}

          {/* Clear Button */}
          <button
            className="keypad-btn-pink"
            onClick={handleClear}
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              background: '#fff5f7',
              border: '1px solid rgba(255, 182, 193, 0.4)',
              color: '#806b74',
              fontSize: '1rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto',
            }}
          >
            <X size={18} />
          </button>

          {/* 0 Button */}
          <button
            className="keypad-btn-pink"
            onClick={(e) => handleKeyPress(e, '0')}
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              background: '#ffffff',
              border: '1.5px solid rgba(255, 182, 193, 0.6)',
              color: '#33222a',
              fontSize: '1.35rem',
              fontWeight: '600',
              fontFamily: 'var(--font-body)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto',
              boxShadow: '0 4px 10px rgba(255, 182, 193, 0.25)',
            }}
          >
            0
          </button>

          {/* Backspace Delete Button */}
          <button
            className="keypad-btn-pink"
            onClick={handleDelete}
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              background: '#fff0f3',
              border: '1px solid rgba(255, 117, 143, 0.4)',
              color: '#ff4d6d',
              fontSize: '1rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto',
              boxShadow: '0 2px 8px rgba(255, 77, 109, 0.15)',
            }}
          >
            <Delete size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
