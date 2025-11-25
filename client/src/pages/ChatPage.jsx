import React, { useState, useEffect, useRef } from "react";
import { SignedIn, SignedOut, SignInButton, useUser } from "@clerk/clerk-react";
import axios from "axios";
import Footer from "../../components/footer/Footer";

// Custom Header
function ChatHeader() {
  const { user } = useUser(); // only user info

  return (
    <div className="w-full bg-blue-600 text-white p-4 shadow-md flex justify-between items-center">
      <h1 className="text-xl font-bold">Chatbot with Sign</h1>
      <div>
        <SignedIn>
          <span className="mr-4">Hello, {user?.firstName || "User"}!</span>
          <SignInButton>Sign Out</SignInButton>
        </SignedIn>
        <SignedOut>
          <SignInButton>Sign In</SignInButton>
        </SignedOut>
      </div>
    </div>
  );
}

// Sidebar button component
function SidebarButton({ icon, label, onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 p-2 hover:bg-gray-200 rounded"
    >
      <span>{icon}</span>
      <span>{label}</span>
    </button>
  );
}

export default function ChatPage() {
  const { user } = useUser();
  const userId = user?.id || null;

  const [chats, setChats] = useState([]); // All chat sessions
  const [currentChatId, setCurrentChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  const messagesEndRef = useRef(null);

  // Scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Fetch user chats on load
  useEffect(() => {
    if (!userId) return;
    fetchChats();
  }, [userId]);

  const fetchChats = async () => {
    try {
      const res = await axios.get(`/api/chat/history?user_id=${userId}`);
      setChats(res.data);
    } catch (err) {
      console.error("Error fetching chats", err);
    }
  };

  const loadChat = async (chatId) => {
    setCurrentChatId(chatId);
    setShowHistory(false);
    setSearchResults([]);
    setSearchQuery("");
    try {
      const res = await axios.get(`/api/chat/messages?chat_id=${chatId}`);
      setMessages(res.data);
    } catch (err) {
      console.error("Error loading chat", err);
    }
  };

  const handleNewChat = async () => {
    if (!userId) {
      alert("Sign in to create a new chat!");
      return;
    }
    try {
      const res = await axios.post("/api/chat/new", { user_id: userId });
      const newChatId = res.data.chat_id;
      setCurrentChatId(newChatId);
      setMessages([]);
      fetchChats(); // refresh sidebar
    } catch (err) {
      console.error("Error creating new chat", err);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || !currentChatId) return;

    const userMessage = { type: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);

    try {
      // Save user message
      await axios.post("/api/chat/message", {
        chat_id: currentChatId,
        sender: "user",
        content: input,
      });

      // Bot reply (replace with AI integration later)
      const botReply = "This is a demo reply from AI.";

      setMessages((prev) => [...prev, { type: "bot", text: botReply }]);

      // Save bot message
      await axios.post("/api/chat/message", {
        chat_id: currentChatId,
        sender: "bot",
        content: botReply,
      });

      setInput("");
    } catch (err) {
      console.error("Error sending message", err);
    }
  };

  const handleSearchChats = async () => {
    if (!searchQuery || !userId) return;
    try {
      const res = await axios.get(
        `/api/chat/search?user_id=${userId}&query=${encodeURIComponent(searchQuery)}`
      );
      setSearchResults(res.data);
      setShowHistory(false);
    } catch (err) {
      console.error("Error searching chats", err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Header */}
      <ChatHeader />

      {/* Main content: Sidebar + Chat */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <div className="w-60 bg-gray-100 h-screen p-4 flex flex-col gap-4">
          {/* New Chat Button */}
          <SidebarButton icon="📝" label="New Chat" onClick={handleNewChat} />

          {/* Search */}
          <div className="flex flex-col gap-2">
            <input
              type="text"
              placeholder="Search chats..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="p-2 border rounded w-full"
            />
            <button
              onClick={handleSearchChats}
              className="bg-blue-500 text-white p-2 rounded w-full"
            >
              Search
            </button>
          </div>

          {/* Toggle History */}
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="flex items-center gap-2 p-2 hover:bg-gray-200 rounded"
          >
            🕘 History
          </button>

          {/* Chat list: show search results if searching, otherwise history */}
          {(showHistory || searchResults.length > 0) && (
            <div className="overflow-y-auto mt-2 max-h-80 flex flex-col gap-1">
              {searchResults.length > 0
                ? searchResults.map((chat) => (
                    <button
                      key={chat.id}
                      className="flex items-center justify-between w-full p-2 hover:bg-gray-300 rounded"
                      onClick={() => {
                        loadChat(chat.id);
                        setSearchResults([]);
                        setSearchQuery("");
                      }}
                    >
                      {chat.title || `Chat ${chat.id}`}
                    </button>
                  ))
                : chats.map((chat) => (
                    <button
                      key={chat.id}
                      className="flex items-center justify-between w-full p-2 hover:bg-gray-300 rounded"
                      onClick={() => loadChat(chat.id)}
                    >
                      {chat.title || `Chat ${chat.id}`}
                    </button>
                  ))}
            </div>
          )}
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col items-center justify-start p-6">
          <div className="w-full max-w-md bg-black rounded-xl shadow-md overflow-hidden flex flex-col">
            {/* Messages */}
            <div className="p-4 overflow-y-auto flex flex-col gap-2 h-[600px]">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`p-2 rounded-md ${
                    msg.type === "user"
                      ? "bg-gray-800 text-white self-end"
                      : "bg-gray-700 text-white self-start"
                  }`}
                >
                  {msg.text}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Sticky Input */}
            <div className="flex border-t border-gray-700 sticky bottom-0 bg-black">
              <input
                type="text"
                placeholder="Type your message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSend();
                }}
                className="flex-1 p-3 bg-gray-800 text-white placeholder-gray-400 focus:outline-none rounded-bl-xl"
              />
              <button
                onClick={handleSend}
                className="px-4 bg-blue-500 hover:bg-blue-600 transition text-white rounded-br-xl"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
3