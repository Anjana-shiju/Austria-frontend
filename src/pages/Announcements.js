import { useState, useEffect } from 'react';
import { getAnnouncements } from '../utils/api';
import { format } from 'date-fns';
import { FiBell, FiCalendar, FiTag } from 'react-icons/fi';
import './Announcements.css';

const CATEGORIES = ['All', 'Admission', 'Visa', 'Housing', 'Events', 'General'];

export default function Announcements() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');

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
                  <div className="announcement-img">
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
    </div>
  );
}
