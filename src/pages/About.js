import { FiMail, FiInfo, FiHeart } from 'react-icons/fi';
import './About.css';

export default function About() {
  return (
    <div className="page-wrapper">
      <div className="container" style={{ maxWidth: 800 }}>
        <div className="page-header">
          <FiInfo className="page-header-icon" />
          <div>
            <h1 className="page-title">About</h1>
            <p className="page-subtitle">IndiaAustria Student Community</p>
          </div>
        </div>

        <div className="about-hero card" style={{ marginBottom: 24 }}>
          <div className="about-flags">🇮🇳 ✕ 🇦🇹</div>
          <h2>Connecting Indian Students in Austria</h2>
          <p>
            This platform was built to help Indian students navigate academic and daily life in Austria.
            Whether you're applying for admission, dealing with visa paperwork, or just looking for
            community — you're in the right place.
          </p>
        </div>

        <div className="about-grid">
          <div className="card">
            <h3>What We Offer</h3>
            <ul className="about-list">
              <li>📢 Official announcements and updates</li>
              <li>❓ Expert answers to your questions</li>
              <li>📸 Community photo gallery</li>
              <li>💬 Real-time community chat</li>
              <li>🆓 Completely free, always</li>
            </ul>
          </div>
          <div className="card">
            <h3>Contact Admin</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 16, fontSize: '0.9rem' }}>
              For password resets, account issues, or any other help:
            </p>
            <a href="mailto:jerinjohnbusiness@gmail.com" className="admin-contact-btn">
              <FiMail />indausconnect@gmail.com
            </a>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', marginTop: 12 }}>
              Responses within 24 hours
            </p>
          </div>
        </div>

        <div className="about-footer card">
          <FiHeart style={{ color: 'var(--austria-red)', fontSize: '1.5rem' }} />
          <p>Made with love for the Indian student community in Austria</p>
        </div>
      </div>
    </div>
  );
}
