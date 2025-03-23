const userModel = require('../models/user.model');

module.exports.createUser = async ({
username,email,password, otp, otpExpires
})=>{
if(!username || !email || !password){
    throw new Error('All fields are required');
}
const user=userModel.create({
    username,
    email,
    password,
    otp,
    otpExpires
});
    return user;
}