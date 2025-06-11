import { createContext, useContext, useEffect, useState } from 'react';
import { Howl } from 'howler';

// Create context
const SoundContext = createContext();

// Sound files would be imported from the assets folder
// For this example, we'll use paths that will be created later
const SOUNDS = {
  startup: '/sounds/startup.mp3',
  ready: '/sounds/ready.mp3',
  click: '/sounds/click.mp3',
  hover: '/sounds/hover.mp3',
  generate: '/sounds/generate.mp3',
  success: '/sounds/success.mp3',
  error: '/sounds/error.mp3',
  toggle: '/sounds/toggle.mp3',
  save: '/sounds/save.mp3'
};

export function SoundProvider({ children }) {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [sounds, setSounds] = useState({});
  const [loaded, setLoaded] = useState(false);

  // Initialize sounds
  useEffect(() => {
    const soundObjects = {};

    Object.entries(SOUNDS).forEach(([key, url]) => {
      soundObjects[key] = new Howl({
        src: [url],
        volume: 0.5,
        preload: true,
      });
    });

    setSounds(soundObjects);
    setLoaded(true);
  }, []);

  const playSound = (soundName) => {
    if (!soundEnabled || !loaded) return;
    
    const sound = sounds[soundName];
    if (sound) {
      sound.play();
    }
  };

  const toggleSound = () => {
    setSoundEnabled((prev) => !prev);
  };

  const value = {
    playSound,
    toggleSound,
    soundEnabled,
    loaded
  };

  return (
    <SoundContext.Provider value={value}>
      {children}
    </SoundContext.Provider>
  );
}

export const useSoundContext = () => {
  const context = useContext(SoundContext);
  if (!context) {
    throw new Error('useSoundContext must be used within a SoundProvider');
  }
  return context;
};