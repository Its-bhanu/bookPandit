import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { SOCKET_BASE } from '../config/api';

const NotificationContext = createContext();

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [bookingNotification, setBookingNotification] = useState(null);
  const [isNotificationVisible, setIsNotificationVisible] = useState(false);

  useEffect(() => {
    // Initialize Socket.IO connection
    const newSocket = io(SOCKET_BASE, {
      transports: ['websocket'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    });

    newSocket.on('connect', () => {
      console.log('Notification socket connected:', newSocket.id);
    });

    // Listen for new booking notifications
    newSocket.on('new_booking_notification', (data) => {
      console.log('New booking notification received:', data);
      setBookingNotification(data);
      setIsNotificationVisible(true);
    });

    // Listen for booking status updates
    newSocket.on('booking_status_updated', (data) => {
      console.log('Booking status updated:', data);
      setBookingNotification(data);
    });

    newSocket.on('disconnect', () => {
      console.log('Notification socket disconnected');
    });

    newSocket.on('error', (error) => {
      console.error('Socket error:', error);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const dismissNotification = () => {
    setIsNotificationVisible(false);
    setBookingNotification(null);
  };

  const emitBookingAccepted = (bookingId, panditId) => {
    if (socket) {
      socket.emit('booking_accepted', { bookingId, panditId });
    }
  };

  const emitBookingRejected = (bookingId, panditId) => {
    if (socket) {
      socket.emit('booking_rejected', { bookingId, panditId });
    }
  };

  const emitJoinPanditRoom = (panditId) => {
    if (socket) {
      socket.emit('join_pandit_room', { panditId });
    }
  };

  const value = {
    socket,
    bookingNotification,
    isNotificationVisible,
    dismissNotification,
    emitBookingAccepted,
    emitBookingRejected,
    emitJoinPanditRoom,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationContext;
