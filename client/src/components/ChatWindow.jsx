import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";

export default function ChatWindow({ messages, setMessages, user }) {
  return (
    <div className="flex flex-col w-full max-w-md h-[600px] mx-auto border-2 border-amber-200 rounded-lg bg-white text-gray-800">
      <div className="text-center font-bold p-3 bg-gradient-to-r from-emerald-700 to-teal-600 border-b border-emerald-300 text-white">
        {user ? `Logged in as ${user.firstName}` : "Guest"}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-amber-50">
        {messages.map((msg, index) => (
          <ChatMessage key={index} role={msg.role} message={msg.message} />
        ))}
      </div>

      <ChatInput messages={messages} setMessages={setMessages} user={user} />
    </div>
  );
}
