import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE } from '../config/api';
import { FaBell, FaTimes } from 'react-icons/fa';

const BookingNotificationPopup = ({ booking, onClose, token }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  if (!booking) return null;

  const getTimeLeft = (createdAt) => {
    const diff = 180000 - (Date.now() - new Date(createdAt).getTime());
    return Math.max(0, diff);
  };

  const formatTimeLeft = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
    const seconds = String(totalSeconds % 60).padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  const [timeLeft, setTimeLeft] = useState(getTimeLeft(booking.createdAt));

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(getTimeLeft(booking.createdAt));
    }, 1000);

    return () => clearInterval(interval);
  }, [booking.createdAt]);

  const handleResponse = async (status) => {
    try {
      setIsLoading(true);
      const response = await axios.put(
        `${API_BASE}/api/bookings/${booking._id}/status`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessage(`Booking ${status} successfully!`);
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (error) {
      console.error('Error updating booking status:', error);
      setMessage(error.response?.data?.message || 'Failed to update booking status');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-96 overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FaBell className="text-xl animate-bounce" />
            <h2 className="text-xl font-bold">New Booking Request</h2>
          </div>
          <button
            onClick={onClose}
            className="hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition"
            disabled={isLoading}
          >
            <FaTimes />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Timer */}
          <div className={`text-center font-bold text-lg ${timeLeft > 60000 ? 'text-green-600' : timeLeft > 30000 ? 'text-yellow-600' : 'text-red-600'}`}>
            ⏱️ {formatTimeLeft(timeLeft)} to respond
          </div>

          {/* Booking Details */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <div>
              <p className="text-gray-600 text-sm font-semibold">Client Name</p>
              <p className="text-gray-900 font-bold">{booking.name}</p>
            </div>

            <div>
              <p className="text-gray-600 text-sm font-semibold">Pooja Type</p>
              <p className="text-gray-900 font-bold">{booking.poojaType}</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-gray-600 text-sm font-semibold">Date</p>
                <p className="text-gray-900 font-bold">{new Date(booking.date).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm font-semibold">Time</p>
                <p className="text-gray-900 font-bold">{booking.time}</p>
              </div>
            </div>

            <div>
              <p className="text-gray-600 text-sm font-semibold">Phone</p>
              <p className="text-gray-900 font-bold">{booking.phoneNo}</p>
            </div>

            <div>
              <p className="text-gray-600 text-sm font-semibold">Address</p>
              <p className="text-gray-900 text-sm break-words">{booking.address}</p>
            </div>

            {booking.message && (
              <div>
                <p className="text-gray-600 text-sm font-semibold">Message</p>
                <p className="text-gray-900 text-sm italic">{booking.message}</p>
              </div>
            )}
          </div>

          {/* Message */}
          {message && (
            <div className={`p-3 rounded-lg text-sm ${message.toLowerCase().includes('successfully') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {message}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={() => handleResponse('Rejected')}
              disabled={isLoading || timeLeft <= 0}
              className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Processing...' : 'Decline'}
            </button>
            <button
              onClick={() => handleResponse('Accepted')}
              disabled={isLoading || timeLeft <= 0}
              className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Processing...' : 'Accept'}
            </button>
          </div>

          {timeLeft <= 0 && (
            <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-3 rounded-lg text-sm mt-4">
              ⚠️ Response time has expired. Booking is now invalid.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingNotificationPopup;
