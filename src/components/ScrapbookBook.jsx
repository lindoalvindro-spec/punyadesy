import React, { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import confetti from 'canvas-confetti';
import {
  ChevronLeft,
  ChevronRight,
  Heart,
  Sparkles,
  Volume2,
  VolumeX,
  ZoomIn,
  X,
  RotateCcw,
  BookOpen,
  Cake,
  Play,
  Pause,
} from 'lucide-react';

// Web Audio API helper for realistic paper flip sound
const playPageFlipSound = () => {
  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const bufferSize = Math.floor(ctx.sampleRate * 0.16);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.28));
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 1600;
    filter.Q.value = 1.1;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.09, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.16);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    noise.start();
  } catch (e) {
    // AudioContext blocked until gesture, ignore safely
  }
};

// Love Letter Paragraphs with Word-by-Word Streaming Data
const rawLetterSections = [
  {
    id: 'intro',
    type: 'p',
    text: "Kalau kamu sudah sampai di halaman ini, berarti kamu sudah melihat sedikit demi sedikit kenangan yang kita punya. Mungkin semuanya terlihat sederhana. Hanya beberapa foto, beberapa halaman, dan lagu yang menemani. Tapi di balik semuanya, ada banyak waktu, pikiran, dan perasaan yang ingin aku sampaikan.",
  },
  {
    id: 'h1',
    type: 'accent_h',
    text: "Aku ingin mengucapkan terima kasih.",
  },
  {
    id: 'p1',
    type: 'p',
    text: "Terima kasih karena sudah hadir dalam hidupku. Terima kasih karena sudah menjadi tempatku bercerita, tertawa, mengeluh, bahkan diam tanpa harus menjelaskan apa pun. Kehadiranmu membuat hari-hariku terasa berbeda. Banyak hal yang dulunya terasa biasa saja, sekarang menjadi sesuatu yang selalu ingin kuingat karena ada kamu di dalamnya.",
  },
  {
    id: 'p2',
    type: 'p',
    text: "Aku sering memperhatikan hal-hal kecil tentangmu. Cara kamu tersenyum ketika sedang benar-benar bahagia. Pose andalanmu ketika berfoto. Tatapanmu yang mungkin terlihat jutek bagi orang lain, tapi justru selalu terlihat menggemaskan di mataku. Cara kamu memakai kebaya yang membuatku selalu terpana. Semua itu mungkin terlihat sederhana, tapi entah kenapa selalu berhasil membuatku semakin menyayangimu.",
  },
  {
    id: 'h2',
    type: 'accent_h',
    text: "Aku juga ingin meminta maaf.",
  },
  {
    id: 'p3',
    type: 'p',
    text: "Mungkin ada waktu ketika aku mengecewakanmu. Ada kata-kata yang kurang baik, sikap yang kurang peka, atau keputusan yang membuatmu sedih. Aku tidak bisa mengubah apa yang sudah terjadi, tetapi aku ingin terus belajar supaya bisa menjadi seseorang yang lebih baik untukmu. Bukan karena aku harus sempurna, tetapi karena kamu pantas mendapatkan seseorang yang selalu berusaha.",
  },
  {
    id: 'p4',
    type: 'p',
    text: "Aku tidak tahu bagaimana masa depan akan berjalan. Akan ada hari-hari yang mudah, dan mungkin ada juga hari-hari yang sulit. Tapi satu hal yang ingin selalu kuusahakan adalah tetap memilihmu, setiap hari, dalam keadaan apa pun.",
  },
  {
    id: 'p5',
    type: 'p',
    text: "Hadiah kecil ini mungkin tidak sempurna. Tampilannya mungkin belum seindah yang kamu bayangkan saat pertama kali melihatnya. Tapi sama seperti hubungan kita, semuanya dibuat sedikit demi sedikit, diperbaiki pelan-pelan, dan dijaga dengan sepenuh hati.",
  },
  {
    id: 'p6',
    type: 'p',
    text: "Semoga setiap foto di sini bisa mengingatkanmu bahwa ada seseorang yang selalu mengagumimu, bahkan di saat kamu merasa biasa-biasa saja.",
  },
  {
    id: 'b1',
    type: 'bullet',
    text: "✦ Terima kasih sudah menjadi dirimu sendiri.",
  },
  {
    id: 'b2',
    type: 'bullet',
    text: "✦ Terima kasih sudah bertahan sejauh ini bersamaku.",
  },
  {
    id: 'b3',
    type: 'bullet',
    text: "✦ Dan terima kasih karena masih memberiku kesempatan untuk terus berjalan di sampingmu.",
  },
  {
    id: 's_love',
    type: 'signoff_love',
    text: "Aku sayang kamu.",
  },
  {
    id: 's_today',
    type: 'signoff_sub',
    text: "Hari ini.",
  },
  {
    id: 's_tomorrow',
    type: 'signoff_sub',
    text: "Besok.",
  },
  {
    id: 's_forever',
    type: 'signoff_sub',
    text: "Dan selamanya.",
  },
  {
    id: 's_heart',
    type: 'signoff_heart',
    text: "🤍",
  },
];

let _letterOffset = 0;
const letterSections = rawLetterSections.map((sec) => {
  const words = sec.text.trim().split(/\s+/);
  const start = _letterOffset;
  _letterOffset += words.length;
  return {
    ...sec,
    words,
    start,
    end: _letterOffset,
  };
});
const totalLetterWords = _letterOffset;

