import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import {
  createProject,
  getProjectsByTeam,
  getProjectByCode,
  getProjectContext
} from "../controllers/project.controller.js";

const projectRoutes = express.Router();

projectRoutes.post("/", authMiddleware, createProject);
projectRoutes.get("/team/:teamCode", authMiddleware, getProjectsByTeam);
projectRoutes.get("/:projectCode", authMiddleware, getProjectByCode);
projectRoutes.get("/:projectCode/context", authMiddleware, getProjectContext);
export default projectRoutes;