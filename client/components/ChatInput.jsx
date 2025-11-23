import React, { useState } from "react";

export default function ChatInput({ messages, setMessages, user }) {
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!inputText) return;

    const newMessage = { role: "user", message: inputText, timestamp: new Date() };
    setMessages(prev => [...prev, newMessage]);
    setLoading(true);

    try {
      const payload = {
        message: inputText,
        user_id: user ? user.id : null,
        messages: messages.slice(-10)
      };

      const response = await fetch("/api/chat/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      setMessages(prev => [
        ...prev,
        { role: "assistant", message: data.reply, timestamp: new Date() }
      ]);

    } catch (err) {
      console.error("Chat API error:", err);
    }

    setInputText("");
    setLoading(false);
  };

  return (
    <div className="flex p-2 border-t border-gray-700">
      <input
        type="text"
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        placeholder="Type your message..."
        className="flex-1 p-2 rounded-md text-black"
        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
      />
      <button
        onClick={sendMessage}
        disabled={loading}
        className={`ml-2 px-4 rounded-md text-white ${
          loading ? "bg-gray-500 cursor-not-allowed" : "bg-red-500"
        }`}
      >
        {loading ? "..." : "Send"}
      </button>
    </div>
  );
}
