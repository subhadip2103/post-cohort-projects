import { z } from "zod";
import Task from "../models/Task.js";
import { Types } from "mongoose";
import Project from "../models/Project.js";

export const createTasks = async (req, res) => {
    try {
        const userId = req.userId;
        const projectId = req.params.projectCode;

        const requiredBody = z.object({
            title: z.string().min(2).max(50),
            description: z.string().optional(),
            status: z.enum(["todo", "doing", "done"]).optional(),
            assignedTo: z.string().refine((val) => Types.ObjectId.isValid(val), {
                message: "Invalid assignedTo ID",
            }).optional(),
        })
        const parsed = requiredBody.safeParse(req.body)
        if (!parsed.success) {
            return res.status(400).json({ message: "Invalid data" });
        }

        const { title, description, status, assignedTo } = parsed.data;

        const project = await Project.findOne({ projectCode: projectId }).populate("teamId");

        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        if (!project.teamId) {
            return res.status(500).json({ message: "Project configuration error (no team found)" });
        }

        const isMember = project.teamId.members.some(
            id => id.toString() === userId.toString()
        );
        if (!isMember) {
            return res.status(403).json({ message: "Access denied" });
        }


        const newTask = await Task.create({
            projectId: project._id,
            title,
            description,
            status,
            assignedTo,
            createdBy: userId
        });

        res.status(201).json({
            message: "Task created successfully",
            taskCode: newTask.taskCode
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }

}

export const listTasks = async (req, res) => {
    try {
        const userId = req.userId;
        const projectId = req.params.projectCode;

        const project = await Project.findOne({ projectCode: projectId }).populate("teamId");

        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        if (!project.teamId) {
            return res.status(500).json({ message: "Project configuration error (no team found)" });
        }

        const isMember = project.teamId.members.some(
            id => id.toString() === userId.toString()
        );
        if (!isMember) {
            return res.status(403).json({ message: "Access denied" });
        }

        const tasks = await Task.find({ projectId: project._id });
        if (!tasks) {
            return res.status(404).json({ message: "Tasks not found." })
        }
        res.status(200).json(tasks)

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server error" });
    }

}

export const editTasks = async (req, res) => {
    try {
        const userId = req.userId;
        const { taskCode } = req.params;

        // 1. Validate Input
        const requiredBody = z.object({
            title: z.string().min(2).max(50).optional(),
            description: z.string().optional(), // Added ()
            status: z.enum(["todo", "doing", "done"]).optional()
        });

        const parsed = requiredBody.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json({ message: "Invalid data", errors: parsed.error.errors });
        }

        // 2. Fetch Task with Deep Population
        // We go: Task -> Project -> Team
        const task = await Task.findOne({ taskCode }).populate({
            path: 'projectId',
            populate: {
                path: 'teamId'
            }
        });

        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }

        // 3. Authorization Check
        // Accessing the members list through the nested path
        const project = task.projectId;
        const team = project?.teamId;

        if (!team || !team.members.some(id => id.toString() === userId.toString())) {
            return res.status(403).json({ message: "Access denied: You are not a member of this project's team" });
        }

        // 4. Update the Task
        task.title = parsed.data.title || task.title;
        task.description = parsed.data.description || task.description;
        task.status = parsed.data.status || task.status;

        await task.save();

        res.status(200).json({
            message: "Task updated successfully",
            task
        });

    } catch (error) {
        console.error("Edit Task Error:", error);
        res.status(500).json({ message: "Server error" });
    }
}

export const deleteTasks = async (req, res) => {
    try {
        const { taskCode } = req.params;
        const userId = req.userId;

        const task = await Task.findOne({ taskCode }).populate({
            path: 'projectId',
            populate: { path: 'teamId' }
        });

        if (!task) return res.status(404).json({ message: "Task not found" });

        const isMember = task.projectId?.teamId?.members.some(id => id.toString() === userId.toString());
        if (!isMember) return res.status(403).json({ message: "Denied" });

        await Task.deleteOne({ _id: task._id });
        res.status(200).json({ message: "Task deleted" });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }

}