const express = require("express");
const BoardRouter = express.Router();
const { z } = require("zod");
const { BoardModel, CardModel } = require("../db");
const { v4: uuidv4 } = require("uuid");
const { userMiddleware } = require("../Middlewares/usermiddleware");


BoardRouter.post("/create", userMiddleware, async (req, res) => {
    const requiredbody = z.object({
        title: z.string().min(2).max(50),
        description: z.string().min(2).max(300)
    });
    const parsedDataWithSuccess = requiredbody.safeParse(req.body);
    if (!parsedDataWithSuccess.success) {
        return res.status(404).json({
            Message: "incorrect format",
            Error: z.prettifyError(parsedDataWithSuccess.error)
        })
    }
    const { title, description } = req.body;
    const userId = req.userId;

    let newBoard;
    try {
        newBoard = await BoardModel.create({
            title,
            description,
            creatorId: userId,
            members: [userId],
            boardId: uuidv4()
        });
        return res.status(201).json({
            message: "Board created successfully",
            inviteLink: `https://collaboard.so/board/${newBoard.boardId}`
        });
    }
    catch (err) {
        return res.status(500).json({
            error: err.message,
            Message: "Unable to create a new board"
        })
    }
})
BoardRouter.post("/join/:boardId", userMiddleware, async (req, res) => {
    const MyUserId = req.userId;
    const boardId = req.params.boardId;


    const Board = await BoardModel.findOne({
        boardId: boardId
    })

    if (!Board) {
        res.status(404).json({
            Message: "Invalid BoardId, board doesn't exist"
        })
    }
    const { members } = Board;
    try {
        if (!members.includes(MyUserId)) {
            await BoardModel.updateOne(
                { boardId: boardId },
                { $addToSet: { members: MyUserId } }  
            );
            return res.status(200).json({ message: "Joined board successfully" });
        } else {
            return res.status(200).json({ message: "Already a member" });
        }

    } catch (error) {
        console.log(error);
        res.status(404)
    }


})
BoardRouter.get("/myBoards", userMiddleware, async (req, res) => {
    const MyUserId = req.userId;
    let Boards;

    try {
        Boards = await BoardModel.find(
            { creatorId: MyUserId }
        ).select("boardId title description createdAt");
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            Message: "Cannot find boards"
        });
    }

    res.status(200).json({
        Message: "Boards found successfully",
        Boards
    });


})
BoardRouter.get("/sharedWithMe", userMiddleware, async (req, res) => {
    const MyUserId = req.userId;
    let Boards;

    try {
        Boards = await BoardModel.find(
            { members: { $in: [MyUserId] }, creatorId: { $ne: MyUserId } }
        ).select("boardId title description createdAt");

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            Message: "Cannot find boards"
        });
    }

    res.status(200).json({
        Message: "Boards found successfully",
        Boards
    });


})
BoardRouter.patch("/:boardId", userMiddleware, async (req, res) => {
    const boardId = req.params.boardId;
    const { title, description } = req.body;
    const userId = req.userId;

    try {

        const board = await BoardModel.findOne({
            boardId: boardId,
            $or: [
                { creatorId: userId },
                { members: userId }
            ]
        });

        if (!board) {
            return res.status(404).json({ message: "Board not found or access denied" });
        }


        await BoardModel.updateOne(
            { boardId: boardId },
            { $set: { title, description } }
        );

        res.status(200).json({
            message: "Board updated successfully",
            updatedFields: { title, description }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to update board" });
    }
});

BoardRouter.delete("/:boardId", userMiddleware, async (req, res) => {
    const { boardId } = req.params;
    const userId = req.userId;

    try {

        const board = await BoardModel.findOne({
            boardId,
            $or: [
                { creatorId: userId },
                { members: userId }
            ]
        });

        if (!board) {
            return res.status(404).json({ message: "Board not found or access denied" });
        }


        await CardModel.deleteMany({ boardId: board._id });


        await BoardModel.deleteOne({ boardId });

        res.status(200).json({
            message: "Board and its cards deleted successfully"
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to delete board" });
    }
});

BoardRouter.get("/:boardId", userMiddleware, async (req, res) => {
    const userId = req.userId;
    const boardId = req.params.boardId;

    let board;
    try {
        board = await BoardModel.findOne({
            boardId,
            $or: [
                { creatorId: userId },
                { members: userId }
            ]
        }).select("boardId title description createdAt");;

        if (!board) {
            return res.status(404).json({ message: "Board not found or access denied" });
        }

        res.status(200).json({
            Message: "Boards found successfully",
            board
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            Message: "Cannot find Board"
        });
    }
})

module.exports = { BoardRouter }