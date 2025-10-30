const { Router } = require("express");
const adminRouter = Router();
const { z } = require("zod")
const { AdminModel, CourseModel } = require("../db")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt");
const { adminMiddleware } = require("../Middlewares/adminMiddleware");
const ADMIN_SECRET = process.env.ADMIN_JWT_SECRET

adminRouter.post("/signup", async (req, res) => {
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
        await AdminModel.create({
            firstname: firstname,
            lastname: lastname,
            email: email,
            password: hashedPassword

        })

    }
    catch (err) {
        return res.json({
            error: err,
            Message: "Admin already exists"
        })
        errorthrown = true;
    }

    if (!errorthrown) {
        return res.status(200).json({
            Message: "Admin signedup successfully."
        })
    }
})
adminRouter.post("/signin", async (req, res) => {
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

        let admin = await AdminModel.findOne({
            email: email
        })
        if (!admin) {
            return res.status(401).json({
                Message: "Admin doesn't exist"
            })
        }

        const passwordmatch = await bcrypt.compare(password, admin.password)

        if (!passwordmatch) {
            return res.status(403).json({
                Message: "Invalid credentials"
            })
        }

        let token = jwt.sign({
            adminId: admin._id
        }, ADMIN_SECRET)

        res.cookie('adminAccessToken', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            maxAge: 120 * 60 * 1000
        })
        res.status(200).json({ message: 'Logged in successfully' });
    }
    catch (err) {
        console.log(err)
        return res.sendStatus(403)
    }
})
adminRouter.post("/addCourse", adminMiddleware, async (req, res) => {
    const requiredbody = z.object({
        Title: z.string().min(2).max(200),
        Description: z.string().min(2).max(500),
        Duration: z.string(),
        Image: z.url(),
        Price:z.number()
    })

    const parsedDataWithSuccess = requiredbody.safeParse(req.body);

    if (!parsedDataWithSuccess.success) {
        return res.status(404).json({
            message: "incorrect format",
            error: z.prettifyError(parsedDataWithSuccess.error)
        })
    }
    try {
        let adminId = req.adminId;
        const { Title, Description, Duration, Image, Price } = req.body;

        const course = await CourseModel.create({
            Title: Title,
            Description: Description,
            Duration: Duration,
            Image: Image,
            Price: Price,
            creatorId: adminId
        })
        res.status(200).json({
            Message: "course added successfully",
            courseId: course._id
        })
    }
    catch (err) {
        console.log(err);
        return
    }

})

adminRouter.put("/editcourse", adminMiddleware, async (req, res) => {
    const requiredbody = z.object({
        Title: z.string().min(2).max(200),
        Description: z.string().min(2).max(500),
        Duration: z.string(),
        Image: z.url(),
        Price:z.number()
    })

    const parsedDataWithSuccess = requiredbody.safeParse(req.body);

    if (!parsedDataWithSuccess.success) {
        return res.status(404).json({
            message: "incorrect format",
            error: z.prettifyError(parsedDataWithSuccess.error)
        })
    }
    try {
        let adminId = req.adminId;
        const { courseId, Title, Description, Duration, Image, Price, creatorId } = req.body;

        const course = await CourseModel.updateOne({
            _id: courseId,
            creatorId: adminId
        }, {
            Title: Title,
            Description: Description,
            Duration: Duration,
            Image: Image,
            Price: Price,
        })
        res.status(200).json({
            Message: "course updated successfully",
            courseId: course._id
        })
    }
    catch (err) {
        console.log(err)
        return
    }
})
adminRouter.get("/viewCourse", adminMiddleware, async (req, res) => {
    let adminId = req.adminId;

    const courses = await CourseModel.find({ creatorId: adminId });

    res.status(200).json({
        Message: "found all the courses",
        courses
    })

})

module.exports = {
    adminRouter: adminRouter
}