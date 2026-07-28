const STOPWORDS = new Set([
  "a", "an", "the", "is", "are", "was", "were", "do", "does", "did",
  "i", "you", "your", "my", "me", "to", "of", "for", "in", "on", "at",
  "and", "or", "it", "this", "that", "can", "could", "will", "would",
  "what", "how", "when", "where", "why", "with", "have", "has", "be",
]);

// Very naive stemming (plurals, -ing, -ed) so "refund" matches "refunds",
// "shipping" matches "ships", etc. Not linguistically rigorous — good enough
// for keyword overlap, which is all Phase 1 needs.
function stem(word) {
  if (word.length > 5 && word.endsWith("ing")) return word.slice(0, -3);
  if (word.length > 4 && word.endsWith("ed")) return word.slice(0, -2);
  if (word.length > 3 && word.endsWith("es")) return word.slice(0, -2);
  if (word.length > 3 && word.endsWith("s")) return word.slice(0, -1);
  return word;
}

function tokenize(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((word) => word.length > 0 && !STOPWORDS.has(word))
    .map(stem);
}

/**
 * Overlap coefficient (intersection / smaller set size) between the token
 * sets of two strings — more forgiving than Jaccard when a short user
 * message is matched against a longer, more descriptive sample question.
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
  return intersection / Math.min(tokensA.size, tokensB.size);
}

const MATCH_THRESHOLD = 0.4;

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
