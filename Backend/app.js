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
const chatRoutes = require('../Backend/routes/chat.routes');
const { GoogleGenerativeAI } = require("@google/generative-ai")
// console.log("heelo")
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieparser())
app.use(cors({
    origin: '*'
}));
app.use(cors()); 
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // or your frontend URL in production
    methods: ["GET", "POST"]
  }
});
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("join_room", (room) => {
    socket.join(room);
    console.log(`User ${socket.id} joined room ${room}`);
  });

  socket.on("send_message", (data) => {
    io.to(data.room).emit("receive_message", data);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});


const client = new OpenAI({
  apiKey: process.env.PERPLEXITY_API_KEY,
  baseURL: "https://api.perplexity.ai", // Important: Perplexity endpoint
});

app.post("/api/predict", async (req, res) => {
  try {
    const { name, dob, birthTime, birthPlace, question } = req.body;

    if (!name || !dob || !birthTime || !birthPlace || !question) {
      return res.status(400).json({ error: "Missing required fields" });
    }

   const prompt = `
आप एक अनुभवी ज्योतिषी हैं और केवल ज्योतिष से संबंधित जानकारी ही प्रदान करते हैं।
नीचे दिए गए उपयोगकर्ता के विवरण के आधार पर उन्हें विस्तृत, सटीक और मित्रवत अंदाज़ में भविष्यवाणी करें।
उत्तर हमेशा हिंदी में दें और बिंदुवार (•) फ़ॉर्मेट में स्पष्ट जानकारी दें।
अगर प्रश्न ज्योतिष से संबंधित नहीं है, तो विनम्रतापूर्वक कहें:
"माफ़ कीजिए, मैं केवल ज्योतिष से संबंधित प्रश्नों का उत्तर देता हूँ।"

उपयोगकर्ता विवरण:
नाम: ${name}
जन्म तिथि: ${dob}
जन्म समय: ${birthTime}
जन्म स्थान: ${birthPlace}
प्रश्न: ${question}

कृपया उत्तर ज्योतिषीय आधार पर दें और यथासंभव विस्तृत व उपयोगी सुझाव शामिल करें।
`;


    const response = await client.chat.completions.create({
      model: "sonar-pro", // Perplexity model
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    res.json({
      prediction: response.choices[0].message.content,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

console.log('hello')



app.use('/api/users',userRoutes);
app.use("/api/pandits",panditRoutes);
app.use("/api/booking",poojaRoutes); 
app.use('/api/chat', chatRoutes);

app.use("/api",ForgetPasswordRoutes);
db=connectToDb();
app.use('/api/payment',paymentRoutes);
app.use("/api/astrology", astrologyRoutes);

  
module.exports=app;