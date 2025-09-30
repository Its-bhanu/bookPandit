const express=require('express');
const app=express();
const http=require('http');
const dotenv=require('dotenv');
const { Server } = require("socket.io");
const OpenAI = require("openai");
// const socketHandler = require("./socket");
dotenv.config();
const cors=require('cors');
const Razorpay=require('razorpay');
const connectToDb=require('./db/db');
const cookieparser=require('cookie-parser')
const userRoutes=require('./routes/user.routes');
const paymentRoutes=require('./routes/payment.routes');
const panditRoutes=require('./routes/pandit.routes')
const poojaRoutes=require("./routes/poojaBooks.routes");
const ForgetPasswordRoutes=require("./routes/ForgetPass.routes");
const astrologyRoutes = require("./routes/astrology.routes")
const predictionRoutes = require('./routes/astrology.routes')
const chatRoutes = require('../Backend/routes/chat.routes');
const { GoogleGenerativeAI } = require("@google/generative-ai")
const statsRoutes = require('./routes/poojaBooks.routes')
// console.log("heelo")
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieparser())
app.use(cors({
    origin: '*'
}));
app.use(cors()); 
// const server = http.createServer(app);
// const io = new Server(server, {
//   cors: {
//     origin: "http://localhost:5173", // or your frontend URL in production
//     methods: ["GET", "POST"]
//   }
// });
// io.on("connection", (socket) => {
//   console.log("User connected:", socket.id);

//   socket.on("join_room", (room) => {
//     socket.join(room);
//     console.log(`User ${socket.id} joined room ${room}`);
//   });

//   socket.on("send_message", (data) => {
//     io.to(data.room).emit("receive_message", data);
//   });

//   socket.on("disconnect", () => {
//     console.log("User disconnected:", socket.id);
//   });
// });

app.use("/api/ai" , predictionRoutes)
app.use('/api/users',userRoutes);
app.use("/api/pandits",panditRoutes);
app.use("/api/booking",poojaRoutes); 
app.use('/api/chat', chatRoutes);

app.use("/api",ForgetPasswordRoutes);
db=connectToDb();
app.use('/api/payment',paymentRoutes);
app.use("/api/astrology", astrologyRoutes);
app.use('/api/stats', statsRoutes);

  
module.exports=app;