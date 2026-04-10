import React, { useState, useEffect } from "react";
<<<<<<< HEAD
import { useLocation, useParams } from "react-router-dom";
import { io } from "socket.io-client";
import axios from "axios";
import { API_BASE, SOCKET_BASE } from "../config/api";
=======
import { useLocation } from "react-router-dom";
import { io } from "socket.io-client";

const BACKEND_URL = "https://book-pandit-mmed.vercel.app/"; // change to your backend URL
>>>>>>> c8a339196acd05b09cbbae7dcfb707bfe754784f

let socket;

const ChatPage = () => {
  const { state } = useLocation();
<<<<<<< HEAD
  const params = useParams();
  const roomId = state?.roomId || params.roomId || "";
  const fallbackIds = roomId.split("_");
  const userId = state?.userId || fallbackIds[0] || "";
  const panditId = state?.panditId || fallbackIds[1] || "";
  const normalizedRoomId = userId && panditId ? `${userId}_${panditId}` : "";
  const role = state?.role || (localStorage.getItem("panditsignintoken") ? "pandit" : "user");
  const token =
    role === "pandit"
      ? localStorage.getItem("panditsignintoken")
      : localStorage.getItem("userlogintoken");
=======
  const { roomId, userId, panditId } = state;
>>>>>>> c8a339196acd05b09cbbae7dcfb707bfe754784f

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
<<<<<<< HEAD
    const fetchMessages = async () => {
      if (!userId || !panditId || !token) return;

      const endpoint =
        role === "pandit"
          ? `${API_BASE}/api/chat/pandit/messages/${userId}/${panditId}`
          : `${API_BASE}/api/chat/messages/${userId}/${panditId}`;

      try {
        const response = await axios.get(endpoint, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMessages(response.data || []);
      } catch (error) {
        console.error("Failed to fetch chat messages", error);
      }
    };

    fetchMessages();
  }, [role, token, userId, panditId]);

  useEffect(() => {
    if (!normalizedRoomId) return;

    socket = io(SOCKET_BASE, { transports: ["websocket"] });

    socket.on("connect", () => {
      console.log("Connected:", socket.id);
      socket.emit("join_room", { userId, panditId });
    });

    socket.on("receive_message", (data) => {
      setMessages((prev) => {
        if (data?._id && prev.some((msg) => msg._id === data._id)) {
          return prev;
        }
        return [...prev, data];
      });
    });

    socket.on("chat_error", (data) => {
      console.error(data?.message || "Chat error");
=======
    socket = io(BACKEND_URL, { transports: ["websocket"] });

    socket.on("connect", () => {
      console.log("Connected:", socket.id);
      socket.emit("join_room", roomId);
    });

    socket.on("receive_message", (data) => {
      setMessages((prev) => [...prev, data]);
>>>>>>> c8a339196acd05b09cbbae7dcfb707bfe754784f
    });

    return () => {
      socket.disconnect();
    };
<<<<<<< HEAD
  }, [normalizedRoomId, userId, panditId]);

  const sendMessage = () => {
    if (message.trim() !== "") {
      const senderId = role === "pandit" ? panditId : userId;
      const receiverId = role === "pandit" ? userId : panditId;
      const data = {
        senderId,
        receiverId,
        text: message,
        userId,
        panditId
      };
      socket.emit("send_message", data);
=======
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
>>>>>>> c8a339196acd05b09cbbae7dcfb707bfe754784f
      setMessage("");
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="bg-indigo-700 text-white p-4 font-bold">Chat with Pandit</div>

      <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-gray-100">
        {messages.map((msg, idx) => (
          <div
<<<<<<< HEAD
            key={msg._id || `${msg.senderId}-${msg.createdAt || idx}`}
            className={`p-2 rounded-lg max-w-xs ${
              msg.senderId === (role === "pandit" ? panditId : userId)
                ? "bg-blue-500 text-white ml-auto"
                : "bg-gray-300"
            }`}
          >
            <p>{msg.text}</p>
            <small className="text-xs">
              {msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString() : ""}
            </small>
=======
            key={idx}
            className={`p-2 rounded-lg max-w-xs ${
              msg.author === userId ? "bg-blue-500 text-white ml-auto" : "bg-gray-300"
            }`}
          >
            <p>{msg.text}</p>
            <small className="text-xs">{msg.time}</small>
>>>>>>> c8a339196acd05b09cbbae7dcfb707bfe754784f
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
