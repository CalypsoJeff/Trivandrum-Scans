import React, { useState, useEffect, useRef } from "react";
import { useLocation, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectAdmin } from "../../features/admin/adminslice";
import io from "socket.io-client";
import Sidebar from "../../components/AdminComponents/Sidebar";
import { fetchChatMessages } from "../../services/adminService";

// Initialize socket connection
const socket = io("http://localhost:5000", { autoConnect: false });

export default function AdminChat() {
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const location = useLocation();
  const { chatId } = useParams();
  const admin = useSelector(selectAdmin);
  const adminId = admin?._id;
  const userName = location.state?.userName; // Get userName from location state

  // Reference to the end of the messages container
  const messagesEndRef = useRef(null);

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

  // Scroll to the bottom of messages whenever they change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const fetchMessages = async (selectedChatId) => {
    try {
      const messages = await fetchChatMessages(selectedChatId);
      setMessages(messages);
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
        createdAt: new Date().toISOString(),
      };

      socket.emit("sendMessage", messageData);
      setMessageInput("");
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="flex min-h-screen bg-gray-100 overflow-hidden">
      {/* Sidebar fixed in place */}
      <div className="fixed left-0 top-0 h-screen w-64 bg-white shadow-lg z-10">
        <Sidebar />
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 ml-64 p-6">
        <div className="bg-white rounded-lg shadow-lg flex flex-col h-[calc(100vh-48px)]">
          <h2 className="text-xl font-semibold text-center py-4 border-b">
            Chat with {userName || "User"}
          </h2>

          {/* Chat Messages */}
          <div
            className="flex-1 overflow-y-auto p-4 space-y-4"
            style={{ maxHeight: "70vh" }}
          >
            {messages.map((msg, index) => {
              const showDateSeparator =
                index === 0 ||
                new Date(messages[index - 1].createdAt).toDateString() !==
                  new Date(msg.createdAt).toDateString();

              return (
                <React.Fragment key={msg._id || index}>
                  {/* Date Separator */}
                  {showDateSeparator && (
                    <div className="flex items-center my-4">
                      <div className="flex-grow border-t border-gray-300"></div>
                      <span className="mx-3 text-gray-500 text-sm">
                        {formatDate(msg.createdAt)}
                      </span>
                      <div className="flex-grow border-t border-gray-300"></div>
                    </div>
                  )}

                  {/* Message */}
                  <div
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
                        msg.senderModel === "User"
                          ? "bg-gray-200"
                          : "bg-blue-500 text-white"
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <p className="text-sm font-semibold">
                          {msg.senderModel === "User" ? userName || "User" : "Admin"}
                        </p>
                        <p
                          className={`text-xs ml-2 ${
                            msg.senderModel === "Admin"
                              ? "text-gray-300"
                              : "text-gray-500"
                          }`}
                        >
                          {formatTimestamp(msg.createdAt)}
                        </p>
                      </div>
                      <p className="text-sm mt-1">{msg.content}</p>
                    </div>
                  </div>
                </React.Fragment>
              );
            })}
            {/* Reference div to scroll to */}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <div className="p-4 border-t">
            <textarea
              placeholder="Type your message..."
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              className="w-full p-3 rounded-lg border border-gray-300 focus:ring focus:ring-blue-200 resize-none"
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
