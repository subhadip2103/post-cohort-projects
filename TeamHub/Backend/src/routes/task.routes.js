import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import {
  createTasks,
  listTasks,
  editTasks,
  deleteTasks
} from "../controllers/task.controllers.js";

const taskRoutes=express.Router();

taskRoutes.post("/project/:projectCode",authMiddleware,createTasks)
taskRoutes.get("/project/:projectCode",authMiddleware,listTasks)
taskRoutes.patch("/:taskCode",authMiddleware,editTasks)
taskRoutes.delete("/:taskCode",authMiddleware,deleteTasks)

export default taskRoutes
