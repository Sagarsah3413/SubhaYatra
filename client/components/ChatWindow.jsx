import React from "react";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";

export default function ChatWindow({ messages, setMessages, user }) {
  return (
    <div className="flex flex-col w-full max-w-md h-[600px] mx-auto border-2 border-gray-300 rounded-lg bg-gray-900 text-white">
      <div className="text-center font-bold p-3 bg-gray-800 border-b border-gray-700">
        {user ? `Logged in as ${user.firstName}` : "Guest"}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map((msg, index) => (
          <ChatMessage key={index} role={msg.role} message={msg.message} />
        ))}
      </div>

      <ChatInput messages={messages} setMessages={setMessages} user={user} />
    </div>
  );
}
