import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const NoteSchema = new mongoose.Schema(
  {
    noteCode: {
      type: String,
      unique: true,
      default: uuidv4
    },
    taskId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "tasks",
      required: true
    },
    content: {
      type: String,
      required: true,
      minlength: 1,
      maxlength: 1000
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true
    }
  },
  { timestamps: true }
);

const Note = mongoose.model("notes", NoteSchema);
export default Note;
