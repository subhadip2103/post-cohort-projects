const { Router, response } = require("express");
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;
const UserRouter = Router();
const { UserModel, PurchaseModel, CourseModel } = require("../db")
const { z, email } = require("zod");
const bcrypt = require("bcrypt");
const { userMiddleware } = require("../Middlewares/userMiddleware");
const courses = require("./courses");



UserRouter.post("/signup", async (req, res) => {
    const requiredbody = z.object({
        firstname: z.string().min(2).max(50),
        lastname: z.string().min(2).max(50),
        email: z.email().max(50),
        password: z.string().min(8).max(30)
    })

    const parsedDataWithSuccess = requiredbody.safeParse(req.body);

    if (!parsedDataWithSuccess.success) {
        return res.status(404).json({
            message: "incorrect format",
            error: z.prettifyError(parsedDataWithSuccess.error)
        })
    }

    const { firstname, lastname, email, password } = req.body

    let errorthrown = false;

    try {
        let hashedPassword = await bcrypt.hash(password, 8)
        await UserModel.create({
            firstname: firstname,
            lastname: lastname,
            email: email,
            password: hashedPassword

        })

    }
    catch (err) {
        return res.json({
            error: err,
            Message: "User already exists"
        })
        errorthrown = true;
    }

    if (!errorthrown) {
        return res.status(200).json({
            Message: "User signedup successfully."
        })
    }
})
UserRouter.post("/login", async (req, res) => {
    const requiredbody = z.object({
        email: z.email().max(50),
        password: z.string().min(8).max(30)
    })

    const parsedDataWithSuccess = requiredbody.safeParse(req.body);

    if (!parsedDataWithSuccess.success) {
        return res.status(404).json({
            message: "incorrect format",
            error: z.prettifyError(parsedDataWithSuccess.error)
        })
    }
    try {
        let email = req.body.email;
        let password = req.body.password;

        let user = await UserModel.findOne({
            email: email
        })
        if (!user) {
            return res.status(401).json({
                Message: "User doesn't exist"
            })
        }

        const passwordmatch = await bcrypt.compare(password, user.password)

        if (!passwordmatch) {
            return res.status(403).json({
                Message: "Invalid credentials"
            })
        }

        let token = jwt.sign({
            userId: user._id
        }, JWT_SECRET)

        res.cookie('userAccessToken', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            maxAge: 120 * 60 * 1000 // 15 minutes 
        })
        res.status(200).json({ message: 'Logged in successfully' });
    }
    catch (err) {
        console.log(err)
        return res.sendStatus(403)
    }
})
UserRouter.get("/purchase", userMiddleware, async (req, res) => {
    const userID = req.userID;

    const purchasedcourses = await PurchaseModel.find({ userID: userID });
    const coursesData = await CourseModel.find({
        _id: { $in: purchasedcourses.map(course => course.courseId) }
    })

    res.status(200).json({
        purchasedcourses,
        coursesData
    })
})

module.exports = {
    UserRouter: UserRouter
};