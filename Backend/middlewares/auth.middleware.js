const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const userModel=require('../models/user.model')
const panditModel=require('../models/pandit.model')
const isBlacklisted=require('../models/blacklistToken.model')

module.exports.authUser =async(req,res,next)=>{
    const token = req.cookies.token||req.headers.authorization?.split('')[1];

    if (!token) {
        return res.status(401).send({ error: 'Access denied. No token provided.' });
    }
    const isBlacklisted=await userModel.findOne({token:token});
    if(isBlacklisted){
        return res.status(401).json({message:'unauthorized'})
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
            
        const user = await userModel.findById(decoded._id);
        req.user=user;

        return next();
    } catch (err) {
        res.status(400).send({ error: 'Invalid token.' });
    }
};

module.exports.authpandit =async(req,res,next)=>{
    const token = req.cookies.token||req.headers.authorization?.split('')[1];

    if (!token) {
        return res.status(401).send({ error: 'Access denied. No token provided.' });
    }
    const isBlacklisted=await userModel.findOne({token:token});
    if(isBlacklisted){
        return res.status(401).json({message:'unauthorized'})
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
            
        const pandit = await panditModel.findById(decoded._id);
        req.pandit=pandit;

        return next();
    } catch (err) {
        res.status(400).send({ error: 'Invalid token.' });
    }
}