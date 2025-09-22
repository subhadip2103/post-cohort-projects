const { Router } = require("express");
const adminRouter=Router();

adminRouter.post("/signup", (req, res) => {
    res.json({
        message:"singnup endpoint"
    })
})
adminRouter.post("/signin", (req, res) => {
    res.json({
        message:"signin endpoint"
})
})
adminRouter.post("/addCourse", (req, res) => {
    res.json({
        message:"addcourse endpoint"
    })
})
adminRouter.delete("/deleteCourse", (req, res) => {
    res.json({
        message:"deletecourse endpoint"
})
})
adminRouter.get("/viewCourse", (req, res) => {
    res.json({
        message:"viewcourse endpoint"
})
})


module.exports={
    adminRouter:adminRouter
}