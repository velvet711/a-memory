import React, { useState, useEffect, useRef } from 'react';
import styles from './GameLayout.module.css';
import yhwhGif from '../assets/yhwh.gif';
import andSfxSrc from '../assets/andsfx.wav';

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
    "and it kept fading away.",
    "your right hand, a stranger's.",
    "your left hand, a stranger's.",
    "and now your ears were clogged.",
    "a figure of a skull, on a book atop the shelf.",
    "neighbours were still visiting back then.",
    "a pink building you regret.",
    "a desolate house that made you forget.",
    "the sun shines in the bedroom when we play.",
    "a rubber chicken.",
    "mud inside candy wrappers.",
    "a hamster and a pillow.",
    "sloppy joes and the smell of nicotine gums.",
    "a girl on the bench overseeing the tree.",
    "a trip to the supermarket.",
    "an olive festival.",
    "an olive tree and you —roasted under the sun.",
    "fishing in the wind. no bites.",
    "the breeze you revisited later.",
    "an ice rink, and a puppet show.",
    "the cow mooed today.",
    "a sea of blanket.",
    "a microscope.",
    "a temporary drinking problem.",
    "a trumpet, a drum, and brass.",
    "dim metro lights.",
    "another cigarette.",
    "a cigarette.",
    "the same names again.",
    "the instant urge to shit after an iced coffee.",
    "back pain.",
    "a brown bear.",
    "still blossomed the chamomile.",
    "an embarrassment.",
    "still you catch the cold.",
    "blue.",
    "a dragon egg."
  ];

  const shakeTriggerSentences = new Set([
    "it was only then that you were.",
    "now you drink until you forget.",
    "a figure of a skull, on a book atop the shelf.",
    "a girl on the bench overseeing the tree.",
    "the cow moo'd today.",
    "another cigarette.",
    "a cigarette.",
    "back pain.",
    "and it was ALL.",
    "and now your ears were clogged.",
    "an embarrassment."
  ]);

  // State to track the current dialogue
  const [dialogueText, setDialogueText] = useState(dialogueList[0]);

  // State for typewriter animation
  const [displayedText, setDisplayedText] = useState('');
  const [charIndex, setCharIndex] = useState(0);

  // State for random button position
  const [buttonPosition, setButtonPosition] = useState(getRandomPosition());

  // State to trigger shake animation
  const [isShaking, setIsShaking] = useState(false);
  const [shakeColor, setShakeColor] = useState('#cc0000');
  const andSfxRef = useRef(null);

  useEffect(() => {
    const andSfx = new Audio(andSfxSrc);
    andSfx.loop = false;
    andSfx.volume = 0.1;
    andSfxRef.current = andSfx;

    return () => {
      andSfx.pause();
    };
  }, []);

  // Typewriter effect: display dialogue text letter by letter
  useEffect(() => {
    setCharIndex(0);
    setDisplayedText('');
  }, [dialogueText]);

  // Animate the text display
  useEffect(() => {
    if (charIndex < dialogueText.length) {
      const timeout = setTimeout(() => { 
        setDisplayedText(dialogueText.substring(0, charIndex + 1));
        setCharIndex(charIndex + 1);
      }, 50); // 50ms delay between each character

      return () => clearTimeout(timeout);
    }
  }, [charIndex, dialogueText]);

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
    if (charIndex < dialogueText.length) {
      setDisplayedText(dialogueText);
      setCharIndex(dialogueText.length);
      return;
    }

    if (andSfxRef.current) {
      andSfxRef.current.currentTime = 0;
      andSfxRef.current.play().catch(err => console.log('And SFX prevented:', err));
    }

    let randomDialogue;
    // Keep picking until we get a different dialogue
    do {
      randomDialogue = dialogueList[Math.floor(Math.random() * dialogueList.length)];
    } while (randomDialogue === dialogueText);
    
    setDialogueText(randomDialogue);
    setButtonPosition(getRandomPosition());
    
    if (shakeTriggerSentences.has(randomDialogue)) {
      const randomColor = getRandomColor();
      setShakeColor(randomColor);
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 650);
    } else {
      setIsShaking(false);
    }
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
          <p className={styles.dialogueText}>{displayedText}</p>
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
