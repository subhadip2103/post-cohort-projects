const { Router } = require("express");
const userRouter=Router();

userRouter.post("/signup",(req,res)=>{
    res.json({
        Message:"signup endpoint"
    })
})
userRouter.post("/login",(req,res)=>{
    res.json({
        Message:"login endpoint"
    })
})
userRouter.get("/purchase",(req,res)=>{
    res.json({
        Message:"purchase endpoint"
    })
})

module.exports={
    userRouter:userRouter
}
