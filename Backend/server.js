const http = require('http');
const { Server } = require('socket.io');
const app = require('./app');
const socketHandler = require('./socket');

const port = process.env.PORT || 3000;
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:5173",
      "https://book-pandit.vercel.app",
      "*"
    ],
    methods: ["GET", "POST"],
    credentials: true   // ✅ correct place
  }
  // transports optional (default is fine)
});

socketHandler(io);

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});