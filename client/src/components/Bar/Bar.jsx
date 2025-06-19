import React, { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './bar.css';

const Bar = ({ isOpen, onClose }) => {
  const barRef = useRef();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (barRef.current && !barRef.current.contains(event.target)) {
        onClose(); // Закрываем при клике вне бара
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  return (
    <div ref={barRef} className={`Bar ${isOpen ? 'open' : 'closed'}`}>
      <Link to="/">Debtors list</Link>
      <Link to="/Map">Map</Link>
    </div>
  );
};

export default Bar;
