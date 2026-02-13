'use client';

import { useState, useEffect } from 'react';

export default function Typewriter() {
  const text = 'Discover amazing categories at great prices';
  const [displayedText, setDisplayedText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [index, setIndex] = useState(text.length);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isDeleting) {
        if (index > 0) {
          setDisplayedText(text.slice(0, index - 1));
          setIndex(index - 1);
        } else {
          setIsDeleting(true);
        }
      } else {
        if (index < text.length) {
          setDisplayedText(text.slice(0, index + 1));
          setIndex(index + 1);
        } else {
          setIsDeleting(false);
        }
      }
    }, 100); 

    return () => clearTimeout(timer);
  }, [index, isDeleting, text]);

  return (
    <div className="overflow-hidden py-2 mb-4">
      <div className="text-xl text-center" style={{ color: 'grey' }}>
        {displayedText}
        <span className="animate-pulse">...</span>
      </div>
    </div>
  );
}
