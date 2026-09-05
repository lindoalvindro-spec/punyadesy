import React, { useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { Check, Sparkles, Scan } from 'lucide-react';

export default function FaceIdScreen({ onComplete }) {
  const containerRef = useRef(null);
  const scanBoxRef = useRef(null);
  const laserRef = useRef(null);
  const statusRef = useRef(null);
  const checkmarkRef = useRef(null);
  const photoRef = useRef(null);

  const [scanState, setScanState] = useState('scanning'); // 'scanning' | 'verified'
  const [statusText, setStatusText] = useState('Mendeteksi Wajah...');

  useGSAP(() => {
    // 1. Initial entrance of the scanner box
    gsap.fromTo(scanBoxRef.current,
      { scale: 0.7, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.6, ease: 'back.out(1.7)' }
    );

    // 2. Continuous sweep of scanning laser line
    const laserTween = gsap.fromTo(laserRef.current,
      { top: '8%', opacity: 0.3 },
      {
        top: '88%',
        opacity: 1,
        duration: 1.1,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      }
    );

    // 3. Viewfinder corners breathing pulse
    gsap.to('.scan-bracket', {
      scale: 1.08,
      duration: 0.8,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      stagger: 0.1,
    });

    // 4. Timeline for biometric verification progression
    const timer1 = setTimeout(() => {
      setStatusText('Memverifikasi Identitas: Desy Eirlea Driselle...');
    }, 1200);

    const timer2 = setTimeout(() => {
      laserTween.kill();
      setScanState('verified');
      setStatusText('Face ID Verified ✨');

      // Checkmark bounce in
      gsap.fromTo(checkmarkRef.current,
        { scale: 0, rotate: -45, opacity: 0 },
        { scale: 1, rotate: 0, opacity: 1, duration: 0.6, ease: 'elastic.out(1.2, 0.4)' }
      );

      // Photo and box success glow
      gsap.to(scanBoxRef.current, {
        borderColor: '#10b981',
        boxShadow: '0 0 35px rgba(16, 185, 129, 0.4), inset 0 0 20px rgba(16, 185, 129, 0.2)',
        duration: 0.4,
      });

      // 5. Fade out to PITCH BLACK for the next galaxy screen
      gsap.to(containerRef.current, {
        opacity: 0,
        backgroundColor: '#000000',
        duration: 0.8,
        delay: 1.3,
        ease: 'power2.inOut',
        onComplete: () => {
          if (onComplete) onComplete();
        },
      });
    }, 2800);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, { scope: containerRef });

  return (
    <div
      ref={containerRef}
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 100,
        background: 'radial-gradient(circle at 50% 35%, #ffffff 0%, #fff0f5 55%, #fce7f3 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px 16px',
        overflow: 'hidden',
        width: '100%',
        height: '100%',
      }}
    >
      {/* Top Header Badge */}
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 18px',
          background: 'rgba(255, 255, 255, 0.85)',
          border: '1px solid rgba(255, 182, 193, 0.6)',
          borderRadius: '20px',
          boxShadow: '0 4px 15px rgba(255, 143, 163, 0.2)',
          marginBottom: '28px',
        }}
      >
        <Scan size={16} color="#ff758f" />
        <span style={{ fontSize: '0.85rem', fontWeight: '600', color: '#33222a', letterSpacing: '0.5px' }}>
          Apple Face ID Security
        </span>
      </div>

      {/* Main Face ID Viewfinder Frame */}
      <div
        ref={scanBoxRef}
        style={{
          position: 'relative',
          width: '200px',
          height: '200px',
          borderRadius: '40px',
          background: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(10px)',
          border: scanState === 'verified' ? '2px solid #10b981' : '2px solid rgba(255, 117, 143, 0.6)',
          boxShadow: scanState === 'verified'
            ? '0 15px 40px rgba(16, 185, 129, 0.35)'
            : '0 15px 40px rgba(255, 143, 163, 0.25)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          marginBottom: '32px',
          transition: 'border-color 0.4s ease, box-shadow 0.4s ease',
        }}
      >
        {/* 4 Corner Viewfinder Brackets */}
        <div
          className="scan-bracket"
          style={{
            position: 'absolute',
            top: '12px',
            left: '12px',
            width: '22px',
            height: '22px',
            borderTop: '3px solid #ff4d6d',
            borderLeft: '3px solid #ff4d6d',
            borderTopLeftRadius: '12px',
            pointerEvents: 'none',
          }}
        />
        <div
          className="scan-bracket"
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            width: '22px',
            height: '22px',
            borderTop: '3px solid #ff4d6d',
            borderRight: '3px solid #ff4d6d',
            borderTopRightRadius: '12px',
            pointerEvents: 'none',
          }}
        />
        <div
          className="scan-bracket"
          style={{
            position: 'absolute',
            bottom: '12px',
            left: '12px',
            width: '22px',
            height: '22px',
            borderBottom: '3px solid #ff4d6d',
            borderLeft: '3px solid #ff4d6d',
            borderBottomLeftRadius: '12px',
            pointerEvents: 'none',
          }}
        />
        <div
          className="scan-bracket"
          style={{
            position: 'absolute',
            bottom: '12px',
            right: '12px',
            width: '22px',
            height: '22px',
            borderBottom: '3px solid #ff4d6d',
            borderRight: '3px solid #ff4d6d',
            borderBottomRightRadius: '12px',
            pointerEvents: 'none',
          }}
        />

        {/* Center Target: Desy's Photo */}
        <div
          ref={photoRef}
          style={{
            position: 'relative',
            width: '135px',
            height: '135px',
            borderRadius: '50%',
            overflow: 'hidden',
            border: '2px solid rgba(255, 182, 193, 0.8)',
            boxShadow: '0 6px 18px rgba(0,0,0,0.08)',
          }}
        >
          <img
            src="/luc 1.jpeg"
            alt="Desy Eirlea Driselle Face ID"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              filter: scanState === 'verified' ? 'none' : 'contrast(1.05)',
            }}
          />

          {/* Biometric Mesh Dots Overlay */}
          {scanState === 'scanning' && (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'radial-gradient(circle, transparent 40%, rgba(255, 77, 109, 0.25) 100%)',
                mixBlendMode: 'overlay',
              }}
            />
          )}
        </div>

        {/* Laser Sweep Line */}
        {scanState === 'scanning' && (
          <div
            ref={laserRef}
            style={{
              position: 'absolute',
              left: '15px',
              right: '15px',
              height: '2.5px',
              background: 'linear-gradient(90deg, transparent, #ff4d6d, #ff758f, #ff4d6d, transparent)',
              boxShadow: '0 0 12px #ff4d6d, 0 0 20px rgba(255, 77, 109, 0.8)',
              borderRadius: '2px',
              pointerEvents: 'none',
              zIndex: 10,
            }}
          />
        )}

        {/* Success Verified Checkmark Overlay */}
        {scanState === 'verified' && (
          <div
            ref={checkmarkRef}
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(255, 255, 255, 0.75)',
              backdropFilter: 'blur(4px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 20,
            }}
          >
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 24px rgba(16, 185, 129, 0.45)',
              }}
            >
              <Check size={36} color="#ffffff" strokeWidth={3} />
            </div>
          </div>
        )}
      </div>

      {/* Dynamic Status Text */}
      <div ref={statusRef} style={{ textAlign: 'center' }}>
        <h3
          style={{
            fontSize: '1.25rem',
            fontWeight: '700',
            fontFamily: 'var(--font-display)',
            color: scanState === 'verified' ? '#059669' : '#33222a',
            marginBottom: '6px',
            transition: 'color 0.3s ease',
          }}
        >
          {statusText}
        </h3>
        <p
          style={{
            fontSize: '0.85rem',
            color: '#806b74',
            fontFamily: 'var(--font-body)',
          }}
        >
          {scanState === 'verified'
            ? 'Akses Diberikan untuk Desy Eirlea Driselle 🤍'
            : 'Posisikan wajah di dalam bingkai'}
        </p>
      </div>
    </div>
  );
}
