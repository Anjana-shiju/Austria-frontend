import { useState, useEffect, useRef } from 'react';
import { getPhotos, uploadPhoto, likePhoto, addComment, deletePhoto } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { FiUpload, FiHeart, FiMessageCircle, FiTrash2, FiX, FiImage } from 'react-icons/fi';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import './Gallery.css';

export default function Gallery() {
  const { user, isAuthenticated, isAdmin } = useAuth();
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [comment, setComment] = useState('');
  const [showUpload, setShowUpload] = useState(false);
  const fileRef = useRef();

  const [uploadForm, setUploadForm] = useState({ title: '', description: '', category: 'Campus', file: null });
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(null);

  useEffect(() => { fetchPhotos(); }, []);

  const fetchPhotos = async () => {
    try {
      const res = await getPhotos();
      setPhotos(res.data.photos);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) return toast.error('File must be under 10MB');
    setUploadForm({ ...uploadForm, file });
    setPreview(URL.createObjectURL(file));
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!uploadForm.file || !uploadForm.title) return toast.error('Title and image required');
    const fd = new FormData();
    fd.append('image', uploadForm.file);
    fd.append('title', uploadForm.title);
    fd.append('description', uploadForm.description);
    fd.append('category', uploadForm.category);
    setUploading(true);
    try {
      const res = await uploadPhoto(fd);
      setPhotos([res.data.photo, ...photos]);
      setShowUpload(false);
      setUploadForm({ title: '', description: '', category: 'Campus', file: null });
      setPreview(null);
      toast.success('Photo uploaded! 🎉');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed');
    } finally { setUploading(false); }
  };

  const handleLike = async (photoId) => {
    if (!isAuthenticated) return toast.error('Login to like photos');
    try {
      const res = await likePhoto(photoId);
      setPhotos(photos.map(p => p._id === photoId ? { ...p, likes: res.data.likes } : p));
      if (selectedPhoto?._id === photoId) setSelectedPhoto({ ...selectedPhoto, likes: res.data.likes });
    } catch (err) { toast.error('Could not like photo'); }
  };

  const handleComment = async (photoId) => {
    if (!comment.trim()) return;
    try {
      const res = await addComment(photoId, { text: comment });
      setPhotos(photos.map(p => p._id === photoId ? { ...p, comments: res.data.comments } : p));
      if (selectedPhoto?._id === photoId) setSelectedPhoto({ ...selectedPhoto, comments: res.data.comments });
      setComment('');
    } catch (err) { toast.error('Could not add comment'); }
  };

  const handleDelete = async (photoId) => {
    if (!window.confirm('Delete this photo?')) return;
    try {
      await deletePhoto(photoId);
      setPhotos(photos.filter(p => p._id !== photoId));
      if (selectedPhoto?._id === photoId) setSelectedPhoto(null);
      toast.success('Photo deleted');
    } catch (err) { toast.error('Could not delete photo'); }
  };

  const isLiked = (photo) => photo.likes?.includes(user?._id);

  return (
    <div className="page-wrapper">
      <div className="container">
        <div className="section-header">
          <div>
            <h1 className="page-title">Gallery</h1>
            <p className="page-subtitle">Student life across Austria, captured by you</p>
          </div>
          {isAuthenticated && (
            <button className="btn btn-primary" onClick={() => setShowUpload(true)}>
              <FiUpload /> Upload Photo
            </button>
          )}
        </div>

        {/* Upload Modal */}
        {showUpload && (
          <div className="modal-overlay" onClick={() => setShowUpload(false)}>
            <div className="modal-card fade-in" onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <h3>Upload Photo</h3>
                <button onClick={() => setShowUpload(false)}><FiX /></button>
              </div>
              <form onSubmit={handleUpload}>
                <div className="upload-area" onClick={() => fileRef.current.click()}>
                  {preview ? (
                    <img src={preview} alt="preview" className="upload-preview" />
                  ) : (
                    <>
                      <FiImage className="upload-icon" />
                      <p>Click to select image</p>
                      <span>JPG, PNG, GIF · Max 10MB</span>
                    </>
                  )}
                  <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFileChange} />
                </div>
                <div className="form-group">
                  <label className="form-label">Title *</label>
                  <input className="form-input" placeholder="My Campus Photo"
                    value={uploadForm.title} onChange={e => setUploadForm({ ...uploadForm, title: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea className="form-input" rows={3} placeholder="Tell us about this photo..."
                    value={uploadForm.description} onChange={e => setUploadForm({ ...uploadForm, description: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select className="form-input" value={uploadForm.category} onChange={e => setUploadForm({ ...uploadForm, category: e.target.value })}>
                    {['Campus', 'Events', 'City', 'Food', 'Travel', 'Other'].map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%', justifyContent: 'center' }} disabled={uploading}>
                  {uploading ? 'Uploading...' : <><FiUpload /> Upload Photo</>}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Photo Grid */}
        {loading ? (
          <div className="loading-page"><div className="loading-spinner" /></div>
        ) : photos.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📸</div>
            <h3>No photos yet</h3>
            <p>Be the first to share your student life!</p>
          </div>
        ) : (
          <div className="gallery-grid">
            {photos.map((photo, i) => (
              <div className="gallery-item fade-in" key={photo._id} style={{ animationDelay: `${i * 0.04}s` }}
                onClick={() => setSelectedPhoto(photo)}>
                <img src={photo.imageUrl} alt={photo.title} loading="lazy" />
                <div className="gallery-overlay">
                  <p className="gallery-title">{photo.title}</p>
                  <div className="gallery-stats">
                    <span><FiHeart /> {photo.likes?.length || 0}</span>
                    <span><FiMessageCircle /> {photo.comments?.length || 0}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Photo Modal */}
        {selectedPhoto && (
          <div className="modal-overlay" onClick={() => setSelectedPhoto(null)}>
            <div className="photo-modal fade-in" onClick={e => e.stopPropagation()}>
              <div className="photo-modal-img">
                <img src={selectedPhoto.imageUrl} alt={selectedPhoto.title} />
                <button className="photo-modal-close" onClick={() => setSelectedPhoto(null)}><FiX /></button>
              </div>
              <div className="photo-modal-info">
                <div className="photo-modal-header">
                  <div>
                    <h3>{selectedPhoto.title}</h3>
                    <p className="photo-uploader">by {selectedPhoto.uploadedBy?.name} · {format(new Date(selectedPhoto.createdAt), 'MMM dd, yyyy')}</p>
                  </div>
                  <div className="photo-modal-actions">
                    <button className={`like-btn ${isLiked(selectedPhoto) ? 'liked' : ''}`} onClick={() => handleLike(selectedPhoto._id)}>
                      <FiHeart /> {selectedPhoto.likes?.length || 0}
                    </button>
                    {(isAdmin || selectedPhoto.uploadedBy?._id === user?._id) && (
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(selectedPhoto._id)}>
                        <FiTrash2 />
                      </button>
                    )}
                  </div>
                </div>
                {selectedPhoto.description && <p className="photo-desc">{selectedPhoto.description}</p>}

                <div className="comments-section">
                  <h4>Comments ({selectedPhoto.comments?.length || 0})</h4>
                  <div className="comments-list">
                    {selectedPhoto.comments?.map((c, i) => (
                      <div className="comment" key={i}>
                        <div className="comment-avatar">{c.user?.name?.charAt(0)}</div>
                        <div>
                          <p className="comment-author">{c.user?.name}</p>
                          <p className="comment-text">{c.text}</p>
                        </div>
                      </div>
                    ))}
                    {!selectedPhoto.comments?.length && <p className="no-comments">No comments yet</p>}
                  </div>
                  {isAuthenticated && (
                    <div className="comment-input-wrap">
                      <input className="form-input" placeholder="Add a comment..."
                        value={comment} onChange={e => setComment(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleComment(selectedPhoto._id)} />
                      <button className="btn btn-primary btn-sm" onClick={() => handleComment(selectedPhoto._id)}>Post</button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
