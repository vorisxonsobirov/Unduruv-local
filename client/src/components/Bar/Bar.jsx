import React from 'react';
import { Link } from 'react-router-dom';
import "./bar.css";

const Bar = ({ isOpen }) => {
  return (
    <div className={`Bar ${isOpen ? 'open' : 'closed'}`}>
      <Link to="/">Profile</Link>
      <Link to="/Map">Map</Link>
    </div>
  );
};

export default Bar;
