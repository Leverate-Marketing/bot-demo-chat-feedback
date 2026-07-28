const express = require("express");
const { prisma } = require("../lib/prisma");
const { asyncHandler } = require("../lib/asyncHandler");

const router = express.Router();

function startOfTodayUtc() {
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
}

// GET /api/stats?conversationId=... — footer counters.
router.get("/stats", asyncHandler(async (req, res) => {
  const { conversationId } = req.query;

  const [messageCount, feedbackToday] = await Promise.all([
    conversationId
      ? prisma.message.count({ where: { conversationId: String(conversationId) } })
      : Promise.resolve(0),
    prisma.feedback.count({ where: { createdAt: { gte: startOfTodayUtc() } } }),
  ]);

  res.json({ messageCount, feedbackToday });
}));

module.exports = router;
