const { Router } = require("express");
const courseRouter=Router();

courseRouter.get(("/preview"),(req,res)=>{
    res.json({Message:"preview endpoint"})
})

courseRouter.post(("/purchase"),(req,res)=>{
    res.json({Message:"purchase endpoint"})
})

module.exports={
    courseRouter:courseRouter
}