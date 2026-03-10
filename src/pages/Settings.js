import { useState } from 'react';
import { updateProfile } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { FiSave, FiUser } from 'react-icons/fi';
import toast from 'react-hot-toast';
import './Settings.css';

const AUSTRIAN_UNIVERSITIES = [
  'University of Vienna', 'TU Wien', 'WU Vienna', 'University of Graz',
  'TU Graz', 'University of Innsbruck', 'Montanuniversität Leoben',
  'JKU Linz', 'University of Salzburg', 'Boku Vienna', 'Other'
];

export default function Settings() {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    university: user?.university || '',
    course: user?.course || '',
    bio: user?.bio || '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await updateProfile(form);
      updateUser(res.data.user);
      toast.success('Profile updated! ✅');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="page-wrapper">
      <div className="container" style={{ maxWidth: 680 }}>
        <div className="page-header">
          <FiUser className="page-header-icon" />
          <div>
            <h1 className="page-title">Settings</h1>
            <p className="page-subtitle">Update your profile information</p>
          </div>
        </div>

        {/* Avatar */}
        <div className="profile-avatar-section card" style={{ marginBottom: 24, display: 'flex', alignItems: 'center', gap: 20 }}>
          <div className="profile-avatar-lg">{user?.name?.charAt(0)}</div>
          <div>
            <p style={{ fontWeight: 700 }}>{user?.name}</p>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>{user?.email}</p>
            <span className={`badge ${user?.role === 'admin' ? 'badge-admission' : 'badge-general'}`} style={{ marginTop: 8 }}>
              {user?.role}
            </span>
          </div>
        </div>

        <div className="card">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Display Name *</label>
              <input className="form-input" value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })} required />
            </div>

            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input className="form-input" type="tel" placeholder="+43 XXX XXXXXXX"
                value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
            </div>

            <div className="form-group">
              <label className="form-label">University</label>
              <select className="form-input" value={form.university}
                onChange={e => setForm({ ...form, university: e.target.value })}>
                <option value="">Select university</option>
                {AUSTRIAN_UNIVERSITIES.map(u => <option key={u} value={u}>{u}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Course / Program</label>
              <input className="form-input" placeholder="e.g. MSc Computer Science"
                value={form.course} onChange={e => setForm({ ...form, course: e.target.value })} />
            </div>

            <div className="form-group">
              <label className="form-label">About Yourself</label>
              <textarea className="form-input" rows={4}
                placeholder="Tell the community about yourself..."
                value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })} />
            </div>

            <div className="settings-note">
              <p>📧 Email cannot be changed. Contact admin if needed.</p>
            </div>

            <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%', justifyContent: 'center' }} disabled={loading}>
              {loading ? 'Saving...' : <><FiSave /> Save Settings</>}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
