const Message = require("./models/Message.model");
const { isChatAllowed } = require('./controllers/chat.controller');

const buildRoomId = (userId, panditId) => {
	if (!userId || !panditId) return "";
	return `${String(userId)}_${String(panditId)}`;
};

// Map to store pandit socket IDs
const panditSockets = new Map();

const socketHandler = (io) => {
	io.on("connection", (socket) => {
		console.log("Client connected:", socket.id);

		// ============== PANDIT ROOM JOIN ==============
		socket.on("join_pandit_room", ({ panditId }) => {
			if (panditId) {
				panditSockets.set(panditId, socket.id);
				socket.join(`pandit_${panditId}`);
				console.log(`Pandit ${panditId} joined room`);
			}
		});

		// ============== CHAT FUNCTIONALITY ==============
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

		// ============== BOOKING NOTIFICATIONS ==============
		socket.on("new_booking", ({ panditId, bookingData }) => {
			console.log(`New booking created for pandit ${panditId}`);
			io.to(`pandit_${panditId}`).emit("new_booking_notification", bookingData);
		});

		socket.on("booking_accepted", ({ bookingId, panditId, userId }) => {
			console.log(`Booking ${bookingId} accepted by pandit ${panditId}`);
			io.to(`user_${userId}`).emit("booking_accepted_notification", { 
				bookingId, 
				panditId,
				message: "Your booking has been accepted! Proceed to payment." 
			});
		});

		socket.on("booking_rejected", ({ bookingId, panditId, userId }) => {
			console.log(`Booking ${bookingId} rejected by pandit ${panditId}`);
			io.to(`user_${userId}`).emit("booking_rejected_notification", { 
				bookingId, 
				panditId,
				message: "Your booking has been declined." 
			});
		});

		socket.on("join_user_room", ({ userId }) => {
			if (userId) {
				socket.join(`user_${userId}`);
				console.log(`User ${userId} joined room`);
			}
		});

		socket.on("disconnect", () => {
			// Remove pandit from map when disconnected
			for (let [panditId, socketId] of panditSockets.entries()) {
				if (socketId === socket.id) {
					panditSockets.delete(panditId);
					console.log(`Pandit ${panditId} disconnected`);
					break;
				}
			}
			console.log("Client disconnected:", socket.id);
		});
	});
};

module.exports = socketHandler;
