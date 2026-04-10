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
    const token = extractToken(req);

    if (!token) {
        return res.status(401).send({ error: 'Access denied. No token provided.' });
    }

    const isBlacklisted = await blacklistTokenModel.findOne({ token });
    if (isBlacklisted) {
        return res.status(401).json({ message: 'unauthorized' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.role && decoded.role !== 'user') {
            return res.status(403).json({ message: 'Forbidden' });
        }

        const user = await userModel.findById(decoded.userId || decoded._id);
        req.user = user;

        return next();
    } catch (err) {
        res.status(400).send({ error: 'Invalid token.' });
    }
};

module.exports.authpandit = async (req, res, next) => {
    const token = extractToken(req);

    if (!token) {
        return res.status(401).send({ error: 'Access denied. No token provided.' });
    }

    const isBlacklisted = await blacklistTokenModel.findOne({ token });
    if (isBlacklisted) {
        return res.status(401).json({ message: 'unauthorized' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.role && decoded.role !== 'pandit') {
            return res.status(403).json({ message: 'Forbidden' });
        }

        const pandit = await panditModel.findById(decoded.userId || decoded._id);
        req.pandit = pandit;

        return next();
    } catch (err) {
        res.status(400).send({ error: 'Invalid token.' });
    }
};
