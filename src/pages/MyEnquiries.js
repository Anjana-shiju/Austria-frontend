import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMyEnquiries } from '../utils/api';
import { FiList, FiPlus, FiClock, FiCheckCircle } from 'react-icons/fi';
import { format } from 'date-fns';
import './Enquiries.css';

export default function MyEnquiries() {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    getMyEnquiries()
      .then(res => setEnquiries(res.data.enquiries))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = filter === 'All' ? enquiries : enquiries.filter(e => e.status === filter);

  return (
    <div className="page-wrapper">
      <div className="container">
        <div className="section-header">
          <div className="page-header" style={{ marginBottom: 0 }}>
            <FiList className="page-header-icon" />
            <div>
              <h1 className="page-title">My Enquiries</h1>
              <p className="page-subtitle">Track your submitted questions</p>
            </div>
          </div>
          <Link to="/ask-doubt" className="btn btn-primary"><FiPlus /> Ask New Question</Link>
        </div>

        {/* Filter tabs */}
        <div className="tabs">
          {['All', 'Pending', 'Resolved'].map(t => (
            <button key={t} className={`tab ${filter === t ? 'active' : ''}`} onClick={() => setFilter(t)}>{t}</button>
          ))}
        </div>

        {loading ? (
          <div className="loading-page"><div className="loading-spinner" /></div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🤔</div>
            <h3>No {filter !== 'All' ? filter.toLowerCase() : ''} enquiries</h3>
            <p><Link to="/ask-doubt" style={{ color: 'var(--saffron)' }}>Ask your first question →</Link></p>
          </div>
        ) : (
          <div className="enquiries-list">
            {filtered.map((enq, i) => (
              <div className="enquiry-card fade-in" key={enq._id} style={{ animationDelay: `${i * 0.05}s` }}>
                <div className="enquiry-header">
                  <div className="enquiry-meta">
                    <span className={`badge badge-${enq.category?.toLowerCase()}`}>{enq.category}</span>
                    <span className={`badge ${enq.status === 'Resolved' ? 'badge-resolved' : 'badge-pending'}`}>
                      {enq.status === 'Resolved' ? <FiCheckCircle /> : <FiClock />} {enq.status}
                    </span>
                    <span className="enquiry-date">{format(new Date(enq.createdAt), 'MMM dd, yyyy')}</span>
                  </div>
                </div>
                <h3 className="enquiry-subject">{enq.subject}</h3>
                <p className="enquiry-question">{enq.question}</p>

                {enq.response && (
                  <div className="enquiry-response">
                    <div className="response-label"><FiCheckCircle /> Admin Response</div>
                    <p>{enq.response}</p>
                    <span className="response-date">{format(new Date(enq.respondedAt), 'MMM dd, yyyy · HH:mm')}</span>
                  </div>
                )}

                {enq.status === 'Pending' && (
                  <div className="enquiry-pending-note">
                    <FiClock /> Waiting for admin response (within 24 hours)
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
