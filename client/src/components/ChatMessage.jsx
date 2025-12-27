export default function ChatMessage({ role, message }) {
  return (
    <div
      className={`px-3 py-2 rounded-lg max-w-[80%] ${
        role === "user"
          ? "bg-amber-600 self-end text-white"
          : "bg-emerald-700 self-start text-white"
      }`}
    >
      {message}
    </div>
  );
}
