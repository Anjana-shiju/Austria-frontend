import { useState, useEffect, useRef } from 'react';
import { useSocket } from '../context/SocketContext';
import { useAuth } from '../context/AuthContext';
import { getChatHistory } from '../utils/api';
import axios from 'axios';
import { FiSend, FiUsers, FiMic, FiSquare, FiTrash2 } from 'react-icons/fi';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import './Chat.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export default function Chat() {
  const { user } = useAuth();
  const { sendMessage, onMessage, onUserJoined, connected, onlineCount } = useSocket();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const bottomRef = useRef(null);

  // Voice recording
  const [recording, setRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioURL, setAudioURL] = useState(null);
  const [sending, setSending] = useState(false);
  const [recordSeconds, setRecordSeconds] = useState(0);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const timerRef = useRef(null);

  // Delete hover/press
  const [hoveredId, setHoveredId] = useState(null);
  const [pressedId, setPressedId] = useState(null);
  const pressTimer = useRef(null);

  useEffect(() => {
    getChatHistory()
      .then(res => setMessages(res.data.messages))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const unsubMsg = onMessage?.((msg) => {
      setMessages(prev => [...prev, msg]);
    });
    const unsubJoin = onUserJoined?.((data) => {
      setMessages(prev => [...prev, { type: 'system', text: `${data.name} joined the chat`, _id: Date.now() }]);
    });
    return () => { unsubMsg?.(); unsubJoin?.(); };
  }, [onMessage, onUserJoined]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    const text = input.trim();
    if (!text) return;
    sendMessage(text);
    setInput('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // ── Voice Recording ──
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      chunksRef.current = [];
      const mr = new MediaRecorder(stream);
      mediaRecorderRef.current = mr;
      mr.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data); };
      mr.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        setAudioBlob(blob);
        setAudioURL(URL.createObjectURL(blob));
        stream.getTracks().forEach(t => t.stop());
      };
      mr.start();
      setRecording(true);
      setRecordSeconds(0);
      timerRef.current = setInterval(() => {
        setRecordSeconds(prev => prev + 1);
      }, 1000);
    } catch (err) {
      toast.error('Microphone access denied');
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setRecording(false);
    clearInterval(timerRef.current);
    setRecordSeconds(0);
  };

  const cancelVoice = () => {
    setAudioBlob(null);
    setAudioURL(null);
  };

const sendVoice = async () => {
  if (!audioBlob) return;

  setSending(true);

  try {
    const fd = new FormData();
    fd.append('audio', audioBlob, 'voice.webm');

    const token = localStorage.getItem('token');

    const res = await axios.post(`${API_URL}/chat/voice`, fd, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      }
    });

    const savedMsg = res.data.message;

    // UI update instantly
    setMessages(prev => [...prev, savedMsg]);

    setAudioBlob(null);
    setAudioURL(null);

    toast.success('Voice message sent!');

  } catch (err) {
    toast.error('Failed to send voice message');
  } finally {
    setSending(false);
  }
};
  // ── Delete (admin only) ──
  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/chat/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessages(prev => prev.filter(m => m._id !== id));
      setPressedId(null);
      toast.success('Message deleted');
    } catch (err) {
      toast.error('Failed to delete');
    }
  };

  // Long press handlers (mobile)
  const handlePressStart = (id) => {
    pressTimer.current = setTimeout(() => setPressedId(id), 600);
  };
  const handlePressEnd = () => clearTimeout(pressTimer.current);

  const isOwn = (msg) => msg.sender?._id === user?._id || msg.sender === user?._id;
  const isAdmin = user?.role === 'admin';

  const groupedMessages = messages.reduce((acc, msg, i) => {
    const prev = messages[i - 1];
    const sameUser = prev?.sender?._id === msg.sender?._id && msg.type !== 'system';
    acc.push({ ...msg, sameUser });
    return acc;
  }, []);

