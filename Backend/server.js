const http = require('http');
const { Server } = require('socket.io');
const app = require('./app');
const socketHandler = require('./socket');

const port = process.env.PORT || 3000;
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: [
            'http://localhost:5173',
            'http://localhost:3000',
            'https://book-pandit.vercel.app',
            'https://bookpandit-2.onrender.com'
        ],
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
        credentials: true
    }
});

socketHandler(io);

// Make io accessible to routes via req.app.get('io')
app.set('io', io);

server.listen(port, () => {
    console.log(`Server running on port ${port}`);
});