import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { FaSun, FaMoon } from 'react-icons/fa';
import './Login.css';

const Login = () => {
  const { isDark, toggleTheme } = useTheme();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError('');
      setLoading(true);
      await login(formData.email, formData.password);
      
      // After successful login, redirect to dashboard
      navigate('/dashboard');
    } catch (error) {
      setError('Correo electrónico o contraseña incorrectos');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`login-container ${isDark ? 'dark' : 'light'}`}>
      <button 
        className={`theme-toggle ${isDark ? 'dark' : 'light'}`} 
        onClick={toggleTheme}
      >
        {isDark ? <FaMoon className="theme-icon" /> : <FaSun className="theme-icon" />}
      </button>
      
      <form onSubmit={handleSubmit} className="login-form">
        <h2>Iniciar Sesion</h2>
        {error && <div className="error-message">{error}</div>}
        <div className="input-group">
          <input 
            type="email" 
            placeholder="Correo Electronico"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            required
          />
        </div>
        <div className="input-group">
          <input 
            type="password" 
            placeholder="Contraseña"
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Iniciando...' : 'Ingresar'}
        </button>
        <p className="switch-form">
          ¿No Tienes Cuenta? <a href="/register">Registrate</a>
        </p>
      </form>
    </div>
  );
};

export default Login;