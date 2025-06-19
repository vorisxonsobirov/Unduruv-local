import React from 'react';
import "../../App.css";
import "./navbar.css";
import { useNavigate } from 'react-router-dom';
import { FaBars } from "react-icons/fa";


const Navbar = ({ onLogout, toggleSidebar }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/');
  };

  return (
    <div className="Navbar">
      <button className="menu-btn" onClick={toggleSidebar}>
        <FaBars />
      </button>
      <h1 className='mxsoft'>Mxsoft</h1>
      <button className="logout-btn" onClick={handleLogout}>Log out</button>
    </div>
  );
};

export default Navbar;
