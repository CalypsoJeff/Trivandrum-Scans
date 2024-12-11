// import React, { useState, useEffect, useRef } from "react";
// import axios from "axios";
// import { useDispatch, useSelector } from "react-redux";
// import ProfileSidebar from "../../components/UserComponents/ProfileSidebar";
// import { selectUser } from "../../features/auth/authSlice";
// import { useSocket } from "../../services/socketProvider";
// import { resetUnreadCount } from "../../features/chat/chatSlice";

// export default function Chat() {
//   const [messages, setMessages] = useState([]);
//   const [messageInput, setMessageInput] = useState("");
//   const [chatId, setChatId] = useState(null);
//   const [typing, setTyping] = useState(false);
//   const [unreadCounts, setUnreadCounts] = useState(0); // Track unread counts
//   const [adminOnline, setAdminOnline] = useState(false); // Track admin online status
//   const user = useSelector(selectUser);
//   const dispatch = useDispatch();
//   const { socket } = useSocket();
//   const userId = user.id;
//   const apiBaseUrl = "/api/users/messages";
//   const messagesEndRef = useRef(null);
//   const adminId = "66ee588d1e1448fbea1f40bb";

//   useEffect(() => {
//     getChatId();
//   }, []);

//   useEffect(() => {
//     if (chatId) fetchMessages();
//   }, [chatId]);

//   useEffect(() => {
//     if (socket && chatId) {
//       socket.emit("join_room", chatId);
//       socket.emit("get_online_status", { userId, adminId });

//       // Listen for server events
//       socket.on("online_status_update", (data) => {
//         if (data.adminId === adminId) {
//           setAdminOnline(data.status === "online");
//         }
//       });

//       socket.on("receiveMessage", (newMessage) => {
//         setMessages((prev) => [...prev, newMessage]);
//         socket.emit("messageRead", { chatId, userId });
//       });

//       socket.on("typing", (data) => {
//         if (data.roomId === chatId) {
//           setTyping(true);
//           setTimeout(() => setTyping(false), 2000);
//         }
//       });

//       socket.on("unreadCount", (data) => {
//         if (data.chatId === chatId) {
//           setUnreadCounts(data.unreadCounts);
//         }
//       });

//       // Mark messages as read and reset unread count
//       socket.emit("messageRead", { chatId, userId });
//       dispatch(resetUnreadCount({ chatId }));

//       return () => {
//         socket.emit("leave_room", chatId);
//         socket.off("receiveMessage");
//         socket.off("typing");
//         socket.off("online_status_update");
//         socket.off("unreadCount");
//       };
//     }
//   }, [socket, chatId, userId, adminId]);

//   useEffect(() => {
//     if (socket && chatId && messageInput) {
//       const typingTimeout = setTimeout(
//         () => socket.emit("typing", { roomId: chatId, userId }),
//         500
//       );
//       return () => clearTimeout(typingTimeout);
//     }
//   }, [messageInput, socket, chatId, userId]);

//   useEffect(() => {
//     if (messagesEndRef.current) {
//       messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
//     }
//   }, [messages]);

//   const getChatId = async () => {
//     try {
//       const response = await axios.get(
//         `http://localhost:5000${apiBaseUrl}/chat/start/${userId}`
//       );
//       setChatId(response.data.chat._id);
//     } catch (error) {
//       console.error("Error fetching chat ID:", error);
//     }
//   };

//   const fetchMessages = async () => {
//     try {
//       const response = await axios.get(
//         `http://localhost:5000${apiBaseUrl}/chat/${chatId}/messages`
//       );
//       setMessages(response.data.messages);
//     } catch (error) {
//       console.error("Error fetching messages:", error);
//     }
//   };

//   const handleSendMessage = () => {
//     if (messageInput.trim() && socket) {
//       const messageData = {
//         chatId,
//         sender: userId,
//         senderModel: "User",
//         content: messageInput.trim(),
//         createdAt: new Date().toISOString(),
//       };

//       setMessageInput("");
//       socket.emit("sendMessage", messageData, (ack) => {
//         if (ack?.success) {
//           setMessages((prevMessages) => [
//             ...prevMessages,
//             { ...messageData, timestamp: new Date() },
//           ]);
//         }
//       });
//     }
//   };

//   function formatTimestamp(timestamp) {
//     const date = new Date(timestamp);
//     return date.toLocaleTimeString("en-US", {
//       hour: "2-digit",
//       minute: "2-digit",
//       hour12: true,
//     });
//   }

//   function formatDateSeparator(timestamp) {
//     const date = new Date(timestamp);
//     return date.toLocaleDateString("en-US", {
//       weekday: "long",
//       month: "short",
//       day: "numeric",
//       year: "numeric",
//     });
//   }

//   return (
//     <div className="flex min-h-screen bg-gray-100">
//       <ProfileSidebar />

//       <div className="flex-1 pl-64">
//         <div className="w-full h-screen bg-white rounded-lg shadow-lg flex flex-col">
//           <h2 className="text-xl font-semibold text-center py-4 border-b">
//             Chat with Admin{" "}
//             <span className="ml-2 text-sm font-normal text-gray-500">
//               {adminOnline ? "Online" : "Offline"}
//             </span>
//             {unreadCounts > 0 && (
//               <span className="ml-4 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
//                 {unreadCounts} unread
//               </span>
//             )}
//           </h2>

