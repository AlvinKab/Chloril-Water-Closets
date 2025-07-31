import jwt from 'jsonwebtoken';
import { secret } from '../config/jwt.js';

const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer")) {
        const token = authHeader.split(' ')[1];
        if (!token) return res.status(401).json({ message: "No token detected." });
        jwt.verify(token, secret, (err, decoded) => {
            if (err) return res.status(403).json({ message: "Invalid token." });
            req.user = decoded.user;
            next();
        });
    } else {
        return res.status(401).json({ message: "No token detected." });
    }
};

export default authenticateJWT;
