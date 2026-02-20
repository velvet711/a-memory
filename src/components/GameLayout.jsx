import React, { useState, useEffect } from 'react';
import styles from './GameLayout.module.css';
import yhwhGif from '../assets/yhwh.gif';

/**
 * GameLayout Component
 * 
 * This is the main container for our narrative game.
 * It displays:
 * - Top section: Large pixel-art image container
 * - Bottom section: Dialogue text + action button
 * Features:
 * - Random dialogue selection from a predefined list
 * - Button that moves to random positions on click
 * - Shake animation with random red color on button click
 * Note: The image container is currently a placeholder and can be replaced with actual pixel-art images in the future.
 */
const GameLayout = () => {
  // Dialogue array - the narrative of the game
  const dialogueList = [
    "you were\n—a child.",
    "it was cold and empty.",
    "you felt the presence of many such halls.",
    "you heard the distant whistles of your father.",
    "and it was all.",
    "and it kept fading away?",
    "it was only then that you were.",
    "an orange tree.",
    "and it was ALL.",
    "you played in the mud.",
    "now you drink until you forget.",
    "you forget, again..?",
    "a flower tucked behind her ears.",
    "and it kept fading away."
  ];

  // State to track the current dialogue
  const [dialogueText, setDialogueText] = useState(dialogueList[0]);

  // State for random button position
  const [buttonPosition, setButtonPosition] = useState(getRandomPosition());

  // State to trigger shake animation
  const [isShaking, setIsShaking] = useState(false);
  const [shakeColor, setShakeColor] = useState('#cc0000');

  // Function to generate random color (subtle red variations)
  function getRandomColor() {
    const colors = [
      '#cc0000', // dark red
      '#990000', // darker red
      '#dd2222', // medium red
      '#bb1111', // dark medium red
      '#aa0000', // another dark red variation
      '#661111', // very dark red
      '#884444', // brownish red
      '#775555'  // dusty red
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  // Function to generate random position (x and y)
  function getRandomPosition() {
    return {
      x: Math.random() * 70, // 0-70% horizontally
      y: 50 + Math.random() * 40 // 50-90% vertically (keeps it in bottom half)
    };
  }

  // Handle button click - get a new random dialogue and position
  const handleButtonClick = () => {
    let randomDialogue;
    // Keep picking until we get a different dialogue
    do {
      randomDialogue = dialogueList[Math.floor(Math.random() * dialogueList.length)];
    } while (randomDialogue === dialogueText);
    
    setDialogueText(randomDialogue);
    setButtonPosition(getRandomPosition());
    
    // Trigger shake animation with random color
    const randomColor = getRandomColor();
    setShakeColor(randomColor);
    setIsShaking(true);
    // Reset shake state after animation completes
    setTimeout(() => setIsShaking(false), 400); 
  };

  const buttonText = "...and?";

  return (
    <div 
      className={`${styles.gameContainer} ${isShaking ? styles.shake : ''}`}
      style={{ '--shake-color': shakeColor }}
    >
      {/* Top Section: Image Area */}
      <div className={styles.imageContainer}>
        <div className={styles.imagePlaceholder}>
          {/* Display yhwh.gif during gameplay */}
          <img src={yhwhGif} alt="Game image" className={styles.gameImage} />
        </div>
      </div>

      {/* Bottom Section: Dialogue Box */}
      <div className={styles.dialogueContainer}>
        <div className={styles.dialogueBox}>
          <p className={styles.dialogueText}>{dialogueText}</p>
          <button 
            className={styles.actionButton}
            onClick={handleButtonClick}
            style={{ left: `${buttonPosition.x}%`, top: `${buttonPosition.y}%` }}
          >
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameLayout;
