import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiBook, FiGlobe, FiArrowRight } from 'react-icons/fi';
import toast from 'react-hot-toast';
import './Auth.css';

const AUSTRIAN_UNIVERSITIES = [
  'University of Vienna', 'TU Wien', 'WU Vienna', 'University of Graz',
  'TU Graz', 'University of Innsbruck', 'Montanuniversität Leoben',
  'JKU Linz', 'University of Salzburg', 'Boku Vienna', 'Other'
];

const COUNTRIES = ['India', 'Other'];

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '', email: '', password: '', confirmPassword: '',
    university: '', country: 'India',
  });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password || !form.university) {
      return toast.error('Please fill all required fields');
    }
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters');
    if (form.password !== form.confirmPassword) return toast.error('Passwords do not match');

    setLoading(true);
    try {
      await register({ name: form.name, email: form.email, password: form.password, university: form.university, country: form.country });
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-bg">
        <div className="auth-orb orb-1" />
        <div className="auth-orb orb-2" />
      </div>

      <div className="auth-card auth-card-wide fade-in">
        <div className="auth-header">
          <div className="auth-logo">🇮🇳 ✕ 🇦🇹</div>
          <h1>Join the Community</h1>
          <p>Create your free account today</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label">Full Name *</label>
              <div className="input-icon-wrap">
                <FiUser className="input-icon" />
                <input type="text" name="name" className="form-input input-with-icon"
                  placeholder="Your full name" value={form.name} onChange={handleChange} required />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Email Address *</label>
              <div className="input-icon-wrap">
                <FiMail className="input-icon" />
                <input type="email" name="email" className="form-input input-with-icon"
                  placeholder="your@email.com" value={form.email} onChange={handleChange} required />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Password *</label>
              <div className="input-icon-wrap">
                <FiLock className="input-icon" />
                <input type={showPw ? 'text' : 'password'} name="password"
                  className="form-input input-with-icon input-with-icon-right"
                  placeholder="Min. 6 characters" value={form.password} onChange={handleChange} required />
                <button type="button" className="input-icon-right" onClick={() => setShowPw(!showPw)}>
                  {showPw ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Confirm Password *</label>
              <div className="input-icon-wrap">
                <FiLock className="input-icon" />
                <input type="password" name="confirmPassword"
                  className="form-input input-with-icon"
                  placeholder="Repeat password" value={form.confirmPassword} onChange={handleChange} required />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">University *</label>
              <div className="input-icon-wrap">
                <FiBook className="input-icon" />
                <select name="university" className="form-input input-with-icon"
                  value={form.university} onChange={handleChange} required>
                  <option value="">Select university</option>
                  {AUSTRIAN_UNIVERSITIES.map(u => <option key={u} value={u}>{u}</option>)}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Country</label>
              <div className="input-icon-wrap">
                <FiGlobe className="input-icon" />
                <select name="country" className="form-input input-with-icon"
                  value={form.country} onChange={handleChange}>
                  {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-lg auth-btn" disabled={loading}>
            {loading ? <><span className="btn-spinner" /> Creating account...</> : <>Create Account <FiArrowRight /></>}
          </button>
        </form>

        <p className="auth-terms">
          By registering, you agree to keep the community respectful and helpful.
        </p>

        <div className="auth-footer">
          <p>Already have an account? <Link to="/login">Sign in</Link></p>
        </div>
      </div>
    </div>
  );
}
