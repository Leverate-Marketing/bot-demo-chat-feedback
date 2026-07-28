const express = require("express");
const { prisma } = require("../lib/prisma");
const { getBotReply } = require("../lib/botReply");
const { asyncHandler } = require("../lib/asyncHandler");

const router = express.Router();

// POST /api/chat — save the user's message, generate + save the bot's reply.
router.post("/chat", asyncHandler(async (req, res) => {
  const { conversationId, message } = req.body || {};

  if (typeof conversationId !== "string" || conversationId.trim() === "") {
    return res.status(400).json({ error: "conversationId is required" });
  }
  if (typeof message !== "string" || message.trim() === "") {
    return res.status(400).json({ error: "message is required" });
  }

  // Client generates the conversation id up front, so create it lazily
  // on the first message of a session (also covers resuming after reload).
  await prisma.conversation.upsert({
    where: { id: conversationId },
    update: {},
    create: { id: conversationId },
  });

  const userMessage = await prisma.message.create({
    data: { conversationId, role: "user", content: message.trim() },
  });

  const replyText = await getBotReply(conversationId, message.trim());

  const botMessage = await prisma.message.create({
    data: { conversationId, role: "bot", content: replyText },
  });

  res.json({ userMessage, botMessage });
}));

// GET /api/conversations/:id/messages — load history (supports resuming a
// session after a page reload, since the client keeps the same id).
router.get("/conversations/:id/messages", asyncHandler(async (req, res) => {
  const messages = await prisma.message.findMany({
    where: { conversationId: req.params.id },
    orderBy: { createdAt: "asc" },
    include: { feedback: true },
  });
  res.json({ messages });
}));

// POST /api/conversations/:id/finish — mark a conversation as ended.
router.post("/conversations/:id/finish", asyncHandler(async (req, res) => {
  const conversation = await prisma.conversation.findUnique({
    where: { id: req.params.id },
  });
  if (!conversation) {
    return res.status(404).json({ error: "conversation not found" });
  }

  const updated = await prisma.conversation.update({
    where: { id: req.params.id },
    data: { endedAt: new Date() },
  });
  res.json({ conversation: updated });
}));

module.exports = router;
