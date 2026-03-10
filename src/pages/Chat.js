import { useState, useEffect, useRef } from 'react';
import { useSocket } from '../context/SocketContext';
import { useAuth } from '../context/AuthContext';
import { getChatHistory } from '../utils/api';
import { FiSend, FiUsers } from 'react-icons/fi';
import { format } from 'date-fns';
import './Chat.css';

export default function Chat() {
  const { user } = useAuth();
  const { sendMessage, onMessage, onUserJoined, connected, onlineCount } = useSocket();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const bottomRef = useRef(null);

  // Load history
  useEffect(() => {
    getChatHistory()
      .then(res => setMessages(res.data.messages))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  // Listen for new messages
  useEffect(() => {
    const unsubMsg = onMessage?.((msg) => {
      setMessages(prev => [...prev, msg]);
    });
    const unsubJoin = onUserJoined?.((data) => {
      setMessages(prev => [...prev, { type: 'system', text: `${data.name} joined the chat`, _id: Date.now() }]);
    });
    return () => { unsubMsg?.(); unsubJoin?.(); };
  }, [onMessage, onUserJoined]);

  // Auto scroll
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

  const isOwn = (msg) => msg.sender?._id === user?._id || msg.sender === user?._id;

  const groupedMessages = messages.reduce((acc, msg, i) => {
    const prev = messages[i - 1];
    const sameUser = prev?.sender?._id === msg.sender?._id && msg.type !== 'system';
    acc.push({ ...msg, sameUser });
    return acc;
  }, []);

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
              <div className="chat-empty">
                <p>👋 Be the first to say hello!</p>
              </div>
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
                  {!own && !msg.sameUser && (
                    <div className="msg-avatar">{msg.sender?.name?.charAt(0)}</div>
                  )}
                  {!own && msg.sameUser && <div className="msg-avatar-spacer" />}
                  <div className="message-group">
                    {!own && !msg.sameUser && (
                      <p className="msg-sender-name">{msg.sender?.name}</p>
                    )}
                    <div className="message-bubble">
                      <p>{msg.message}</p>
                      <span className="msg-time">{format(new Date(msg.createdAt), 'HH:mm')}</span>
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
          <div className="chat-input-wrap">
            <textarea
              className="chat-input"
              placeholder="Type a message... (Enter to send)"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={1}
              disabled={!connected}
            />
            <button className="chat-send-btn" onClick={handleSend} disabled={!input.trim() || !connected}>
              <FiSend />
            </button>
          </div>
          <p className="chat-note">Public chat — be respectful and helpful 🙏</p>
        </div>
      </div>
    </div>
  );
}
