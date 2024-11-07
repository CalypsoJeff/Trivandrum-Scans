import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { selectUser } from "../../features/auth/authSlice";
import ProfileSidebar from "../../components/UserComponents/ProfileSidebar";
import io from "socket.io-client";

// Singleton pattern for the socket connection
const socket = io("http://localhost:5000", { autoConnect: false });

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const [chatId, setChatId] = useState(null);
  const user = useSelector(selectUser);
  const userId = user.id;
  const apiBaseUrl = "/api/users/messages";

  useEffect(() => {
    getChatId();
  }, []);

  useEffect(() => {
    if (chatId) {
      fetchMessages();
      socket.connect();
      socket.emit("joinChat", chatId); // Join the chat room if `chatId` is defined

      // Listen for new messages from the server only once
      const handleMessage = (newMessage) => {
        setMessages((prevMessages) => {
          const isDuplicate = prevMessages.some((msg) => msg._id === newMessage._id);
          if (!isDuplicate) {
            return [...prevMessages, newMessage];
          }
          return prevMessages;
        });
      };

      socket.on("receiveMessage", handleMessage);

      // Cleanup listener and disconnect socket on component unmount or when `chatId` changes
      return () => {
        socket.off("receiveMessage", handleMessage);
        socket.disconnect();
      };
    }
  }, [chatId]);

  // Fetch chat ID
  const getChatId = async () => {
    try {
      const response = await axios.get(`http://localhost:5000${apiBaseUrl}/chat/start/${userId}`);
      setChatId(response.data.chat._id);
    } catch (error) {
      console.error("Error fetching chat ID:", error);
    }
  };

  // Fetch initial messages for the chat
  const fetchMessages = async () => {
    if (!chatId) return;
    try {
      const response = await axios.get(`http://localhost:5000${apiBaseUrl}/chat/${chatId}/messages`);
      setMessages(response.data.messages);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  // Send message to the server
  const sendMessage = () => {
    if (messageInput.trim() && chatId) {
      const messageData = {
        chatId,
        sender: userId,
        senderModel: "User",
        content: messageInput,
      };

      // Emit the message to the server via Socket.IO
      socket.emit("sendMessage", messageData);

      // Optimistically add the message to the UI with a temporary ID
      setMessages((prevMessages) => [
        ...prevMessages,
        { ...messageData, _id: Date.now().toString(), isLocal: true },
      ]);
      setMessageInput("");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <ProfileSidebar />

      <div className="flex-1 flex justify-center items-center p-5">
        <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg p-5 flex flex-col h-full">
          <div className="flex-1 overflow-y-auto space-y-4 p-3 border-b border-gray-200">
            {messages.map((msg) => (
              <div
                key={msg._id}
                className={`flex ${msg.senderModel === "Admin" ? "" : "flex-row-reverse"} items-start space-x-3`}
              >
                <img
                  src={
                    msg.senderModel === "Admin"
                      ? "https://mdbcdn.b-cdn.net/img/Photos/Avatars/avatar-1.webp"
                      : "https://mdbcdn.b-cdn.net/img/Photos/Avatars/avatar-2.webp"
                  }
                  alt={`${msg.senderModel.toLowerCase()}-avatar`}
                  className="rounded-full w-10 h-10"
                />
                <div
                  className={`max-w-xs p-3 rounded-lg ${
                    msg.senderModel === "Admin" ? "bg-gray-200" : "bg-blue-500 text-white"
                  }`}
                >
                  <p className="text-sm font-semibold">
                    {msg.senderModel === "Admin" ? "Admin" : "You"}
                  </p>
                  <p className="text-sm">{msg.content}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4">
            <textarea
              placeholder="Type your message..."
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              className="w-full p-3 rounded-lg border border-gray-300 focus:ring focus:ring-blue-200"
              rows={3}
            />
            <button
              onClick={sendMessage}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg mt-2 hover:bg-blue-600 transition-colors w-full"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
