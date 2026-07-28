const express = require("express");
const { prisma } = require("../lib/prisma");
const { asyncHandler } = require("../lib/asyncHandler");

const router = express.Router();

const VALID_RATINGS = new Set(["up", "down"]);

// POST /api/feedback — record thumbs up/down (+ optional comment) on a bot reply.
router.post("/feedback", asyncHandler(async (req, res) => {
  const { messageId, rating, comment } = req.body || {};

  if (typeof messageId !== "string" || messageId.trim() === "") {
    return res.status(400).json({ error: "messageId is required" });
  }
  if (!VALID_RATINGS.has(rating)) {
    return res.status(400).json({ error: 'rating must be "up" or "down"' });
  }

  const message = await prisma.message.findUnique({ where: { id: messageId } });
  if (!message) {
    return res.status(404).json({ error: "message not found" });
  }

  const feedback = await prisma.feedback.create({
    data: {
      messageId,
      rating,
      comment: typeof comment === "string" && comment.trim() !== "" ? comment.trim() : null,
    },
  });

  res.status(201).json({ feedback });
}));

module.exports = router;
