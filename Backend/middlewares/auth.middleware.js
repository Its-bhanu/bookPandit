const jwt = require('jsonwebtoken');
const userModel = require('../models/user.model');
const panditModel = require('../models/pandit.model');
const blacklistTokenModel = require('../models/blacklistToken.model');

const extractToken = (req) => {
    const authHeader = req.headers.authorization || '';
    if (authHeader.startsWith('Bearer ')) {
        return authHeader.split(' ')[1];
    }
    return req.cookies.token || null;
};

module.exports.authUser = async (req, res, next) => {
    console.log("🔍 [Auth User] Checking user authentication");
    
    const token = extractToken(req);

    if (!token) {
        console.log("❌ [Auth User] No token provided");
        return res.status(401).send({ error: 'Access denied. No token provided.' });
    }

    console.log("✅ [Auth User] Token found:", token.substring(0, 20) + "...");

    const isBlacklisted = await blacklistTokenModel.findOne({ token });
    if (isBlacklisted) {
        console.log("❌ [Auth User] Token is blacklisted");
        return res.status(401).json({ message: 'unauthorized' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("✅ [Auth User] Token decoded successfully");
        console.log("📝 [Auth User] Decoded payload:", decoded);
        
        if (decoded.role && decoded.role !== 'user') {
            console.log("❌ [Auth User] Token role is not 'user', it's:", decoded.role);
            return res.status(403).json({ message: 'Forbidden' });
        }

        const userId = decoded.userId || decoded._id;
        console.log("🔍 [Auth User] Looking for user with ID:", userId);
        
        const user = await userModel.findById(userId);
        if (!user) {
            console.log("❌ [Auth User] User not found with ID:", userId);
            return res.status(404).json({ message: 'User not found' });
        }
        
        console.log("✅ [Auth User] User found:", user.username);
        req.user = user;

        return next();
    } catch (err) {
        console.error("❌ [Auth User] Token verification failed:", err.message);
        console.error("❌ [Auth User] Full error:", err);
        res.status(400).send({ error: 'Invalid token.' });
    }
};

module.exports.authpandit = async (req, res, next) => {
    console.log("🔍 [Auth Pandit] Checking pandit authentication");
    
    const token = extractToken(req);

    if (!token) {
        console.log("❌ [Auth Pandit] No token provided");
        return res.status(401).send({ error: 'Access denied. No token provided.' });
    }

    console.log("✅ [Auth Pandit] Token found:", token.substring(0, 20) + "...");

    const isBlacklisted = await blacklistTokenModel.findOne({ token });
    if (isBlacklisted) {
        console.log("❌ [Auth Pandit] Token is blacklisted");
        return res.status(401).json({ message: 'unauthorized' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("✅ [Auth Pandit] Token decoded successfully");
        console.log("📝 [Auth Pandit] Decoded payload:", decoded);
        
        if (decoded.role && decoded.role !== 'pandit') {
            console.log("❌ [Auth Pandit] Token role is not 'pandit', it's:", decoded.role);
            return res.status(403).json({ message: 'Forbidden' });
        }

        const panditId = decoded.userId || decoded._id;
        console.log("🔍 [Auth Pandit] Looking for pandit with ID:", panditId);
        
        const pandit = await panditModel.findById(panditId);
        if (!pandit) {
            console.log("❌ [Auth Pandit] Pandit not found with ID:", panditId);
            return res.status(404).json({ message: 'Pandit not found' });
        }
        
        console.log("✅ [Auth Pandit] Pandit found:", pandit.fullname);
        req.pandit = pandit;

        return next();
    } catch (err) {
        console.error("❌ [Auth Pandit] Token verification failed:", err.message);
        console.error("❌ [Auth Pandit] Full error:", err);
        res.status(400).send({ error: 'Invalid token.' });
    }
};
