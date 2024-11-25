import React, { useState, useEffect, useRef } from "react";
import { useLocation, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useSocket } from "../../services/socketProvider";
import { selectAdmin } from "../../features/admin/adminSlice";
import Sidebar from "../../components/AdminComponents/Sidebar";
import { fetchChatMessages } from "../../services/adminService";

export default function AdminChat() {
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [online, setOnline] = useState(false); // Online status state
  const [, setAdminOnline] = useState(false); // Track admin online status
  const location = useLocation();
  const { chatId } = useParams();
  const admin = useSelector(selectAdmin);
  const adminId = admin?._id;

  const { socket } = useSocket();
  const messagesEndRef = useRef(null);
  const { userId, userName } = location.state;

  // Fetch chat messages when chatId is available
  useEffect(() => {
    if (chatId) {
      fetchMessages(chatId);
      socket.connect();
      socket.emit("join_room", chatId);
      socket.emit("get_online_status", { userId, adminId });

      // Unified handler for online status updates
      socket.on("online_status_update", (data) => {
        if (data.userId === userId) setOnline(data.status === "online");
        if (data.adminId === adminId) setAdminOnline(data.status === "online");
      });

      // Handle receiving new messages from server
      socket.on("receiveMessage", (newMessage) => {
        if (newMessage.chat === chatId) {
          setMessages((prevMessages) => [...prevMessages, newMessage]);
        }
      });

      // Handle typing indicator
      socket.on("typing", (data) => {
        if (data.roomId === chatId) {
          setTyping(true);
          setTimeout(() => setTyping(false), 2000); // Reset typing after 2 seconds
        }
      });

      // Cleanup on component unmount
      return () => {
        console.log("AdminChat component is unmounting.");
        socket.emit("leave_room", chatId);
        socket.off("receiveMessage");
        socket.off("typing");
        socket.off("online_status_update");
        socket.emit("custom_disconnect", adminId);
      };
    }
  }, [socket, userId, chatId, adminId]);

  // Scroll to the bottom of messages on new message
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Fetch initial messages from the server
  const fetchMessages = async (selectedChatId) => {
    try {
      const messages = await fetchChatMessages(selectedChatId);
      setMessages(messages);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const sendMessage = () => {
    if (messageInput.trim() && socket) {
      if (!socket.connected) {
        console.error("Socket is disconnected. Message not sent.");
        return;
      }

      const messageData = {
        chatId,
        sender: adminId,
        senderModel: "Admin",
        content: messageInput.trim(),
        createdAt: new Date().toISOString(),
      };

      setMessageInput(""); // Clear input immediately after sending

      // Emit the message to the server
      socket.emit("sendMessage", messageData, (ack) => {
        if (ack?.success) {
          setMessages((prevMessages) => [
            ...prevMessages,
            { ...messageData, timestamp: new Date() },
          ]);
        } else {
          console.error("Message not acknowledged by server");
          setMessageInput(messageData.content); // Optionally restore the message if sending failed
        }
      });
    }
  };

  useEffect(() => {
    if (socket && adminId) {
      socket.emit("admin_connected", adminId); // Notify the server of the admin's presence

      return () => {
        socket.emit("custom_disconnect", adminId); // Custom event to avoid conflict with reserved `disconnect`
      };
    }
  }, [socket, adminId]);

  // Handle typing event
  useEffect(() => {
    if (socket && chatId && messageInput) {
      const typingTimeout = setTimeout(() => {
        socket.emit("typing", { roomId: chatId, userId: adminId });
      }, 500);

      return () => clearTimeout(typingTimeout);
    }
  }, [messageInput, socket, chatId, adminId]);

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
      <div className="fixed left-0 top-0 h-screen w-64 bg-white shadow-lg z-10">
        <Sidebar />
      </div>

      <div className="flex-1 ml-64 p-6">
        <div className="bg-white rounded-lg shadow-lg flex flex-col h-[calc(100vh-48px)]">
          <h2 className="text-xl font-semibold text-center py-4 border-b">
            Chat with {userName}{" "}
            <span className="ml-2 text-sm font-normal text-gray-500">
              {online ? "Online" : "Offline"}
            </span>
          </h2>

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
                  {showDateSeparator && (
                    <div className="flex items-center my-4">
                      <div className="flex-grow border-t border-gray-300"></div>
                      <span className="mx-3 text-gray-500 text-sm">
                        {formatDate(msg.createdAt)}
                      </span>
                      <div className="flex-grow border-t border-gray-300"></div>
                    </div>
                  )}

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
                      className={`max-w-xs p-3 rounded-lg shadow-md break-words ${
                        msg.senderModel === "User"
                          ? "bg-gray-200"
                          : "bg-blue-500 text-white"
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <p className="text-sm font-semibold">
                          {msg.senderModel === "User" ? userName : "Admin"}
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
            <div ref={messagesEndRef} />
          </div>

          {typing && (
            <p className="text-sm text-gray-500 px-4 py-2">User is typing...</p>
          )}

          {/* Message Input */}
          <div className="p-4 border-t flex items-center space-x-3">
            <textarea
              placeholder="Type your message..."
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              className="flex-1 p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring focus:ring-blue-200 resize-none"
              style={{ maxHeight: "120px" }}
              rows={2}
            />
            <button
              onClick={sendMessage}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
