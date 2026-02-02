import { z } from "zod"
import Team from "../models/Team.js";

export const createTeam = async (req, res) => {
  let newTeam;
  const userId = req.userId;
  const requiredBody = z.object({
    name: z.string().min(2).max(100)
  })
  const ParsedDataWithSuccess = requiredBody.safeParse(req.body);
  if (!ParsedDataWithSuccess.success) {
    return res.status(400).json({
      Message: "Invalid Data sent",
      error: z.prettifyError(ParsedDataWithSuccess.error)

    })
  }

  const { name } = req.body;

  try {
    newTeam = await Team.create({
      name: name,
      owner: userId,
      members: [userId]
    })

    res.status(201).json({
      message: "Team created successfully",
      inviteLink: `http://localhost:3001/join/${newTeam.teamCode}`,
      teamCode: newTeam.teamCode
    })
  } catch (error) {
    return res.status(500).json({
      error: error.message,
      Message: "Unable to create a Team"
    })

  }
}

export const getMyTeams = async (req, res) => {
  const userId = req.userId;

  try {
    const teams = await Team.find({
      $or: [
        { owner: userId },
        { members: { $in: [userId] } }
      ]
    }).select("teamCode name createdAt");

    res.status(200).json({
      Message: "Team found successfully",
      teams
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      Message: "Cannot find team"
    });
  }


}

export const joinTeam = async (req, res) => {
  const MyUserId = req.userId;
  const requiredBody = z.object({
    teamCode: z.uuid()
  })
  const parsed = requiredBody.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ Message: "Invalid Data sent" })
  }

  const { teamCode } = parsed.data;


  const team = await Team.findOne({
    teamCode: teamCode
  })

  if (!team) {
    return res.status(404).json({
      Message: "Invalid team code, Team doesn't exist."
    })
  }
  const { members } = team;
  try {
    if (!members.some(id => id.toString() === MyUserId.toString())) {
      await Team.updateOne(
        { teamCode: teamCode },
        { $addToSet: { members: MyUserId } }
      );
      return res.status(200).json({ message: "Joined Team successfully" });
    } else {
      return res.status(200).json({ message: "Already a member" });
    }

  } catch (error) {
    console.log(error);
    res.status(404)
  }


}

export const getTeamById = async (req, res) => {
  const userId = req.userId;
  const teamCode = req.params.teamCode;

  let team;
  try {
    team = await Team.findOne({
      teamCode,
      $or: [
        { owner: userId },
        { members: userId }
      ]
    }).select("teamCode name createdAt");;

    if (!team) {
      return res.status(404).json({ message: "Team not found or access denied" });
    }

    res.status(200).json({
      Message: "Teams found successfully",
      team
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      Message: "Cannot find Board"
    });
  }
}

