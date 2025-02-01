import { createContext, useContext, useRef, useState } from 'react';

const AudioContext = createContext();

export function AudioProvider({ children }) {
  const [isEnabled, setIsEnabled] = useState(false);
  const backgroundMusicRef = useRef(null);
  const soundEffectsRef = useRef(null);

  const enableAudio = () => {
    setIsEnabled(true);
    if (backgroundMusicRef.current) {
      backgroundMusicRef.current.play();
      backgroundMusicRef.current.volume = 0.2;
    }
  };

  const playSound = (soundType) => {
    if (!isEnabled || !soundEffectsRef.current) return;
    
    soundEffectsRef.current.src = `/sounds/${soundType}.mp3`;
    soundEffectsRef.current.currentTime = 0;
    soundEffectsRef.current.play();
  };

  const value = {
    isEnabled,
    enableAudio,
    playSound,
    backgroundMusicRef,
    soundEffectsRef,
  };

  return (
    <AudioContext.Provider value={value}>
      {children}
      <audio ref={backgroundMusicRef} loop preload="auto" />
      <audio ref={soundEffectsRef} preload="auto" />
    </AudioContext.Provider>
  );
}

export const useAudio = () => useContext(AudioContext);