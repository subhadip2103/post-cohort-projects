import mongoose from "mongoose"
import { Schema } from "mongoose";
import { v4 as uuidv4 } from "uuid";


const ProjectSchema = new Schema({
    projectCode: {
        type: String,
        unique: true,
        default: uuidv4
    },
    teamId: { type: mongoose.Schema.Types.ObjectId, ref: "teams", required:true},
    title: String,
    description: String,
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "users", required:true },
}, {
    timestamps: true
})

const Project = mongoose.model("projects", ProjectSchema);

export default Project