import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { FaSun, FaMoon } from 'react-icons/fa';
import { toast } from 'react-toastify';
import './Register.css';

const Register = () => {
  const { isDark, toggleTheme } = useTheme();
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);  // Eliminado confirmPassword del estado

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Eliminada validación de confirmación de contraseña
    try {
      setLoading(true);
      await signup(formData.email, formData.password, formData.fullName);
      toast.success('¡Registro exitoso!');
      setTimeout(() => navigate('/login'), 2000);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`register-container ${isDark ? 'dark' : 'light'}`}>
      <button className={`theme-toggle ${isDark ? 'dark' : 'light'}`} onClick={toggleTheme}>
        {isDark ? <FaMoon className="theme-icon" /> : <FaSun className="theme-icon" />}
      </button>
      
      <form onSubmit={handleSubmit} className="register-form">
        <h2>Crear Cuenta</h2>
        <div className="input-group">
          <input
            type="text"
            placeholder="Nombre completo"
            value={formData.fullName}
            onChange={(e) => setFormData({...formData, fullName: e.target.value})}
            required
          />
        </div>
        <div className="input-group">
          <input
            type="email"
            placeholder="Correo electrónico"
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
        {/* Eliminado el div de confirmación de contraseña */}
        <button type="submit" disabled={loading}>
          {loading ? 'Registrando...' : 'Registrarse'}
        </button>
        <p className="switch-form">
          ¿Ya tienes una cuenta? <Link to="/login">Iniciar sesión</Link>
        </p>
      </form>
    </div>
  );
};

export default Register;