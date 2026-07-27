const STOPWORDS = new Set([
  "a", "an", "the", "is", "are", "was", "were", "do", "does", "did",
  "i", "you", "your", "my", "me", "to", "of", "for", "in", "on", "at",
  "and", "or", "it", "this", "that", "can", "could", "will", "would",
  "what", "how", "when", "where", "why", "with", "have", "has", "be",
]);

function tokenize(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((word) => word.length > 0 && !STOPWORDS.has(word));
}

/**
 * Jaccard similarity between the token sets of two strings.
 * Keyword-overlap based — deliberately simple, this is a Phase 1 stand-in
 * for real NLU that will land in Phase 2.
 */
function similarity(a, b) {
  const tokensA = new Set(tokenize(a));
  const tokensB = new Set(tokenize(b));
  if (tokensA.size === 0 || tokensB.size === 0) return 0;

  let intersection = 0;
  for (const token of tokensA) {
    if (tokensB.has(token)) intersection += 1;
  }
  const union = new Set([...tokensA, ...tokensB]).size;
  return intersection / union;
}

const MATCH_THRESHOLD = 0.3;

/**
 * Finds the best matching Q&A pair for a user message.
 * Returns the pair plus its score, or null if nothing clears the threshold.
 */
function findBestMatch(userMessage, qaPairs) {
  let best = null;
  let bestScore = 0;

  for (const pair of qaPairs) {
    const score = similarity(userMessage, pair.question);
    if (score > bestScore) {
      bestScore = score;
      best = pair;
    }
  }

  if (best && bestScore >= MATCH_THRESHOLD) {
    return { pair: best, score: bestScore };
  }
  return null;
}

module.exports = { findBestMatch, similarity, tokenize };
