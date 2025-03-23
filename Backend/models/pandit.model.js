const mongoose = require('mongoose');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken'); 
const PoojaBook = require('./poojaBooks.model');

const panditSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true,
        minlength:[3,'fullname must be atleast 3 charectors long']
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    experience: {
        type: Number,
        required: true
    },
    mobile: {
        type: Number,
        required: true,
        unique: true
    },
    address: {
        type:String,
        required:true,
    },
      
    age: {
        type: Number,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    otp:{
        type:String,
        required:true,
    },
    otpExpires:{
        type:Date,

    },
    isVerified:{
        type:Boolean,
        default:false,
    },
    expertise:{
        type:String,
        required:true,
    },
    BookingId:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref: PoojaBook
            
            // required:true,
        } 
    ],
    resetPasswordOTP :{
        type:String,
    },
    resetPasswordExpires:{
        type:Date,
    },
    
    // imageUrl:{
    //     type:String,
    //     required:true,
    // }
    
});
// panditSchema.index({location:'2dsphere'});

panditSchema.methods.generateAuthToken=function(){
    const token=jwt.sign({_id:this._id},process.env.JWT_SECRET,{expiresIn:'24h'});
    return token;
}
panditSchema.methods.comparePassword=async function(Password){
    return await bcrypt.compare(Password,this.password);
}
panditSchema.statics.hashPassword=async function(Password){
    return await bcrypt.hash(Password,10);
}

const PanditModel = mongoose.model('Pandit', panditSchema);

module.exports = PanditModel;