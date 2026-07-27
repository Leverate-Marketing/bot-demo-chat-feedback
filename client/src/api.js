const BASE = "/api";

async function request(path, options) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Request failed: ${res.status}`);
  }
  return res.json();
}

export function fetchHistory(conversationId) {
  return request(`/conversations/${conversationId}/messages`);
}

export function sendChatMessage(conversationId, message) {
  return request("/chat", {
    method: "POST",
    body: JSON.stringify({ conversationId, message }),
  });
}

export function submitFeedback({ messageId, rating, comment }) {
  return request("/feedback", {
    method: "POST",
    body: JSON.stringify({ messageId, rating, comment }),
  });
}

export function finishConversation(conversationId) {
  return request(`/conversations/${conversationId}/finish`, { method: "POST" });
}

export function fetchStats(conversationId) {
  return request(`/stats?conversationId=${conversationId}`);
}
