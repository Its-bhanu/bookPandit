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

// Enhanced CORS Configuration with Debugging - Vercel Compatible
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      "http://localhost:5173",      // Vite dev server
      "https://book-pandit.vercel.app",       // ✅ Your Frontend
      "https://bookpandit.vercel.app",  
      "*"  // Allow all origins (less secure but helps debug Vercel issues)
    ];

    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin || allowedOrigins.includes(origin) || allowedOrigins.includes("*")) {
      console.log("✅ CORS Allowed for origin:", origin);
      callback(null, true);
    } else {
      console.error("❌ CORS Blocked for origin:", origin);
      console.error("📋 Allowed origins:", allowedOrigins);
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  exposedHeaders: ['Content-Length', 'Content-Type'],
  optionsSuccessStatus: 200,
  maxAge: 86400 // 24 hours
};

app.use(cors(corsOptions));

// Explicit CORS headers for preflight requests
app.use((req, res, next) => {
  const origin = req.get('origin');
  
  // Set CORS headers explicitly
  res.header('Access-Control-Allow-Origin', origin || '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  // Debug logging
  console.log(`📍 ${req.method} ${req.path}`);
  console.log(`🌍 Origin: ${origin || 'No origin'}`);
  console.log(`🔐 Authorization: ${req.get('authorization') ? '✅ Present' : '❌ Missing'}`);
  
  // Handle preflight
  if (req.method === 'OPTIONS') {
    console.log("✈️  Preflight OPTIONS request for:", req.path);
    return res.sendStatus(200);
  }
  
  next();
});


app.use("/api/ai" , predictionRoutes)
app.use('/api/users',userRoutes);
app.use("/api/pandits",panditRoutes);
app.use("/api/booking",poojaRoutes);
app.use("/api/bookings",poojaRoutes);
app.use('/api/chat', chatRoutes);

app.use("/api",ForgetPasswordRoutes);
db=connectToDb();
app.use('/api/payment',paymentRoutes);
app.use("/api/astrology", astrologyRoutes);
app.use('/api/stats', statsRoutes);

// Error handling middleware for CORS and other errors
app.use((err, req, res, next) => {
  console.error("❌ Error occurred:");
  console.error("   Message:", err.message);
  console.error("   Path:", req.path);
  console.error("   Method:", req.method);
  
  if (err.message.includes("Not allowed by CORS")) {
    console.error("\n⚠️  CORS ERROR DEBUG:");
    console.error("   Origin:", req.get('origin'));
    console.error("   Allowed origins:", [
      "http://localhost:5173",
      "http://localhost:3000",
      "http://127.0.0.1:5173",
      "https://book-pandit.vercel.app",
      "https://bookpandit-2.onrender.com",
      "https://bookpandit.vercel.app"
    ]);
    return res.status(403).json({
      success: false,
      message: "CORS Error: Origin not allowed",
      error: err.message,
      yourOrigin: req.get('origin')
    });
  }
  
  res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error",
    error: process.env.NODE_ENV === 'production' ? {} : err
  });
});

// 404 handler
app.use((req, res) => {
  console.warn("⚠️  404 Not Found:", req.method, req.path);
  res.status(404).json({
    success: false,
    message: "API endpoint not found",
    path: req.path,
    method: req.method
  });
});

  
module.exports=app;