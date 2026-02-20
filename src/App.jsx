import { useState, useRef, useEffect } from 'react'
import './App.css'
import StartScreen from './components/StartScreen'
import GameLayout from './components/GameLayout'
import gifSrc from './assets/littleguy.gif'
import audioSrc from './assets/music.wav'

function App() {
  const [gameStarted, setGameStarted] = useState(false);
  const [volume, setVolume] = useState(7);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  // Play audio when component mounts
  useEffect(() => {
    const audio = new Audio(audioSrc);
    audio.volume = volume / 100;
    audio.loop = true;
    audioRef.current = audio;
  }, []);

  // Handle play/pause
  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(err => console.log('Autoplay prevented:', err));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);

  // Update audio volume when slider changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  const handleStart = () => {
    setGameStarted(true);
  };

  return (
    <>
      {!gameStarted ? (
        <StartScreen 
          onStart={handleStart}
          setVolume={setVolume}
          gifSrc={gifSrc}
          audioSrc={audioSrc}
          isPlaying={isPlaying}
          setIsPlaying={setIsPlaying}
        />
      ) : (
        <GameLayout />
      )}
    </>
  );
}

export default App
