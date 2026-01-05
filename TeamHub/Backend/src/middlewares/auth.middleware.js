import { verifyToken } from "../utils/jwt.js";

function authMiddleware(req, res, next) {
    const token = req.cookies.userAccessToken;

    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    try {
        const decoded = verifyToken(token);
        req.userId = decoded.userId;
        next();
    } catch (err) {
        return res.status(401).json({ message: "Invalid token" });
    }
}

export default authMiddleware
