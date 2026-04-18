const Message = require("./models/Message.model");
const { isChatAllowed } = require('./controllers/chat.controller');

const buildRoomId = (userId, panditId) => {
	if (!userId || !panditId) return "";
	return `${String(userId)}_${String(panditId)}`;
};

const socketHandler = (io) => {
	io.on("connection", (socket) => {
		console.log("Client connected:", socket.id);

		socket.on("join_room", async ({ userId, panditId }) => {
			if (userId && panditId) {
				const allowed = await isChatAllowed(userId, panditId);
				if (!allowed) {
					socket.emit("chat_error", { message: "Chat not available yet" });
					return;
				}
			}

			const room = buildRoomId(userId, panditId);
			if (!room) return;

			socket.join(room);
		});

		socket.on("send_message", async ({ senderId, receiverId, text, userId, panditId }) => {
			const room = buildRoomId(userId, panditId);
			if (!senderId || !receiverId || !text || !room) return;

			if (userId && panditId) {
				const allowed = await isChatAllowed(userId, panditId);
				if (!allowed) {
					socket.emit("chat_error", { message: "Chat not available yet" });
					return;
				}
			}

			const newMessage = new Message({ room, senderId, receiverId, text });
			await newMessage.save();
			io.to(room).emit("receive_message", newMessage);
		});

		socket.on("disconnect", () => {
			console.log("Client disconnected:", socket.id);
		});
	});
};

module.exports = socketHandler;
