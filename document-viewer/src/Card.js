import React, { useState, useEffect } from 'react';
import './Card.css';

const Card = ({ type, title }) => {
  const [showOverlay, setShowOverlay] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setShowOverlay(false);
      }
    };

    if (showOverlay) {
      window.addEventListener('keydown', handleKeyDown);
    } else {
      window.removeEventListener('keydown', handleKeyDown);
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [showOverlay]);

  return (
    <div className="card">
      <img src={`/media/${type}.png`} alt={title} onClick={() => setShowOverlay(true)} />
      <h3>{title}</h3>
      {showOverlay && (
        <div className="overlay" onClick={() => setShowOverlay(false)}>
          <img src={`/media/${type}.png`} alt={title} className="overlay-image" />
        </div>
      )}
    </div>
  );
};

export default Card;
