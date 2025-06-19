import React, { useState } from 'react';
import './authPage.css';

const AuthPage = ({ onAuthSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isLogin) {
      const savedEmail = localStorage.getItem('email');
      const savedPassword = localStorage.getItem('password');

      if (email === savedEmail && password === savedPassword) {
        onAuthSuccess(email, password);
      } else {
        alert('Incorrect email or password');
      }
    } else {
      if (password !== confirmPassword) {
        alert('Passwords do not match');
        return;
      }
      localStorage.setItem('email', email);
      localStorage.setItem('password', password);
      onAuthSuccess(email, password);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <div className="tabs">
          <button className={isLogin ? 'active' : ''} onClick={() => setIsLogin(true)}>
            Login
          </button>
          <button className={!isLogin ? 'active' : ''} onClick={() => setIsLogin(false)}>
            Signup
          </button>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {!isLogin && (
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          )} 

        <div className="switch-link">
          {isLogin ? (
            <span>Don’t have an account? <span className="link" onClick={() => setIsLogin(false)}>Signup</span></span>
          ) : (
            <span>Already have an account? <span className="link" onClick={() => setIsLogin(true)}>Login</span></span>
          )}
        </div>

          <button type="submit" className="main-btn">
            {isLogin ? 'Login' : 'Signup'}
          </button>
        </form>

      </div>
    </div>
  );
};

export default AuthPage;
