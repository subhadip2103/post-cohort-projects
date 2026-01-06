import mongoose from "mongoose"
import { Schema } from "mongoose";


const TaskSchema = new Schema({
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: "projects", required:true },
    title: String,
    description: String,
    status: {
        type: String,
        enum: ['todo', 'doing', 'done'],
        default: 'todo'
    },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "users" }
}, {
    timestamps: true
})

const Task = mongoose.model("tasks", TaskSchema);

export default Task