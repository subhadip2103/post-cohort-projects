const { Router } = require("express");
const CourseRouter = Router();
const { CourseModel, PurchaseModel, UserModel } = require("../db");
const { userMiddleware } = require("../Middlewares/userMiddleware");

CourseRouter.post('/purchase', userMiddleware, async (req, res) => {
    try {
        const userID = req.userID;
        const courseId = req.body.courseId

        //should check that the user actually paid for the course
        await PurchaseModel.create({
            userID: userID,
            courseId: courseId
        })

        res.status(200).json({ Message: "You have successfully bought the course." })
    }
    catch (err) {
        console.log(err)
        return
    }

})
CourseRouter.get('/preview', async (req, res) => {
    const courses = await CourseModel.find({});
    res.status(200).json({
        courses
    })
})

module.exports = {
    CourseRouter: CourseRouter
};