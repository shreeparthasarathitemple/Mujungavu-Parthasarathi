import React, { useState, useEffect } from 'react';

const TypewriterText = ({ text, speed = 30, delay = 0 }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(delay === 0);

  useEffect(() => {
    setDisplayedText(''); // Reset when text changes
    
    if (delay > 0) {
      setIsTyping(false);
      const timeout = setTimeout(() => {
        setIsTyping(true);
      }, delay);
      return () => clearTimeout(timeout);
    } else {
      setIsTyping(true);
    }
  }, [text, delay]);

  useEffect(() => {
    if (!isTyping) return;

    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex <= text.length) {
        setDisplayedText(text.substring(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(interval);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed, isTyping]);

  return (
    <span>
      {displayedText}
      {isTyping && <span className="typewriter-cursor" style={{ opacity: displayedText.length === text.length ? 0 : 1 }}></span>}
    </span>
  );
};

export default TypewriterText;
