import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import {
  createTasks,
  listTasks,
  editTasks,
  deleteTasks
} from "../controllers/task.controllers.js";

const taskRoutes=express.Router();

taskRoutes.post("/:projectCode/tasks",authMiddleware,createTasks)
taskRoutes.get("/:projectCode/tasks",authMiddleware,listTasks)
taskRoutes.patch("/:taskCode",authMiddleware,editTasks)
taskRoutes.delete("/:taskCode",authMiddleware,deleteTasks)
