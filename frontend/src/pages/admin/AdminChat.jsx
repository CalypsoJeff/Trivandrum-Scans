import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import axiosInstance from "../../services/axiosInstance";
import { selectAdmin } from "../../features/admin/adminslice";
import io from "socket.io-client";
import Sidebar from "../../components/AdminComponents/Sidebar";

// Initialize socket connection
const socket = io("http://localhost:5000", { autoConnect: false });

export default function AdminChat() {
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const { chatId } = useParams();
  const admin = useSelector(selectAdmin);
  const adminId = admin?._id;

  useEffect(() => {
    if (chatId) {
      fetchMessages(chatId);
      socket.connect();
      socket.emit("joinChat", chatId);

      socket.on("receiveMessage", (newMessage) => {
        if (newMessage.chat === chatId) {
          setMessages((prevMessages) => [...prevMessages, newMessage]);
        }
      });

      return () => {
        socket.off("receiveMessage");
        socket.emit("leaveChat", chatId);
        socket.disconnect();
      };
    }
  }, [chatId]);

  const fetchMessages = async (selectedChatId) => {
    try {
      const response = await axiosInstance.get(`/messages/chat/${selectedChatId}/messages`);
      setMessages(response.data.messages);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const sendMessage = () => {
    if (messageInput.trim() && chatId) {
      const messageData = {
        chatId,
        sender: adminId,
        senderModel: "Admin",
        content: messageInput,
      };

      socket.emit("sendMessage", messageData);
      setMessages((prevMessages) => [...prevMessages, messageData]);
      setMessageInput("");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar fixed in place */}
      <Sidebar />

      {/* Main Chat Area */}
      <div className="flex-1 flex justify-center items-center p-5"> {/* Removed ml-64 for full coverage */}
        <div className="w-full max-w-3xl bg-white rounded-lg shadow-lg p-6 flex flex-col h-full">
          <h2 className="text-xl font-semibold mb-6 text-center border-b pb-4">Admin Chat</h2>
          
          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto space-y-4 p-4 border-b border-gray-200">
            {messages.map((msg, index) => (
              <div
                key={msg._id || index}
                className={`flex ${
                  msg.senderModel === "User" ? "" : "flex-row-reverse"
                } items-start space-x-3`}
              >
                <img
                  src={
                    msg.senderModel === "User"
                      ? "https://mdbcdn.b-cdn.net/img/Photos/Avatars/avatar-2.webp"
                      : "https://mdbcdn.b-cdn.net/img/Photos/Avatars/avatar-1.webp"
                  }
                  alt={`${msg.senderModel.toLowerCase()}-avatar`}
                  className="rounded-full w-10 h-10"
                />
                <div
                  className={`max-w-xs p-3 rounded-lg shadow-md ${
                    msg.senderModel === "User" ? "bg-gray-200" : "bg-blue-500 text-white"
                  }`}
                >
                  <p className="text-sm font-semibold">{msg.senderModel === "User" ? "User" : "Admin"}</p>
                  <p className="text-sm mt-1">{msg.content}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Message Input */}
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
