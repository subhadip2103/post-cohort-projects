const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");
const { email, string } = require("zod");
const { z } = require("zod");
const { required } = require("zod/mini");
const ObjectId = mongoose.Types.ObjectId
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    email: { type: String, unique: true },
    password: String,
    firstname: String,
    lastname: String
})

const BoardSchema = new mongoose.Schema({
    boardId: {
        type: String,
        unique: true,
        default: uuidv4,  // Automatically generate new UUID for each board
    },
    title: String,
    description: String,
    creatorId: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: "users" }],
    createdAt: { type: Date, default: Date.now },
});

const CardSchema = new Schema({
    cardId: {
        type: String,
        unique: true,
        default: uuidv4,  // Automatically generate new UUID for each card
    },
    boardId: { type: mongoose.Schema.Types.ObjectId, ref: "boards", required: true },
    title: { type: String, required: true },
    description: String,
    status: { type: String, enum: ["todo", "doing", "done"], default: "todo" },
    position: { type: Number, default: 0 },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
    assignedTo: [{ type: mongoose.Schema.Types.ObjectId, ref: "users" }],
    createdAt: { type: Date, default: Date.now },
});

const UserModel = mongoose.model("users", UserSchema);
const BoardModel = mongoose.model("boards", BoardSchema);
const CardModel=mongoose.model("cards",CardSchema);

module.exports = ({
    UserModel,
    BoardModel,
    CardModel
})