import './App.css';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar.jsx';
import Bar from './components/Bar/Bar.jsx';
import Profile from './components/Profile/Profile.jsx';
import Map from './components/Map/Map.jsx';
import CoordinatesScreen from './components/Map/CoordinatesScreen.jsx';
import AuthPage from './components/Auth/AuthPage.jsx';
import { useState, useEffect } from 'react';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false); // ← добавили

  useEffect(() => {
    const storedEmail = localStorage.getItem('email');
    const storedPassword = localStorage.getItem('password');
    if (storedEmail && storedPassword) {
      setIsAuthenticated(true);
    }
  }, []);


  const isMobile = window.innerWidth < 768;

  // Показываем Бар:
  {
    isMobile ? (
      <Bar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
    ) : (
      <Bar isOpen={true} onClose={() => { }} />
    )
  }

  const handleAuthSuccess = (email, password) => {
    localStorage.setItem('email', email);
    localStorage.setItem('password', password);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('email');
    localStorage.removeItem('password');
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen); // ← переключение
  };

  if (!isAuthenticated) {
    return <AuthPage onAuthSuccess={handleAuthSuccess} />;
  }

  return (
    <div className="App">
      <Navbar onLogout={handleLogout} toggleSidebar={toggleSidebar} />
      <div className="main-layout">
        <Bar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />


        <div className="page-content">
          <Routes>
            <Route path="/" element={<Profile />} />
            <Route path="/Map" element={<Map />} />
            <Route path="/Coordinates" element={<CoordinatesScreen />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default App;
