import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const socketRef = useRef(null);
  const [connected, setConnected] = useState(false);
  const [onlineCount, setOnlineCount] = useState(0);

  useEffect(() => {
    if (!isAuthenticated || !user) return;

    const token = localStorage.getItem('token');
    const socket = io(process.env.REACT_APP_SOCKET_URL || 'https://austria-zs72.onrender.com', {
      auth: { token },
      transports: ['websocket'],
    });

    socket.on('connect', () => {
      setConnected(true);
      console.log('Socket connected');
    });

    socket.on('disconnect', () => {
      setConnected(false);
    });

    socket.on('online_count', (count) => {
      setOnlineCount(count);
    });

    socketRef.current = socket;

    return () => {
      socket.disconnect();
      socketRef.current = null;
      setConnected(false);
    };
  }, [isAuthenticated, user]);

  const sendMessage = (message) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('chat_message', { message });
    }
  };

  const onMessage = (callback) => {
    socketRef.current?.on('new_message', callback);
    return () => socketRef.current?.off('new_message', callback);
  };

  const onUserJoined = (callback) => {
    socketRef.current?.on('user_joined', callback);
    return () => socketRef.current?.off('user_joined', callback);
  };

  return (
    <SocketContext.Provider value={{
      socket: socketRef.current,
      connected,
      onlineCount,
      sendMessage,
      onMessage,
      onUserJoined,
    }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
