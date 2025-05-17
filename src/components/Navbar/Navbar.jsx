import { FaUserCircle, FaChevronDown, FaSignOutAlt, FaTimes, FaChartLine, FaDollarSign } from 'react-icons/fa';
import { FiSun, FiMoon } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import './Navbar.css';
import { useTheme } from '../../context/ThemeContext';

const Navbar = ({ activePage }) => {
  // Verifica que los datos se están leyendo correctamente
  const user = JSON.parse(localStorage.getItem('user')) || {};
  console.log('Datos de usuario:', user); // Esto te mostrará en consola qué hay guardado
  const navigate = useNavigate();
  const [showSidebar, setShowSidebar] = useState(false);
  const { isDark, toggleTheme } = useTheme();

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar-brand" onClick={() => navigate('/dashboard')}>
          <FaChartLine className="brand-icon" />
          <span className="brand-name">Analizador</span>
        </div>

        <div className="navbar-links">
          <div 
            className={`nav-item ${activePage === 'dashboard' ? 'active' : ''}`}
            onClick={() => navigate('/dashboard')}
          >
            <FaChartLine />
            <span>Dashboard</span>
          </div>
          <div 
            className={`nav-item ${activePage === 'gastos' ? 'active' : ''}`}
            onClick={() => navigate('/gastos')}
          >
            <FaDollarSign />
            <span>Gastos</span>
          </div>
        </div>

        <div className="user-menu" onClick={() => setShowSidebar(!showSidebar)}>
          <FaUserCircle className="user-icon" />
          <span className="user-name">
            {user.fullName || 'Usuario'} {/* Muestra el nombre o 'Usuario' si no existe */}
          </span>
          <FaChevronDown className={`dropdown-icon ${showSidebar ? 'rotate' : ''}`} />
        </div>
      </nav>

      <div className={`sidebar ${showSidebar ? 'open' : ''}`}>
        <div className="sidebar-header">
          <FaUserCircle className="user-icon-large" />
          <div className="user-info">
            <div className="user-info-name">{user?.fullName || 'Usuario'}</div>
            <div className="user-info-email">{user?.email || ''}</div>
          </div>
          <button className="close-sidebar" onClick={() => setShowSidebar(false)}>
            <FaTimes />
          </button>
        </div>

        <div className="sidebar-content">
          <div className="theme-switch-mirror" onClick={toggleTheme}>
            <div className={`theme-icon-container ${isDark ? 'dark' : 'light'}`}>
              {isDark ? <FiSun className="theme-icon" /> : <FiMoon className="theme-icon" />}
            </div>
            <span className="theme-label">Modo {isDark ? 'Claro' : 'Oscuro'}</span>
          </div>
        </div>

        <div className="sidebar-footer">
          <div className="theme-switch-mirror logout" onClick={handleLogout}>
            <div className="theme-icon-container">
              <FaSignOutAlt className="theme-icon" />
            </div>
            <span className="theme-label">Cerrar sesión</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;