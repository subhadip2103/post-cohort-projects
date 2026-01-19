import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const TaskSchema = new mongoose.Schema(
  {
    taskCode: {
      type: String,
      unique: true,
      default: uuidv4
    },
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "projects",
      required: true
    },
    title: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 200
    },
    description: {
      type: String
    },
    status: {
      type: String,
      enum: ["todo", "doing", "done"],
      default: "todo"
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users"
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true
    }
  },
  { timestamps: true }
);

const Task = mongoose.model("tasks", TaskSchema);
export default Task;
