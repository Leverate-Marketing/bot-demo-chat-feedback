export default function StatusBar({ messageCount, feedbackToday }) {
  return (
    <div className="border-t border-gray-100 bg-gray-50 px-4 py-2 text-center text-xs text-gray-500">
      {messageCount} messages in current conversation · {feedbackToday} feedback submitted today
    </div>
  );
}
