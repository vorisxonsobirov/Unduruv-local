import React from 'react';
import "../../App.css";
import "./navbar.css";
import { useNavigate } from 'react-router-dom';

const Navbar = ({ onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout(); // Вызываем функцию logout из App.jsx
    navigate('/'); // Перенаправляем на главную страницу
  };

  return (
    <div className="Navbar">
      <h1>Mxsoft</h1>
      <button className="logout-btn" onClick={handleLogout}>Log out</button>
    </div>
  );
};

export default Navbar;