const fs = require("fs");
const path = require("path");
const { findBestMatch } = require("./matchQuestion");
const { getRoutingReply } = require("./countryRouting");

const SAMPLE_QA_PATH = path.join(__dirname, "..", "sample-qa.json");
const NO_MATCH_REPLY =
  "No sample answer configured yet for this question — real bot logic comes in Phase 2.";

function loadSampleQa() {
  const raw = fs.readFileSync(SAMPLE_QA_PATH, "utf-8");
  return JSON.parse(raw);
}

/**
 * PHASE 1 PLACEHOLDER — this is the single function to replace in Phase 2.
 *
 * Swapping in the real bot means changing only this file: keep the
 * `getBotReply(conversationId, userMessage) => Promise<string>` signature
 * and neither the API route nor the frontend need to change.
 */
async function getBotReply(conversationId, userMessage) {
  const routingReply = getRoutingReply(userMessage);
  if (routingReply) {
    return `(sample answer for testing) ${routingReply}`;
  }

  const qaPairs = loadSampleQa();
  const match = findBestMatch(userMessage, qaPairs);

  if (match) {
    return `(sample answer for testing) ${match.pair.answer}`;
  }
  return NO_MATCH_REPLY;
}

module.exports = { getBotReply };
