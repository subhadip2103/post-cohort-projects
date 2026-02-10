import { z } from "zod";
import Team from "../models/Team.js";
import Project from "../models/Project.js";

export const createProject = async (req, res) => {
    const userId = req.userId;

    const schema = z.object({
        teamCode: z.uuid(),
        title: z.string().min(2).max(100),
        description: z.string().optional()
    });

    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).json({ message: "Invalid data" });
    }

    const { teamCode, title, description } = parsed.data;

    const team = await Team.findOne({ teamCode });
    if (!team) {
        return res.status(404).json({ message: "Team not found" });
    }

    const isMember = team.members.some(
        id => id.toString() === userId.toString()
    );
    if (!isMember) {
        return res.status(403).json({ message: "Access denied" });
    }

    const project = await Project.create({
        teamId: team._id,
        title,
        description,
        createdBy: userId
    });

    return res.status(201).json({
        message: "Project created successfully",
        projectCode: project.projectCode
    });
}

export const getProjectsByTeam = async (req, res) => {
    const userId = req.userId;
    const { teamCode } = req.params;

    const team = await Team.findOne({ teamCode });
    if (!team) {
        return res.status(404).json({ message: "Team not found" });
    }

    const isMember = team.members.some(
        id => id.toString() === userId.toString()
    );
    if (!isMember) {
        return res.status(403).json({ message: "Access denied" });
    }

    const projects = await Project.find({ teamId: team._id })
        .select("projectCode title description createdAt");

    return res.status(200).json({ projects });
};

export const getProjectByCode = async (req, res) => {
    const userId = req.userId;
    const { projectCode } = req.params;

    const project = await Project.findOne({ projectCode }).populate("teamId");
    if (!project) {
        return res.status(404).json({ message: "Project not found" });
    }

    const isMember = project.teamId.members.some(
        id => id.toString() === userId.toString()
    );
    if (!isMember) {
        return res.status(403).json({ message: "Access denied" });
    }

    return res.status(200).json({
        project: {
            projectCode: project.projectCode,
            title: project.title,
            description: project.description,
            createdAt: project.createdAt
        }
    });
}

export const getProjectContext = async (req, res) => {
  try {
    const { projectCode } = req.params;

    const project = await Project.findOne({ projectCode });
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const team = await Team.findById(project.teamId)
      .populate("members", "firstname lastname");

    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    const members = team.members.map((m) => ({
      userId: m._id,
      name: `${m.firstname} ${m.lastname}`,
    }));

    res.status(200).json({
      project: {
        projectCode: project.projectCode,
        title: project.title,
      },
      team: {
        teamCode: team.teamCode,
        name: team.name,
      },
      members,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};