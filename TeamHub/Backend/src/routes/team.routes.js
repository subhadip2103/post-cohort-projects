import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import {
    createTeam,
    getMyTeams,
    joinTeam,
    getTeamById
} from "../controllers/team.controllers.js";

const teamRoutes = express.Router();

teamRoutes.post("/", authMiddleware, createTeam)
teamRoutes.get("/", authMiddleware, getMyTeams)
teamRoutes.post("/join", authMiddleware, joinTeam)
teamRoutes.get("/:teamCode", authMiddleware, getTeamById)


export default teamRoutes
