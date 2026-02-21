import React, { useState } from 'react';
import styles from './StartScreen.module.css';

/**
 * StartScreen Component
 * 
 * Initial landing screen before the game begins.
 * Features:
 * - Displays little guy GIF from assets
 * - Volume slider for background music, with play/pause toggle button. Meant as a fix 
 * for the music not playing on some browsers due to autoplay restrictions. 
 * The slider allows users to set the volume before starting the game, 
 * and the play/pause button gives them control over the music playback. Might find a better fix.
 * - Start button to begin the game
 */
const StartScreen = ({ onStart, setVolume, gifSrc, audioSrc, isPlaying, setIsPlaying }) => {
  const [volume, setLocalVolume] = useState(7);

  // Handle volume change
  const handleVolumeChange = (e) => {
    const newVolume = parseInt(e.target.value);
    setLocalVolume(newVolume);
    setVolume(newVolume);
  };

  // Handle play/pause toggle
  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div className={styles.startContainer}>
      {/* GIF Display Area */}
      <div className={styles.gifContainer}>
        {gifSrc && (
          <img src={gifSrc} alt="Game GIF" className={styles.gif} />
        )}
      </div>

      {/* Controls Section */}
      <div className={styles.controlsContainer}>
        {/* Volume Slider */}
        <div className={styles.volumeControl}>
          <label htmlFor="volumeSlider">Music Volume</label>
          <div className={styles.volumeRow}>
            <input
              id="volumeSlider"
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={handleVolumeChange}
              className={styles.slider}
            />
            <button 
              className={styles.playPauseButton}
              onClick={handlePlayPause}
              title={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? "⏸" : "▶"}
            </button>
          </div>
          <span className={styles.volumeValue}>{volume}%</span>
        </div>

        {/* Start Button */}
        <button className={styles.startButton} onClick={onStart}>
          a memory
        </button>
      </div>
    </div>
  );
};

export default StartScreen;
