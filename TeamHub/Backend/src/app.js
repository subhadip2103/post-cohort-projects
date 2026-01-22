import express from "express";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes.js";
import teamRoutes from "./routes/team.routes.js";
import projectRoutes from "./routes/project.routes.js";
import taskRoutes from "./routes/task.routes.js";
import noteRoutes from "./routes/note.routes.js";


const app=express();
app.use(express.json());
app.use(cookieParser());

app.use("/api/v1/auth",authRoutes)
app.use("/api/v1/team",teamRoutes)
app.use("/api/v1/project",projectRoutes)
app.use("/api/v1/task",taskRoutes)
app.use("/api/v1/note",noteRoutes)

export default app