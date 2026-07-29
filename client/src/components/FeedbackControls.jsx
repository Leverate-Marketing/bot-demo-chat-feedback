import { useState } from "react";
import { submitFeedback } from "../api.js";

function ThumbIcon({ direction, filled }) {
  const up = direction === "up";
  return (
    <svg
      viewBox="0 0 24 24"
      className="w-4 h-4"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="1.8"
      style={{ transform: up ? undefined : "scaleY(-1)" }}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M7 10v10H4a1 1 0 01-1-1v-8a1 1 0 011-1h3zm0 0l4.5-8a1.5 1.5 0 012.7.3L13 8h5a2 2 0 012 2l-1.5 8a2 2 0 01-2 1.7H7"
      />
    </svg>
  );
}

export default function FeedbackControls({ messageId, initialFeedback, onSubmitted }) {
  const [submittedRating, setSubmittedRating] = useState(initialFeedback?.rating ?? null);
  const [openRating, setOpenRating] = useState(null);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showThanks, setShowThanks] = useState(false);
  const [error, setError] = useState("");

  if (submittedRating) {
    return (
      <div className="mt-2 flex items-center gap-2 text-xs text-gray-400">
        <span className={submittedRating === "up" ? "text-indigo-600" : "text-gray-500"}>
          <ThumbIcon direction={submittedRating} filled />
        </span>
        <span>Thanks for the feedback!</span>
      </div>
    );
  }

  async function handleSubmit(rating) {
    setSubmitting(true);
    setError("");
    try {
      await submitFeedback({ messageId, rating, comment });
      setSubmittedRating(rating);
      setOpenRating(null);
      setShowThanks(true);
      setTimeout(() => setShowThanks(false), 2500);
      onSubmitted?.();
    } catch (err) {
      setError(err.message || "Could not submit feedback");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mt-2">
      <div className="flex items-center gap-2 text-gray-400">
        <button
          type="button"
          aria-label="Thumbs up"
          onClick={() => setOpenRating(openRating === "up" ? null : "up")}
          className={`p-1 rounded hover:bg-gray-100 hover:text-indigo-600 transition-colors ${
            openRating === "up" ? "text-indigo-600 bg-gray-100" : ""
          }`}
        >
          <ThumbIcon direction="up" />
        </button>
        <button
          type="button"
          aria-label="Thumbs down"
          onClick={() => setOpenRating(openRating === "down" ? null : "down")}
          className={`p-1 rounded hover:bg-gray-100 hover:text-red-500 transition-colors ${
            openRating === "down" ? "text-red-500 bg-gray-100" : ""
          }`}
        >
          <ThumbIcon direction="down" />
        </button>
        {showThanks && <span className="text-xs text-green-600">Thanks!</span>}
      </div>

      {openRating && (
        <div className="mt-2 w-72 max-w-full rounded-lg border border-gray-200 bg-gray-50 p-3">
          <label className="block text-xs font-medium text-gray-600 mb-1">
            What was wrong / good about this reply? (optional)
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={2}
            className="w-full rounded-md border border-gray-300 bg-white px-2 py-1 text-sm text-gray-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            placeholder="Optional comment..."
          />
          {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
          <div className="mt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setOpenRating(null)}
              className="rounded-md px-3 py-1 text-xs font-medium text-gray-500 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={submitting}
              onClick={() => handleSubmit(openRating)}
              className="rounded-md bg-indigo-600 px-3 py-1 text-xs font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
            >
              {submitting ? "Submitting..." : "Submit"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
