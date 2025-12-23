import React, { useState, useEffect, useRef } from "react";
import { SignedIn, SignedOut, SignInButton, useUser } from "@clerk/clerk-react";
import axios from "axios";
import Footer from "../../components/footer/Footer";

// ---------------- HEADER ----------------
function ChatHeader() {
  const { user } = useUser();

  return (
    <div className="w-full bg-blue-600 text-white p-4 shadow-md flex justify-between items-center">
      <h1 className="text-xl font-bold">Chatbot</h1>

      <div>
        <SignedIn>
          <span className="mr-4">Hello, {user?.firstName || "User"}!</span>
        </SignedIn>

        <SignedOut>
          <SignInButton>Sign In</SignInButton>
        </SignedOut>
      </div>
    </div>
  );
}

// ---------------- SIDEBAR BUTTON ----------------
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

// ---------------- MAIN CHAT PAGE ----------------
export default function ChatPage() {
  const { user } = useUser();
  const userId = user?.id || null;

  const [chats, setChats] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(null);
  const [messages, setMessages] = useState([]);

  const [input, setInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  const messagesEndRef = useRef(null);

  // AUTO SCROLL
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // FETCH USER CHATS
  useEffect(() => {
    if (userId) fetchChats();
  }, [userId]);

  const fetchChats = async () => {
    try {
      const res = await axios.get(`/api/chat/history?user_id=${userId}`);
      setChats(res.data);
    } catch (error) {
      console.error("Error fetching chats", error);
    }
  };

  const loadChat = async (chatId) => {
    setCurrentChatId(chatId);
    setShowHistory(false);

    try {
      const res = await axios.get(`/api/chat/messages?chat_id=${chatId}`);
      setMessages(res.data);
    } catch (error) {
      console.error("Error loading chat", error);
    }
  };

  const handleNewChat = async () => {
    if (!userId) return alert("You must sign in first!");

    try {
      const res = await axios.post("/api/chat/new", { user_id: userId });
      const newChatId = res.data.chat_id;

      setCurrentChatId(newChatId);
      setMessages([]);
      fetchChats();
    } catch (error) {
      console.error("Error creating chat", error);
    }
  };

  // ---------------- SEND MESSAGE ----------------
  const handleSend = async () => {
    if (!input.trim() || !currentChatId) return;

    const userText = input;

    // 1. Show user message instantly
    setMessages((prev) => [...prev, { sender: "user", content: userText }]);
    setInput("");

    try {
      // 2. Save user message
      await axios.post("/api/chat/message", {
        chat_id: currentChatId,
        sender: "user",
        content: userText,
      });

      // 3. Request AI reply (auto reply)
      const reply = await axios.post("/api/chat/ai", {
        chat_id: currentChatId,
        message: userText,
      });

      const botText = reply.data.response;

      // 4. Show bot message in UI
      setMessages((prev) => [...prev, { sender: "bot", content: botText }]);

      // 5. Save bot message
      await axios.post("/api/chat/message", {
        chat_id: currentChatId,
        sender: "bot",
        content: botText,
      });
    } catch (error) {
      console.error("Error sending message", error);
    }
  };

  // ---------------- SEARCH ----------------
  const handleSearchChats = async () => {
    if (!searchQuery || !userId) return;

    try {
      const res = await axios.get(
        `/api/chat/search?user_id=${userId}&query=${encodeURIComponent(
          searchQuery
        )}`
      );
      setSearchResults(res.data);
    } catch (error) {
      console.error("Error searching chats", error);
    }
  };

  // ---------------- UI ----------------
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <ChatHeader />

      <div className="flex flex-1">
        {/* SIDEBAR */}
        <div className="w-64 bg-gray-100 h-screen p-4 flex flex-col gap-4">
          <SidebarButton icon="📝" label="New Chat" onClick={handleNewChat} />

          {/* Search */}
          <div className="flex flex-col gap-2">
            <input
              type="text"
              placeholder="Search chats..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="p-2 border rounded"
            />
            <button
              onClick={handleSearchChats}
              className="bg-blue-500 text-white p-2 rounded"
            >
              Search
            </button>
          </div>

          {/* History Toggle */}
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="flex items-center gap-2 p-2 hover:bg-gray-200 rounded"
          >
            🕘 History
          </button>

          {/* Chat List */}
          {(showHistory || searchResults.length > 0) && (
            <div className="mt-2 overflow-y-auto max-h-80 flex flex-col gap-1">
              {(searchResults.length > 0 ? searchResults : chats).map((chat) => (
                <button
                  key={chat.id}
                  onClick={() => loadChat(chat.id)}
                  className="p-2 bg-white hover:bg-gray-200 rounded text-left"
                >
                  {chat.title || `Chat ${chat.id}`}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* CHAT WINDOW */}
        <div className="flex-1 flex flex-col items-center justify-start p-6">
          <div className="w-full max-w-2xl bg-black rounded-xl shadow-lg flex flex-col">
            <div className="p-4 h-[600px] overflow-y-auto flex flex-col gap-2">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`p-2 rounded-md max-w-[75%] ${
                    msg.sender === "user"
                      ? "bg-gray-800 text-white self-end"
                      : "bg-gray-700 text-white self-start"
                  }`}
                >
                  {msg.content}
                </div>
              ))}

              <div ref={messagesEndRef} />
            </div>

            {/* INPUT BAR */}
            <div className="flex border-t border-gray-700 bg-black">
              <input
                type="text"
                placeholder="Type message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                className="flex-1 p-3 bg-gray-800 text-white rounded-bl-xl focus:outline-none"
              />
              <button
                onClick={handleSend}
                className="px-5 bg-blue-500 text-white rounded-br-xl hover:bg-blue-600"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
