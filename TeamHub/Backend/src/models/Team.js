import mongoose from "mongoose"
import { Schema } from "mongoose";


const TeamSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
    members: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users"
        }
    ]
},
    { timestamps: true })

const Team = mongoose.model("teams", TeamSchema);

export default Team