import { useState, useEffect } from 'react';
import { getAnnouncements } from '../utils/api';
import { format } from 'date-fns';
import { FiBell, FiCalendar, FiTag, FiX } from 'react-icons/fi';
import './Announcements.css';

const CATEGORIES = ['All', 'Admission', 'Visa', 'Housing', 'Events', 'General'];

export default function Announcements() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [lightbox, setLightbox] = useState(null); // lightbox image URL

  useEffect(() => {
    fetchAnnouncements();
  }, [activeCategory]);

  const fetchAnnouncements = async () => {
    setLoading(true);
    try {
      const params = activeCategory !== 'All' ? { category: activeCategory } : {};
      const res = await getAnnouncements(params);
      setAnnouncements(res.data.announcements);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrapper">
      <div className="container">
        <div className="page-header">
          <FiBell className="page-header-icon" />
          <div>
            <h1 className="page-title">Announcements</h1>
            <p className="page-subtitle">Stay updated with the latest news and important information</p>
          </div>
        </div>

        {/* Category Filter */}
        <div className="category-filter">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              className={`category-btn ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="loading-page"><div className="loading-spinner" /></div>
        ) : announcements.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📢</div>
            <h3>No announcements yet</h3>
            <p>Check back later for updates</p>
          </div>
        ) : (
          <div className="announcements-list">
            {announcements.map((ann, i) => (
              <div className="announcement-card fade-in" key={ann._id} style={{ animationDelay: `${i * 0.05}s` }}>
                {ann.image && (
                  <div className="announcement-img" onClick={() => setLightbox(ann.image)} style={{ cursor: 'zoom-in' }}>
                    <img src={ann.image} alt={ann.title} loading="lazy" />
                  </div>
                )}
                <div className="announcement-body">
                  <div className="announcement-meta">
                    <span className={`badge badge-${ann.category?.toLowerCase()}`}>
                      <FiTag /> {ann.category}
                    </span>
                    <span className="announcement-date">
                      <FiCalendar /> {format(new Date(ann.createdAt), 'MMM dd, yyyy')}
                    </span>
                  </div>
                  <h2 className="announcement-title">{ann.title}</h2>
                  <p className="announcement-content">{ann.content}</p>
                  <div className="announcement-author">
                    Posted by <strong>Admin</strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          onClick={() => setLightbox(null)}
          style={{
            position: 'fixed', inset: 0,
            background: 'rgba(0,0,0,0.92)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 1000, padding: 16, cursor: 'zoom-out'
          }}
        >
          <button
            onClick={() => setLightbox(null)}
            style={{
              position: 'absolute', top: 20, right: 20,
              background: 'rgba(255,255,255,0.15)', border: 'none',
              borderRadius: '50%', width: 40, height: 40,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'white', fontSize: '1.2rem', cursor: 'pointer'
            }}
          >
            <FiX />
          </button>
          <img
            src={lightbox}
            alt="Full view"
            onClick={e => e.stopPropagation()}
            style={{
              maxWidth: '95vw', maxHeight: '90vh',
              objectFit: 'contain', borderRadius: 12,
              boxShadow: '0 8px 40px rgba(0,0,0,0.6)'
            }}
          />
        </div>
      )}
    </div>
  );
}