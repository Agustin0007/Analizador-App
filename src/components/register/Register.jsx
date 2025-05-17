import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { FaSun, FaMoon } from 'react-icons/fa';
import './Register.css';

const Register = () => {
  const { isDark, toggleTheme } = useTheme();
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError('');
      setLoading(true);
      await signup(formData.email, formData.password);
      
      // Save user data to localStorage
      localStorage.setItem('user', JSON.stringify({
        fullName: formData.fullName,
        email: formData.email
      }));
      
      // Redirect to login instead of gastos
      navigate('/login');
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        setError('Este correo electrónico ya está registrado');
      } else {
        setError('Error al registrarse: ' + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`register-container ${isDark ? 'dark' : 'light'}`}>
      <button 
        className={`theme-toggle ${isDark ? 'dark' : 'light'}`} 
        onClick={toggleTheme}
      >
        {isDark ? <FaMoon className="theme-icon" /> : <FaSun className="theme-icon" />}
      </button>
      
      <form onSubmit={handleSubmit} className="register-form">
        <h2>Crear Cuenta</h2>
        {error && <div className="error-message">{error}</div>}
        <div className="input-group">
          <input 
            type="text" 
            placeholder="Nombre Completo"
            value={formData.fullName}
            onChange={(e) => setFormData({...formData, fullName: e.target.value})}
            required
          />
        </div>
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
          {loading ? 'Registrando...' : 'Registrate'}
        </button>
        <p className="switch-form">
          ¿Ya Tienes una Cuenta? <a href="/login">Inicia Sesion</a>
        </p>
      </form>
    </div>
  );
};

export default Register;