export default function ScrapbookBook({
  isPlaying,
  onToggleMusic,
  onRestart,
  onGoToGalaxy,
}) {
  const containerRef = useRef(null);
  const pageSheetRef = useRef(null);
  const shadowOverlayRef = useRef(null);

  // Pages: 0: Cover, 1: Pameran 1, 2: Pameran 2, 3: Polaroid Gallery, 4: Music/Lagu, 5: Surat, 6: Penutup & Lilin
  const [currentPage, setCurrentPage] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  // Active photo in Polaroid Gallery (Page 3)
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [autoProgress, setAutoProgress] = useState(0);
  const tabContainerRef = useRef(null);
  const photoCardTouchStartXRef = useRef(0);
  const photoCardTouchStartYRef = useRef(0);

  // Envelope state (Page 5)
  const [isEnvelopeOpen, setIsEnvelopeOpen] = useState(false);
  const envelopeFlapRef = useRef(null);
  const letterRef = useRef(null);
  const sealRef = useRef(null);
  const [visibleWordCount, setVisibleWordCount] = useState(0);
  const typingTimerRef = useRef(null);

  // Birthday cake state (Page 6)
  const [showCakeModal, setShowCakeModal] = useState(false);
  const [candleBlown, setCandleBlown] = useState(false);

  // Touch swipe handling
  const touchStartXRef = useRef(0);
  const touchStartYRef = useRef(0);

  const totalPages = 7;

  const pageNames = [
    { id: 0, label: 'Sampul', icon: '🎀' },
    { id: 1, label: 'Kenalan', icon: '🌸' },
    { id: 2, label: 'First Date', icon: '🍜' },
    { id: 3, label: '5 Potret', icon: '📸' },
    { id: 4, label: 'Lagu Kita', icon: '🎵' },
    { id: 5, label: 'Surat Cinta', icon: '💌' },
    { id: 6, label: 'Tiup Lilin', icon: '🎂' },
  ];

  // The 5 Special Photos with their exact quotes requested by user
  const desyPhotos = [
    {
      id: 1,
      image: '/luc 1.jpeg',
      tabLabel: '1. Senja',
      title: 'Pesona Pertama',
      caption: 'Kamu selalu cantik dalam keadaan apa pun, tapi entah kenapa, di foto ini aku benar-benar terpukau',
      date: 'Senja di Tepi Pantai',
      stamp: 'TERPUKAU 🌸',
      pinColor: '#ff758f',
      accentColor: '#ffe4ea',
    },
    {
      id: 2,
      image: '/luc 2.jpeg',
      tabLabel: '2. Pose Andalan',
      title: 'Pose Andalan',
      caption: 'Pose andalan kamu... dan entah kenapa, aku nggak pernah bosan melihatnya.',
      date: 'Suasana Hangat Kafe',
      stamp: 'FAVORITE ♡',
      pinColor: '#ffd700',
      accentColor: '#fef3c7',
    },
    {
      id: 3,
      image: '/luc 3.jpeg',
      tabLabel: '3. Menggemaskan',
      title: 'Hangat & Menggemaskan',
      caption: 'Mungkin bagi orang lain kamu terlihat sedikit judes. Tapi yang aku lihat justru seseorang yang sangat menggemaskan. Tatapanmu mungkin terlihat tenang, tapi bagiku selalu terasa hangat',
      date: 'Hammock di Bawah Teduh',
      stamp: 'SO SWEET ✨',
      pinColor: '#10b981',
      accentColor: '#dcfce7',
    },
    {
      id: 4,
      image: '/luc 4.jpeg',
      tabLabel: '4. Idulfitri',
      title: 'Hari Kemenangan',
      caption: 'Hari itu adalah Idulfitri, tapi yang paling aku ingat justru kamu. Tetap dengan pose andalanmu, tetap berhasil membuatku tersenyum setiap kali melihatnya',
      date: 'Momen Idulfitri',
      stamp: 'IDULFITRI 🤍',
      pinColor: '#0ea5e9',
      accentColor: '#e0f2fe',
    },
    {
      id: 5,
      image: '/luc 5.jpeg',
      tabLabel: '5. Gaun Anggun',
      title: 'Bidadari yang Bersinar',
      caption: 'Melihatmu mengenakan gaun ini benar-benar membuatku terpana. Bukan hanya karena penampilannya, tetapi karena setiap senyummu selalu berhasil membuat semuanya terasa lebih indah',
      date: 'Malam Istimewa',
      stamp: 'ANGGUN 👑',
      pinColor: '#f59e0b',
      accentColor: '#fef3c7',
    },
  ];

  // GSAP 3D Page Turn Animation
  const turnToPage = (targetPage) => {
    if (isFlipping || targetPage === currentPage || targetPage < 0 || targetPage >= totalPages) return;

    setIsFlipping(true);
    playPageFlipSound();

    const direction = targetPage > currentPage ? 'next' : 'prev';
    const pageEl = pageSheetRef.current;
    const shadowEl = shadowOverlayRef.current;

    // Phase 1: Turn current page halfway (0deg -> 90deg / -90deg)
    const tl = gsap.timeline({
      onComplete: () => {
        setCurrentPage(targetPage);
        if (pageEl) pageEl.scrollTop = 0;

        // Phase 2: Swing incoming page from halfway back to 0deg
        gsap.fromTo(pageEl,
          {
            rotateY: direction === 'next' ? 85 : -85,
            scale: 0.96,
            opacity: 0.8,
            boxShadow: '0 25px 50px rgba(180, 80, 110, 0.35)',
          },
          {
            rotateY: 0,
            scale: 1,
            opacity: 1,
            duration: 0.4,
            ease: 'back.out(1.25)',
            boxShadow: '0 10px 30px rgba(255, 117, 143, 0.18)',
            onComplete: () => {
              setIsFlipping(false);
            },
          }
        );

        if (shadowEl) {
          gsap.fromTo(shadowEl,
            { opacity: 0.35 },
            { opacity: 0, duration: 0.35, ease: 'power2.out' }
          );
        }
      },
    });

    // Animate current page folding away
    tl.to(pageEl, {
      rotateY: direction === 'next' ? -85 : 85,
      scale: 0.95,
      duration: 0.32,
      ease: 'power2.in',
      transformOrigin: direction === 'next' ? 'left center' : 'right center',
    });

    if (shadowEl) {
      tl.to(shadowEl, {
        opacity: 0.4,
        duration: 0.25,
        ease: 'power1.in',
      }, 0);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      turnToPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 0) {
      turnToPage(currentPage - 1);
    }
  };

  // Touch Swipe handlers
  const handleTouchStart = (e) => {
    touchStartXRef.current = e.touches[0].clientX;
    touchStartYRef.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e) => {
    const deltaX = e.changedTouches[0].clientX - touchStartXRef.current;
    const deltaY = e.changedTouches[0].clientY - touchStartYRef.current;

    if (Math.abs(deltaX) > 45 && Math.abs(deltaX) > Math.abs(deltaY) * 1.5) {
      if (deltaX < 0) {
        handleNextPage();
      } else {
        handlePrevPage();
      }
    }
  };

  // Zoom lightbox
  const handleOpenZoom = (photo) => {
    setSelectedPhoto(photo);
    requestAnimationFrame(() => {
      gsap.fromTo('.zoom-modal-content',
        { scale: 0.65, opacity: 0, y: 30 },
        { scale: 1, opacity: 1, y: 0, duration: 0.38, ease: 'back.out(1.6)' }
      );
    });
  };

  const handleCloseZoom = () => {
    gsap.to('.zoom-modal-content', {
      scale: 0.75,
      opacity: 0,
      duration: 0.2,
      ease: 'power2.in',
      onComplete: () => setSelectedPhoto(null),
    });
  };

  // Select photo in Page 3 & reset 10s auto timer
  const handleSelectPhoto = (idx) => {
    setActivePhotoIdx(idx);
    setAutoProgress(0);
  };

  // 10-Second Auto-Rotate for Page 3 (5 Potret Kenangan)
  useEffect(() => {
    if (currentPage !== 3 || !isAutoPlay || selectedPhoto !== null) {
      setAutoProgress(0);
      return;
    }

    const intervalMs = 100;
    const totalMs = 10000; // 10 seconds
    const step = (intervalMs / totalMs) * 100;

    const timer = setInterval(() => {
      setAutoProgress((prev) => {
        if (prev + step >= 100) {
          setActivePhotoIdx((curr) => (curr + 1) % desyPhotos.length);
          return 0;
        }
        return prev + step;
      });
    }, intervalMs);

    return () => clearInterval(timer);
  }, [currentPage, isAutoPlay, selectedPhoto, desyPhotos.length]);

  // Center active tab pill into view smoothly
  useEffect(() => {
    if (currentPage === 3 && tabContainerRef.current) {
      const activeBtn = tabContainerRef.current.children[activePhotoIdx];
      if (activeBtn) {
        activeBtn.scrollIntoView({
          behavior: 'smooth',
          inline: 'center',
          block: 'nearest',
        });
      }
    }
  }, [activePhotoIdx, currentPage]);

  // Envelope interactive open (Page 5)
  const handleOpenEnvelope = () => {
    if (isEnvelopeOpen) return;

    confetti({
      particleCount: 85,
      spread: 75,
      origin: { y: 0.6 },
      colors: ['#ff758f', '#ffccd5', '#ffffff', '#ffd700', '#ff4d6d'],
    });

    const tl = gsap.timeline({
      defaults: { ease: 'power2.inOut' },
      onComplete: () => {
        setIsEnvelopeOpen(true);
      },
    });

    if (sealRef.current) {
      tl.to(sealRef.current, {
        scale: 1.35,
        opacity: 0,
        duration: 0.22,
      });
    }

    if (envelopeFlapRef.current) {
      tl.to(envelopeFlapRef.current, {
        rotateX: 180,
        duration: 0.35,
      }, '-=0.08');
    }
  };

  // Typewriter word-by-word streaming animation when envelope is open
  useEffect(() => {
    if (isEnvelopeOpen) {
      if (pageSheetRef.current) {
        pageSheetRef.current.scrollTo({ top: 0, behavior: 'smooth' });
      }

      if (letterRef.current) {
        gsap.fromTo(letterRef.current,
          { opacity: 0, y: 25, scale: 0.95 },
          { opacity: 1, y: 0, scale: 1, duration: 0.45, ease: 'back.out(1.2)' }
        );
      }

      setVisibleWordCount(0);
      let count = 0;
      clearInterval(typingTimerRef.current);
      typingTimerRef.current = setInterval(() => {
        count += 1;
        setVisibleWordCount(count);

        // Gently auto-scroll downward as new text appears
        if (count % 10 === 0 && pageSheetRef.current) {
          const el = pageSheetRef.current;
          if (el.scrollHeight - el.scrollTop - el.clientHeight > 50) {
            el.scrollBy({ top: 22, behavior: 'smooth' });
          }
        }

        if (count >= totalLetterWords) {
          clearInterval(typingTimerRef.current);
        }
      }, 55); // 55ms per word
    } else {
      clearInterval(typingTimerRef.current);
      setVisibleWordCount(0);
    }

    return () => clearInterval(typingTimerRef.current);
  }, [isEnvelopeOpen]);

  const handleShowAllLetterText = () => {
    clearInterval(typingTimerRef.current);
    setVisibleWordCount(totalLetterWords + 10);
  };

  const handleRestartTyping = () => {
    if (pageSheetRef.current) {
      pageSheetRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
    setVisibleWordCount(0);
    let count = 0;
    clearInterval(typingTimerRef.current);
    typingTimerRef.current = setInterval(() => {
      count += 1;
      setVisibleWordCount(count);
      if (count % 10 === 0 && pageSheetRef.current) {
        const el = pageSheetRef.current;
        if (el.scrollHeight - el.scrollTop - el.clientHeight > 50) {
          el.scrollBy({ top: 22, behavior: 'smooth' });
        }
      }
      if (count >= totalLetterWords) {
        clearInterval(typingTimerRef.current);
      }
    }, 55);
  };

  // Birthday cake handlers (Page 6)
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
      particleCount: 130,
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
        height: '100%',
        maxHeight: '100%',
        position: 'relative',
        background: 'radial-gradient(ellipse at 50% 30%, #fff7f9 0%, #fae6ec 55%, #f4d0dc 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '8px 10px 10px',
        overflow: 'hidden',
        boxSizing: 'border-box',
      }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* ========================================================= */}
      {/* TOP HEADER: Navigation Bar & Controls (Fixed Height) */}
      {/* ========================================================= */}
      <div
        style={{
          width: '100%',
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '2px 4px 6px',
          zIndex: 30,
        }}
      >
        {/* Back to Galaxy Cosmos Button */}
        <button
          onClick={onGoToGalaxy}
          style={{
            background: 'rgba(255, 255, 255, 0.9)',
            border: '1.5px solid #ffccd5',
            borderRadius: '20px',
            padding: '5px 12px',
            fontSize: '0.78rem',
            fontWeight: '600',
            color: '#b05d6f',
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(255, 117, 143, 0.15)',
          }}
        >
          <span>🌌</span>
          <span>Semesta Hati</span>
        </button>

        {/* Page Counter Badge */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.92)',
            border: '1.5px solid #ffccd5',
            borderRadius: '16px',
            padding: '5px 12px',
            fontSize: '0.78rem',
            fontWeight: '700',
            color: '#ff4d6d',
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            boxShadow: '0 2px 8px rgba(255, 117, 143, 0.15)',
          }}
        >
          <BookOpen size={14} color="#ff4d6d" />
          <span>{pageNames[currentPage].label} ({currentPage + 1}/{totalPages})</span>
        </div>

        {/* Floating Audio Toggle */}
        <button
          onClick={onToggleMusic}
          style={{
            width: '34px',
            height: '34px',
            borderRadius: '50%',
            background: isPlaying
              ? 'linear-gradient(135deg, #ff758f 0%, #ff4d6d 100%)'
              : 'rgba(255, 255, 255, 0.9)',
            border: '1.5px solid #ffccd5',
            color: isPlaying ? '#ffffff' : '#b05d6f',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(255, 117, 143, 0.2)',
          }}
        >
          {isPlaying ? <Volume2 size={16} /> : <VolumeX size={16} />}
        </button>
      </div>

      {/* ========================================================= */}
      {/* 3D SCRAPBOOK BOOK CONTAINER (FLEXIBLE HEIGHT, NEVER OVERFLOWS) */}
      {/* ========================================================= */}
      <div
        style={{
          width: '100%',
          flex: '1 1 0',
          minHeight: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          perspective: '1800px',
          position: 'relative',
          padding: '2px 0',
          overflow: 'hidden',
        }}
      >
        {/* Book Binding Left Spine (Silver Rings) */}
        <div
          style={{
            position: 'absolute',
            left: '2px',
            top: '6%',
            bottom: '6%',
            width: '24px',
            zIndex: 25,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-evenly',
            alignItems: 'center',
            pointerEvents: 'none',
          }}
        >
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              style={{
                width: '12px',
                height: '22px',
                borderRadius: '6px',
                background: 'linear-gradient(180deg, #e5e7eb 0%, #9ca3af 45%, #4b5563 80%, #1f2937 100%)',
                boxShadow: '0 2px 5px rgba(0,0,0,0.25), inset 0 1px 2px #ffffff',
                border: '1px solid rgba(255,255,255,0.6)',
              }}
            />
          ))}
        </div>

        {/* Book Underneath Stack Layers */}
        <div
          style={{
            position: 'absolute',
            top: '8px',
            bottom: '4px',
            left: '20px',
            right: '4px',
            background: '#f7d6e0',
            borderRadius: '16px',
            boxShadow: '0 15px 35px rgba(180, 70, 95, 0.2)',
            transform: 'rotate(0.8deg)',
            zIndex: 2,
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: '4px',
            bottom: '2px',
            left: '16px',
            right: '6px',
            background: '#fff0f3',
            borderRadius: '16px',
            boxShadow: '0 10px 25px rgba(180, 70, 95, 0.15)',
            transform: 'rotate(-0.5deg)',
            zIndex: 3,
          }}
        />

        {/* ========================================================= */}
        {/* ACTIVE FLIPPING PAGE SHEET */}
        {/* ========================================================= */}
        <div
          ref={pageSheetRef}
          style={{
            width: 'calc(100% - 18px)',
            height: '100%',
            maxHeight: '100%',
            marginLeft: '12px',
            background: currentPage === 0
              ? 'linear-gradient(145deg, #ff85a2 0%, #ff5c7a 50%, #d43d5e 100%)'
              : '#fffefc',
            color: currentPage === 0 ? '#ffffff' : '#2e1c24',
            borderRadius: '14px',
            boxShadow: '0 10px 30px rgba(255, 117, 143, 0.2), inset 12px 0 16px rgba(0,0,0,0.03)',
            border: currentPage === 0 ? '3px double #ffd1dc' : '1px solid #f3d7e0',
            position: 'relative',
            zIndex: 10,
            overflowY: 'auto',
            overflowX: 'hidden',
            padding: '14px 12px 18px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            boxSizing: 'border-box',
            transformStyle: 'preserve-3d',
            scrollbarWidth: 'thin',
            scrollbarColor: '#ffccd5 transparent',
          }}
        >
          {/* Dynamic Shadow Overlay during 3D flip */}
          <div
            ref={shadowOverlayRef}
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to right, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.08) 35%, transparent 100%)',
              opacity: 0,
              pointerEvents: 'none',
              zIndex: 50,
              borderRadius: '14px',
            }}
          />

          {/* ======================================================= */}
          {/* PAGE 0: HARDCOVER SCRAPBOOK COVER (SAMPUL BUKU) */}
          {/* ======================================================= */}
          {currentPage === 0 && (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                minHeight: '100%',
                padding: '16px 4px',
                position: 'relative',
              }}
            >
              <div style={{ position: 'absolute', top: '4px', left: '4px', fontSize: '1.1rem', opacity: 0.8 }}>🌸</div>
              <div style={{ position: 'absolute', top: '4px', right: '4px', fontSize: '1.1rem', opacity: 0.8 }}>✨</div>
              <div style={{ position: 'absolute', bottom: '4px', left: '4px', fontSize: '1.1rem', opacity: 0.8 }}>🤍</div>
              <div style={{ position: 'absolute', bottom: '4px', right: '4px', fontSize: '1.1rem', opacity: 0.8 }}>🌸</div>

              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  background: 'radial-gradient(circle, #ffe4a0 0%, #d4a034 70%, #9e7215 100%)',
                  boxShadow: '0 4px 12px rgba(212, 160, 52, 0.4), inset 0 2px 4px #ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.5rem',
                  marginBottom: '12px',
                  border: '2px solid #ffffff',
                }}
              >
                🎀
              </div>

              <div
                style={{
                  border: '2px double rgba(255, 255, 255, 0.85)',
                  borderRadius: '14px',
                  padding: '18px 12px',
                  background: 'rgba(255, 255, 255, 0.12)',
                  backdropFilter: 'blur(3px)',
                  boxShadow: '0 6px 20px rgba(0, 0, 0, 0.15)',
                  width: '100%',
                  maxWidth: '290px',
                  marginBottom: '16px',
                }}
              >
                <p
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.68rem',
                    letterSpacing: '2.5px',
                    textTransform: 'uppercase',
                    color: '#ffe5ec',
                    fontWeight: '700',
                    marginBottom: '6px',
                  }}
                >
                  SPECIAL BIRTHDAY SCRAPBOOK
                </p>

                <h1
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '1.65rem',
                    fontWeight: '700',
                    lineHeight: '1.25',
                    color: '#ffffff',
                    textShadow: '0 2px 10px rgba(0,0,0,0.25)',
                    marginBottom: '6px',
                  }}
                >
                  Desy's Memory Book
                </h1>

                <div
                  style={{
                    height: '2px',
                    width: '50px',
                    background: '#ffe5ec',
                    margin: '6px auto 8px',
                    borderRadius: '2px',
                  }}
                />

                <p
                  style={{
                    fontFamily: 'var(--font-handwriting)',
                    fontSize: '1.3rem',
                    color: '#fff0f3',
                    marginBottom: '4px',
                  }}
                >
                  Untuk Desy Eirlea Driselle 🤍
                </p>

                <p
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.74rem',
                    color: '#ffe5ec',
                    fontStyle: 'italic',
                  }}
                >
                  Dibuat dengan seluruh ketulusan & cinta 🤍
                </p>
              </div>

              <button
                onClick={handleNextPage}
                style={{
                  background: 'linear-gradient(135deg, #ffffff 0%, #fff0f5 100%)',
                  color: '#c9184a',
                  border: '2px solid #ffffff',
                  borderRadius: '28px',
                  padding: '11px 24px',
                  fontSize: '0.9rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 6px 20px rgba(0, 0, 0, 0.25)',
                  animation: 'pulseGlow 2s infinite alternate',
                }}
              >
                <span>Buka Halaman Pertama 📖</span>
                <Sparkles size={15} color="#c9184a" />
              </button>
            </div>
          )}

          {/* ======================================================= */}
          {/* PAGE 1: PAMERAN 01 — AWAL KISAH & FOTO 1 (SENJA) */}
          {/* ======================================================= */}
          {currentPage === 1 && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              {/* Badge */}
              <div
                style={{
                  display: 'inline-block',
                  padding: '8px 16px',
                  borderRadius: '18px',
                  border: '2px double #b05d6f',
                  background: '#fff9fa',
                  boxShadow: '0 3px 10px rgba(176, 93, 111, 0.1)',
                  marginBottom: '10px',
                  textAlign: 'center',
                  width: '100%',
                  maxWidth: '290px',
                }}
              >
                <p style={{ fontSize: '0.68rem', letterSpacing: '2px', color: '#b05d6f', fontWeight: '800', textTransform: 'uppercase', margin: '0 0 2px 0' }}>
                  PAMERAN 01
                </p>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.12rem', color: '#2e1c24', margin: '0 0 2px 0', lineHeight: 1.25 }}>
                  Awalan baru buat aku yaitu kenal kamu lebih dalam
                </h3>
                <p style={{ fontSize: '0.68rem', color: '#8c6571', margin: 0, fontStyle: 'italic' }}>
                  Kenangan Manis Bersamamu 🤍
                </p>
              </div>

              {/* Centerpiece Polaroid: Foto 1 (Sunset Pantai) */}
              <div
                className="polaroid-card"
                onClick={() => handleOpenZoom(desyPhotos[0])}
                style={{
                  width: '215px',
                  padding: '8px 8px 14px',
                  transform: 'rotate(-2deg)',
                  marginBottom: '10px',
                }}
              >
                {/* 3D Pushpin */}
                <div
                  style={{
                    position: 'absolute',
                    top: '-8px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '16px',
                    height: '16px',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle at 35% 35%, #ffffff 0%, #ff758f 50%, #991b1b 100%)',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
                    zIndex: 20,
                    border: '1.5px solid #ffffff',
                  }}
                />

                <div style={{ position: 'relative' }}>
                  <img
                    src="/luc 1.jpeg"
                    alt="Desy 1"
                    style={{ width: '100%', height: '175px', objectFit: 'cover', borderRadius: '4px' }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      bottom: '5px',
                      right: '5px',
                      background: 'rgba(0,0,0,0.45)',
                      borderRadius: '50%',
                      width: '22px',
                      height: '22px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#ffffff',
                    }}
                  >
                    <ZoomIn size={13} />
                  </div>
                </div>

                <p
                  style={{
                    fontFamily: 'var(--font-handwriting)',
                    fontSize: '0.98rem',
                    color: '#704250',
                    textAlign: 'center',
                    marginTop: '6px',
                    lineHeight: '1.3',
                  }}
                >
                  "Kamu selalu cantik dalam keadaan apa pun, tapi entah kenapa, di foto ini aku benar-benar terpukau" 🌸
                </p>
              </div>

              {/* Note Sheet */}
              <div
                style={{
                  background: '#fefcf8',
                  border: '1px solid #ebd9df',
                  borderRadius: '10px',
                  padding: '10px 12px 10px 16px',
                  width: '100%',
                  maxWidth: '290px',
                  boxShadow: '0 3px 10px rgba(0,0,0,0.04)',
                  position: 'relative',
                  marginBottom: '10px',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    top: '-6px',
                    left: '14px',
                    width: '10px',
                    height: '20px',
                    border: '2px solid #d4af37',
                    borderRadius: '4px',
                    zIndex: 10,
                  }}
                />
                <p
                  style={{
                    fontFamily: 'var(--font-handwriting)',
                    fontSize: '1.05rem',
                    color: '#4a2c38',
                    lineHeight: '1.3',
                    margin: 0,
                  }}
                >
                  "Dari awal kita saling sapa, ada ketenangan yang gak pernah aku rasakan sebelumnya. Setiap cerita kecil bersamamu adalah lembaran baru yang ingin terus kubaca selamanya."
                </p>
              </div>

              {/* Next Page Prompt */}
              <div
                onClick={handleNextPage}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  fontSize: '0.78rem',
                  fontWeight: '600',
                  color: '#ff4d6d',
                  cursor: 'pointer',
                  padding: '4px 12px',
                  borderRadius: '16px',
                  background: 'rgba(255, 117, 143, 0.1)',
                }}
              >
                <span>Balik ke Pameran 02</span>
                <ChevronRight size={15} />
              </div>
            </div>
          )}

          {/* ======================================================= */}
          {/* PAGE 2: PAMERAN 02 — FIRST DATE & FOTO 2 (POSE ANDALAN KAFE) */}
          {/* ======================================================= */}
          {currentPage === 2 && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              {/* Badge */}
              <div
                style={{
                  display: 'inline-block',
                  padding: '8px 16px',
                  borderRadius: '18px',
                  border: '2px double #b05d6f',
                  background: '#fff9fa',
                  boxShadow: '0 3px 10px rgba(176, 93, 111, 0.1)',
                  marginBottom: '10px',
                  textAlign: 'center',
                  width: '100%',
                  maxWidth: '290px',
                }}
              >
                <p style={{ fontSize: '0.68rem', letterSpacing: '2px', color: '#b05d6f', fontWeight: '800', textTransform: 'uppercase', margin: '0 0 2px 0' }}>
                  PAMERAN 02
                </p>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.12rem', color: '#2e1c24', margin: 0 }}>
                  potongan memori favoritku
                </h3>
              </div>

              {/* Torn Lined Notebook Memo Sheet */}
              <div
                style={{
                  width: '100%',
                  maxWidth: '290px',
                  background: '#fffdfa',
                  border: '1px solid #ebd9df',
                  borderRadius: '10px',
                  padding: '14px 12px 12px',
                  position: 'relative',
                  boxShadow: '0 4px 14px rgba(0,0,0,0.05)',
                  marginBottom: '10px',
                  backgroundImage: 'repeating-linear-gradient(#fffdfa, #fffdfa 24px, #f2e2e7 25px)',
                  lineHeight: '25px',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    top: '-7px',
                    left: '35%',
                    width: '65px',
                    height: '16px',
                    background: 'rgba(167, 196, 178, 0.8)',
                    zIndex: 15,
                    transform: 'rotate(2deg)',
                  }}
                />

                <p
                  style={{
                    fontFamily: 'var(--font-handwriting)',
                    fontSize: '1.12rem',
                    color: '#381e28',
                    margin: 0,
                    paddingTop: '2px',
                  }}
                >
                  Banyak hal yang dulunya terasa biasa saja, sekarang menjadi sesuatu yang selalu ingin kuingat karena ada kamu di dalamnya. Cara kamu tersenyum ketika sedang benar-benar bahagia selalu berhasil menghangatkan hariku 🤍
                </p>
              </div>

              {/* Centerpiece Polaroid: Foto 2 (Pose Andalan Kafe) */}
              <div
                className="polaroid-card"
                onClick={() => handleOpenZoom(desyPhotos[1])}
                style={{
                  width: '205px',
                  padding: '8px 8px 14px',
                  transform: 'rotate(2deg)',
                  marginBottom: '10px',
                }}
              >
                <div style={{ position: 'relative' }}>
                  <img
                    src="/luc 2.jpeg"
                    alt="Desy 2"
                    style={{ width: '100%', height: '165px', objectFit: 'cover', borderRadius: '4px' }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      bottom: '5px',
                      right: '5px',
                      background: 'rgba(0,0,0,0.45)',
                      borderRadius: '50%',
                      width: '22px',
                      height: '22px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#ffffff',
                    }}
                  >
                    <ZoomIn size={13} />
                  </div>
                </div>

                <p
                  style={{
                    fontFamily: 'var(--font-handwriting)',
                    fontSize: '1.02rem',
                    color: '#704250',
                    textAlign: 'center',
                    marginTop: '6px',
                    lineHeight: '1.3',
                  }}
                >
                  "Pose andalan kamu... dan entah kenapa, aku nggak pernah bosan melihatnya." ♡
                </p>
              </div>

              {/* Next Page Prompt */}
              <div
                onClick={handleNextPage}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  fontSize: '0.78rem',
                  fontWeight: '600',
                  color: '#ff4d6d',
                  cursor: 'pointer',
                  padding: '4px 12px',
                  borderRadius: '16px',
                  background: 'rgba(255, 117, 143, 0.1)',
                }}
              >
                <span>Buka 5 Potret Kenangan</span>
                <ChevronRight size={15} />
              </div>
            </div>
          )}

          {/* ======================================================= */}
          {/* PAGE 3: PAMERAN 03 — 5 POTRET KENANGAN DESY EIRLEA DRISELLE (INTERACTIVE SHOWCASE) */}
          {/* ======================================================= */}
          {currentPage === 3 && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              {/* Badge */}
              <div
                style={{
                  display: 'inline-block',
                  padding: '8px 16px',
                  borderRadius: '18px',
                  border: '2px double #b05d6f',
                  background: '#fff9fa',
                  boxShadow: '0 3px 10px rgba(176, 93, 111, 0.1)',
                  marginBottom: '8px',
                  textAlign: 'center',
                  width: '100%',
                  maxWidth: '290px',
                }}
              >
                <p style={{ fontSize: '0.68rem', letterSpacing: '2px', color: '#b05d6f', fontWeight: '800', textTransform: 'uppercase', margin: '0 0 2px 0' }}>
                  PAMERAN 03
                </p>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.12rem', color: '#2e1c24', margin: '0 0 2px 0' }}>
                  5 Potret Kenangan Desy Eirlea Driselle
                </h3>
                <p style={{ fontSize: '0.68rem', color: '#8c6571', margin: 0, fontStyle: 'italic' }}>
                  Ketuk foto untuk memperbesar (zoom) 🔍
                </p>
              </div>

              {/* 5 Tabs / Pills Selector Row with Horizontal Scroll & Quick Arrows */}
              <div
                style={{
                  width: '100%',
                  maxWidth: '300px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '3px',
                  marginBottom: '4px',
                }}
              >
                {/* Scroll Left Arrow */}
                <button
                  onClick={() => {
                    if (tabContainerRef.current) {
                      tabContainerRef.current.scrollBy({ left: -80, behavior: 'smooth' });
                    }
                  }}
                  style={{
                    background: 'rgba(255, 255, 255, 0.92)',
                    border: '1px solid #ffd1dc',
                    borderRadius: '50%',
                    width: '22px',
                    height: '22px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    color: '#ff4d6d',
                    padding: 0,
                    flexShrink: 0,
                    boxShadow: '0 1px 4px rgba(255, 77, 109, 0.15)',
                  }}
                  title="Geser Tab ke Kiri"
                >
                  <ChevronLeft size={13} />
                </button>

                {/* Horizontally Scrollable / Swipeable Tabs Container */}
                <div
                  ref={tabContainerRef}
                  style={{
                    display: 'flex',
                    gap: '5px',
                    overflowX: 'auto',
                    scrollbarWidth: 'none',
                    WebkitOverflowScrolling: 'touch',
                    scrollBehavior: 'smooth',
                    padding: '2px 2px',
                    flex: 1,
                  }}
                >
                  {desyPhotos.map((p, idx) => (
                    <button
                      key={p.id}
                      onClick={() => handleSelectPhoto(idx)}
                      style={{
                        padding: '4px 9px',
                        borderRadius: '13px',
                        border: activePhotoIdx === idx ? '1.5px solid #ff4d6d' : '1px solid #ffd1dc',
                        background: activePhotoIdx === idx ? '#ff4d6d' : '#ffffff',
                        color: activePhotoIdx === idx ? '#ffffff' : '#704250',
                        fontSize: '0.68rem',
                        fontWeight: activePhotoIdx === idx ? '700' : '500',
                        cursor: 'pointer',
                        whiteSpace: 'nowrap',
                        transition: 'all 0.2s ease',
                        boxShadow: activePhotoIdx === idx ? '0 2px 6px rgba(255, 77, 109, 0.3)' : 'none',
                        flexShrink: 0,
                      }}
                    >
                      {p.tabLabel}
                    </button>
                  ))}
                </div>

                {/* Scroll Right Arrow */}
                <button
                  onClick={() => {
                    if (tabContainerRef.current) {
                      tabContainerRef.current.scrollBy({ left: 80, behavior: 'smooth' });
                    }
                  }}
                  style={{
                    background: 'rgba(255, 255, 255, 0.92)',
                    border: '1px solid #ffd1dc',
                    borderRadius: '50%',
                    width: '22px',
                    height: '22px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    color: '#ff4d6d',
                    padding: 0,
                    flexShrink: 0,
                    boxShadow: '0 1px 4px rgba(255, 77, 109, 0.15)',
                  }}
                  title="Geser Tab ke Kanan"
                >
                  <ChevronRight size={13} />
                </button>
              </div>

              {/* 10-Second Auto Rotate Progress Bar & Pause/Resume Control */}
              <div
                style={{
                  width: '100%',
                  maxWidth: '290px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '7px',
                  padding: '0 2px',
                }}
              >
                {/* Subtle Progress Bar */}
                <div
                  style={{
                    flex: 1,
                    height: '3.5px',
                    background: 'rgba(255, 117, 143, 0.16)',
                    borderRadius: '3px',
                    overflow: 'hidden',
                    marginRight: '8px',
                    boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.04)',
                  }}
                  title={isAutoPlay ? `Otomatis berganti dalam 10 detik (${Math.round(autoProgress)}%)` : 'Timer otomatis dijeda'}
                >
                  <div
                    style={{
                      width: isAutoPlay ? `${autoProgress}%` : '0%',
                      height: '100%',
                      background: 'linear-gradient(90deg, #ff758f, #ff4d6d)',
                      borderRadius: '3px',
                      transition: 'width 0.1s linear',
                    }}
                  />
                </div>

                {/* Auto Rotate Toggle Button */}
                <button
                  onClick={() => setIsAutoPlay(!isAutoPlay)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '3px',
                    background: isAutoPlay ? '#fff0f3' : '#f3f4f6',
                    border: `1px solid ${isAutoPlay ? '#fecdd3' : '#e5e7eb'}`,
                    borderRadius: '10px',
                    padding: '2px 7px',
                    fontSize: '0.62rem',
                    color: isAutoPlay ? '#e11d48' : '#6b7280',
                    cursor: 'pointer',
                    fontWeight: '600',
                    whiteSpace: 'nowrap',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                  }}
                  title={isAutoPlay ? 'Jeda ganti foto otomatis 10 detik' : 'Nyalakan ganti foto otomatis 10 detik'}
                >
                  {isAutoPlay ? (
                    <>
                      <Pause size={10} />
                      <span>10s Auto</span>
                    </>
                  ) : (
                    <>
                      <Play size={10} />
                      <span>Putar Auto</span>
                    </>
                  )}
                </button>
              </div>

              {/* Active Polaroid Card Display with Touch Swipe Support */}
              {(() => {
                const currentPhoto = desyPhotos[activePhotoIdx];
                return (
                  <div
                    key={`polaroid-active-${currentPhoto.id}`}
                    className="polaroid-card"
                    onClick={() => handleOpenZoom(currentPhoto)}
                    onTouchStart={(e) => {
                      e.stopPropagation();
                      photoCardTouchStartXRef.current = e.touches[0].clientX;
                      photoCardTouchStartYRef.current = e.touches[0].clientY;
                    }}
                    onTouchEnd={(e) => {
                      e.stopPropagation();
                      const deltaX = e.changedTouches[0].clientX - photoCardTouchStartXRef.current;
                      const deltaY = e.changedTouches[0].clientY - photoCardTouchStartYRef.current;
                      if (Math.abs(deltaX) > 35 && Math.abs(deltaX) > Math.abs(deltaY)) {
                        if (deltaX < 0) {
                          handleSelectPhoto((activePhotoIdx + 1) % desyPhotos.length);
                        } else {
                          handleSelectPhoto(activePhotoIdx > 0 ? activePhotoIdx - 1 : desyPhotos.length - 1);
                        }
                      }
                    }}
                    style={{
                      width: '220px',
                      padding: '8px 8px 12px',
                      transform: `rotate(${currentPhoto.rotation}deg)`,
                      marginBottom: '8px',
                      position: 'relative',
                      cursor: 'pointer',
                    }}
                  >
                    {/* 3D Pushpin */}
                    <div
                      style={{
                        position: 'absolute',
                        top: '-8px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: '16px',
                        height: '16px',
                        borderRadius: '50%',
                        background: `radial-gradient(circle at 35% 35%, #ffffff 0%, ${currentPhoto.pinColor} 50%, #991b1b 100%)`,
                        boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
                        zIndex: 20,
                        border: '1.5px solid #ffffff',
                      }}
                    />

                    {/* Rubber Stamp Badge */}
                    <div
                      style={{
                        position: 'absolute',
                        bottom: '8px',
                        right: '8px',
                        border: '1.5px dashed #b05d6f',
                        borderRadius: '6px',
                        padding: '2px 5px',
                        fontSize: '0.58rem',
                        fontWeight: '800',
                        color: '#b05d6f',
                        transform: 'rotate(-5deg)',
                        opacity: 0.85,
                        zIndex: 10,
                        background: 'rgba(255,255,255,0.85)',
                      }}
                    >
                      {currentPhoto.stamp}
                    </div>

                    <div style={{ position: 'relative' }}>
                      <img
                        src={currentPhoto.image}
                        alt={currentPhoto.title}
                        style={{
                          width: '100%',
                          height: '170px',
                          objectFit: 'cover',
                          borderRadius: '4px',
                          display: 'block',
                        }}
                      />
                      <div
                        style={{
                          position: 'absolute',
                          bottom: '5px',
                          left: '5px',
                          background: 'rgba(0,0,0,0.45)',
                          borderRadius: '50%',
                          width: '22px',
                          height: '22px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#ffffff',
                        }}
                      >
                        <ZoomIn size={13} />
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px' }}>
                      <p style={{ fontSize: '0.64rem', color: '#9e7b87', margin: 0, paddingLeft: '2px' }}>
                        {currentPhoto.date}
                      </p>
                      <span style={{ fontSize: '0.6rem', color: '#ff758f', fontWeight: '600' }}>
                        Geser foto ↔
                      </span>
                    </div>
                  </div>
                );
              })()}

              {/* Handwritten Quote Box for the Active Photo */}
              <div
                style={{
                  background: '#fefcf8',
                  border: '1px solid #ebd9df',
                  borderRadius: '10px',
                  padding: '10px 14px',
                  width: '100%',
                  maxWidth: '280px',
                  boxShadow: '0 3px 10px rgba(0,0,0,0.04)',
                  marginBottom: '8px',
                  textAlign: 'center',
                }}
              >
                <p
                  style={{
                    fontFamily: 'var(--font-handwriting)',
                    fontSize: '1.14rem',
                    color: '#381e28',
                    lineHeight: '1.35',
                    margin: 0,
                  }}
                >
                  "{desyPhotos[activePhotoIdx].caption}"
                </p>
              </div>

              {/* Photo Switcher Controls */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '6px',
                }}
              >
                <button
                  onClick={() => handleSelectPhoto(activePhotoIdx > 0 ? activePhotoIdx - 1 : desyPhotos.length - 1)}
                  style={{
                    background: '#ffffff',
                    border: '1px solid #ffd1dc',
                    borderRadius: '14px',
                    padding: '3px 8px',
                    fontSize: '0.72rem',
                    color: '#b05d6f',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '2px',
                  }}
                >
                  <ChevronLeft size={13} />
                  <span>Sebelumnya</span>
                </button>

                <span style={{ fontSize: '0.72rem', fontWeight: '700', color: '#ff4d6d' }}>
                  {activePhotoIdx + 1} / 5
                </span>

                <button
                  onClick={() => handleSelectPhoto((activePhotoIdx + 1) % desyPhotos.length)}
                  style={{
                    background: '#ffffff',
                    border: '1px solid #ffd1dc',
                    borderRadius: '14px',
                    padding: '3px 8px',
                    fontSize: '0.72rem',
                    color: '#b05d6f',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '2px',
                  }}
                >
                  <span>Selanjutnya</span>
                  <ChevronRight size={13} />
                </button>
              </div>

              {/* Next Page Prompt */}
              <div
                onClick={handleNextPage}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  fontSize: '0.76rem',
                  fontWeight: '600',
                  color: '#ff4d6d',
                  cursor: 'pointer',
                  padding: '4px 10px',
                  borderRadius: '14px',
                  background: 'rgba(255, 117, 143, 0.1)',
                }}
              >
                <span>Buka Pameran 04: Lagu Kita</span>
                <ChevronRight size={14} />
              </div>
            </div>
          )}

          {/* ======================================================= */}
          {/* PAGE 4: PAMERAN 04 — LAGU KITA (SPOTIFY AUDIO GUIDE) */}
          {/* ======================================================= */}
          {currentPage === 4 && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              {/* Badge */}
              <div
                style={{
                  display: 'inline-block',
                  padding: '8px 16px',
                  borderRadius: '18px',
                  border: '2px double #b05d6f',
                  background: '#fff9fa',
                  boxShadow: '0 3px 10px rgba(176, 93, 111, 0.1)',
                  marginBottom: '10px',
                  textAlign: 'center',
                  width: '100%',
                  maxWidth: '290px',
                }}
              >
                <p style={{ fontSize: '0.68rem', letterSpacing: '2px', color: '#b05d6f', fontWeight: '800', textTransform: 'uppercase', margin: '0 0 2px 0' }}>
                  PAMERAN 04
                </p>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem', color: '#2e1c24', margin: 0 }}>
                  Lagu yg membawa kamu ke aku
                </h3>
              </div>

              {/* Memo Note Text */}
              <div
                style={{
                  background: '#fffdfa',
                  border: '1px solid #ebd9df',
                  borderRadius: '10px',
                  padding: '12px 14px',
                  width: '100%',
                  maxWidth: '290px',
                  boxShadow: '0 3px 10px rgba(0,0,0,0.04)',
                  marginBottom: '12px',
                }}
              >
                <p
                  style={{
                    fontFamily: 'var(--font-handwriting)',
                    fontSize: '1.12rem',
                    color: '#3d202b',
                    lineHeight: '1.35',
                    margin: 0,
                  }}
                >
                  kamu jugo keknyo sudah tau, kalo satu lagu ini biso bkin aku keinget kamu, karno aku bener" naro kamu di lagu ini 🎵
                </p>
              </div>

              {/* Spotify Player */}
              <div
                style={{
                  width: '100%',
                  maxWidth: '290px',
                  background: '#ffffff',
                  borderRadius: '14px',
                  padding: '12px',
                  boxShadow: '0 6px 20px rgba(180, 80, 110, 0.12)',
                  border: '1.5px solid #fce7f3',
                  marginBottom: '14px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.64rem', letterSpacing: '2px', color: '#ff4d6d', fontWeight: '700' }}>AUDIO GUIDE</span>
                  <span style={{ fontSize: '0.68rem', color: '#9e7b87', fontWeight: '600' }}>● No. 04</span>
                </div>

                <div
                  style={{
                    background: 'linear-gradient(135deg, #2b1055 0%, #431057 50%, #591a53 100%)',
                    borderRadius: '10px',
                    padding: '12px 10px',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                  }}
                >
                  {/* Spinning Vinyl */}
                  <div
                    style={{
                      width: '54px',
                      height: '54px',
                      borderRadius: '50%',
                      background: 'radial-gradient(circle, #1a1a1a 0%, #333333 40%, #111111 70%, #000000 100%)',
                      boxShadow: '0 3px 10px rgba(0,0,0,0.4)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      animation: isPlaying ? 'spinVinyl 3s linear infinite' : 'none',
                    }}
                  >
                    <div
                      style={{
                        width: '20px',
                        height: '20px',
                        borderRadius: '50%',
                        background: '#ff4d6d',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.6rem',
                      }}
                    >
                      🤍
                    </div>
                  </div>

                  {/* Track Details */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: '0.8rem', fontWeight: '700', margin: '0 0 2px 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      Give Me Your Forever
                    </p>
                    <p style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.7)', margin: '0 0 4px 0' }}>
                      Nadhif Basalama · Special for Desy 🤍
                    </p>

                    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '2px', height: '12px' }}>
                      {Array.from({ length: 10 }).map((_, i) => (
                        <div
                          key={i}
                          style={{
                            width: '3px',
                            height: isPlaying ? `${Math.sin(i * 1.5) * 5 + 6}px` : '3px',
                            background: '#ff758f',
                            borderRadius: '2px',
                            transition: 'height 0.2s ease',
                          }}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Play Button */}
                  <button
                    onClick={onToggleMusic}
                    style={{
                      width: '34px',
                      height: '34px',
                      borderRadius: '50%',
                      background: '#1db954',
                      border: 'none',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      flexShrink: 0,
                    }}
                  >
                    {isPlaying ? <Volume2 size={16} /> : <VolumeX size={16} />}
                  </button>
                </div>
              </div>

              {/* Next Page Prompt */}
              <div
                onClick={handleNextPage}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  fontSize: '0.78rem',
                  fontWeight: '600',
                  color: '#ff4d6d',
                  cursor: 'pointer',
                  padding: '5px 12px',
                  borderRadius: '16px',
                  background: 'rgba(255, 117, 143, 0.1)',
                }}
              >
                <span>Buka Pameran 05: Surat Cinta 💌</span>
                <ChevronRight size={15} />
              </div>
            </div>
          )}

          {/* ======================================================= */}
          {/* PAGE 5: PAMERAN 05 — AMPLOP 3D & FOTO 5 (GAUN ANGGUN) */}
          {/* ======================================================= */}
          {currentPage === 5 && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              {/* Badge */}
              <div
                style={{
                  display: 'inline-block',
                  padding: '8px 16px',
                  borderRadius: '18px',
                  border: '2px double #b05d6f',
                  background: '#fff9fa',
                  boxShadow: '0 3px 10px rgba(176, 93, 111, 0.1)',
                  marginBottom: '10px',
                  textAlign: 'center',
                  width: '100%',
                  maxWidth: '290px',
                }}
              >
                <p style={{ fontSize: '0.68rem', letterSpacing: '2px', color: '#b05d6f', fontWeight: '800', textTransform: 'uppercase', margin: '0 0 2px 0' }}>
                  PAMERAN 05
                </p>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem', color: '#2e1c24', margin: 0 }}>
                  Sepucuk Surat Dari Lubuk Hatiku
                </h3>
              </div>

              {/* Interactive 3D Envelope */}
              <div
                style={{
                  width: '100%',
                  maxWidth: '290px',
                  position: 'relative',
                  perspective: '1200px',
                  margin: '4px auto 10px',
                  minHeight: isEnvelopeOpen ? 'auto' : '160px',
                  transition: 'all 0.4s ease',
                }}
              >
                {!isEnvelopeOpen ? (
                  <div
                    key="closed-envelope-container"
                    onClick={handleOpenEnvelope}
                    style={{
                      width: '100%',
                      height: '155px',
                      background: 'linear-gradient(145deg, #fce7f3 0%, #fbcfe8 100%)',
                      border: '2px solid #f472b6',
                      borderRadius: '12px',
                      boxShadow: '0 8px 20px rgba(244, 114, 182, 0.25)',
                      cursor: 'pointer',
                      position: 'relative',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transformStyle: 'preserve-3d',
                    }}
                  >
                    <div
                      key="envelope-top-flap"
                      ref={envelopeFlapRef}
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: '75px',
                        background: 'linear-gradient(180deg, #f9a8d4 0%, #f472b6 100%)',
                        clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
                        transformOrigin: 'top center',
                        zIndex: 10,
                      }}
                    />

                    <div
                      key="envelope-wax-seal"
                      ref={sealRef}
                      style={{
                        position: 'absolute',
                        top: '50px',
                        zIndex: 25,
                        width: '50px',
                        height: '50px',
                        borderRadius: '50%',
                        background: 'radial-gradient(circle, #ff4d6d 0%, #c9184a 70%, #800f2f 100%)',
                        border: '2.5px solid #ffd1dc',
                        boxShadow: '0 4px 12px rgba(201, 24, 74, 0.4)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#ffffff',
                      }}
                    >
                      <Heart size={17} fill="#ffffff" />
                      <span style={{ fontSize: '0.48rem', fontWeight: '800', letterSpacing: '0.5px' }}>BUKA</span>
                    </div>

                    <p style={{ position: 'absolute', bottom: '10px', fontSize: '0.78rem', color: '#831843', fontWeight: '600' }}>
                      Ketuk segel untuk membuka surat 💌
                    </p>
                  </div>
                ) : (
                  <div
                    key="open-letter-sheet"
                    ref={letterRef}
                    style={{
                      width: '100%',
                      background: '#fffdfa',
                      border: '1.5px solid #f9a8d4',
                      borderRadius: '12px',
                      padding: '14px 12px 16px',
                      boxShadow: '0 8px 25px rgba(180, 80, 110, 0.18)',
                      position: 'relative',
                    }}
                  >
                    {/* Typewriter Progress / Skip Controls Header */}
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '10px',
                        padding: '4px 8px',
                        background: 'rgba(255, 117, 143, 0.08)',
                        borderRadius: '10px',
                        border: '1px solid rgba(255, 182, 193, 0.4)',
                      }}
                    >
                      {visibleWordCount < totalLetterWords ? (
                        <>
                          <span style={{ fontSize: '0.68rem', color: '#db2777', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: '600' }}>
                            <span>✍️ Menulis kata demi kata...</span>
                          </span>
                          <button
                            onClick={handleShowAllLetterText}
                            style={{
                              background: '#ffffff',
                              border: '1px solid #ffd1dc',
                              borderRadius: '10px',
                              padding: '2px 8px',
                              fontSize: '0.64rem',
                              color: '#ff4d6d',
                              fontWeight: '700',
                              cursor: 'pointer',
                              boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                            }}
                          >
                            Tampilkan Semua ⏩
                          </button>
                        </>
                      ) : (
                        <>
                          <span style={{ fontSize: '0.68rem', color: '#8c6571', fontStyle: 'italic' }}>
                            Surat cinta selesai ditulis 💌
                          </span>
                          <button
                            onClick={handleRestartTyping}
                            style={{
                              background: '#ffffff',
                              border: '1px solid #ffd1dc',
                              borderRadius: '10px',
                              padding: '2px 8px',
                              fontSize: '0.64rem',
                              color: '#ff4d6d',
                              fontWeight: '600',
                              cursor: 'pointer',
                            }}
                          >
                            ✍️ Ketik Ulang
                          </button>
                        </>
                      )}
                    </div>

                    {/* Centered Keepsake Polaroid: Foto 5 (Gaun / Kebaya Anggun) with Washi Tape */}
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '14px' }}>
                      <div
                        key="letter-polaroid-foto-5"
                        className="polaroid-card"
                        onClick={() => handleOpenZoom(desyPhotos[4])}
                        style={{
                          width: '145px',
                          padding: '7px 7px 10px',
                          transform: 'rotate(-1.5deg)',
                          boxShadow: '0 6px 18px rgba(180, 80, 110, 0.16)',
                          cursor: 'pointer',
                          position: 'relative',
                        }}
                      >
                        {/* Washi Tape Header */}
                        <div
                          style={{
                            position: 'absolute',
                            top: '-8px',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            width: '56px',
                            height: '14px',
                            background: 'rgba(255, 182, 193, 0.75)',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                            zIndex: 5,
                            borderRadius: '1px',
                          }}
                        />
                        <img
                          src="/luc 5.jpeg"
                          alt="Desy Gaun Anggun"
                          style={{ width: '100%', height: '145px', objectFit: 'cover', borderRadius: '4px', display: 'block' }}
                        />
                        <p style={{ fontFamily: 'var(--font-handwriting)', fontSize: '0.8rem', color: '#704250', textAlign: 'center', margin: '4px 0 0 0', lineHeight: 1.2 }}>
                          anggunmu bidadari ♡ (zoom 🔍)
                        </p>
                      </div>
                    </div>

                    {/* Greeting Header */}
                    <div style={{ textAlign: 'left', marginBottom: '8px' }}>
                      <span style={{ fontSize: '1.1rem' }}>💌</span>
                      <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', color: '#c9184a', margin: '2px 0 0 0', fontWeight: '700' }}>
                        Hai, sayang.
                      </h4>
                    </div>

                    {/* Letter Body: Word-by-Word Streaming Content */}
                    <div
                      style={{
                        fontFamily: 'var(--font-handwriting)',
                        fontSize: '1.12rem',
                        color: '#381e28',
                        lineHeight: '1.55',
                        textAlign: 'left',
                      }}
                    >
                      {letterSections.map((sec) => {
                        if (visibleWordCount <= sec.start) return null;
                        const wordsToShow = sec.words.slice(0, visibleWordCount - sec.start);
                        const isCurrentlyTypingThis = visibleWordCount < sec.end;

                        if (sec.type === 'accent_h') {
                          return (
                            <div key={sec.id} style={{ margin: '14px 0 6px', borderLeft: '3px solid #ff758f', paddingLeft: '8px' }}>
                              <p style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', color: '#c9184a', fontWeight: '700', margin: 0 }}>
                                {wordsToShow.join(' ')}
                                {isCurrentlyTypingThis && <span className="typewriter-cursor">|</span>}
                              </p>
                            </div>
                          );
                        }

                        if (sec.type === 'bullet') {
                          return (
                            <div key={sec.id} style={{ marginBottom: '5px' }}>
                              <p style={{ margin: 0, color: '#704250' }}>
                                {wordsToShow.join(' ')}
                                {isCurrentlyTypingThis && <span className="typewriter-cursor">|</span>}
                              </p>
                            </div>
                          );
                        }

                        if (sec.type === 'signoff_love') {
                          return (
                            <div key={sec.id} style={{ textAlign: 'right', marginTop: '16px' }}>
                              <p style={{ margin: '0 0 3px 0', fontSize: '1.16rem', color: '#c9184a', fontWeight: '700' }}>
                                {wordsToShow.join(' ')}
                                {isCurrentlyTypingThis && <span className="typewriter-cursor">|</span>}
                              </p>
                            </div>
                          );
                        }

                        if (sec.type === 'signoff_sub') {
                          return (
                            <div key={sec.id} style={{ textAlign: 'right' }}>
                              <p style={{ margin: '0 0 2px 0', fontSize: '1.04rem', color: '#b05d6f', fontStyle: 'italic' }}>
                                {wordsToShow.join(' ')}
                                {isCurrentlyTypingThis && <span className="typewriter-cursor">|</span>}
                              </p>
                            </div>
                          );
                        }

                        if (sec.type === 'signoff_heart') {
                          return (
                            <div key={sec.id} style={{ textAlign: 'right' }}>
                              <p style={{ margin: '4px 0 0 0', fontSize: '1.4rem' }}>
                                {wordsToShow.join(' ')}
                                {isCurrentlyTypingThis && <span className="typewriter-cursor">|</span>}
                              </p>
                            </div>
                          );
                        }

                        if (sec.type === 'signoff_name') {
                          return (
                            <div key={sec.id} style={{ textAlign: 'right' }}>
                              <p style={{ margin: '2px 0 0 0', fontSize: '1.28rem', fontWeight: '700', color: '#c9184a' }}>
                                {wordsToShow.join(' ')}
                                {isCurrentlyTypingThis && <span className="typewriter-cursor">|</span>}
                              </p>
                            </div>
                          );
                        }

                        // Standard Paragraph
                        return (
                          <p key={sec.id} style={{ marginBottom: '10px' }}>
                            {wordsToShow.join(' ')}
                            {isCurrentlyTypingThis && <span className="typewriter-cursor">|</span>}
                          </p>
                        );
                      })}

                      {/* Optional Fold Back Button */}
                      <div style={{ textAlign: 'center', marginTop: '16px' }}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setIsEnvelopeOpen(false);
                          }}
                          style={{
                            background: 'transparent',
                            border: '1px dashed #f472b6',
                            borderRadius: '12px',
                            padding: '4px 12px',
                            fontSize: '0.72rem',
                            color: '#db2777',
                            cursor: 'pointer',
                          }}
                        >
                          ✉️ Lipat Kembali ke Amplop
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Next Page Prompt */}
              <div
                onClick={handleNextPage}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  fontSize: '0.78rem',
                  fontWeight: '600',
                  color: '#ff4d6d',
                  cursor: 'pointer',
                  padding: '4px 12px',
                  borderRadius: '16px',
                  background: 'rgba(255, 117, 143, 0.1)',
                }}
              >
                <span>Halaman Terakhir: Tiup Lilin 🎂</span>
                <ChevronRight size={15} />
              </div>
            </div>
          )}

          {/* ======================================================= */}
          {/* PAGE 6: PENUTUP — BUKET APRESIASI & TIUP LILIN */}
          {/* ======================================================= */}
          {currentPage === 6 && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
              {/* Badge */}
              <div
                style={{
                  display: 'inline-block',
                  padding: '8px 16px',
                  borderRadius: '18px',
                  border: '2px double #b05d6f',
                  background: '#fff9fa',
                  boxShadow: '0 3px 10px rgba(176, 93, 111, 0.1)',
                  marginBottom: '8px',
                  width: '100%',
                  maxWidth: '290px',
                }}
              >
                <p style={{ fontSize: '0.68rem', letterSpacing: '2px', color: '#b05d6f', fontWeight: '800', textTransform: 'uppercase', margin: '0 0 2px 0' }}>
                  PAMERAN TERAKHIR
                </p>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.12rem', color: '#2e1c24', margin: 0 }}>
                  Buket Apresiasi & Tiup Lilin
                </h3>
              </div>

              {/* Flower Bouquet Image */}
              <div style={{ position: 'relative', width: '100px', height: '100px', margin: '0 auto 4px' }}>
                <img
                  src="/bucket bunga 2 no bg.png"
                  alt="Bouquet"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    filter: 'drop-shadow(0 6px 14px rgba(255, 117, 143, 0.3))',
                    animation: 'pulseGlow 2.5s infinite alternate',
                  }}
                />
              </div>

              {/* Appreciation Card */}
              <div
                style={{
                  background: '#fffbfd',
                  border: '1.5px solid #ffd1dc',
                  borderRadius: '12px',
                  padding: '10px 12px',
                  width: '100%',
                  maxWidth: '290px',
                  boxShadow: '0 4px 14px rgba(180, 80, 110, 0.08)',
                  marginBottom: '10px',
                }}
              >
                <p style={{ fontSize: '0.64rem', letterSpacing: '2px', color: '#b05d6f', fontWeight: '800', textTransform: 'uppercase', marginBottom: '2px' }}>
                  APRESIASI
                </p>
                <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem', color: '#2e1c24', margin: '0 0 4px 0', fontStyle: 'italic' }}>
                  Thank You for Staying untuk Desy...
                </h4>
                <p style={{ fontSize: '0.78rem', color: '#8c6571', margin: '0 0 8px 0' }}>
                  Terima kasih karena tetap ada dan menemani perjalananku.
                </p>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', justifyContent: 'center' }}>
                  <span style={{ fontSize: '0.64rem', background: '#ffe4ea', color: '#c9184a', padding: '2px 7px', borderRadius: '10px', fontWeight: '600' }}>
                    🌸 Pink rose · Gratitude
                  </span>
                  <span style={{ fontSize: '0.64rem', background: '#e0f2fe', color: '#0369a1', padding: '2px 7px', borderRadius: '10px', fontWeight: '600' }}>
                    🦋 Blue hydrangea · Devotion
                  </span>
                </div>
              </div>

              {/* Interactive Birthday Cake Button */}
              <button
                onClick={handleOpenCake}
                style={{
                  width: '100%',
                  maxWidth: '280px',
                  background: 'linear-gradient(135deg, #ff758f 0%, #ff4d6d 50%, #c9184a 100%)',
                  color: '#ffffff',
                  border: '2px solid #ffffff',
                  borderRadius: '26px',
                  padding: '10px 18px',
                  fontSize: '0.92rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  boxShadow: '0 6px 20px rgba(255, 77, 109, 0.4)',
                  marginBottom: '8px',
                }}
              >
                <Cake size={17} />
                <span>Tiup Lilin Ulang Tahun 🎂 💕</span>
              </button>

              {/* Restart Button */}
              <button
                onClick={onRestart}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#a8828f',
                  fontSize: '0.75rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  cursor: 'pointer',
                  textDecoration: 'underline',
                  padding: '2px',
                }}
              >
                <RotateCcw size={11} />
                <span>Ulangi dari awal</span>
              </button>
            </div>
          )}

          {/* CURLED CORNER FLIP BUTTON (Bottom Right) */}
          {currentPage < totalPages - 1 && (
            <div
              onClick={handleNextPage}
              title="Balik Halaman Berikutnya"
              style={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                width: '42px',
                height: '42px',
                cursor: 'pointer',
                zIndex: 20,
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'flex-end',
                padding: '3px 5px',
              }}
            >
              <div
                style={{
                  width: '28px',
                  height: '28px',
                  background: 'linear-gradient(135deg, transparent 50%, #f472b6 50%)',
                  boxShadow: '-2px -2px 5px rgba(0,0,0,0.12)',
                  borderRadius: '0 0 12px 0',
                }}
              />
            </div>
          )}

          {/* CURLED CORNER PREV BUTTON (Bottom Left) */}
          {currentPage > 0 && (
            <div
              onClick={handlePrevPage}
              title="Balik Halaman Sebelumnya"
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                width: '42px',
                height: '42px',
                cursor: 'pointer',
                zIndex: 20,
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'flex-start',
                padding: '3px 5px',
              }}
            >
              <div
                style={{
                  width: '28px',
                  height: '28px',
                  background: 'linear-gradient(225deg, transparent 50%, #f472b6 50%)',
                  boxShadow: '2px -2px 5px rgba(0,0,0,0.12)',
                  borderRadius: '0 0 0 12px',
                }}
              />
            </div>
          )}
        </div>
      </div>

      {/* ========================================================= */}
      {/* BOTTOM NAVIGATION BAR: Prev, Dots, Next (Fixed & Never Cut Off) */}
      {/* ========================================================= */}
      <div
        style={{
          width: '100%',
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '6px 8px 2px',
          zIndex: 30,
        }}
      >
        {/* Previous Button */}
        <button
          onClick={handlePrevPage}
          disabled={currentPage === 0 || isFlipping}
          style={{
            background: currentPage === 0 ? 'rgba(255,255,255,0.4)' : '#ffffff',
            border: '1.5px solid #ffccd5',
            borderRadius: '20px',
            padding: '6px 14px',
            fontSize: '0.78rem',
            fontWeight: '600',
            color: currentPage === 0 ? '#d1b5be' : '#b05d6f',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            cursor: currentPage === 0 ? 'not-allowed' : 'pointer',
            boxShadow: '0 2px 8px rgba(255, 117, 143, 0.15)',
          }}
        >
          <ChevronLeft size={15} />
          <span>Sebelumnya</span>
        </button>

        {/* Page Dots Indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          {pageNames.map((p, idx) => (
            <div
              key={p.id}
              onClick={() => turnToPage(idx)}
              title={p.label}
              style={{
                width: currentPage === idx ? '18px' : '6px',
                height: '6px',
                borderRadius: '3px',
                background: currentPage === idx ? '#ff4d6d' : '#ffd1dc',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
              }}
            />
          ))}
        </div>

        {/* Next Button */}
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages - 1 || isFlipping}
          style={{
            background: currentPage === totalPages - 1
              ? 'rgba(255,255,255,0.4)'
              : 'linear-gradient(135deg, #ff758f 0%, #ff4d6d 100%)',
            border: '1.5px solid #ffffff',
            borderRadius: '20px',
            padding: '6px 14px',
            fontSize: '0.78rem',
            fontWeight: '700',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            cursor: currentPage === totalPages - 1 ? 'not-allowed' : 'pointer',
            boxShadow: '0 3px 10px rgba(255, 77, 109, 0.3)',
          }}
        >
          <span>Selanjutnya</span>
          <ChevronRight size={15} />
        </button>
      </div>

      {/* ========================================================= */}
      {/* FULL-SCREEN ZOOM LIGHTBOX MODAL */}
      {/* ========================================================= */}
      {selectedPhoto && (
        <div
          onClick={handleCloseZoom}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 999,
            background: 'rgba(20, 8, 14, 0.88)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px 14px',
          }}
        >
          <div
            className="zoom-modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#ffffff',
              borderRadius: '16px',
              padding: '14px 14px 20px',
              maxWidth: '360px',
              width: '100%',
              boxShadow: '0 25px 60px rgba(0,0,0,0.5)',
              position: 'relative',
              textAlign: 'center',
            }}
          >
            <button
              onClick={handleCloseZoom}
              style={{
                position: 'absolute',
                top: '-10px',
                right: '-10px',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: '#ff4d6d',
                color: '#ffffff',
                border: '2px solid #ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 3px 10px rgba(0,0,0,0.3)',
              }}
            >
              <X size={16} />
            </button>

            <img
              src={selectedPhoto.image}
              alt={selectedPhoto.title || selectedPhoto.caption}
              style={{
                width: '100%',
                maxHeight: '380px',
                objectFit: 'contain',
                borderRadius: '8px',
                marginBottom: '10px',
              }}
            />

            <h4
              style={{
                fontFamily: 'var(--font-handwriting)',
                fontSize: '1.25rem',
                color: '#2e1c24',
                margin: '0 0 6px 0',
                lineHeight: '1.35',
              }}
            >
              "{selectedPhoto.caption}"
            </h4>

            <p style={{ fontSize: '0.78rem', color: '#9e7b87', margin: 0 }}>
              {selectedPhoto.date}
            </p>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* BIRTHDAY CAKE & BLOW CANDLE MODAL */}
      {/* ========================================================= */}
      {showCakeModal && (
        <div
          onClick={() => setShowCakeModal(false)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 999,
            background: 'rgba(20, 8, 14, 0.85)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px 16px',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#ffffff',
              borderRadius: '22px',
              padding: '22px 18px',
              maxWidth: '330px',
              width: '100%',
              textAlign: 'center',
              boxShadow: '0 25px 60px rgba(0,0,0,0.4)',
              position: 'relative',
              border: '2px solid #ffd1dc',
            }}
          >
            <button
              onClick={() => setShowCakeModal(false)}
              style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                background: 'transparent',
                border: 'none',
                color: '#9e7b87',
                cursor: 'pointer',
              }}
            >
              <X size={18} />
            </button>

            <span style={{ fontSize: '0.72rem', letterSpacing: '2px', color: '#ff4d6d', fontWeight: '800' }}>
              MAKE A WISH
            </span>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.35rem', color: '#2e1c24', margin: '4px 0 12px 0' }}>
              Ulang Tahun Desy 🎂
            </h3>

            {/* Cake Graphic */}
            <div style={{ position: 'relative', width: '110px', height: '110px', margin: '0 auto 14px' }}>
              {!candleBlown ? (
                <div
                  style={{
                    position: 'absolute',
                    top: '2px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '14px',
                    height: '22px',
                    borderRadius: '50% 50% 20% 20%',
                    background: 'radial-gradient(ellipse at 50% 80%, #ffffff 0%, #ffd700 40%, #ff4500 80%)',
                    boxShadow: '0 0 12px #ffd700, 0 0 25px #ff4500',
                    animation: 'pulseGlow 0.8s infinite alternate',
                  }}
                />
              ) : (
                <div
                  style={{
                    position: 'absolute',
                    top: '4px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    fontSize: '1.2rem',
                    animation: 'fadeSmoke 1.5s forwards',
                  }}
                >
                  💨
                </div>
              )}

              <div
                style={{
                  position: 'absolute',
                  top: '24px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '7px',
                  height: '22px',
                  background: 'linear-gradient(to right, #ffccd5, #ff4d6d)',
                  borderRadius: '2px',
                }}
              />

              <div
                style={{
                  position: 'absolute',
                  bottom: '6px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '84px',
                  height: '52px',
                  background: 'linear-gradient(180deg, #ffe4ea 0%, #ff85a2 100%)',
                  borderRadius: '10px 10px 6px 6px',
                  border: '2px solid #ffffff',
                  boxShadow: '0 4px 12px rgba(255, 77, 109, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.3rem',
                }}
              >
                🍰
              </div>
            </div>

            {!candleBlown ? (
              <>
                <p style={{ fontFamily: 'var(--font-handwriting)', fontSize: '1.2rem', color: '#4a2c38', marginBottom: '14px' }}>
                  Pikirkan satu harapan terindahmu sebelum meniup lilinnya ya sayang... 🤍
                </p>
                <button
                  onClick={handleBlowCandle}
                  style={{
                    background: 'linear-gradient(135deg, #ff758f 0%, #ff4d6d 100%)',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '28px',
                    padding: '11px 24px',
                    fontSize: '0.92rem',
                    fontWeight: '700',
                    cursor: 'pointer',
                    boxShadow: '0 6px 18px rgba(255, 77, 109, 0.4)',
                  }}
                >
                  Tiup Lilin 💨 ✨
                </button>
              </>
            ) : (
              <div>
                <p style={{ fontFamily: 'var(--font-handwriting)', fontSize: '1.3rem', color: '#c9184a', fontWeight: '700', marginBottom: '6px' }}>
                  Yaaay! Selamat Ulang Tahun Desy Eirlea Driselle! 🎉✨
                </p>
                <p style={{ fontSize: '0.78rem', color: '#66424e', marginBottom: '14px' }}>
                  Semoga semua doa dan harapan manismu terkabul, selalu bahagia, sehat, dan terus tersenyum bersama orang-orang tersayang! 💕
                </p>
                <button
                  onClick={() => setShowCakeModal(false)}
                  style={{
                    background: '#fce7f3',
                    color: '#c9184a',
                    border: '1.5px solid #ff758f',
                    borderRadius: '18px',
                    padding: '7px 18px',
                    fontSize: '0.82rem',
                    fontWeight: '700',
                    cursor: 'pointer',
                  }}
                >
                  Tutup & Simpan Kenangan 🌸
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
