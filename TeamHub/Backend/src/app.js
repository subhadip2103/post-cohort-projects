import express from "express";
import cors from "cors"
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes.js";
import teamRoutes from "./routes/team.routes.js";
import projectRoutes from "./routes/project.routes.js";
import taskRoutes from "./routes/task.routes.js";
import noteRoutes from "./routes/note.routes.js";



const app = express();
const corsOptions = {
  
  origin: ['http://localhost:5173','http://localhost:5174'], 
  credentials: true,
  methods: 'GET,POST,PUT,DELETE,OPTIONS',
  allowedHeaders: 'Content-Type,Authorization'
};
app.use(cors(corsOptions))
app.use(express.json());
app.use(cookieParser());

app.use("/api/v1/auth", authRoutes)
app.use("/api/v1/teams", teamRoutes)
app.use("/api/v1/projects", projectRoutes)
app.use("/api/v1/tasks", taskRoutes)
app.use("/api/v1/notes", noteRoutes)

export default app