const isVoice = (msg) => {
  return msg.type === 'voice' || msg.message?.includes('[voice]');
};

  const renderContent = (msg) => {
    if (isVoice(msg)) {
      const url = msg.message.replace('🎤 [voice]', '');
      return (
        <audio controls style={{ height: 32, maxWidth: 220, display: 'block' }}>
          <source src={url} type="audio/webm" />
        </audio>
      );
    }
    return <p>{msg.message}</p>;
  };

  // Format seconds as mm:ss
  const formatTime = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  return (
    <div className="chat-page">
      {/* Header */}
      <div className="chat-header">
        <div className="container chat-header-inner">
          <div>
            <h1>Community Chat</h1>
            <p>Talk with Indian students across Austria</p>
          </div>
          <div className="chat-status">
            <span className={`dot ${connected ? 'dot-online' : 'dot-offline'}`} />
            <span>{connected ? 'Connected' : 'Connecting...'}</span>
            <span className="online-count"><FiUsers /> {onlineCount} online</span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="chat-messages-wrap">
        <div className="container">
          <div className="chat-messages">
            {loading && <div className="loading-page"><div className="loading-spinner" /></div>}

            {!loading && messages.length === 0 && (
              <div className="chat-empty"><p>👋 Be the first to say hello!</p></div>
            )}

            {groupedMessages.map((msg) => {
              if (msg.type === 'system') {
                return (
                  <div key={msg._id} className="system-message">
                    <span>{msg.text}</span>
                  </div>
                );
              }

              const own = isOwn(msg);
              return (
                <div key={msg._id} className={`message-wrap ${own ? 'own' : 'other'} ${msg.sameUser ? 'same-user' : ''}`}>
                  {!own && !msg.sameUser && <div className="msg-avatar">{msg.sender?.name?.charAt(0)}</div>}
                  {!own && msg.sameUser && <div className="msg-avatar-spacer" />}
                  <div className="message-group">
                    {!own && !msg.sameUser && <p className="msg-sender-name">{msg.sender?.name}</p>}
                    <div
                      className="message-bubble"
                      style={{
                        position: 'relative',
                        ...(isVoice(msg) && {
                          background: 'var(--dark-3)',
                          border: '1px solid var(--border)'
                        })
                      }}
                      onMouseEnter={() => isAdmin && setHoveredId(msg._id)}
                      onMouseLeave={() => setHoveredId(null)}
                      onTouchStart={() => isAdmin && handlePressStart(msg._id)}
                      onTouchEnd={handlePressEnd}
                    >
                      {renderContent(msg)}
                      <span className="msg-time">{format(new Date(msg.createdAt), 'HH:mm')}</span>

                      {/* Desktop: hover delete */}
                      {isAdmin && hoveredId === msg._id && (
                        <button
                          onClick={() => handleDelete(msg._id)}
                          style={{
                            position: 'absolute', top: -10, right: -10,
                            background: 'rgba(239,68,68,0.9)', border: 'none',
                            borderRadius: '50%', width: 26, height: 26,
                            cursor: 'pointer', color: 'white',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '0.75rem', boxShadow: '0 2px 8px rgba(0,0,0,0.4)', zIndex: 10
                          }}
                        >
                          <FiTrash2 />
                        </button>
                      )}

                      {/* Mobile: long press popup */}
                      {isAdmin && pressedId === msg._id && (
                        <div style={{
                          position: 'absolute', bottom: '110%', left: '50%',
                          transform: 'translateX(-50%)',
                          background: 'var(--dark-card)', border: '1px solid var(--border)',
                          borderRadius: 10, padding: '6px 4px',
                          boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
                          zIndex: 100, display: 'flex', gap: 4, whiteSpace: 'nowrap'
                        }}>
                          <button className="btn btn-danger btn-sm"
                            onClick={() => handleDelete(msg._id)}
                            style={{ fontSize: '0.8rem', padding: '6px 12px' }}>
                            <FiTrash2 /> Delete
                          </button>
                          <button className="btn btn-secondary btn-sm"
                            onClick={() => setPressedId(null)}
                            style={{ fontSize: '0.8rem', padding: '6px 12px' }}>
                            Cancel
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={bottomRef} />
          </div>
        </div>
      </div>

      {/* Input */}
      <div className="chat-input-bar">
        <div className="container">

          {/* Voice preview */}
          {audioURL && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10,
              background: 'var(--dark-2)', padding: '10px 14px', borderRadius: 12
            }}>
              <audio controls src={audioURL} style={{ height: 36, flex: 1 }} />
              <button onClick={sendVoice} disabled={sending} className="btn btn-primary btn-sm">
                {sending ? '...' : <><FiSend /> Send</>}
              </button>
              <button onClick={cancelVoice} className="btn btn-secondary btn-sm"><FiTrash2 /></button>
            </div>
          )}

          <div className="chat-input-wrap">
            <textarea
              className="chat-input"
              placeholder="Type a message... "
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={1}
              disabled={!connected}
            />
            <button
              className="chat-send-btn"
              onClick={recording ? stopRecording : startRecording}
              disabled={!connected || !!audioURL}
              title={recording ? 'Stop recording' : 'Voice message'}
              style={{ marginRight: 6, background: recording ? 'var(--austria-red)' : 'var(--dark-3)' }}
            >
              {recording ? <FiSquare /> : <FiMic />}
            </button>
            <button className="chat-send-btn" onClick={handleSend} disabled={!input.trim() || !connected}>
              <FiSend />
            </button>
          </div>

          {recording && (
            <p style={{ color: 'var(--austria-red)', fontSize: '0.82rem', marginTop: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--austria-red)', display: 'inline-block', animation: 'pulse 1s infinite' }} />
              Recording... {formatTime(recordSeconds)}
            </p>
          )}
          <p className="chat-note">Public chat — be respectful and helpful 🙏</p>
        </div>
      </div>
    </div>
  );
}