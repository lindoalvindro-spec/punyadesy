import React, { useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import confetti from 'canvas-confetti';
import { Heart, Sparkles, Cake, RotateCcw, X } from 'lucide-react';

export default function ClosingSection({ onRestart }) {
  const containerRef = useRef(null);
  const [showCakeModal, setShowCakeModal] = useState(false);
  const [candleBlown, setCandleBlown] = useState(false);

  useGSAP(() => {
    // Entrance animations
    gsap.fromTo('.closing-item',
      { opacity: 0, y: 25 },
      { opacity: 1, y: 0, duration: 0.8, stagger: 0.2, ease: 'power2.out' }
    );

    // Bouquet float
    gsap.to('.closing-bouquet-img', {
      y: '-=10',
      duration: 2.2,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    });
  }, { scope: containerRef });

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
        padding: '36px 16px 80px',
        textAlign: 'center',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      {/* PENUTUP Header */}
      <div className="closing-item" style={{ marginBottom: '24px' }}>
        <p
          style={{
            fontSize: '0.74rem',
            letterSpacing: '3px',
            color: '#ff758f',
            fontWeight: '700',
            textTransform: 'uppercase',
            marginBottom: '8px',
          }}
        >
          PENUTUP
        </p>

        <h2
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.65rem',
            lineHeight: '1.35',
            color: '#33222a',
            fontWeight: '700',
            maxWidth: '320px',
            margin: '0 auto 16px',
          }}
        >
          Sebuah Pesan Singkat Terakhir 🤍
        </h2>

        {/* Romantic Short Closing Words (Matching Video Reference) */}
        <div
          className="scrapbook-paper"
          style={{
            padding: '22px 18px',
            maxWidth: '340px',
            margin: '0 auto 30px',
            border: '1.5px solid rgba(255, 182, 193, 0.6)',
            boxShadow: '0 10px 30px rgba(255, 143, 163, 0.15)',
          }}
        >
          <p
            style={{
              fontFamily: 'var(--font-handwriting)',
              fontSize: '1.25rem',
              lineHeight: '1.6',
              color: '#382b31',
              margin: 0,
            }}
          >
            "Kalau scrapbook ini adalah caraku mengingatmu, maka bagian ini adalah cara kecilku untuk selalu bersyukur memilikimu dalam hidupku."
          </p>
        </div>
      </div>

      {/* Flower Bouquet Appreciation Card */}
      <div
        className="closing-item scrapbook-paper"
        style={{
          width: '100%',
          maxWidth: '340px',
          padding: '24px 18px 20px',
          borderRadius: '28px',
          border: '1.5px solid rgba(255, 182, 193, 0.5)',
          boxShadow: '0 15px 35px rgba(255, 143, 163, 0.18)',
          marginBottom: '32px',
          position: 'relative',
        }}
      >
        {/* Bouquet PNG Image */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
          <img
            src="/bucket bunga 2 no bg.png"
            alt="Bouquet Bunga"
            className="closing-bouquet-img"
            style={{
              width: '100px',
              height: 'auto',
              filter: 'drop-shadow(0 8px 18px rgba(255, 117, 143, 0.45))',
            }}
          />
        </div>

        <p
          style={{
            fontSize: '0.72rem',
            letterSpacing: '2px',
            color: '#c9184a',
            fontWeight: '700',
            textTransform: 'uppercase',
            marginBottom: '4px',
          }}
        >
          APRESIASI
        </p>

        <h3
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.35rem',
            color: '#33222a',
            marginBottom: '6px',
            fontStyle: 'italic',
          }}
        >
          Thank You for Staying, Desy
        </h3>

        <p style={{ fontSize: '0.82rem', color: '#806b74', marginBottom: '16px' }}>
          Terima kasih karena selalu ada dan menjadi sosok yang begitu luar biasa 🤍
        </p>

        {/* Bouquet Flower Tags */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '6px',
            flexWrap: 'wrap',
            marginBottom: '10px',
          }}
        >
          <span style={{ fontSize: '0.75rem', background: '#fff0f3', color: '#c9184a', padding: '4px 10px', borderRadius: '12px', fontWeight: '600' }}>
            Pink Rose · Gratitude
          </span>
          <span style={{ fontSize: '0.75rem', background: '#f0f9ff', color: '#0284c7', padding: '4px 10px', borderRadius: '12px', fontWeight: '600' }}>
            Blue Lily · Grace
          </span>
          <span style={{ fontSize: '0.75rem', background: '#fefce8', color: '#ca8a04', padding: '4px 10px', borderRadius: '12px', fontWeight: '600' }}>
            White Daisy · Purity
          </span>
        </div>
      </div>

      {/* Birthday Toast Button */}
      <div className="closing-item" style={{ width: '100%', maxWidth: '300px', marginBottom: '20px' }}>
        <button
          onClick={handleOpenCake}
          style={{
            width: '100%',
            background: 'linear-gradient(135deg, #ff758f 0%, #ff4d6d 100%)',
            color: '#ffffff',
            border: 'none',
            padding: '14px 24px',
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
          <Cake size={20} />
          <span>Tiup Lilin & Birthday Toast 💕</span>
        </button>
      </div>

      {/* Replay from Start Button */}
      <div className="closing-item">
        <button
          onClick={onRestart}
          style={{
            background: 'none',
            border: 'none',
            color: '#806b74',
            fontSize: '0.85rem',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 12px',
          }}
        >
          <RotateCcw size={14} />
          <span>Ulangi Dari Awal</span>
        </button>
      </div>

      {/* BIRTHDAY CAKE & CANDLE MODAL */}
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
              boxShadow: '0 20px 60px rgba(0,0,0,0.4), 0 0 30px rgba(255, 117, 143, 0.3)',
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
                boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
              }}
            >
              <X size={18} />
            </button>

            {/* Cake Emoji / Illustration with Candle */}
            <div style={{ fontSize: '3.8rem', marginBottom: '8px', position: 'relative' }}>
              🎂
              {!candleBlown && (
                <div
                  style={{
                    position: 'absolute',
                    top: '-6px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    fontSize: '1.2rem',
                    animation: 'pulseGlow 0.8s infinite alternate',
                  }}
                >
                  🔥
                </div>
              )}
            </div>

            <h3
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.45rem',
                color: '#33222a',
                marginBottom: '6px',
              }}
            >
              Happy Birthday, Desy Eirlea Driselle! 🎂✨
            </h3>

            <p style={{ fontSize: '0.88rem', color: '#806b74', marginBottom: '20px', lineHeight: '1.5' }}>
              {candleBlown
                ? 'Semoga setiap doa dan impian indahmu terkabul! 💖'
                : 'Ketik atau ketuk tombol di bawah untuk meniup lilinnya 🕯️'}
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
