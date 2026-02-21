import { useState, useRef, useEffect } from 'react'
import './App.css'
import StartScreen from './components/StartScreen'
import GameLayout from './components/GameLayout'
import gifSrc from './assets/littleguy.gif'
import startThemeSrc from './assets/littleguytheme.wav'
import gameThemeSrc from './assets/dorange.wav'
import startSfxSrc from './assets/startsfx.wav'

const START_THEME_VOLUME_MULTIPLIER = 0.4;
const GAME_THEME_VOLUME_MULTIPLIER = 1;
const SCREEN_FADE_DURATION_MS = 2250;
const AUDIO_FADE_DURATION_MS = 2250;
const AUDIO_FADE_STEP_MS = 30;

function App() {
  const [currentScreen, setCurrentScreen] = useState('start');
  const [transitionState, setTransitionState] = useState('in');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [volume, setVolume] = useState(7);
  const [isPlaying, setIsPlaying] = useState(false);
  const startAudioRef = useRef(null);
  const gameAudioRef = useRef(null);
  const startSfxRef = useRef(null);
  const audioFadeIntervalRef = useRef(null);
  const transitionTimeoutRef = useRef(null);

  // Play audio when component mounts
  useEffect(() => {
    const startAudio = new Audio(startThemeSrc);
    const gameAudio = new Audio(gameThemeSrc);
    const startSfx = new Audio(startSfxSrc);

    startAudio.loop = true;
    gameAudio.loop = true;
    startSfx.loop = false;

    startAudioRef.current = startAudio;
    gameAudioRef.current = gameAudio;
    startSfxRef.current = startSfx;

    const baseVolume = volume / 100;
    startAudio.volume = baseVolume * START_THEME_VOLUME_MULTIPLIER;
    gameAudio.volume = 0;

    return () => {
      if (audioFadeIntervalRef.current) {
        clearInterval(audioFadeIntervalRef.current);
      }
      if (transitionTimeoutRef.current) {
        clearTimeout(transitionTimeoutRef.current);
      }
      startAudio.pause();
      gameAudio.pause();
      startSfx.pause();
    };
  }, []);

  // Keep active track/volume in sync when not transitioning
  useEffect(() => {
    const startAudio = startAudioRef.current;
    const gameAudio = gameAudioRef.current;
    if (!startAudio || !gameAudio) return;

    const baseVolume = volume / 100;
    const startTargetVolume = baseVolume * START_THEME_VOLUME_MULTIPLIER;
    const gameTargetVolume = baseVolume * GAME_THEME_VOLUME_MULTIPLIER;

    if (!isTransitioning) {
      if (currentScreen === 'start') {
        startAudio.volume = startTargetVolume;
        gameAudio.volume = 0;
      } else {
        startAudio.volume = 0;
        gameAudio.volume = gameTargetVolume;
      }
    }
  }, [volume, currentScreen, isTransitioning]);

  // Handle play/pause
  useEffect(() => {
    const startAudio = startAudioRef.current;
    const gameAudio = gameAudioRef.current;
    if (!startAudio || !gameAudio) return;

    if (!isPlaying) {
      startAudio.pause();
      gameAudio.pause();
      return;
    }

    if (isTransitioning) {
      startAudio.play().catch(err => console.log('Playback prevented:', err));
      gameAudio.play().catch(err => console.log('Playback prevented:', err));
      return;
    }

    if (currentScreen === 'start') {
      startAudio.play().catch(err => console.log('Playback prevented:', err));
      gameAudio.pause();
    } else {
      gameAudio.play().catch(err => console.log('Playback prevented:', err));
      startAudio.pause();
    }
  }, [isPlaying, currentScreen, isTransitioning]);

  const handleStart = () => {
    if (isTransitioning || currentScreen === 'game') {
      return;
    }

    if (startSfxRef.current) {
      startSfxRef.current.currentTime = 0;
      startSfxRef.current.volume = Math.min(1, volume / 100);
      startSfxRef.current.play().catch(err => console.log('Start SFX prevented:', err));
    }

    setIsTransitioning(true);
    setTransitionState('out');

    const startAudio = startAudioRef.current;
    const gameAudio = gameAudioRef.current;

    if (audioFadeIntervalRef.current) {
      clearInterval(audioFadeIntervalRef.current);
    }

    if (startAudio && gameAudio) {
      const baseVolume = volume / 100;
      const startTargetVolume = baseVolume * START_THEME_VOLUME_MULTIPLIER;
      const gameTargetVolume = baseVolume * GAME_THEME_VOLUME_MULTIPLIER;

      startAudio.volume = startTargetVolume;
      gameAudio.volume = 0;

      if (isPlaying) {
        startAudio.play().catch(err => console.log('Playback prevented:', err));
        gameAudio.play().catch(err => console.log('Playback prevented:', err));
      }

      let elapsed = 0;
      audioFadeIntervalRef.current = setInterval(() => {
        elapsed += AUDIO_FADE_STEP_MS;
        const progress = Math.min(elapsed / AUDIO_FADE_DURATION_MS, 1);

        startAudio.volume = startTargetVolume * (1 - progress);
        gameAudio.volume = gameTargetVolume * progress;

        if (progress >= 1) {
          clearInterval(audioFadeIntervalRef.current);
          audioFadeIntervalRef.current = null;
          startAudio.pause();
        }
      }, AUDIO_FADE_STEP_MS);
    }

    transitionTimeoutRef.current = setTimeout(() => {
      setCurrentScreen('game');
      setTransitionState('in');

      transitionTimeoutRef.current = setTimeout(() => {
        setIsTransitioning(false);
      }, SCREEN_FADE_DURATION_MS);
    }, SCREEN_FADE_DURATION_MS);
  };

  return (
    <div className={`appScreen ${transitionState === 'out' ? 'fadeOut' : 'fadeIn'}`}>
      {currentScreen === 'start' ? (
        <StartScreen 
          onStart={handleStart}
          setVolume={setVolume}
          gifSrc={gifSrc}
          audioSrc={startThemeSrc}
          isPlaying={isPlaying}
          setIsPlaying={setIsPlaying}
        />
      ) : (
        <GameLayout />
      )}
    </div>
  );
}

export default App
