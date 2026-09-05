import React, { useState, useRef } from 'react';
import PasscodeScreen from './components/PasscodeScreen';
import FaceIdScreen from './components/FaceIdScreen';
import HeartGalaxyScreen from './components/HeartGalaxyScreen';
import ScrapbookBook from './components/ScrapbookBook';

export default function App() {
  // 'passcode' | 'face-id' | 'galaxy' | 'book'
  const [currentStep, setCurrentStep] = useState('passcode');
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  const handleToggleMusic = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(() => {});
    }
  };

  const handleStartMusic = () => {
    if (!audioRef.current) return;
    audioRef.current.play()
      .then(() => setIsPlaying(true))
      .catch(() => {});
  };

  const handleRestart = () => {
    setCurrentStep('passcode');
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  };

  return (
    <div className="mobile-app-shell">
      {/* Background Audio */}
      <audio
        ref={audioRef}
        loop
        preload="auto"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      >
        <source src="/special-song.mp3" type="audio/mpeg" />
        <source src="/WhatsApp Audio 2026-09-05 at 17.10.01.mpeg" type="audio/mpeg" />
        <source src="/WhatsApp%20Audio%202026-09-05%20at%2017.10.01.mpeg" type="audio/mpeg" />
      </audio>

      {/* 1. Passcode Screen (PIN: 111225) */}
      {currentStep === 'passcode' && (
        <PasscodeScreen onUnlock={() => setCurrentStep('face-id')} />
      )}

      {/* 2. Face ID Scanner Animation */}
      {currentStep === 'face-id' && (
        <FaceIdScreen onComplete={() => setCurrentStep('galaxy')} />
      )}

      {/* 3. Black Starry Cosmos Screen with Pulsing Heart & Music */}
      {currentStep === 'galaxy' && (
        <HeartGalaxyScreen
          onPlayMusic={handleStartMusic}
          onContinue={() => setCurrentStep('book')}
        />
      )}

      {/* 4. 3D Animated Flipping Scrapbook Book */}
      {currentStep === 'book' && (
        <ScrapbookBook
          isPlaying={isPlaying}
          onToggleMusic={handleToggleMusic}
          onRestart={handleRestart}
          onGoToGalaxy={() => setCurrentStep('galaxy')}
        />
      )}
    </div>
  );
}
