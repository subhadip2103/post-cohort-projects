import { z } from "zod";
import Note from "../models/Note.js";
import Task from "../models/Task.js";

export const createNote = async (req, res) => {
    try {
        const userId = req.userId;
        const taskCode = req.params.taskCode;

        const requiredBody = z.object({
            content: z.string(),
        })
        const parsed = requiredBody.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json({ message: "Invalid data" });
        }

        const { content } = parsed.data;
        const task = await Task.findOne({ taskCode }).populate({
            path: 'projectId',
            populate: {
                path: 'teamId'
            }
        });

        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }

        const project = task.projectId;
        const team = project?.teamId;

        if (!team || !team.members.some(id => id.toString() === userId.toString())) {
            return res.status(403).json({ message: "Access denied: You are not a member of this project's team" });
        }

        const newNote = await Note.create({
            taskId: task._id,
            content: content,
            createdBy: userId
        })

        res.status(201).json({
            message: "Note created successfully",
            noteCode: newNote.noteCode
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }

}
export const listNote = async (req, res) => {
    const userId = req.userId;
    const taskCode = req.params.taskCode;

    const task = await Task.findOne({ taskCode }).populate({
        path: 'projectId',
        populate: {
            path: 'teamId'
        }
    });

    if (!task) {
        return res.status(404).json({ message: "Task not found" });
    }

    const project = task.projectId;
    const team = project?.teamId;

    if (!team || !team.members.some(id => id.toString() === userId.toString())) {
        return res.status(403).json({ message: "Access denied: You are not a member of this project's team" });
    }

    const notes = await Note.find({ taskId: task._id });

    res.status(200).json({
        Message: "Task found successfully.",
        notes
    })
}
export const deleteNote = async (req, res) => {
    try {
        const userId = req.userId;
        const noteCode = req.params.noteCode;

        const note = await Note.findOne({ noteCode }).populate({
            path: "taskId",
            populate: {
                path: "projectId",
                populate: {
                    path: "teamId"
                }
            }
        });


        if (!note) {
            return res.status(404).json({ message: "note not found" });
        }

        const task = note.taskId;
        const project = task?.projectId;
        const team = project?.teamId;

        if (!team || !team.members.some(id => id.toString() === userId.toString())) {
            return res.status(403).json({ message: "Access denied: You are not a member of this project's team" });
        }

        await Note.deleteOne({ _id: note._id });
        res.status(200).json({ message: "Note deleted" });

    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }

}