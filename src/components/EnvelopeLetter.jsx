import React, { useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import confetti from 'canvas-confetti';
import { Heart, Sparkles, Mail, ArrowRight } from 'lucide-react';

export default function EnvelopeLetter({ onGoToClosing }) {
  const containerRef = useRef(null);
  const envelopeRef = useRef(null);
  const flapRef = useRef(null);
  const letterRef = useRef(null);
  const sealRef = useRef(null);

  const [isOpen, setIsOpen] = useState(false);

  useGSAP(() => {
    // Entrance animation for closed envelope
    gsap.fromTo(envelopeRef.current,
      { opacity: 0, scale: 0.75, y: 30 },
      { opacity: 1, scale: 1, y: 0, duration: 0.8, ease: 'back.out(1.6)' }
    );

    // Idle gentle float of envelope
    gsap.to(envelopeRef.current, {
      y: '-=8',
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    });
  }, { scope: containerRef });

  const handleOpenEnvelope = () => {
    if (isOpen) return;
    setIsOpen(true);

    // Trigger confetti
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#ff758f', '#ffccd5', '#ffffff', '#ff4d6d', '#ffd700'],
    });

    const tl = gsap.timeline({ defaults: { ease: 'power2.inOut' } });

    // 1. Break wax seal with pop & fade
    tl.to(sealRef.current, {
      scale: 1.4,
      opacity: 0,
      duration: 0.3,
      ease: 'power1.out',
    })
    // 2. Flap rotates open 180 degrees 3D
    .to(flapRef.current, {
      rotateX: 180,
      duration: 0.6,
      ease: 'power2.inOut',
    })
    // 3. Letter slides out and unfolds upward into full reading mode
    .to(letterRef.current, {
      y: -180,
      scale: 1.05,
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

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        minHeight: '100%',
        padding: '30px 16px 80px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
      }}
    >
      {/* Section Header */}
      <div style={{ textAlign: 'center', marginBottom: isOpen ? '16px' : '36px' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '5px 16px',
            background: 'rgba(255, 255, 255, 0.85)',
            border: '1px solid rgba(255, 182, 193, 0.6)',
            borderRadius: '20px',
            fontSize: '0.78rem',
            color: '#c9184a',
            fontWeight: '600',
            letterSpacing: '1px',
            marginBottom: '10px',
            boxShadow: '0 2px 8px rgba(255, 143, 163, 0.15)',
          }}
        >
          <Mail size={14} color="#ff758f" />
          <span>SURAT UNTUKMU</span>
          <Mail size={14} color="#ff758f" />
        </div>

        <h2
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.85rem',
            color: '#33222a',
            marginBottom: '4px',
            fontWeight: '700',
          }}
        >
          {isOpen ? 'Surat Dari Hatiku 💌' : 'Sebuah Amplop Rahasia 💌'}
        </h2>
        <p style={{ fontSize: '0.85rem', color: '#806b74' }}>
          {isOpen ? 'Bacalah dengan perlahan ya sayang 🤍' : 'Ketuk amplop di bawah untuk membukanya'}
        </p>
      </div>

      {/* 3D Interactive Envelope Container */}
      {!isOpen && (
        <div
          ref={envelopeRef}
          onClick={handleOpenEnvelope}
          style={{
            position: 'relative',
            width: '280px',
            height: '190px',
            perspective: '1000px',
            cursor: 'pointer',
            margin: '20px auto 40px',
          }}
        >
          {/* Ambient Glow */}
          <div
            style={{
              position: 'absolute',
              inset: '-15px',
              borderRadius: '24px',
              background: 'radial-gradient(circle, rgba(255, 182, 193, 0.5) 0%, transparent 70%)',
              filter: 'blur(20px)',
              pointerEvents: 'none',
            }}
          />

          {/* Envelope Pocket Base */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(135deg, #fff0f3 0%, #ffd6df 100%)',
              borderRadius: '16px',
              border: '2px solid rgba(255, 182, 193, 0.9)',
              boxShadow: '0 15px 35px rgba(255, 117, 143, 0.25)',
              overflow: 'hidden',
            }}
          >
            {/* Triangular Pocket Lines (SVG) */}
            <svg viewBox="0 0 280 190" width="100%" height="100%" style={{ position: 'absolute', inset: 0 }}>
              <path d="M 0 190 L 140 100 L 280 190 Z" fill="#ffccd5" opacity="0.6" />
              <path d="M 0 0 L 140 100 L 0 190 Z" fill="#ffd1dc" opacity="0.4" />
              <path d="M 280 0 L 140 100 L 280 190 Z" fill="#ffd1dc" opacity="0.4" />
            </svg>
          </div>

          {/* Envelope Flap (3D Flipping Lid) */}
          <div
            ref={flapRef}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100px',
              transformOrigin: 'top center',
              transformStyle: 'preserve-3d',
              zIndex: 15,
            }}
          >
            <svg viewBox="0 0 280 100" width="100%" height="100%">
              <path
                d="M 0 0 L 140 95 L 280 0 Z"
                fill="linear-gradient(180deg, #ffd1dc 0%, #ffccd5 100%)"
                stroke="rgba(255, 182, 193, 0.8)"
                strokeWidth="1.5"
                filter="drop-shadow(0 4px 6px rgba(0,0,0,0.08))"
              />
            </svg>
          </div>

          {/* Wax Seal with Heart Emblem */}
          <div
            ref={sealRef}
            style={{
              position: 'absolute',
              top: '72px',
              left: '50%',
              marginLeft: '-25px',
              width: '50px',
              height: '50px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #c9184a 0%, #800f2f 100%)',
              border: '2px solid #ffffff',
              boxShadow: '0 6px 16px rgba(128, 15, 47, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 25,
            }}
          >
            <Heart size={24} color="#ffffff" fill="#ffffff" />
          </div>
        </div>
      )}

      {/* UNROLLED / OPENED LETTER CONTENT */}
      {isOpen && (
        <div
          ref={letterRef}
          style={{
            width: '100%',
            maxWidth: '345px',
            background: '#ffffff',
            borderRadius: '24px',
            padding: '28px 22px 24px',
            border: '2px solid rgba(255, 182, 193, 0.6)',
            boxShadow: '0 20px 50px rgba(255, 143, 163, 0.25), 0 4px 15px rgba(0,0,0,0.04)',
            position: 'relative',
            marginBottom: '32px',
          }}
        >
          {/* Top Decorative Washi Tape */}
          <div
            className="washi-tape washi-tape-pink"
            style={{
              top: '-12px',
              left: '50%',
              marginLeft: '-40px',
            }}
          />

          {/* Letter Date */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: '0.78rem',
              color: '#806b74',
              marginBottom: '16px',
              borderBottom: '1px dashed #ffccd5',
              paddingBottom: '8px',
            }}
          >
            <span>Special Birthday Note</span>
            <span>🤍 Desy Eirlea Driselle</span>
          </div>

          {/* Letter Greeting */}
          <h3
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.35rem',
              color: '#c9184a',
              marginBottom: '14px',
              lineHeight: '1.25',
            }}
          >
            Happy Birthday, Sayang ❤️
          </h3>

          {/* Letter Body in Handwritten Style */}
          <div
            style={{
              fontFamily: 'var(--font-handwriting)',
              fontSize: '1.25rem',
              lineHeight: '1.6',
              color: '#382b31',
            }}
          >
            <p style={{ marginBottom: '14px' }}>
              Di hari yang begitu istimewa ini, aku mendoakan segala kebaikan, kesehatan, kebahagiaan tulus, dan terwujudnya setiap impian yang kamu genggam.
            </p>

            <p style={{ marginBottom: '14px' }}>
              Terima kasih telah menjadi bagian yang begitu berharga dan bermakna dalam hidupku. Kebaikanmu, tawamu yang manis, dan caramu menyinari hariku adalah hadiah terindah yang tak ternilai harganya.
            </p>

            <p style={{ marginBottom: '14px' }}>
              Doa dan rasa sayangku selalu menyertaimu di setiap langkah. Semoga perjalanan kita ke depan senantiasa dipenuhi kehangatan dan saling mendukung menjadi versi terbaik dari diri kita.
            </p>

            <p style={{ marginBottom: '4px', fontStyle: 'italic', color: '#a51d38' }}>
              Happy birthday, my dearest Desy. You deserve all the love and beauty this world has to offer.
            </p>
          </div>

          {/* Signature */}
          <div
            style={{
              marginTop: '20px',
              textAlign: 'right',
              borderTop: '1px dashed #ffccd5',
              paddingTop: '12px',
            }}
          >
            <p style={{ fontSize: '0.78rem', color: '#806b74', margin: '0 0 2px 0' }}>
              With all my love & devotion,
            </p>
            <p
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.35rem',
                color: '#ff4d6d',
                fontWeight: '700',
                margin: 0,
              }}
            >
              🤍
            </p>
          </div>
        </div>
      )}

      {/* Action Button: Tap to open or proceed to closing */}
      <div style={{ textAlign: 'center', width: '100%', maxWidth: '300px' }}>
        {!isOpen ? (
          <button
            onClick={handleOpenEnvelope}
            style={{
              width: '100%',
              background: 'linear-gradient(135deg, #ff758f 0%, #ff4d6d 100%)',
              color: '#ffffff',
              border: 'none',
              padding: '13px 26px',
              borderRadius: '30px',
              fontSize: '0.96rem',
              fontWeight: '600',
              fontFamily: 'var(--font-body)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: '0 8px 24px rgba(255, 77, 109, 0.4)',
            }}
          >
            <Sparkles size={18} />
            <span>Buka Amplop Surat</span>
          </button>
        ) : (
          <button
            onClick={onGoToClosing}
            style={{
              width: '100%',
              background: 'linear-gradient(135deg, #ff758f 0%, #ff4d6d 100%)',
              color: '#ffffff',
              border: 'none',
              padding: '13px 26px',
              borderRadius: '30px',
              fontSize: '0.96rem',
              fontWeight: '700',
              fontFamily: 'var(--font-body)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: '0 8px 25px rgba(255, 77, 109, 0.4)',
              transition: 'transform 0.2s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.04)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          >
            <span>Lanjut ke Penutup</span>
            <ArrowRight size={18} />
          </button>
        )}
      </div>
    </div>
  );
}
