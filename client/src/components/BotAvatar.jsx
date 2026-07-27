export default function BotAvatar({ size = "md" }) {
  const dimensions = size === "lg" ? "w-16 h-16" : size === "sm" ? "w-8 h-8" : "w-10 h-10";
  return (
    <div
      className={`${dimensions} shrink-0 rounded-full bg-indigo-600 text-white flex items-center justify-center`}
      aria-hidden="true"
    >
      <svg viewBox="0 0 24 24" fill="none" className="w-1/2 h-1/2">
        <rect x="4" y="8" width="16" height="11" rx="3" fill="currentColor" />
        <rect x="9" y="2" width="6" height="5" rx="2" fill="currentColor" />
        <circle cx="9" cy="13.5" r="1.5" fill="white" />
        <circle cx="15" cy="13.5" r="1.5" fill="white" />
        <rect x="10" y="17" width="4" height="1.5" rx="0.75" fill="white" />
      </svg>
    </div>
  );
}
