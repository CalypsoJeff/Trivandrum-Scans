import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import ProfileSidebar from "../../components/UserComponents/ProfileSidebar";
import { selectUser } from "../../features/auth/authSlice";
import { useSocket } from "../../services/socketProvider";
import { updateMessageStatus } from "../../features/chat/chatSlice";
import { uploadFileToS3 } from "../../utils/s3Uploader";

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const [chatId, setChatId] = useState(null);
  const [typing, setTyping] = useState(false);
  const [, setOnline] = useState(false); // Online status state
  const [adminOnline, setAdminOnline] = useState(false); // Track admin online status
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const { socket } = useSocket();
  const userId = user.id;
  const messagesEndRef = useRef(null);
  const adminId = "66ee588d1e1448fbea1f40bb";
  useEffect(() => {
    getChatId();
  }, []);

  useEffect(() => {
    if (chatId) fetchMessages();
  }, [chatId]);

  useEffect(() => {
    if (socket && chatId) {
      socket.emit("join_room", chatId);
      socket.emit("get_online_status", { userId, adminId });

      // Listen for online status updates for both user and admin
      socket.on("online_status_update", (data) => {
        if (data.userId === userId) setOnline(data.status === "online");
        if (data.adminId === adminId) setAdminOnline(data.status === "online");
      });

      socket.on("receiveMessage", (newMessage) => {
        setMessages((prev) => [...prev, newMessage]);
        socket.emit("messageRead", { roomId: chatId, userId });
      });

      socket.on("typing", (data) => {
        if (data.roomId === chatId) {
          setTyping(true);
          setTimeout(() => setTyping(false), 2000);
        }
      });

      if (socket) {
        const handleMessageStatusUpdate = ({ messageId, status }) => {
          setMessages((prevMessages) =>
            prevMessages.map((msg) =>
              msg._id === messageId ? { ...msg, status } : msg
            )
          );
        };

        socket.on("messageStatusUpdate", handleMessageStatusUpdate);

        return () => {
          socket.off("messageStatusUpdate", handleMessageStatusUpdate);
        };
      }
      socket.emit("messageRead", { roomId: chatId, userId });
      return () => {
        console.log("User Chat component is unmounting.");
        socket.emit("leave_room", chatId);
        socket.off("receiveMessage");
        socket.off("typing");
        socket.off("online_status_update");
        socket.emit("custom_disconnect", userId);
      };
    }
  }, [socket, chatId, userId, adminId]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
      setSelectedFile(file);
    }
  };

  const handleSendWithFile = () => {
    if (selectedFile) {
      handleSendMessage(selectedFile);
      setImagePreview(null);
      setSelectedFile(null);
    } else {
      handleSendMessage();
    }
  };
  useEffect(() => {
    if (socket) {
      socket.on("messageStatusUpdate", ({ messageId, status }) => {
        dispatch(updateMessageStatus({ messageId, status }));
      });
      return () => {
        socket.off("messageStatusUpdate");
      };
    }
  }, [socket, dispatch]);

  useEffect(() => {
    if (socket && chatId && messageInput) {
      const typingTimeout = setTimeout(
        () => socket.emit("typing", { roomId: chatId, userId }),
        500
      );
      return () => clearTimeout(typingTimeout);
    }
  }, [messageInput, socket, chatId, userId]);
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const getChatId = async () => {
    try {
      const response = await axios.get(
        `https://trivandrumscans.online/api/users/messages/chat/start/${userId}`
      );
      setChatId(response.data.chat._id);
    } catch (error) {
      console.error("Error fetching chat ID:", error);
    }
  };

  const fetchMessages = async () => {
    try {
      const response = await axios.get(
        `https://trivandrumscans.online/api/users/messages/chat/${chatId}/messages`
      );
      setMessages(response.data.messages);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  useEffect(() => {
    if (socket) {
      socket.emit("user_connected", userId);

      return () => {
        socket.emit("custom_disconnect", userId); // Custom event for cleanup
      };
    }
  }, [socket, userId]);

  const handleSendMessage = async (file = null) => {
    if (!messageInput.trim() && !file) {
      console.error("Message not sent: input is empty or no file selected.");
      return;
    }

    if (!socket || !socket.connected) {
      console.error("Socket is disconnected. Message not sent.");
      return;
    }

    let fileUrl = null;
    if (file) {
      try {
        fileUrl = await uploadFileToS3(file);
        console.log("File uploaded successfully:", fileUrl);
      } catch (error) {
        console.error("Failed to upload file:", error);
        return;
      }
    }

    const messageData = {
      _id: new Date().getTime().toString(),
      chatId,
      sender: userId,
      senderModel: "User",
      content: fileUrl || messageInput.trim(),
      createdAt: new Date().toISOString(),
      type: file ? "image" : "text",
      status: "sent",
    };

    setMessageInput(""); // Clear text input
    socket.emit("sendMessage", messageData, (ack) => {
      if (!ack?.success) {
        console.error("Message failed to send.");
      }
    });
  };

  useEffect(() => {
    if (socket && chatId) {
      socket.on("receiveMessage", (newMessage) => {
        setMessages((prevMessages) => {
          const exists = prevMessages.some((msg) => msg._id === newMessage._id);
          return exists ? prevMessages : [...prevMessages, newMessage];
        });
        socket.emit("messageRead", { roomId: chatId, userId });
      });

      return () => {
        socket.off("receiveMessage");
      };
    }
  }, [socket, chatId, userId]);

  function formatTimestamp(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  }

  function formatDateSeparator(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <ProfileSidebar />

      <div className="flex-1 pl-64">
        <div className="w-full h-screen bg-white rounded-lg shadow-lg flex flex-col">
          <h2 className="text-xl font-semibold text-center py-4 border-b">
            Chat with Admin{" "}
            <span className="ml-2 text-sm font-normal text-gray-500">
              {adminOnline ? "Online" : "Offline"}
            </span>
          </h2>

          <div className="flex-1 overflow-y-auto space-y-4 p-4 border-b border-gray-200">
            {messages.map((msg, index) => {
              const showDateSeparator =
                index === 0 ||
                new Date(messages[index - 1].createdAt).toDateString() !==
                  new Date(msg.createdAt).toDateString();

              return (
                <React.Fragment key={msg._id}>
                  {/* Date Separator */}
                  {showDateSeparator && (
                    <div className="flex items-center my-4">
                      <div className="flex-grow border-t border-gray-300"></div>
                      <span className="mx-3 text-gray-500 text-sm">
                        {formatDateSeparator(msg.createdAt)}
                      </span>
                      <div className="flex-grow border-t border-gray-300"></div>
                    </div>
                  )}

                  {/* Message Bubble */}
                  <div
                    className={`flex ${
                      msg.senderModel === "Admin" ? "" : "flex-row-reverse"
                    } items-start space-x-3`}
                  >
                    {/* Sender Avatar */}
                    <img
                      src={
                        msg.senderModel === "Admin"
                          ? "https://mdbcdn.b-cdn.net/img/Photos/Avatars/avatar-1.webp"
                          : "https://mdbcdn.b-cdn.net/img/Photos/Avatars/avatar-2.webp"
                      }
                      alt={`${msg.senderModel.toLowerCase()}-avatar`}
                      className="rounded-full w-10 h-10"
                    />

                    {/* Message Bubble */}
                    <div
                      className={`max-w-2xl p-3 rounded-lg shadow-md break-words ${
                        msg.senderModel === "Admin"
                          ? "bg-gray-200"
                          : "bg-blue-500 text-white"
                      }`}
                    >
                      {/* Sender Name and Timestamp */}
                      <div className="flex justify-between items-center">
                        <p className="text-sm font-semibold">
                          {msg.senderModel === "Admin" ? "Admin" : "You"}
                        </p>
                        <p
                          className={`text-xs ml-2 ${
                            msg.senderModel === "Admin"
                              ? "text-gray-500"
                              : "text-white opacity-75"
                          }`}
                        >
                          {formatTimestamp(msg.createdAt)}
                        </p>
                      </div>

                      {/* Message Content */}
                      {msg.fileType === "image" ? (
                        <img
                          src={msg.content} // Use content as the src for the image
                          alt="Chat image"
                          className="mt-2 rounded-lg max-w-full max-h-60 object-contain"
                        />
                      ) : (
                        <p className="text-sm">{msg.content}</p> // Render text content for non-image messages
                      )}

                      {/* Status Indicator */}
                      {msg.senderModel !== "Admin" && (
                        <div className="flex justify-end mt-1">
                          <span
                            className={`text-xs font-medium ${
                              msg.read
                                ? "text-green-500"
                                : msg.delivered
                                ? "text-blue-500"
                                : "text-gray-500"
                            }`}
                          >
                            {msg.read
                              ? "Read ✔✔"
                              : msg.delivered
                              ? "Delivered ✔"
                              : "Sent ⏳"}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </React.Fragment>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {typing && (
            <p className="text-sm text-gray-500 px-4 py-2">
              Admin is typing...
            </p>
          )}

          <div className="p-4 border-t flex items-center space-x-3">
            {/* File Upload Preview */}
            {imagePreview && (
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="h-20 w-20 object-cover rounded-lg"
                />
                <button
                  onClick={() => {
                    setImagePreview(null);
                    setSelectedFile(null);
                  }}
                  className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full"
                >
                  ✕
                </button>
              </div>
            )}

            {/* File Input */}
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              id="image-upload"
            />
            <label
              htmlFor="image-upload"
              className="bg-gray-200 px-4 py-2 rounded-lg cursor-pointer hover:bg-gray-300"
            >
              Upload Image
            </label>

            {/* Text Input */}
            <textarea
              placeholder="Type your message..."
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendWithFile();
                }
              }}
              className="flex-1 p-3 rounded-lg border border-gray-300 focus:ring focus:ring-blue-200 resize-none"
              rows={2}
            />
            <button
              onClick={handleSendWithFile}
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
