import { useState, useEffect, useRef } from 'react';
import { getAdminStats, getAllEnquiries, getAnnouncements, deleteAnnouncement, respondToEnquiry, getAllUsers, deleteUser, createAnnouncement } from '../utils/api';
import { FiUsers, FiMessageSquare, FiCheckCircle, FiBell, FiTrash2, FiSend, FiImage, FiX } from 'react-icons/fi';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import './Admin.css';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [enquiries, setEnquiries] = useState([]);
  const [users, setUsers] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [responses, setResponses] = useState({});
  const [respondingId, setRespondingId] = useState(null);
  const [posting, setPosting] = useState(false);
  const [announcements, setAnnouncements] = useState([]);
  const [annForm, setAnnForm] = useState({ title: '', content: '', category: 'General' });
  const [annImage, setAnnImage] = useState(null);
  const [annPreview, setAnnPreview] = useState(null);
  const fileRef = useRef();

  useEffect(() => {
    fetchStats();
    fetchEnquiries();
  }, []);

  const fetchStats = async () => {
    try { const res = await getAdminStats(); setStats(res.data); } catch (e) { console.error(e); }
  };

  const fetchEnquiries = async () => {
    try { const res = await getAllEnquiries(); setEnquiries(res.data.enquiries); } catch (e) { console.error(e); }
  };

  const fetchUsers = async () => {
    try { const res = await getAllUsers(); setUsers(res.data.users); } catch (e) { console.error(e); }
  };

  const fetchAnnouncements = async () => {
    try { const res = await getAnnouncements(); setAnnouncements(res.data.announcements); } catch (e) { console.error(e); }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === 'users' && !users.length) fetchUsers();
    if (tab === 'announcements') fetchAnnouncements();
  };

  const handleRespond = async (id) => {
    const response = responses[id]?.trim();
    if (!response) return toast.error('Write a response first');
    setRespondingId(id);
    try {
      await respondToEnquiry(id, { response });
      setEnquiries(enquiries.map(e => e._id === id ? { ...e, status: 'Resolved', response, respondedAt: new Date() } : e));
      setResponses({ ...responses, [id]: '' });
      toast.success('Response sent! ✅');
    } catch (err) { toast.error('Failed to send response'); }
    finally { setRespondingId(null); }
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) return toast.error('Image must be under 10MB');
    setAnnImage(file);
    setAnnPreview(URL.createObjectURL(file));
  };

  const removeImage = () => {
    setAnnImage(null);
    setAnnPreview(null);
    if (fileRef.current) fileRef.current.value = '';
  };

  const handleDeleteAnnouncement = async (id) => {
    if (!window.confirm('Delete this announcement?')) return;
    try {
      await deleteAnnouncement(id);
      setAnnouncements(announcements.filter(a => a._id !== id));
      toast.success('Announcement deleted');
    } catch (err) { toast.error('Failed to delete'); }
  };

  const handlePostAnnouncement = async (e) => {
    e.preventDefault();
    if (!annForm.title || !annForm.content) return toast.error('Fill title and content');
    setPosting(true);
    try {
      const fd = new FormData();
      fd.append('title', annForm.title);
      fd.append('content', annForm.content);
      fd.append('category', annForm.category);
      if (annImage) fd.append('image', annImage);
      await createAnnouncement(fd);
      setAnnForm({ title: '', content: '', category: 'General' });
      setAnnImage(null);
      setAnnPreview(null);
      toast.success('Announcement posted! 📢');
      fetchAnnouncements();
    } catch (err) { toast.error('Failed to post announcement'); }
    finally { setPosting(false); }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Delete this user?')) return;
    try {
      await deleteUser(id);
      setUsers(users.filter(u => u._id !== id));
      toast.success('User deleted');
    } catch (err) { toast.error('Failed to delete user'); }
  };

  const pending = enquiries.filter(e => e.status === 'Pending');

  return (
    <div className="page-wrapper">
      <div className="container">
        <div className="admin-header">
          <div>
            <h1 className="page-title">Admin Dashboard</h1>
            <p className="page-subtitle">Manage the community platform</p>
          </div>
          <div className="admin-badge">Admin Access</div>
        </div>

        {/* Tabs */}
        <div style={{
          display: 'flex',
          gap: '4px',
          background: 'var(--dark-2)',
          padding: '4px',
          borderRadius: 'var(--radius)',
          marginBottom: '28px',
          overflowX: 'auto',
          WebkitOverflowScrolling: 'touch',
          scrollbarWidth: 'none',
          flexWrap: 'nowrap',
          width: '100%'
        }}>
          {['overview', 'enquiries', 'announcements', 'users'].map(t => (
            <button
              key={t}
              onClick={() => handleTabChange(t)}
              style={{
                padding: '10px 16px',
                borderRadius: '8px',
                fontSize: '0.85rem',
                fontWeight: 500,
                border: 'none',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                flexShrink: 0,
                background: activeTab === t ? 'var(--dark-card)' : 'transparent',
                color: activeTab === t ? 'var(--text-primary)' : 'var(--text-muted)',
                boxShadow: activeTab === t ? '0 2px 8px rgba(0,0,0,0.3)' : 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
              {t === 'enquiries' && pending.length > 0 && (
                <span className="tab-badge">{pending.length}</span>
              )}
            </button>
          ))}
        </div>

        {/* Overview */}
        {activeTab === 'overview' && (
          <div className="fade-in">
            <div className="grid-4" style={{ marginBottom: 32 }}>
              <div className="stat-card">
                <FiUsers className="stat-icon" />
                <div className="stat-number">{stats?.totalUsers || 0}</div>
                <div className="stat-label">Total Users</div>
              </div>
              <div className="stat-card">
                <FiMessageSquare className="stat-icon" />
                <div className="stat-number">{stats?.totalEnquiries || 0}</div>
                <div className="stat-label">Total Enquiries</div>
              </div>
              <div className="stat-card pending">
                <FiMessageSquare className="stat-icon" />
                <div className="stat-number">{stats?.pendingEnquiries || 0}</div>
                <div className="stat-label">Pending</div>
              </div>
              <div className="stat-card resolved">
                <FiCheckCircle className="stat-icon" />
                <div className="stat-number">{stats?.resolvedEnquiries || 0}</div>
                <div className="stat-label">Resolved</div>
              </div>
            </div>

            {pending.length > 0 && (
              <div>
                <h2 className="section-title" style={{ marginBottom: 16 }}>⚡ Needs Attention ({pending.length})</h2>
                {pending.slice(0, 3).map(enq => (
                  <div className="quick-enquiry card" key={enq._id}>
                    <div className="quick-meta">
                      <span className={`badge badge-${enq.category?.toLowerCase()}`}>{enq.category}</span>
                      <span className="enquiry-date">{format(new Date(enq.createdAt), 'MMM dd')}</span>
                      <strong>{enq.user?.name}</strong>
                    </div>
                    <p className="enquiry-subject">{enq.subject}</p>
                    <button className="btn btn-primary btn-sm" onClick={() => handleTabChange('enquiries')}>Respond →</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Enquiries */}
        {activeTab === 'enquiries' && (
          <div className="fade-in">
            {pending.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">✅</div>
                <h3>All caught up!</h3>
                <p>No pending enquiries</p>
              </div>
            ) : (
              <div className="admin-enquiries">
                {pending.map(enq => (
                  <div className="admin-enquiry-card card" key={enq._id}>
                    <div className="enquiry-meta" style={{ marginBottom: 10 }}>
                      <span className={`badge badge-${enq.category?.toLowerCase()}`}>{enq.category}</span>
                      <span className="badge badge-pending">Pending</span>
                      <strong style={{ fontSize: '0.9rem' }}>{enq.user?.name}</strong>
                      <span className="enquiry-date">{enq.user?.university} · {format(new Date(enq.createdAt), 'MMM dd, yyyy')}</span>
                    </div>
                    <h3 className="enquiry-subject">{enq.subject}</h3>
                    <p className="enquiry-question" style={{ WebkitLineClamp: 'unset' }}>{enq.question}</p>
                    <div className="admin-respond">
                      <textarea className="form-input" rows={4} placeholder="Type your response..."
                        value={responses[enq._id] || ''}
                        onChange={e => setResponses({ ...responses, [enq._id]: e.target.value })} />
                      <button className="btn btn-primary" onClick={() => handleRespond(enq._id)} disabled={respondingId === enq._id}>
                        {respondingId === enq._id ? 'Sending...' : <><FiSend /> Send Response</>}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Announcements */}
        {activeTab === 'announcements' && (
          <div className="fade-in">
            {/* Post form */}
            <div className="card" style={{ marginBottom: 32 }}>
              <h2 className="section-title" style={{ marginBottom: 24 }}>Post Announcement</h2>
              <form onSubmit={handlePostAnnouncement}>
                <div className="form-group">
                  <label className="form-label">Title *</label>
                  <input className="form-input" placeholder="Announcement title"
                    value={annForm.title} onChange={e => setAnnForm({ ...annForm, title: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select className="form-input" value={annForm.category}
                    onChange={e => setAnnForm({ ...annForm, category: e.target.value })}>
                    {['General', 'Admission', 'Visa', 'Housing', 'Events'].map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Content *</label>
                  <textarea className="form-input" rows={6} placeholder="Write the full announcement..."
                    value={annForm.content} onChange={e => setAnnForm({ ...annForm, content: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Image (Optional)</label>
                  {annPreview ? (
                    <div className="ann-img-preview">
                      <img src={annPreview} alt="preview" />
                      <button type="button" className="ann-img-remove" onClick={removeImage}>
                        <FiX /> Remove
                      </button>
                    </div>
                  ) : (
                    <div className="ann-img-upload" onClick={() => fileRef.current.click()}>
                      <FiImage />
                      <span>Click to add image</span>
                      <small>JPG, PNG · Max 10MB</small>
                    </div>
                  )}
                  <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImageSelect} />
                </div>
                <button type="submit" className="btn btn-primary btn-lg" disabled={posting}>
                  {posting ? 'Posting...' : <><FiBell /> Post Announcement</>}
                </button>
              </form>
            </div>

            {/* Announcements list */}
            {announcements.length > 0 && (
              <div>
                <h3 className="section-title" style={{ marginBottom: 16 }}>
                  Posted Announcements ({announcements.length})
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {announcements.map(ann => (
                    <div className="card" key={ann._id} style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
                          <span className={`badge badge-${ann.category?.toLowerCase()}`}>{ann.category}</span>
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                            {format(new Date(ann.createdAt), 'MMM dd, yyyy')}
                          </span>
                        </div>
                        <h4 style={{ fontFamily: 'DM Sans', fontSize: '1rem', marginBottom: 6 }}>{ann.title}</h4>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem',
                          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                          {ann.content}
                        </p>
                      </div>
                      {ann.image && (
                        <img src={ann.image} alt={ann.title}
                          style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 8, flexShrink: 0 }} />
                      )}
                      <button className="btn btn-danger btn-sm" onClick={() => handleDeleteAnnouncement(ann._id)}>
                        <FiTrash2 />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Users */}
        {activeTab === 'users' && (
          <div className="fade-in">
            <div className="users-table-wrap">
              <table className="users-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>University</th>
                    <th>Joined</th>
                    <th>Role</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u._id}>
                      <td><strong>{u.name}</strong></td>
                      <td style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>{u.email}</td>
                      <td style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{u.university}</td>
                      <td style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>{format(new Date(u.createdAt), 'MMM dd, yyyy')}</td>
                      <td><span className={`badge ${u.role === 'admin' ? 'badge-admission' : 'badge-general'}`}>{u.role}</span></td>
                      <td>
                        {u.role !== 'admin' && (
                          <button className="btn btn-danger btn-sm" onClick={() => handleDeleteUser(u._id)}>
                            <FiTrash2 />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}