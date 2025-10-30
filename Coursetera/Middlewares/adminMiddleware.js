const jwt = require("jsonwebtoken");
const ADMIN_SECRET = process.env.ADMIN_JWT_SECRET;


function adminMiddleware(req, res, next) {
    try {
        let accessToken = req.cookies.adminAccessToken
        if (!accessToken) {
            return res.status(401).json({ message: 'Authentication required' });
        }

        let admin = jwt.verify(accessToken, ADMIN_SECRET);

        if (!admin) {
            return res.status(404).json({ message: "Invalid token" })
        }

        req.adminId = admin.adminId
        next()
    }
    catch(err){
        
    }
}

module.exports = {
    adminMiddleware: adminMiddleware
}