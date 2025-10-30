const express = require("express");
const cardRouter = express.Router();
const { z } = require("zod");
const { BoardModel, CardModel } = require("../db");
const { v4: uuidv4 } = require("uuid");
const { userMiddleware } = require("../Middlewares/usermiddleware");



cardRouter.post("/boards/:boardId/cards", userMiddleware, async (req, res) => {
  const userId = req.userId;
  const boardId = req.params.boardId;
  const { title, description, assignedTo } = req.body;

  const requiredBody = z.object({
    title: z.string().min(2).max(100),
    description: z.string().optional(),
    assignedTo: z.array(z.string()).optional()
  });

  const parsed = requiredBody.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: "Invalid card format" });
  }
  const board = await BoardModel.findOne({
    boardId,
    $or: [
      { creatorId: userId },
      { members: { $in: [userId] } }
    ]
  });

  if (!board) {
    return res.status(403).json({ message: "You don't have access to this board or it doesn't exist" });
  }
  const newCard = await CardModel.create({
    boardId: board._id,
    title,
    description,
    createdBy: userId,
    assignedTo: assignedTo || [],
  });
  res.status(201).json({
    message: "Card created successfully",
    card: {
      cardId: newCard.cardId,
      title: newCard.title,
      description: newCard.description,
      status: newCard.status,
      createdAt: newCard.createdAt,
      assignedTo: newCard.assignedTo,
    },
  });


})
cardRouter.get("/boards/:boardId/cards", userMiddleware, async (req, res) => {
  const userId = req.userId;
  const boardId = req.params.boardId;

  try {
    const board = await BoardModel.findOne({
      boardId,
      $or: [
        { creatorId: userId },
        { members: { $in: [userId] } }
      ]
    });

    if (!board) {
      return res.status(403).json({ message: "Access denied or board not found" });
    }


    const cards = await CardModel.find({ boardId: board._id })
      .select("cardId title description status position assignedTo createdAt");

    res.status(200).json({
      message: "Cards fetched successfully",
      cards
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching cards" });
  }
});

cardRouter.get("/cards/:cardId", userMiddleware, async (req, res) => {
  const userId = req.userId;
  const { cardId } = req.params;

  try {

    const card = await CardModel.findOne({ cardId });

    if (!card) {
      return res.status(404).json({ message: "Card not found" });
    }

    const board = await BoardModel.findById(card.boardId);


    if (
      board.creatorId.toString() !== userId.toString() &&
      !board.members.includes(userId)
    ) {
      return res.status(403).json({ message: "Access denied" });
    }


    res.status(200).json({
      message: "Card fetched successfully",
      card
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching card" });
  }
});


cardRouter.patch("/cards/:cardId", userMiddleware, async (req, res) => {
  const userId = req.userId;
  const { cardId } = req.params;

  try {
    // Find the card
    const card = await CardModel.findOne({ cardId });
    
    if (!card) {
      return res.status(404).json({ message: "Card not found" });
    }

    // Find the board and check access
    const board = await BoardModel.findById(card.boardId);
    
    if (!board) {
      return res.status(404).json({ message: "Board not found" });
    }

    // Check if user has access to board
    const hasAccess = 
      board.creatorId.toString() === userId.toString() ||
      board.members.some(memberId => memberId.toString() === userId.toString());

    if (!hasAccess) {
      return res.status(403).json({ message: "Access denied" });
    }

    // Build update object dynamically (only fields provided)
    const updateFields = {};
    
    // Only add fields that are actually in the request body
    if (req.body.title !== undefined) {
      updateFields.title = req.body.title;
    }
    if (req.body.description !== undefined) {
      updateFields.description = req.body.description;
    }
    if (req.body.status !== undefined) {
      updateFields.status = req.body.status;
    }
    if (req.body.position !== undefined) {
      updateFields.position = req.body.position;
    }
    if (req.body.assignedTo !== undefined) {
      updateFields.assignedTo = req.body.assignedTo;
    }

    // If no fields to update, return error
    if (Object.keys(updateFields).length === 0) {
      return res.status(400).json({ message: "No fields to update" });
    }

    // Update only the provided fields
    const updatedCard = await CardModel.findOneAndUpdate(
      { cardId },
      { $set: updateFields },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      message: "Card updated successfully",
      card: updatedCard
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating card" });
  }
});

cardRouter.delete("/cards/:cardId", userMiddleware, async (req, res) => {
  const userId = req.userId;
  const { cardId } = req.params;

  try {
    const card = await CardModel.findOne({ cardId });
    if (!card) return res.status(404).json({ message: "Card not found" });

    const board = await BoardModel.findById(card.boardId);
    if (!board) return res.status(404).json({ message: "Board not found" });

    const isBoardAdmin = board.creatorId.toString() === userId.toString();
    const isCardCreator = card.createdBy.toString() === userId.toString();
    const isBoardMember = board.members.some(id => id.toString() === userId.toString());

    if (!isBoardMember && !isBoardAdmin) {
      return res.status(403).json({ message: "Access denied" });
    }

    if (!isBoardAdmin && !isCardCreator) {
      return res.status(403).json({ message: "Only the creator or board admin can delete this card" });
    }

    await CardModel.deleteOne({ _id: card._id });

    res.status(200).json({
      message: "Card deleted successfully",
      deletedCardId: card.cardId
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting card" });
  }
});



module.exports = { cardRouter }