// middlewares.mjs
import jwt from 'jsonwebtoken';

// Existing auth middleware
export const auth = (req, res, next) => {
    const token = req.header('Authorization')?.split(" ")[1]; // Extract token from header

    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // Adjusted to match your token structure:
        req.user = { id: decoded.id, isAdmin: decoded.isAdmin };
        next();
    } catch (err) {
        res.status(401).json({ msg: 'Token is not valid' });
    }
};



export const adminAuth = (req, res, next) => {
    // Get token from the header
    const token = req.header('Authorization')?.split(" ")[1];

    // Check if no token
    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    // Verify token
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // Assuming decoded contains isAdmin property
        if (decoded.isAdmin) {
            req.user = decoded; // Optionally set user information in request if needed
            next(); // Proceed since user is admin
        } else {
            return res.status(403).json({ msg: 'Access forbidden. Requires admin role.' });
        }
    } catch (err) {
        res.status(401).json({ msg: 'Token is not valid' });
    }
};


