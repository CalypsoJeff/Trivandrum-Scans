import React, { useState, useEffect, useRef } from "react";
import { MessageCircle, Search, Mail } from "lucide-react";
import { fetchChatList, fetchChatMessages } from "../../services/adminService";
import { useSocket } from "../../services/socketProvider";
import { useSelector } from "react-redux";
import { selectAdmin } from "../../features/admin/adminslice";
import Sidebar from "../../components/AdminComponents/Sidebar";
// import { debounce } from "lodash";

const Chat = () => {
  const [chatList, setChatList] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [typingUserName, setTypingUserName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [onlineStatus, setOnlineStatus] = useState({});
  const [online, setOnline] = useState(false);
  const adminId = useSelector(selectAdmin)?._id;
  const { socket } = useSocket();
  const messagesEndRef = useRef(null);

  // Fetch Chat List
  useEffect(() => {
    const getChatList = async () => {
      try {
        const chatData = await fetchChatList();
        const sortedChatData = chatData.sort(
          (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
        );
        setChatList(sortedChatData);

        if (socket) {
          chatData.forEach((chat) => {
            const user = chat.users.find((u) => u._id !== adminId);
            if (user) {
              console.log("Emitting get_online_status for:", user._id);
              socket.emit("get_online_status", { userId: user._id, adminId });
            }
          });
        } else {
          console.warn("Socket is not initialized yet.");
        }
      } catch (error) {
        console.error("Failed to load chat list:", error);
      }
    };

    if (socket) {
      getChatList();
    }
  }, [socket, adminId]);
  useEffect(() => {
    if (socket) {
      const handleNewMessage = async (newMessage) => {
        console.log("New message received:", newMessage);

        // Update messages if the message belongs to the selected chat
        if (selectedChat?._id === newMessage.chat) {
          setMessages((prev) => [...prev, newMessage]);
        }

        // Update chatList regardless of whether a chat is selected
        setChatList((prevChatList) => {
          const updatedChatList = prevChatList.map((chat) =>
            chat._id === newMessage.chat
              ? {
                  ...chat,
                  latestMessage: {
                    content: newMessage.content,
                    sender: newMessage.sender,
                  },
                  updatedAt: newMessage.createdAt,
                }
              : chat
          );

          // If the chat is not already in the list, add it (for newly created chats)
          const isChatInList = updatedChatList.some(
            (chat) => chat._id === newMessage.chat
          );
          if (!isChatInList) {
            updatedChatList.push({
              _id: newMessage.chat,
              latestMessage: {
                content: newMessage.content,
                sender: newMessage.sender,
              },
              updatedAt: newMessage.createdAt,
              users: [], // Add users if available, else leave empty
            });
          }

          // Re-sort the chat list by updatedAt
          return updatedChatList.sort(
            (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
          );
        });
      };

      // Global listener for new messages
      socket.on("receiveMessage", handleNewMessage);

      return () => {
        socket.off("receiveMessage", handleNewMessage);
      };
    }
  }, [socket, selectedChat]);

  // Handle socket events
  useEffect(() => {
    if (socket) {
      const handleOnlineStatusUpdate = (data) => {
        console.log("online_status_update received:", data);
        setOnlineStatus((prevStatus) => ({
          ...prevStatus,
          [data.userId]: data.status === "online",
        }));
      };

      socket.on("online_status_update", handleOnlineStatusUpdate);

      return () => {
        socket.off("online_status_update", handleOnlineStatusUpdate);
      };
    }
  }, [socket]);

  // Admin connection status
  useEffect(() => {
    if (socket && adminId) {
      socket.emit("admin_connected", adminId);

      return () => {
        socket.emit("admin_disconnected", adminId);
      };
    }
  }, [socket, adminId]);

  // Fetch messages for the selected chat
  const fetchMessages = async (chatId) => {
    try {
      const chatMessages = await fetchChatMessages(chatId);
      setMessages(chatMessages);
    } catch (error) {
      console.error("Error fetching chat messages:", error);
    }
  };
  // // Refetch chat list with debounce
  // const refetchChatList = debounce(async () => {
  //   try {
  //     const updatedChatList = await fetchChatList();
  //     const sortedChatList = updatedChatList.sort(
  //       (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
  //     );
  //     setChatList(sortedChatList);
  //   } catch (error) {
  //     console.error("Failed to refetch chat list:", error);
  //   }
  // }, 300);

  // Handle chat selection
  const handleChatSelect = (chat) => {
    if (selectedChat?._id === chat._id) return;
    setSelectedChat(chat);
    fetchMessages(chat._id);

    if (socket) {
      socket.emit("join_room", chat._id);

      const user = chat.users.find((u) => u._id !== adminId);
      const userId = user?._id;

      socket.emit("get_online_status", { userId, adminId });

      // Emit `messageRead` event
      if (chat && chat._id) {
        console.log("Emitting messageRead with chatId:", chat._id);
        socket.emit("messageRead", { chatId: chat._id, userId: adminId });
    } else {
        console.warn("chat._id is undefined or chat is null. Cannot emit messageRead.");
        console.log("chat:", chat); // Debug the chat object
    }
    

      socket.on("online_status_update", (data) => {
        if (data.userId === userId) setOnline(data.status === "online");
      });

      socket.on("typing", (data) => {
        if (data.roomId === chat._id) {
          setTyping(true);
          setTypingUserName(user?.name || "User");
          setTimeout(() => {
            setTyping(false);
            setTypingUserName("");
          }, 2000);
        }
      });

      return () => {
        socket.off("online_status_update");
        socket.off("receiveMessage");
        socket.off("typing");
      };
    }
  };

  // Handle sending a message
  const handleSendMessage = () => {
    if (messageInput.trim() && socket) {
      const messageData = {
        chatId: selectedChat._id,
        sender: adminId,
        senderModel: "Admin",
        content: messageInput.trim(),
        createdAt: new Date().toISOString(),
        status: "sent",
      };

      socket.emit("sendMessage", messageData, (ack) => {
        if (!ack?.success) {
          console.error("Message not acknowledged by server");
          setMessages((prevMessages) =>
            prevMessages.map((msg) =>
              msg.createdAt === messageData.createdAt
                ? { ...msg, status: "delivered" }
                : msg
            )
          );
        }
      });

      setMessageInput("");
    }
  };

  useEffect(() => {
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
  }, [socket]);

  // Emit typing event
  useEffect(() => {
    if (socket && selectedChat && messageInput) {
      const typingTimeout = setTimeout(() => {
        socket.emit("typing", { roomId: selectedChat._id, userId: adminId });
      }, 500);

      return () => clearTimeout(typingTimeout);
    }
  }, [messageInput, socket, selectedChat, adminId]);

  // Scroll to the bottom of the chat
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Filter chats based on the search query
  const filteredChats = chatList.filter((chat) => {
    const user = chat.users.find((u) => u._id !== adminId);
    return user?.name?.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="w-full md:w-80 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Messages</h2>
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search conversations..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <div className="overflow-y-auto flex-1">
          {filteredChats.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <Mail className="h-12 w-12 mb-2" />
              <p className="text-center">No conversations found</p>
            </div>
          ) : (
            <div className="space-y-1">
              {filteredChats.map((chat) => {
                const user = chat.users.find((u) => u._id !== adminId);
                const isSelected = selectedChat?._id === chat._id;
                const isOnline = onlineStatus[user?._id];

                return (
                  <div
                    key={chat._id}
                    className={`flex items-center p-4 cursor-pointer transition-colors duration-150 ${
                      isSelected
                        ? "bg-green-50 border-l-4 border-green-500"
                        : "hover:bg-gray-50"
                    }`}
                    onClick={() => handleChatSelect(chat)}
                  >
                    <div className="relative">
                      <img
                        src={
                          user?.avatar || "https://ui-avatars.com/api/?name=U"
                        }
                        alt={user?.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      {isOnline && (
                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                      )}
                    </div>
                    <div className="ml-4 flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <h3 className="font-medium text-gray-900 truncate">
                          {user?.name || "User"}
                        </h3>
                        <span className="text-xs text-gray-500">
                          {new Date(chat.updatedAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 truncate">
                        {chat.latestMessage?.content || "No messages yet"}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
      <div className="flex-1 flex flex-col bg-gray-50">
        {selectedChat ? (
          <>
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-800">
                Chat with{" "}
                {selectedChat.users.find((u) => u._id !== adminId)?.name ||
                  "User"}
              </h3>
              <span className="text-sm text-gray-500">
                {online ? "Online" : "Offline"}
              </span>
            </div>
            <div className="flex-1 overflow-y-auto overflow-x-hidden p-4">
              {messages.map((msg, index) => {
                const showDateSeparator =
                  index === 0 ||
                  new Date(messages[index - 1]?.createdAt).toDateString() !==
                    new Date(msg.createdAt).toDateString();

                return (
                  <React.Fragment key={msg._id}>
                    {/* Date Separator */}
                    {showDateSeparator && (
                      <div className="flex items-center my-4">
                        <div className="flex-grow border-t border-gray-300"></div>
                        <span className="mx-3 text-sm text-gray-500">
                          {new Date(msg.createdAt).toLocaleDateString("en-US", {
                            weekday: "long",
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                        <div className="flex-grow border-t border-gray-300"></div>
                      </div>
                    )}

                    {/* Message Bubble */}
                    <div
                      className={`flex ${
                        msg.sender === adminId ? "justify-end" : "justify-start"
                      } mb-2`}
                    >
                      <div
                        className={`p-3 rounded-lg shadow-md max-w-xs break-words ${
                          msg.sender === adminId
                            ? "bg-blue-500 text-white"
                            : "bg-gray-200"
                        }`}
                      >
                        {/* Message Content */}
                        <div>{msg.content}</div>

                        {/* Timestamp and Status */}
                        <div className="flex justify-between items-center text-xs mt-1">
                          {/* Timestamp */}
                          <span
                            className={`${
                              msg.sender === adminId
                                ? "text-blue-200"
                                : "text-gray-400"
                            }`}
                          >
                            {new Date(msg.createdAt).toLocaleTimeString(
                              "en-US",
                              {
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: true,
                              }
                            )}
                          </span>

                          {/* Status (Only for Sent Messages) */}
                          {msg.sender === adminId && (
                            <span
                              className={`ml-2 ${
                                msg.status === "read"
                                  ? "text-green-500"
                                  : msg.status === "delivered"
                                  ? "text-blue-500"
                                  : "text-gray-500"
                              }`}
                            >
                              {msg.status === "read"
                                ? "Read ✔✔"
                                : msg.status === "delivered"
                                ? "Delivered ✔"
                                : "Sent ⏳"}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </React.Fragment>
                );
              })}

              <div ref={messagesEndRef} />
            </div>
            {typing && (
              <div className="text-sm text-gray-500 p-4">
                {typingUserName} is typing...
              </div>
            )}
            <div className="p-4 border-t flex items-center space-x-3">
              <textarea
                placeholder="Type your message..."
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                className="flex-1 p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring focus:ring-green-500 resize-none"
                style={{
                  maxHeight: "120px",
                  overflowY: "auto",
                }}
                rows={2}
              />
              <button
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                onClick={handleSendMessage}
              >
                Send
              </button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <MessageCircle className="h-12 w-12 text-gray-400 mb-4" />
            <p>Select a chat to start messaging</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;
