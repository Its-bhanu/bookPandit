import React, { useState, useRef, useEffect } from 'react';
import { FaOm, FaPaperPlane, FaUser } from 'react-icons/fa';
import { useParams } from 'react-router-dom';

const PanditChat = () => {
  const { panditId } = useParams(); // Get panditId from URL
  const [panditName, setPanditName] = useState('Pandit Sharma'); // Default name
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: `Namaste! 🙏 I'm A astrologer and How can I help you today? You can ask about your Astrology, kundli ,and any other queries.`,
      sender: 'pandit',
      timestamp: new Date(),
    },
    {
        id: 2,
        text: `Ask any Questions.`,
        sender: 'pandit',
        timestamp: new Date(),
    }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);

  // Fetch pandit details when component mounts
  useEffect(() => {
    const fetchPanditDetails = async () => {
      try {
        // Replace with your actual API endpoint
        const response = await fetch(` https://book-pandit-mmed.vercel.app/api/pandits/${panditId}`);
        const data = await response.json();
        if (data.fullname) {
          setPanditName(data.fullname);
          // Update the welcome message with the correct name
          setMessages([{
            id: 1,
            text: `Namaste! 🙏 I'm ${data.fullname}. How can I help you today? You can ask about rituals, puja vidhi, or any spiritual guidance.`,
            sender: 'pandit',
            timestamp: new Date(),
          }]);
        }
      } catch (error) {
        console.error('Error fetching pandit details:', error);
      }
    };

    if (panditId) {
      fetchPanditDetails();
    }
  }, [panditId]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() === '') return;

    // Add user message
    const userMessage = {
      id: messages.length + 1,
      text: newMessage,
      sender: 'user',
      timestamp: new Date(),
    };
    setMessages([...messages, userMessage]);
    setNewMessage('');

    // Simulate pandit response after a delay
    setTimeout(() => {
      const panditResponses = [
        "That's a great question! Let me think about it.",
        "Chat with Pandit will be comming Soon.",
      ];
      const randomResponse = panditResponses[Math.floor(Math.random() * panditResponses.length)];
      
      const panditMessage = {
        id: messages.length + 2,
        text: randomResponse,
        sender: 'pandit',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, panditMessage]);
    }, 3000);
  };

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Header with Pandit's Name */}
      <header className="bg-yellow-600 text-white p-4 rounded-t-lg shadow-md">
        <div className="flex items-center">
          <div className="w-12 h-12 rounded-full bg-yellow-500 flex items-center justify-center mr-3">
            <FaOm className="text-2xl" />
          </div>
          <div>
            <h1 className="text-xl font-bold">Consulting with Our Astrologers</h1>
            <p className="text-yellow-100 text-sm">Get personalized spiritual guidance</p>
          </div>
        </div>
      </header>

      {/* Chat Container */}
      <div className="bg-white shadow-lg rounded-b-lg overflow-hidden">
        {/* Chat Messages */}
        <div className="h-96 p-4 overflow-y-auto space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex items-start ${
                message.sender === 'user' ? 'justify-end' : ''
              }`}
            >
              {message.sender === 'pandit' && (
                <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center mr-3">
                  <FaOm className="text-yellow-600" />
                </div>
              )}
              <div
                className={`p-3 rounded-lg max-w-xs md:max-w-md ${
                  message.sender === 'pandit'
                    ? 'bg-yellow-50 text-gray-800'
                    : 'bg-blue-50 text-gray-800'
                }`}
              >
                <p>{message.text}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
              {message.sender === 'user' && (
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center ml-3">
                  <FaUser className="text-blue-600" />
                </div>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <form
          onSubmit={handleSendMessage}
          className="border-t border-gray-200 p-4 bg-gray-50"
        >
          <div className="flex">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your question here..."
              className="flex-1 border border-gray-300 rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
            <button
              type="submit"
              className="bg-yellow-600 text-white px-4 py-2 rounded-r-lg hover:bg-yellow-700 transition-colors"
            >
              <FaPaperPlane />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PanditChat;