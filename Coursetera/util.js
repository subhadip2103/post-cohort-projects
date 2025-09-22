require("dotenv").config();

function authenticateUserToken(req, res, next) {
    const token = req.cookies.jwt;
    if (!token) {
        return res.sendStatus(401);
    }
    try {
        const decoded = jwt.verify(token, `${process.env.JWT_SECRET}`);
        req.user = decoded;
        next();
    } catch (err) {
        return res.sendStatus(403)
    }
}

function authenticateadminToken(req, res, next) {
    const token = req.cookies.jwt;
    if (!token) {
        return res.sendStatus(401);
    }
    try {
        const decoded = jwt.verify(token, `${process.env.JWT_SECRET}`)
    }
    catch (err) {
        return res.sendStatus(403)
    }
}