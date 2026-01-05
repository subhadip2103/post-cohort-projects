import express from "express";
import {signupUsers} from "../controllers/auth.controllers.js";
import {signinUsers} from "../controllers/auth.controllers.js";
import {verifyMe} from "../controllers/auth.controllers.js"
import authMiddleware from "../middlewares/auth.middleware.js";


const authRoutes=express.Router();

authRoutes.post("/signup",signupUsers)
authRoutes.post("/login",signinUsers)
authRoutes.get("/me",authMiddleware,verifyMe)


export default authRoutes