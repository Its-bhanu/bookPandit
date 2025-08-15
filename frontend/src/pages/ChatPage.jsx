import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { io } from "socket.io-client";

const BACKEND_URL = "http://localhost:4000/"; // change to your backend URL

let socket;

const ChatPage = () => {
  const { state } = useLocation();
  const { roomId, userId, panditId } = state;

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket = io(BACKEND_URL, { transports: ["websocket"] });

    socket.on("connect", () => {
      console.log("Connected:", socket.id);
      socket.emit("join_room", roomId);
    });

    socket.on("receive_message", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => {
      socket.disconnect();
    };
  }, [roomId]);

  const sendMessage = () => {
    if (message.trim() !== "") {
      const data = {
        room: roomId,
        author: userId,
        text: message,
        time: new Date().toLocaleTimeString(),
      };
      socket.emit("send_message", data);
      setMessages((prev) => [...prev, data]);
      setMessage("");
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="bg-indigo-700 text-white p-4 font-bold">Chat with Pandit</div>

      <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-gray-100">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`p-2 rounded-lg max-w-xs ${
              msg.author === userId ? "bg-blue-500 text-white ml-auto" : "bg-gray-300"
            }`}
          >
            <p>{msg.text}</p>
            <small className="text-xs">{msg.time}</small>
          </div>
        ))}
      </div>

      <div className="flex p-4 border-t bg-white">
        <input
          type="text"
          className="flex-1 border rounded-l-lg px-4 py-2"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          onClick={sendMessage}
          className="bg-indigo-600 text-white px-4 py-2 rounded-r-lg hover:bg-indigo-700"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatPage;
