import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Navbar.css';

export default function Navbar({ navItems, activeNav, setActiveNav }) {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <div className="sidebar-nav">
      <div className="sidebar-brand">
        <div className="sidebar-logo">U</div>
        <div>
          <div className="sidebar-title">SIAE UNACH</div>
          <div className="sidebar-sub">Gestión Administrativa</div>
        </div>
      </div>

      <div className="sidebar-user">
        <div className="sidebar-user-label">Bienvenido(a),</div>
        <div className="sidebar-user-name">{usuario?.nombre}</div>
        <div className="sidebar-user-role">{usuario?.rol?.toUpperCase()}</div>
      </div>

      <div className="sidebar-menu-label">MENÚ</div>
      <nav className="sidebar-menu">
        {navItems.map(item => (
          <div
            key={item.key}
            className={`sidebar-menu-item ${activeNav === item.key ? 'active' : ''}`}
            onClick={() => setActiveNav(item.key)}
          >
            <span className="sidebar-menu-icon">{item.icon || '•'}</span>
            {item.label}
          </div>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button className="sidebar-logout" onClick={handleLogout}>← Cerrar Sesión</button>
      </div>
    </div>
  );
}
