import BotAvatar from "./BotAvatar.jsx";

export default function EmptyState() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
      <BotAvatar size="lg" />
      <h2 className="mt-4 text-xl font-semibold text-gray-900">Start the conversation</h2>
      <p className="mt-1 text-sm text-gray-500 max-w-sm">
        Ask anything. Use the thumbs after each reply to leave feedback.
      </p>
    </div>
  );
}
