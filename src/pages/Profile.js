import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiMail, FiPhone, FiBook, FiGlobe, FiEdit, FiUser } from 'react-icons/fi';
import './profile.css';

export default function Profile() {
  const { user } = useAuth();

  return (
    <div className="page-wrapper">
      <div className="container" style={{ maxWidth: 700 }}>

        {/* Cover + Avatar */}
        <div className="profile-cover">
          <div className="profile-cover-bg" />
          <div className="profile-avatar-wrap">
            <div className="profile-avatar-xl">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
          </div>
        </div>

        {/* Name + Edit */}
        <div className="profile-top">
          <div>
            <h1 className="profile-name">{user?.name}</h1>
            <span className={`badge ${user?.role === 'admin' ? 'badge-admission' : 'badge-general'}`}>
              {user?.role === 'admin' ? '⚡ Admin' : '🎓 Student'}
            </span>
          </div>
          <Link to="/settings" className="btn btn-secondary">
            <FiEdit /> Edit Profile
          </Link>
        </div>

        {/* Bio */}
        {user?.bio && (
          <div className="profile-bio card">
            <p>{user.bio}</p>
          </div>
        )}

        {/* Details */}
        <div className="profile-details card">
          <h3 className="profile-section-title">Profile Details</h3>

          <div className="profile-info-list">
            <div className="profile-info-item">
              <div className="profile-info-icon"><FiUser /></div>
              <div>
                <p className="profile-info-label">Full Name</p>
                <p className="profile-info-value">{user?.name || '—'}</p>
              </div>
            </div>

            <div className="profile-info-item">
              <div className="profile-info-icon"><FiMail /></div>
              <div>
                <p className="profile-info-label">Email</p>
                <p className="profile-info-value">{user?.email || '—'}</p>
              </div>
            </div>

            <div className="profile-info-item">
              <div className="profile-info-icon"><FiPhone /></div>
              <div>
                <p className="profile-info-label">Phone</p>
                <p className="profile-info-value">{user?.phone || 'Not added'}</p>
              </div>
            </div>

            <div className="profile-info-item">
              <div className="profile-info-icon"><FiBook /></div>
              <div>
                <p className="profile-info-label">University</p>
                <p className="profile-info-value">{user?.university || 'Not added'}</p>
              </div>
            </div>

            <div className="profile-info-item">
              <div className="profile-info-icon"><FiBook /></div>
              <div>
                <p className="profile-info-label">Course</p>
                <p className="profile-info-value">{user?.course || 'Not added'}</p>
              </div>
            </div>

            <div className="profile-info-item">
              <div className="profile-info-icon"><FiGlobe /></div>
              <div>
                <p className="profile-info-label">Country</p>
                <p className="profile-info-value">{user?.country || 'India'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="profile-quick-links">
          <Link to="/my-enquiries" className="btn btn-secondary">My Enquiries</Link>
          <Link to="/chat" className="btn btn-secondary">Community Chat</Link>
          <Link to="/settings" className="btn btn-primary"><FiEdit /> Edit Profile</Link>
        </div>

      </div>
    </div>
  );
}