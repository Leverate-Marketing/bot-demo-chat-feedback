import { useEffect, useState } from "react";
import Header from "./components/Header.jsx";
import EmptyState from "./components/EmptyState.jsx";
import MessageBubble from "./components/MessageBubble.jsx";
import ChatInput from "./components/ChatInput.jsx";
import StatusBar from "./components/StatusBar.jsx";
import BotAvatar from "./components/BotAvatar.jsx";
import { fetchHistory, sendChatMessage, finishConversation, fetchStats } from "./api.js";

const STORAGE_KEY = "botDemoConversationId";

function getOrCreateConversationId() {
  const existing = sessionStorage.getItem(STORAGE_KEY);
  if (existing) return existing;
  const fresh = crypto.randomUUID();
  sessionStorage.setItem(STORAGE_KEY, fresh);
  return fresh;
}

export default function App() {
  const [conversationId, setConversationId] = useState(getOrCreateConversationId);
  const [messages, setMessages] = useState([]);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [stats, setStats] = useState({ messageCount: 0, feedbackToday: 0 });

  async function refreshStats(id) {
    try {
      const data = await fetchStats(id);
      setStats(data);
    } catch {
      // Non-critical — footer counters just won't update this round.
    }
  }

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { messages: history } = await fetchHistory(conversationId);
        if (!cancelled) setMessages(history);
      } catch {
        if (!cancelled) setError("Could not load conversation history.");
      }
      refreshStats(conversationId);
    })();
    return () => {
      cancelled = true;
    };
  }, [conversationId]);

  async function handleSend(text) {
    setSending(true);
    setError("");
    try {
      const { userMessage, botMessage } = await sendChatMessage(conversationId, text);
      setMessages((prev) => [...prev, userMessage, botMessage]);
      refreshStats(conversationId);
    } catch (err) {
      setError(err.message || "Something went wrong sending your message.");
    } finally {
      setSending(false);
    }
  }

  async function handleFinish() {
    try {
      await finishConversation(conversationId);
    } catch {
      // Even if marking it finished fails server-side, still reset the UI
      // locally so the tester can start again.
    }
    const fresh = crypto.randomUUID();
    sessionStorage.setItem(STORAGE_KEY, fresh);
    setConversationId(fresh);
    setMessages([]);
  }

  return (
    <div className="h-screen flex flex-col bg-white">
      <Header onFinishConversation={handleFinish} canFinish={messages.length > 0} />

      <main className="flex-1 flex flex-col overflow-hidden">
        {messages.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
            {messages.map((message) => (
              <MessageBubble
                key={message.id}
                message={message}
                onFeedbackSubmitted={() => refreshStats(conversationId)}
              />
            ))}
            {sending && (
              <div className="flex items-start gap-2.5">
                <BotAvatar size="sm" />
                <div className="rounded-2xl rounded-tl-sm bg-gray-100 px-4 py-2.5 text-sm text-gray-400">
                  Typing...
                </div>
              </div>
            )}
          </div>
        )}

        {error && (
          <p className="px-6 pb-2 text-center text-xs text-red-500">{error}</p>
        )}

        <ChatInput onSend={handleSend} disabled={sending} />
        <StatusBar messageCount={stats.messageCount} feedbackToday={stats.feedbackToday} />
      </main>
    </div>
  );
}
