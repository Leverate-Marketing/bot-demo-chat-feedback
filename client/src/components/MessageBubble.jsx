import BotAvatar from "./BotAvatar.jsx";
import FeedbackControls from "./FeedbackControls.jsx";

export default function MessageBubble({ message }) {
  const isUser = message.role === "user";

  if (isUser) {
    return (
      <div className="flex justify-end">
        <div className="max-w-[75%] rounded-2xl rounded-tr-sm bg-indigo-600 px-4 py-2.5 text-sm text-white">
          {message.content}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-2.5">
      <BotAvatar size="sm" />
      <div className="max-w-[75%]">
        <div className="rounded-2xl rounded-tl-sm bg-gray-100 px-4 py-2.5 text-sm text-gray-800">
          {message.content}
        </div>
        <FeedbackControls messageId={message.id} initialFeedback={message.feedback?.[0]} />
      </div>
    </div>
  );
}
