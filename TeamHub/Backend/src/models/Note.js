import mongoose from "mongoose"
import { Schema } from "mongoose";


const NoteSechema = new Schema({
    taskId: {
        type: Schema.Types.ObjectId,
        ref: "tasks",
        required: true
    },
    content: {
        type: String,
        required: true
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "users",
        required: true
    }
},
    { timestamps: true })

const Note = mongoose.model("notes", NoteSechema);

export default Note