import React, { useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { 
  Heart, Sparkles, X, Calendar, MapPin, ZoomIn, 
  Music, Volume2, VolumeX, ArrowRight, Pin, Paperclip, Stamp 
} from 'lucide-react';

export default function ScrapbookGallery({ onGoToEnvelope, isPlaying, onToggleMusic }) {
  const containerRef = useRef(null);
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  // Scrapbook Photos with Authentic Memorabilia Details
  const polaroids = [
    {
      id: 1,
      src: '/luc 1.jpeg',
      caption: 'Momen terindah bersamamu di alam terbuka ⛰️🤍',
      note: 'Hari penuh senyum & udara sejuk!',
      date: 'Special Date with Desy',
      location: 'Together in Nature',
      rotation: '-3.2deg',
      tapeColor: 'repeating-linear-gradient(45deg, rgba(255, 182, 193, 0.8), rgba(255, 182, 193, 0.8) 8px, rgba(255, 220, 230, 0.8) 8px, rgba(255, 220, 230, 0.8) 16px)',
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
      rotation: '2.6deg',
      tapeColor: 'rgba(255, 192, 203, 0.85)',
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
      rotation: '-2deg',
      tapeColor: 'rgba(255, 218, 225, 0.9)',
      pinColor: '#ff758f',
      stamp: 'FOREVER CHERISHED',
      flowerDeco: '/bunga 1 no bg.png',
    },
  ];

  useGSAP(() => {
    // 1. Scrapbook page entrance
    gsap.fromTo('.scrapbook-page-layer',
      { opacity: 0, y: 35, scale: 0.96 },
      { opacity: 1, y: 0, scale: 1, duration: 0.8, stagger: 0.25, ease: 'power2.out' }
    );

    // 2. Polaroid items entrance with organic spring
    gsap.fromTo('.scrapbook-polaroid',
      { opacity: 0, scale: 0.8, y: 25 },
      { opacity: 1, scale: 1, y: 0, duration: 0.8, stagger: 0.2, ease: 'back.out(1.6)', delay: 0.3 }
    );

    // 3. Floating pressed flower decorations
    gsap.to('.scrapbook-sticker', {
      rotation: '+=6',
      y: '-=4',
      duration: 2.2,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      stagger: 0.3,
    });
  }, { scope: containerRef });

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

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        minHeight: '100%',
        padding: '24px 14px 90px',
        position: 'relative',
        background: '#fdf7f9',
      }}
    >
      {/* Floating Audio Toggle Button */}
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

      {/* TOP SCRAPBOOK HEADER: BINDER COIL & STAMP EFFECT */}
      <div style={{ textAlign: 'center', marginBottom: '28px', position: 'relative' }}>
        {/* Notebook Spiral Wire Ring Coils on Top */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '14px',
            marginBottom: '16px',
          }}
        >
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

        {/* Vintage Postmark Stamp Badge */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '4px 16px',
            background: 'rgba(255, 255, 255, 0.95)',
            border: '1.5px dashed #ff758f',
            borderRadius: '20px',
            fontSize: '0.76rem',
            color: '#c9184a',
            fontWeight: '700',
            letterSpacing: '1.5px',
            textTransform: 'uppercase',
            boxShadow: '0 3px 10px rgba(255, 117, 143, 0.15)',
            marginBottom: '10px',
          }}
        >
          <Sparkles size={13} color="#ff758f" />
          <span>DESY'S MEMORY SCRAPBOOK</span>
          <Sparkles size={13} color="#ff758f" />
        </div>

        <h2
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '2rem',
            color: '#33222a',
            fontWeight: '700',
            marginBottom: '4px',
          }}
        >
          Museum Kenangan Kita 📖
        </h2>
        <p
          style={{
            fontFamily: 'var(--font-handwriting)',
            fontSize: '1.25rem',
            color: '#ff4d6d',
          }}
        >
          Setiap lembar penuh cerita, rasa rindu, dan kasih sayang
        </p>
      </div>

      {/* SCRAPBOOK PAGE 1: KRAFT PAPER INTRODUCTION */}
      <div
        className="scrapbook-page-layer"
        style={{
          background: 'linear-gradient(135deg, #fdfbf7 0%, #f7f1e5 100%)',
          borderRadius: '16px',
          padding: '24px 20px 20px',
          border: '1.5px solid rgba(220, 200, 180, 0.8)',
          boxShadow: '0 10px 25px rgba(180, 140, 120, 0.15), 0 2px 5px rgba(0,0,0,0.03)',
          position: 'relative',
          marginBottom: '36px',
        }}
      >
        {/* Metal Paperclip at Top Left */}
        <div
          style={{
            position: 'absolute',
            top: '-12px',
            left: '24px',
            width: '18px',
            height: '38px',
            border: '3px solid #d4af37',
            borderRadius: '10px',
            boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
            zIndex: 15,
            background: 'transparent',
          }}
        />

        {/* Diagonal Washi Tape on Top Right */}
        <div
          style={{
            position: 'absolute',
            top: '-10px',
            right: '20px',
            width: '75px',
            height: '22px',
            background: 'repeating-linear-gradient(45deg, rgba(255, 182, 193, 0.85), rgba(255, 182, 193, 0.85) 6px, rgba(255, 220, 230, 0.85) 6px, rgba(255, 220, 230, 0.85) 12px)',
            transform: 'rotate(5deg)',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            zIndex: 10,
          }}
        />

        <p
          style={{
            fontSize: '0.72rem',
            letterSpacing: '2px',
            color: '#a57152',
            fontWeight: '700',
            textTransform: 'uppercase',
            marginBottom: '4px',
          }}
        >
          MEMO 01 · CATATAN AWAL
        </p>

        <h3
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.35rem',
            color: '#3d2e24',
            marginBottom: '10px',
          }}
        >
          Awal Mula Cerita Indah Kita ✨
        </h3>

        <p
          style={{
            fontFamily: 'var(--font-handwriting)',
            fontSize: '1.22rem',
            lineHeight: '1.6',
            color: '#4a3b32',
            margin: 0,
          }}
        >
          "Kehadiranmu datang seperti sinar matahari pagi yang hangat. Dari canda tawa pertama hingga setiap obrolan manis larut malam, kamu selalu punya cara tersendiri membuat hari-hariku menjadi begitu berarti."
        </p>
      </div>

      {/* SCRAPBOOK PAGE 2: REALISTIC POLAROID PHOTO GALLERY */}
      <div style={{ marginBottom: '40px' }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <p
            style={{
              fontSize: '0.74rem',
              letterSpacing: '2px',
              color: '#ff758f',
              fontWeight: '700',
              textTransform: 'uppercase',
              marginBottom: '4px',
            }}
          >
            GALERI POLAROID SCRAPBOOK
          </p>
          <h3
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.5rem',
              color: '#33222a',
              marginBottom: '4px',
            }}
          >
            Potongan Memori Favoritku 📸
          </h3>
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.8rem',
              color: '#806b74',
            }}
          >
            (Ketuk foto polaroid untuk memperbesar ✨)
          </p>
        </div>

        {/* Collage Stack of Realistic Polaroids with Scrapbook Details */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '36px',
            alignItems: 'center',
          }}
        >
          {polaroids.map((item, index) => (
            <div
              key={item.id}
              className="scrapbook-polaroid"
              onClick={() => handleOpenZoom(item)}
              style={{
                position: 'relative',
                width: '100%',
                maxWidth: '315px',
                background: '#ffffff',
                padding: '14px 14px 28px 14px',
                borderRadius: '8px',
                boxShadow: '0 16px 35px rgba(160, 90, 110, 0.18), 0 3px 10px rgba(0, 0, 0, 0.05)',
                transform: `rotate(${item.rotation})`,
                transition: 'transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.3s ease',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.03) rotate(0deg)';
                e.currentTarget.style.zIndex = '30';
                e.currentTarget.style.boxShadow = '0 22px 45px rgba(255, 105, 135, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = `rotate(${item.rotation})`;
                e.currentTarget.style.zIndex = '1';
                e.currentTarget.style.boxShadow = '0 16px 35px rgba(160, 90, 110, 0.18), 0 3px 10px rgba(0, 0, 0, 0.05)';
              }}
            >
              {/* 3D Thumbtack / Pushpin on Top */}
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

              {/* Realistic Washi Tape Across Corner */}
              <div
                style={{
                  position: 'absolute',
                  top: '-8px',
                  left: index % 2 === 0 ? '-10px' : 'auto',
                  right: index % 2 === 0 ? 'auto' : '-10px',
                  width: '80px',
                  height: '24px',
                  background: item.tapeColor,
                  transform: index % 2 === 0 ? 'rotate(-25deg)' : 'rotate(25deg)',
                  boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                  zIndex: 15,
                  borderLeft: '2px dashed rgba(255,255,255,0.7)',
                  borderRight: '2px dashed rgba(255,255,255,0.7)',
                }}
              />

              {/* Pressed Flower Sticker (If exists) */}
              {item.flowerDeco && (
                <img
                  src={item.flowerDeco}
                  alt="Pressed Flower"
                  className="scrapbook-sticker"
                  style={{
                    position: 'absolute',
                    bottom: '-18px',
                    right: '-16px',
                    width: '65px',
                    height: 'auto',
                    filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))',
                    zIndex: 25,
                    pointerEvents: 'none',
                  }}
                />
              )}

              {/* Rubber Stamp Badge on Corner */}
              <div
                style={{
                  position: 'absolute',
                  top: '20px',
                  right: '18px',
                  border: '1.5px dashed rgba(225, 29, 72, 0.65)',
                  borderRadius: '6px',
                  padding: '2px 8px',
                  color: 'rgba(225, 29, 72, 0.75)',
                  fontSize: '0.62rem',
                  fontWeight: '800',
                  letterSpacing: '1px',
                  transform: 'rotate(-12deg)',
                  zIndex: 12,
                  pointerEvents: 'none',
                  background: 'rgba(255, 255, 255, 0.7)',
                }}
              >
                {item.stamp}
              </div>

              {/* Photo Image Frame */}
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  height: '255px',
                  borderRadius: '4px',
                  overflow: 'hidden',
                  backgroundColor: '#f3f4f6',
                  boxShadow: 'inset 0 0 10px rgba(0,0,0,0.06)',
                }}
              >
                <img
                  src={item.src}
                  alt={item.caption}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block',
                  }}
                />

                {/* Subtle Click-to-Zoom Badge */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: '10px',
                    right: '10px',
                    background: 'rgba(255, 255, 255, 0.88)',
                    borderRadius: '16px',
                    padding: '4px 10px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '0.72rem',
                    color: '#ff4d6d',
                    fontWeight: '700',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.12)',
                  }}
                >
                  <ZoomIn size={12} />
                  <span>Zoom</span>
                </div>
              </div>

              {/* Handwritten Polaroid Caption with Cursive Ink */}
              <div
                style={{
                  fontFamily: 'var(--font-handwriting)',
                  fontSize: '1.3rem',
                  color: '#2e2127',
                  textAlign: 'center',
                  marginTop: '12px',
                  lineHeight: '1.3',
                }}
              >
                {item.caption}
              </div>

              {/* Little Handwritten Note Tag Underneath */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '0.78rem',
                  fontFamily: 'var(--font-handwriting)',
                  color: '#83273e',
                  marginTop: '4px',
                  fontStyle: 'italic',
                }}
              >
                <span>♡ {item.note} ♡</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SCRAPBOOK PAGE 3: TUCKED-IN SPOTIFY AUDIO GUIDE CARD */}
      <div
        className="scrapbook-page-layer"
        style={{
          background: '#ffffff',
          borderRadius: '20px',
          padding: '22px 18px',
          border: '1.5px solid rgba(255, 182, 193, 0.6)',
          boxShadow: '0 12px 30px rgba(180, 100, 120, 0.12)',
          position: 'relative',
          marginBottom: '36px',
        }}
      >
        {/* Washi Tape Strip at Top Center */}
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

        <p
          style={{
            fontSize: '0.72rem',
            letterSpacing: '2px',
            color: '#ff758f',
            fontWeight: '700',
            textTransform: 'uppercase',
            marginBottom: '4px',
            textAlign: 'center',
          }}
        >
          AUDIO GUIDE NO. 04
        </p>

        <h4
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.3rem',
            color: '#33222a',
            marginBottom: '8px',
            textAlign: 'center',
          }}
        >
          Lagu Yang Membawa Kamu ke Aku 🎵
        </h4>

        <p
          style={{
            fontFamily: 'var(--font-handwriting)',
            fontSize: '1.18rem',
            color: '#5c4852',
            textAlign: 'center',
            marginBottom: '16px',
          }}
        >
          "Setiap alunannya selalu mengingatkanku pada sosokmu yang begitu hangat dan berharga."
        </p>

        {/* Dark Purple / Spotify Player Card Styled like in Video Reference */}
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
            <div>
              <p style={{ fontSize: '0.9rem', fontWeight: '700', margin: 0 }}>
                Soundtrack Khusus Desy
              </p>
              <p style={{ fontSize: '0.74rem', color: '#e9d5ff', margin: '2px 0 0 0' }}>
                Diputar dengan penuh cinta 🤍
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

      {/* TRANSITION TO ENVELOPE BUTTON */}
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <p
          style={{
            fontFamily: 'var(--font-handwriting)',
            fontSize: '1.3rem',
            color: '#c9184a',
            marginBottom: '12px',
          }}
        >
          Ada sepucuk surat rahasia yang menunggu untuk dibuka...
        </p>

        <button
          onClick={onGoToEnvelope}
          style={{
            width: '100%',
            maxWidth: '300px',
            background: 'linear-gradient(135deg, #ff758f 0%, #ff4d6d 100%)',
            color: '#ffffff',
            border: 'none',
            padding: '14px 28px',
            borderRadius: '30px',
            fontSize: '0.98rem',
            fontWeight: '700',
            fontFamily: 'var(--font-body)',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            boxShadow: '0 8px 25px rgba(255, 77, 109, 0.4)',
            transition: 'transform 0.2s ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.04)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        >
          <span>Buka Surat Rahasia 💌</span>
          <ArrowRight size={18} />
        </button>
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
            {/* Close Button */}
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

            {/* Enlarged Photo */}
            <img
              src={selectedPhoto.src}
              alt={selectedPhoto.caption}
              style={{
                width: '100%',
                maxHeight: '380px',
                objectFit: 'cover',
                borderRadius: '4px',
                display: 'block',
                marginBottom: '14px',
              }}
            />

            {/* Caption & Location Badge */}
            <p
              style={{
                fontFamily: 'var(--font-handwriting)',
                fontSize: '1.45rem',
                color: '#33222a',
                textAlign: 'center',
                margin: '0 0 8px 0',
                lineHeight: '1.3',
              }}
            >
              {selectedPhoto.caption}
            </p>

            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '12px',
                fontSize: '0.78rem',
                color: '#806b74',
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Calendar size={13} color="#ff758f" />
                {selectedPhoto.date}
              </span>
              {selectedPhoto.location && (
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <MapPin size={13} color="#ff758f" />
                  {selectedPhoto.location}
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
