// // socket.js

// const Message = require("./models/Message.model");

// const socketHandler = (io) => {
//   io.on("connection", (socket) => {
//     console.log("Client connected:", socket.id);

//     socket.on("join_room", ({ room }) => {
//       socket.join(room);
//     });

//     socket.on("send_message", async ({ senderId, receiverId, message, room }) => {
//       const newMessage = new Message({ senderId, receiverId, message });
//       await newMessage.save();
//       io.to(room).emit("receive_message", newMessage);
//     });

//     socket.on("disconnect", () => {
//       console.log("Client disconnected:", socket.id);
//     });
//   });
// };

// module.exports = socketHandler; // ✅ Must export function directly
