const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;


async function userMiddleware(req, res, next) {
    try {
        let accessToken = req.cookies.userAccessToken
        if (!accessToken) {
            return res.status(401).json({ message: 'Authentication required' });
        }

        let user = jwt.verify(accessToken, JWT_SECRET);

        if (!user) {
            return res.status(404).json({ message: "Invalid token" })
        }

        req.userId = user.userId
        next()
    }
    catch(err){
        return res.status(401).json({ message: "Invalid or expired token" });
    }
    
}

module.exports = {
    userMiddleware: userMiddleware
}