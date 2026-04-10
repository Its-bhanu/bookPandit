<<<<<<< HEAD
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
    }
});

socketHandler(io);

server.listen(port, () => {
=======
const http=require('http');
const app=require('./app');
const port=process.env.PORT || 3000;
const server = http.createServer(app);

server.listen(port,()=>{
>>>>>>> c8a339196acd05b09cbbae7dcfb707bfe754784f
    console.log(`Server running on port ${port}`);
});