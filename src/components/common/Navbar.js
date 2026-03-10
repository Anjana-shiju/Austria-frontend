import { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  FiMenu, FiX, FiUser, FiSettings, FiLogOut,
  FiChevronDown, FiMessageSquare, FiHelpCircle, FiList
} from 'react-icons/fi';
import './Navbar.css';

export default function Navbar() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropOpen, setDropOpen] = useState(false);
  const dropRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target)) setDropOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/about', label: 'About' },
    { to: '/announcements', label: 'Announcements' },
    { to: '/gallery', label: 'Gallery' },
  ];

  const authLinks = isAuthenticated ? [
    { to: '/ask-doubt', label: 'Ask Doubt', icon: <FiHelpCircle /> },
    { to: '/my-enquiries', label: 'My Enquiries', icon: <FiList /> },
    { to: '/chat', label: 'Chat', icon: <FiMessageSquare /> },
  ] : [];

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        {/* Logo */}
        <Link to="/" className="navbar-logo">
          <div className="logo-icon">
            <span className="logo-flag">🇮🇳</span>
            <span className="logo-x">✕</span>
            <span className="logo-flag">🇦🇹</span>
          </div>
          <div className="logo-text">
            <span className="logo-name">IndiaAustria</span>
            <span className="logo-sub">Student Community</span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <ul className="nav-links desktop-only">
          {navLinks.map((l) => (
            <li key={l.to}>
              <NavLink to={l.to} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} end={l.to === '/'}>
                {l.label}
              </NavLink>
            </li>
          ))}
          {isAuthenticated && authLinks.map((l) => (
            <li key={l.to}>
              <NavLink to={l.to} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                {l.icon} {l.label}
              </NavLink>
            </li>
          ))}
          {isAdmin && (
            <li>
              <NavLink to="/admin" className={({ isActive }) => `nav-link admin-link ${isActive ? 'active' : ''}`}>
                Admin
              </NavLink>
            </li>
          )}
        </ul>

        {/* Desktop Auth */}
        <div className="nav-auth desktop-only">
          {isAuthenticated ? (
            <div className="user-dropdown" ref={dropRef}>
              <button className="user-btn" onClick={() => setDropOpen(!dropOpen)}>
                <div className="user-avatar">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                <span className="user-name">{user?.name?.split(' ')[0]}</span>
                <FiChevronDown className={`chevron ${dropOpen ? 'open' : ''}`} />
              </button>
              {dropOpen && (
                <div className="dropdown-menu fade-in">
                  <div className="dropdown-header">
                    <p className="dropdown-name">{user?.name}</p>
                    <p className="dropdown-email">{user?.email}</p>
                  </div>
                  <div className="dropdown-divider" />
                  <Link to="/profile" className="dropdown-item" onClick={() => setDropOpen(false)}>
                    <FiUser /> My Profile
                  </Link>
                  <Link to="/settings" className="dropdown-item" onClick={() => setDropOpen(false)}>
                    <FiSettings /> Settings
                  </Link>
                  <div className="dropdown-divider" />
                  <button className="dropdown-item danger" onClick={handleLogout}>
                    <FiLogOut /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="btn btn-secondary btn-sm">Login</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Register</Link>
            </div>
          )}
        </div>

        {/* Mobile hamburger */}
        <button className="hamburger mobile-only" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="mobile-menu fade-in">
          {navLinks.map((l) => (
            <NavLink key={l.to} to={l.to} className={({ isActive }) => `mobile-link ${isActive ? 'active' : ''}`}
              onClick={() => setMenuOpen(false)} end={l.to === '/'}>
              {l.label}
            </NavLink>
          ))}
          {isAuthenticated && (
            <>
              <div className="mobile-divider" />
              {authLinks.map((l) => (
                <NavLink key={l.to} to={l.to} className={({ isActive }) => `mobile-link ${isActive ? 'active' : ''}`}
                  onClick={() => setMenuOpen(false)}>
                  {l.icon} {l.label}
                </NavLink>
              ))}
              {isAdmin && (
                <NavLink to="/admin" className={({ isActive }) => `mobile-link admin-link ${isActive ? 'active' : ''}`}
                  onClick={() => setMenuOpen(false)}>
                  Admin Dashboard
                </NavLink>
              )}
              <div className="mobile-divider" />
              <Link to="/settings" className="mobile-link" onClick={() => setMenuOpen(false)}>
                <FiSettings /> Settings
              </Link>
              <button className="mobile-link danger" onClick={() => { handleLogout(); setMenuOpen(false); }}>
                <FiLogOut /> Logout
              </button>
            </>
          )}
          {!isAuthenticated && (
            <>
              <div className="mobile-divider" />
              <Link to="/login" className="mobile-link" onClick={() => setMenuOpen(false)}>Login</Link>
              <Link to="/register" className="mobile-link highlight" onClick={() => setMenuOpen(false)}>Register Free</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
