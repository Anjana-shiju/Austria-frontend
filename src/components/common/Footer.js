import { Link } from 'react-router-dom';
import { FiMail, FiHeart } from 'react-icons/fi';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="footer-logo">🇮🇳 ✕ 🇦🇹</div>
            <p className="footer-desc">
              A community platform for Indian students navigating life in Austria.
              Connect, share, and grow together.
            </p>
            <div className="flag-bar">
              <span className="saffron"></span>
              <span className="white"></span>
              <span className="green"></span>
            </div>
          </div>

          <div className="footer-links-group">
            <h4>Navigate</h4>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/about">About</Link></li>
              <li><Link to="/announcements">Announcements</Link></li>
              <li><Link to="/gallery">Gallery</Link></li>
            </ul>
          </div>

          <div className="footer-links-group">
            <h4>Community</h4>
            <ul>
              <li><Link to="/ask-doubt">Ask a Doubt</Link></li>
              <li><Link to="/chat">Community Chat</Link></li>
              <li><Link to="/register">Join Now</Link></li>
            </ul>
          </div>

          <div className="footer-links-group">
            <h4>Contact Admin</h4>
            <a href="mailto:indausconnect@gmail.com" className="footer-email">
              <FiMail />
             indausconnect@gmail.com
            </a>
            <p className="footer-note">Queries answered within 24 hours</p>
          </div>
        </div>

        <div className="footer-bottom">
          <p>
            Made with <FiHeart className="heart" /> for Indian students in Austria · {new Date().getFullYear()}
          </p>
          <p className="footer-rights">Free forever for the community</p>
        </div>
      </div>
    </footer>
  );
}
