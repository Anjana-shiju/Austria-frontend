import { Link } from 'react-router-dom';
import { FiArrowRight, FiMessageSquare, FiImage, FiBell, FiHelpCircle, FiUsers, FiShield } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import './Home.css';

const features = [
  { icon: <FiBell />, title: 'Announcements', desc: 'Stay updated with visa deadlines, events, and important news from admin.' },
  { icon: <FiHelpCircle />, title: 'Ask Doubts', desc: 'Submit questions about admission, visa, housing. Get expert responses within 24 hrs.' },
  { icon: <FiImage />, title: 'Photo Gallery', desc: 'Share your university moments. Like and comment on community photos.' },
  { icon: <FiMessageSquare />, title: 'Community Chat', desc: 'Real-time chat with fellow Indian students across Austria.' },
  { icon: <FiUsers />, title: 'Student Network', desc: 'Connect with Indians studying at universities across Austria.' },
  { icon: <FiShield />, title: 'Verified & Safe', desc: 'Moderated community. Admin ensures helpful, respectful environment.' },
];

const steps = [
  { num: '01', title: 'Create Account', desc: 'Register free with your university email' },
  { num: '02', title: 'Join Community', desc: 'Browse announcements and chat instantly' },
  { num: '03', title: 'Ask & Share', desc: 'Post doubts, share photos, help others' },
];

export default function Home() {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="home">
      {/* Hero */}
      <section className="hero">
        <div className="hero-bg">
          <div className="hero-orb orb-1" />
          <div className="hero-orb orb-2" />
          <div className="hero-grid" />
        </div>
        <div className="container hero-content">
          <div className="hero-badge fade-in">
            🇮🇳 Indian Students · Austria 🇦🇹
          </div>
          <h1 className="hero-title fade-in" style={{ animationDelay: '0.1s' }}>
            Your Community<br />Away From Home
          </h1>
          <p className="hero-subtitle fade-in" style={{ animationDelay: '0.2s' }}>
            Connect with fellow Indian students across Austria. Get answers,<br />
            share experiences, and navigate student life together.
          </p>
          <div className="hero-actions fade-in" style={{ animationDelay: '0.3s' }}>
            {isAuthenticated ? (
              <>
                <Link to="/chat" className="btn btn-primary btn-lg">
                  Join Community Chat <FiArrowRight />
                </Link>
                <Link to="/announcements" className="btn btn-secondary btn-lg">
                  Latest Updates
                </Link>
              </>
            ) : (
              <>
                <Link to="/register" className="btn btn-primary btn-lg">
                  Join for Free <FiArrowRight />
                </Link>
                <Link to="/login" className="btn btn-secondary btn-lg">
                  Sign In
                </Link>
              </>
            )}
          </div>

          <div className="hero-stats fade-in" style={{ animationDelay: '0.4s' }}>
            <div className="hero-stat">
              <span className="hero-stat-num">500+</span>
              <span className="hero-stat-label">Students</span>
            </div>
            <div className="hero-stat-divider" />
            <div className="hero-stat">
              <span className="hero-stat-num">10+</span>
              <span className="hero-stat-label">Universities</span>
            </div>
            <div className="hero-stat-divider" />
            <div className="hero-stat">
              <span className="hero-stat-num">24h</span>
              <span className="hero-stat-label">Response Time</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="features-section">
        <div className="container">
          <div className="section-intro">
            <div className="flag-bar"><span className="saffron" /><span className="white" /><span className="green" /></div>
            <h2 className="section-heading">Everything You Need</h2>
            <p className="section-desc">One platform for all your student life needs in Austria</p>
          </div>
          <div className="features-grid">
            {features.map((f, i) => (
              <div className="feature-card fade-in" key={i} style={{ animationDelay: `${i * 0.08}s` }}>
                <div className="feature-icon">{f.icon}</div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="how-section">
        <div className="container">
          <div className="section-intro">
            <h2 className="section-heading">Get Started in Minutes</h2>
          </div>
          <div className="steps-grid">
            {steps.map((s, i) => (
              <div className="step-card" key={i}>
                <div className="step-num">{s.num}</div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
                {i < steps.length - 1 && <div className="step-arrow">→</div>}
              </div>
            ))}
          </div>
          {!isAuthenticated && (
            <div className="how-cta">
              <Link to="/register" className="btn btn-primary btn-lg">
                Create Your Free Account <FiArrowRight />
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* CTA Banner */}
      {!isAuthenticated && (
        <section className="cta-section">
          <div className="container">
            <div className="cta-card">
              <div className="cta-orb" />
              <h2>Ready to Join?</h2>
              <p>Join 500+ Indian students already on the platform. It's completely free.</p>
              <Link to="/register" className="btn btn-primary btn-lg">
                Join the Community <FiArrowRight />
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
