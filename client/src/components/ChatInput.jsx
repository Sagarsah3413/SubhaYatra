import { useState } from "react";

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
    <div className="flex p-4 border-t border-amber-200 bg-white">
      <input
        type="text"
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        placeholder="Ask about destinations..."
        className="flex-1 p-3 rounded-lg text-gray-800 border border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
      />
      <button
        onClick={sendMessage}
        disabled={loading}
        className={`ml-3 px-6 rounded-lg font-semibold transition-colors ${
          loading ? "bg-gray-400 cursor-not-allowed text-white" : "bg-amber-600 hover:bg-amber-700 text-white"
        }`}
      >
        {loading ? "..." : "Send"}
      </button>
    </div>
  );
}
