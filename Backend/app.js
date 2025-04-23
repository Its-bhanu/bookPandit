const express=require('express');
const app=express();
const dotenv=require('dotenv');
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
// console.log("heelo")
app.use(cors(
    // {
    //     origin:"https://book-pandit.vercel.app",
    // }
));
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieparser())

console.log('hello')

app.use('/api/users',userRoutes);
app.use("/api/pandits",panditRoutes);
app.use("/api/booking",poojaRoutes); 
app.use("/api",ForgetPasswordRoutes);
db=connectToDb();
app.use('/api/payment',paymentRoutes);


module.exports=app;