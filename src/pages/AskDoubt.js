// AskDoubt.js
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { submitEnquiry } from '../utils/api';
import { FiHelpCircle, FiSend } from 'react-icons/fi';
import toast from 'react-hot-toast';
import './Enquiries.css';

const CATEGORIES = ['Admission', 'Visa', 'Housing', 'Scholarships', 'Student Life', 'General'];

export function AskDoubt() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ category: 'General', subject: '', question: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.subject || !form.question) return toast.error('Please fill all fields');
    setLoading(true);
    try {
      await submitEnquiry(form);
      toast.success('Question submitted! Admin will respond within 24 hours 📨');
      navigate('/my-enquiries');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Submission failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="page-wrapper">
      <div className="container" style={{ maxWidth: 700 }}>
        <div className="page-header">
          <FiHelpCircle className="page-header-icon" />
          <div>
            <h1 className="page-title">Ask a Doubt</h1>
            <p className="page-subtitle">Admin will respond within 24 hours</p>
          </div>
        </div>

        <div className="card">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Category *</label>
              <div className="category-pills">
                {CATEGORIES.map(cat => (
                  <button type="button" key={cat}
                    className={`category-pill ${form.category === cat ? 'active' : ''}`}
                    onClick={() => setForm({ ...form, category: cat })}>
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Subject *</label>
              <input className="form-input" placeholder="e.g. Application deadlines for Vienna University"
                value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} required />
            </div>

            <div className="form-group">
              <label className="form-label">Your Question *</label>
              <textarea className="form-input" rows={6}
                placeholder="Describe your question in detail. The more specific you are, the better the answer will be..."
                value={form.question} onChange={e => setForm({ ...form, question: e.target.value })} required />
            </div>

            <div className="enquiry-tips">
              <p>💡 <strong>Tips for a good question:</strong></p>
              <ul>
                <li>Be specific about your university and course</li>
                <li>Mention relevant deadlines or dates</li>
                <li>Include what you've already tried</li>
              </ul>
            </div>

            <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%', justifyContent: 'center' }} disabled={loading}>
              {loading ? 'Submitting...' : <><FiSend /> Submit Question</>}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
