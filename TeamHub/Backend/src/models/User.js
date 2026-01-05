import mongoose from "mongoose"
import { Schema } from "mongoose";

const UserSchema = new Schema({
    firstname: String,
    lastname: String,
    email: { type: String, unique: true },
    password: String,

}, {
    timestamps: true
})

const User = mongoose.model("users", UserSchema);

export default User