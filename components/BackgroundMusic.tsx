import React, { useEffect, useRef, useState } from 'react';

const DEFAULT_MUSIC = process.env.NEXT_PUBLIC_MUSIC_URL || '/audio/musicox.mp3';

export const BackgroundMusic: React.FC = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const closed = localStorage.getItem('musicClosed');
    if (closed === '1') {
      setVisible(false);
      return;
    }

    const muted = localStorage.getItem('musicMuted');
    const shouldPlay = muted !== '1';

    // If audio element already exists, use it; else it will be created by render
    const audio = audioRef.current;
    if (audio) {
      audio.loop = true;
      audio.preload = 'auto';
      if (shouldPlay) {
        audio.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
      }
    }

    return () => {
      try {
        if (audioRef.current) {
          audioRef.current.pause();
        }
      } catch (e) {}
    };
  }, []);

  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
      localStorage.setItem('musicMuted', '1');
    } else {
      try {
        await audio.play();
        setPlaying(true);
        localStorage.removeItem('musicMuted');
      } catch (e) {
        setPlaying(false);
      }
    }
  };

  const closeMusic = () => {
    const audio = audioRef.current;
    try {
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
    } catch (e) {}
    setPlaying(false);
    setVisible(false);
    localStorage.setItem('musicClosed', '1');
  };

  if (!visible) return null;

  return (
    <>
      <audio
        ref={(el) => {
          if (el) {
            // ensure src is set from env (client only)
            if (!el.src || el.src.endsWith('/')) {
              el.src = process.env.NEXT_PUBLIC_MUSIC_URL || DEFAULT_MUSIC;
            }
            audioRef.current = el;
          }
        }}
        style={{ display: 'none' }}
        preload="auto"
        loop
      />

      <div className="fixed right-6 z-70 flex items-center gap-2" style={{ bottom: '96px' }}>
        <button
          onClick={togglePlay}
          aria-label={playing ? 'Pause music' : 'Play music'}
          className="bg-white/10 hover:bg-white/20 text-white px-4 py-3 rounded-md border-2 border-white/20 backdrop-blur-sm text-lg"
        >
          {playing ? '🔊' : '🔈'}
        </button>
        <button
          onClick={closeMusic}
          aria-label="Close music"
          className="bg-white/10 hover:bg-white/20 text-white px-4 py-3 rounded-md border-2 border-white/20 backdrop-blur-sm text-lg"
        >
          ✖
        </button>
      </div>
    </>
  );
};

export default BackgroundMusic;
