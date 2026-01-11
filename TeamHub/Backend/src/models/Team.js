import mongoose from "mongoose"
import { Schema } from "mongoose";
import { v4 as uuidv4 } from "uuid";


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
    ],
    teamCode: {
        type: String,
        unique: true,
        default: uuidv4,
    },
},
    { timestamps: true })

const Team = mongoose.model("teams", TeamSchema);

export default Team