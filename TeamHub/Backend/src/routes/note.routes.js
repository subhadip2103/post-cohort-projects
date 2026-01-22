import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import {
  createNote,
  listNote,
  deleteNote
} from "../controllers/note.controllers.js";

const noteRoutes=express.Router();

noteRoutes.post("/task/:taskCode",authMiddleware,createNote)
noteRoutes.get("/task/:taskCode",authMiddleware,listNote)
noteRoutes.delete("/:noteCode",authMiddleware,deleteNote)

export default noteRoutes