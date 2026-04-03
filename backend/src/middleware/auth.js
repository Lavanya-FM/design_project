const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'studio_secret_2024';

const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(403).json({ error: 'Invalid or expired token.' });
    }
};

const checkRole = (roles) => (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
        return res.status(403).json({ error: 'Access denied. Insufficient permissions.' });
    }
    next();
};

const isAdmin = checkRole(['ADMIN']);
const isDesigner = checkRole(['DESIGNER']);
const isTailor = checkRole(['TAILOR']);
const isVendor = checkRole(['VENDOR']);

module.exports = {
    verifyToken,
    isAdmin,
    isDesigner,
    isTailor,
    isVendor
};
