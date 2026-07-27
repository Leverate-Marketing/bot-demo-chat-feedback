import BotAvatar from "./BotAvatar.jsx";

export default function Header({ onFinishConversation, canFinish }) {
  return (
    <header className="border-b border-gray-200 bg-white px-6 py-4 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <BotAvatar size="sm" />
        <div>
          <h1 className="text-lg font-semibold text-gray-900">Bot Demo</h1>
          <p className="text-sm text-gray-500">
            Chat with the bot, rate each reply, finish to start a new conversation.
          </p>
        </div>
      </div>
      <button
        type="button"
        onClick={onFinishConversation}
        disabled={!canFinish}
        className="shrink-0 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        Finish Conversation
      </button>
    </header>
  );
}
