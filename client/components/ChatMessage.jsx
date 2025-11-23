import React from "react";

export default function ChatMessage({ role, message }) {
  return (
    <div
      className={`px-3 py-2 rounded-lg max-w-[80%] ${
        role === "user"
          ? "bg-red-500 self-end text-white"
          : "bg-blue-500 self-start text-white"
      }`}
    >
      {message}
    </div>
  );
}
