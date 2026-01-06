import mongoose from "mongoose"
import { Schema } from "mongoose";


const ProjectSchema = new Schema({
    teamId: {type:mongoose.Schema.Types.ObjectId, ref:"teams"},
    title: String,
    description: String,
    createdBy:{type:mongoose.Schema.Types.ObjectId, ref:"users"},
}, {
    timestamps: true
})

const Project = mongoose.model("projects", ProjectSchema);

export default Project