//           <div className="flex-1 overflow-y-auto space-y-4 p-4 border-b border-gray-200">
//             {messages.map((msg, index) => {
//               const showDateSeparator =
//                 index === 0 ||
//                 new Date(messages[index - 1].createdAt).toDateString() !==
//                   new Date(msg.createdAt).toDateString();

//               return (
//                 <React.Fragment key={msg._id}>
//                   {showDateSeparator && (
//                     <div className="flex items-center my-4">
//                       <div className="flex-grow border-t border-gray-300"></div>
//                       <span className="mx-3 text-gray-500 text-sm">
//                         {formatDateSeparator(msg.createdAt)}
//                       </span>
//                       <div className="flex-grow border-t border-gray-300"></div>
//                     </div>
//                   )}
//                   <div
//                     className={`flex ${
//                       msg.senderModel === "Admin" ? "" : "flex-row-reverse"
//                     } items-start space-x-3`}
//                   >
//                     <img
//                       src={
//                         msg.senderModel === "Admin"
//                           ? "https://mdbcdn.b-cdn.net/img/Photos/Avatars/avatar-1.webp"
//                           : "https://mdbcdn.b-cdn.net/img/Photos/Avatars/avatar-2.webp"
//                       }
//                       alt={`${msg.senderModel.toLowerCase()}-avatar`}
//                       className="rounded-full w-10 h-10"
//                     />
//                     <div
//                       className={`max-w-2xl p-3 rounded-lg shadow-md break-words ${
//                         msg.senderModel === "Admin"
//                           ? "bg-gray-200"
//                           : "bg-blue-500 text-white"
//                       }`}
//                     >
//                       <div className="flex justify-between items-center">
//                         <p className="text-sm font-semibold">
//                           {msg.senderModel === "Admin" ? "Admin" : "You"}
//                         </p>
//                         <p
//                           className={`text-xs ml-2 ${
//                             msg.senderModel === "Admin"
//                               ? "text-gray-500"
//                               : "text-white opacity-75"
//                           }`}
//                         >
//                           {formatTimestamp(msg.createdAt)}
//                         </p>
//                       </div>
//                       <p className="text-sm">{msg.content}</p>
//                     </div>
//                   </div>
//                 </React.Fragment>
//               );
//             })}
//             <div ref={messagesEndRef} />
//           </div>

//           {typing && (
//             <p className="text-sm text-gray-500 px-4 py-2">
//               Admin is typing...
//             </p>
//           )}

//           <div className="p-4 border-t flex items-center space-x-3">
//             <textarea
//               placeholder="Type your message..."
//               value={messageInput}
//               onChange={(e) => setMessageInput(e.target.value)}
//               onKeyDown={(e) => {
//                 if (e.key === "Enter" && !e.shiftKey) {
//                   e.preventDefault();
//                   handleSendMessage();
//                 }
//               }}
//               className="flex-1 p-3 rounded-lg border border-gray-300 focus:ring focus:ring-blue-200 resize-none"
//               rows={2}
//             />
//             <button
//               onClick={handleSendMessage}
//               className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
//             >
//               Send
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import ProfileSidebar from "../../components/UserComponents/ProfileSidebar";
import { selectUser } from "../../features/auth/authSlice";
import { useSocket } from "../../services/socketProvider";
import { updateMessageStatus } from "../../features/chat/chatSlice";

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const [chatId, setChatId] = useState(null);
  const [typing, setTyping] = useState(false);
  const [, setOnline] = useState(false); // Online status state
  const [adminOnline, setAdminOnline] = useState(false); // Track admin online status
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const { socket } = useSocket();
  const userId = user.id;
  const apiBaseUrl = "/api/users/messages";
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

      socket.on("online_status", (data) => {
        if (data.adminId === adminId) {
          setAdminOnline(data.status === "online");
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
      // dispatch(resetUnreadCount());

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
        // `http://localhost:5000${apiBaseUrl}/chat/start/${userId}`
        `http://localhost:5000/api/users/messages/chat/start/${userId}`
      );
      setChatId(response.data.chat._id);
    } catch (error) {
      console.error("Error fetching chat ID:", error);
    }
  };

  const fetchMessages = async () => {
    try {
      const response = await axios.get(
        // `http://localhost:5000${apiBaseUrl}/chat/${chatId}/messages`
        `http://localhost:5000/api/users/messages/chat/${chatId}/messages`
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

  const handleSendMessage = () => {
    if (messageInput.trim() && socket) {
      if (!socket.connected) {
        console.error("Socket is disconnected. Message not sent.");
        return;
      }

      const messageData = {
        _id: new Date().getTime().toString(), // Temporary unique ID
        chatId,
        sender: userId,
        senderModel: "User",
        content: messageInput.trim(),
        createdAt: new Date().toISOString(),
        status: "sent",
      };

      // Clear input immediately to enhance user experience
      setMessageInput("");
      socket.emit("sendMessage", messageData, (ack) => {
        if (!ack?.success) {
          console.error("Message failed to send, retrying...");
          // Revert the optimistic update
          setMessages((prevMessages) =>
            prevMessages.filter((msg) => msg._id !== messageData._id)
          );
          setMessageInput(messageData.content);
        }
      });
    } else {
      console.error("Message not sent: input is empty or socket disconnected.");
    }
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
                      <p className="text-sm">{msg.content}</p>

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
            <textarea
              placeholder="Type your message..."
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              className="flex-1 p-3 rounded-lg border border-gray-300 focus:ring focus:ring-blue-200 resize-none"
              rows={2}
            />
            <button
              onClick={handleSendMessage}
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
