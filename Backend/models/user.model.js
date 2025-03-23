const mongoose=require('mongoose');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
const userSchema= new mongoose.Schema({ 
    username:{
        type:String,
        required:true,
        minlength:[3,'Name should be atleast 3 characters long']
    },
    email:{
        type:String,
        required:true,
        unique:true,
        minlength:[3,'Email should be atleast 3 characters long']
    
    },
    password:{
        type:String,
        required:true,
        unique:true,
        minlength:[6,'Password should be atleast 6 characters long']
    },
    otp:{
        type:String,
        // required:true,
    },
    otpExpires:{
        type:Date,

    },
    isVerified:{
        type:Boolean,
        default:false,
    },
    resetPasswordOTP :{
        type:String,
    },
    resetPasswordExpires:{
        type:Date,
    }
})

userSchema.methods.generateAuthToken=function(){
    const token=jwt.sign({_id:this._id},process.env.JWT_SECRET,{expiresIn:'24h'});
    return token;
}
userSchema.methods.comparePassword=async function(Password){
    return await bcrypt.compare(Password,this.password);
}
userSchema.statics.hashPassword=async function(Password){
    return await bcrypt.hash(Password,10);
}
const userModel=mongoose.model('User',userSchema);
module.exports=userModel;