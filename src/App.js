import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import { ProtectedRoute, AdminRoute, GuestRoute } from './components/common/ProtectedRoute';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Pages
import Home from './pages/Home';
import About from './pages/About';
import Announcements from './pages/Announcements';
import Gallery from './pages/Gallery';
import Login from './pages/Login';
import Register from './pages/Register';
import Chat from './pages/Chat';
import { AskDoubt } from './pages/AskDoubt';
import MyEnquiries from './pages/MyEnquiries';
import Settings from './pages/Settings';
import AdminDashboard from './pages/AdminDashboard';

import './styles/global.css';
import Profile from './pages/Profile';

function AppLayout({ children, noFooter }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      {!noFooter && <Footer />}
    </>
  );
}


function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <BrowserRouter>
    <ScrollToTop />   
      <AuthProvider>
        <SocketProvider>
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: '#16161F',
                color: '#F0EDE8',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: '12px',
                fontSize: '0.9rem',
              },
              success: { iconTheme: { primary: '#FF6B00', secondary: '#fff' } },
            }}
          />

          <Routes>
            {/* Public */}
            <Route path="/" element={<AppLayout><Home /></AppLayout>} />
            <Route path="/about" element={<AppLayout><About /></AppLayout>} />
            <Route path="/announcements" element={<AppLayout><Announcements /></AppLayout>} />
            <Route path="/gallery" element={<AppLayout><Gallery /></AppLayout>} />
            

            {/* Guest only */}
            <Route path="/login" element={<GuestRoute><AppLayout><Login /></AppLayout></GuestRoute>} />
            <Route path="/register" element={<GuestRoute><AppLayout><Register /></AppLayout></GuestRoute>} />

            {/* Protected */}
            <Route path="/chat" element={<ProtectedRoute><AppLayout noFooter><Chat /></AppLayout></ProtectedRoute>} />
            <Route path="/ask-doubt" element={<ProtectedRoute><AppLayout><AskDoubt /></AppLayout></ProtectedRoute>} />
            <Route path="/my-enquiries" element={<ProtectedRoute><AppLayout><MyEnquiries /></AppLayout></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><AppLayout><Settings /></AppLayout></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><AppLayout><Profile /></AppLayout></ProtectedRoute>} />
            

            {/* Admin */}
            <Route path="/admin" element={<AdminRoute><AppLayout><AdminDashboard /></AppLayout></AdminRoute>} />

            {/* 404 */}
            <Route path="*" element={
              <AppLayout>
                <div className="page-wrapper" style={{ textAlign: 'center' }}>
                  <h1 style={{ fontSize: '6rem', opacity: 0.2 }}>404</h1>
                  <p style={{ color: 'var(--text-muted)' }}>Page not found</p>
                </div>
              </AppLayout>
            } />
          </Routes>
        </SocketProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
