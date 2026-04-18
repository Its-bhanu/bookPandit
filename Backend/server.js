const http = require('http');
const { Server } = require('socket.io');
const app = require('./app');
const socketHandler = require('./socket');

const port = process.env.PORT || 3000;
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'] 
    },
    credentials: true,
    transports: ['websocket'],
    reconnection: true, 
});

socketHandler(io);

server.listen(port, () => {
    console.log(`Server running on port ${port}`);
});