import React, { useState, useEffect, useRef } from "react";
import axiosInstanceUser from "../../services/axiosInstanceUser";
import { useSelector } from "react-redux";
import { selectUser } from "../../features/auth/authSlice";
import { useSocket } from "../../services/socketProvider";
import EmojiPicker from "emoji-picker-react";
import { GrEmoji } from "react-icons/gr";
import { IoIosSend } from "react-icons/io";
import { IoAttachSharp } from "react-icons/io5";
import { format } from "date-fns";
import { MdDone, MdDoneAll } from "react-icons/md";
// import { PiDotsThreeCircleVerticalBold } from "react-icons/pi";
// import { FaMicrophone, FaStop } from "react-icons/fa";
import Header from "../../components/UserComponents/Header";

const UserChat = () => {
  const [activeChats, setActiveChats] = useState([]);
  const [messagesByRoom, setMessagesByRoom] = useState({});
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [messageInput, setMessageInput] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [typing, setTyping] = useState(false);
  // const [isRecording, setIsRecording] = useState(false);
  const [unreadCounts, setUnreadCounts] = useState({});
  const [replyToMessage, setReplyToMessage] = useState(null);

  const { socket } = useSocket();
  const user = useSelector(selectUser);
  const userId = user.id;
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (socket) {
      socket.on("typing", (data) => {
        if (data.roomId === selectedRoom) {
          setTyping(true);
          setTimeout(() => setTyping(false), 2000);
        }
      });

      return () => socket.off("typing");
    }
  }, [socket, selectedRoom]);

  // Fetch active chats
  useEffect(() => {
    const fetchActiveChats = async () => {
      try {
        const response = await axiosInstanceUser.get(`/active-chats/${userId}`);
        const sortedChats = response.data.sort(
          (a, b) =>
            new Date(b.latestMessage?.createdAt) -
            new Date(a.latestMessage?.createdAt)
        );
        setActiveChats(sortedChats);
      } catch (error) {
        console.error("Error fetching active chats:", error);
      }
    };
    fetchActiveChats();
  }, [userId]);

  // Emit typing indicator
  useEffect(() => {
    if (socket && selectedRoom && messageInput) {
      const typingTimeout = setTimeout(() => {
        socket.emit("typing", { roomId: selectedRoom, userId });
      }, 500);
      return () => clearTimeout(typingTimeout);
    }
  }, [messageInput, socket, selectedRoom, userId]);

  // Update unread counts
  useEffect(() => {
    if (socket) {
      socket.on("unreadCount", (data) => {
        setUnreadCounts((prevCounts) => ({
          ...prevCounts,
          [data.roomId]: data.unreadCount,
        }));
      });
      return () => socket.off("unreadCount");
    }
  }, [socket]);

  // Receive new messages
  useEffect(() => {
    const handleReceiveMessage = (newMessage) => {
      setMessagesByRoom((prevMessages) => ({
        ...prevMessages,
        [newMessage.chat]: [
          ...(prevMessages[newMessage.chat] || []),
          newMessage,
        ],
      }));
      if (newMessage.senderModel === "Admin") {
        setUnreadCounts((prevCounts) => ({
          ...prevCounts,
          [newMessage.chat]: (prevCounts[newMessage.chat] || 0) + 1,
        }));
      }
    };
    if (socket) {
      socket.on("receiveMessage", handleReceiveMessage);
      return () => socket.off("receiveMessage", handleReceiveMessage);
    }
  }, [socket]);

  // Join and leave room on room selection
  useEffect(() => {
    if (selectedRoom && socket) {
      socket.emit("join_room", selectedRoom);
      return () => socket.emit("leave_room", selectedRoom);
    }
  }, [selectedRoom, socket]);

  // Scroll to latest message
  useEffect(() => {
    if (messagesEndRef.current)
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
  }, [messagesByRoom, selectedRoom]);

  // Fetch messages for selected room
  useEffect(() => {
    const fetchMessagesForRoom = async () => {
      try {
        const response = await axiosInstanceUser.get(
          `/messages/${selectedRoom}`
        );
        setMessagesByRoom((prevMessages) => ({
          ...prevMessages,
          [selectedRoom]: response.data.messages || [],
        }));
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };
    if (selectedRoom) fetchMessagesForRoom();
  }, [selectedRoom]);

  const handleSendMessage = async () => {
    if (socket && selectedRoom && userId) {
      const messageData = {
        roomId: selectedRoom,
        sender: userId,
        content: messageInput,
        senderModel: "User",
        timestamp: new Date(),
        replyTo: replyToMessage?._id || null,
      };
      if (selectedFile) {
        messageData.fileBase64 = await convertFileToBase64(selectedFile);
        messageData.fileName = selectedFile.name;
        messageData.fileType = selectedFile.type;
      }
      socket.emit("sendMessage", messageData);
      setMessageInput("");
      setSelectedFile(null);
      setFilePreview(null);
      setShowEmojiPicker(false);
      setReplyToMessage(null);
      document.getElementById("fileUpload").value = "";
    } else {
      console.error("Socket, Room ID, or User ID is missing.");
    }
  };

  const handleRoomSelect = (roomId) => {
    setSelectedRoom(roomId);
    setUnreadCounts((prevCounts) => ({ ...prevCounts, [roomId]: 0 }));
  };

  const convertFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result.split(",")[1]);
      reader.onerror = (error) => reject(error);
    });
  };

  return (
    <div>
      <Header />
      <div className="flex h-screen bg-gray-100">
        {/* Sidebar for Active Chats */}
        <div className="w-1/4 border-r border-gray-200 p-4 bg-white">
          <h2 className="text-xl font-bold mb-4">Chats</h2>
          <div className="mb-4">
            <h3 className="font-semibold">Active Chats</h3>
            {activeChats.length === 0 ? (
              <p className="text-gray-500">No active chats.</p>
            ) : (
              activeChats.map((chat) => (
                <div
                  key={chat._id}
                  className={`relative p-3 rounded-lg mb-3 cursor-pointer ${
                    selectedRoom === chat._id ? "bg-blue-100" : "bg-gray-50"
                  }`}
                  onClick={() => handleRoomSelect(chat._id)}
                >
                  <p>
                    {chat.users.find((u) => u._id !== userId)?.name || "Admin"}
                  </p>
                  <p className="text-gray-500 text-sm">
                    {chat.latestMessage?.content || "No messages yet"}
                  </p>
                  {unreadCounts[chat._id] > 0 && (
                    <span className="absolute top-4 right-4 bg-[#a39f74] text-white text-xs px-2 py-1 rounded-full">
                      {unreadCounts[chat._id]}
                    </span>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-grow flex flex-col">
          {selectedRoom && (
            <div className="bg-white border-b border-gray-200 p-4">
              <h3 className="text-lg font-semibold">
                {activeChats
                  .find((chat) => chat._id === selectedRoom)
                  ?.users.find((u) => u._id !== userId)?.name || "Admin"}
              </h3>
              {typing && <p className="text-xs">Typing...</p>}
            </div>
          )}

          {/* Messages Display */}
          <div className="flex-grow overflow-y-auto p-4">
            {messagesByRoom[selectedRoom]?.map((msg) => (
              <div
                key={msg._id}
                className={`relative mb-2 p-2 rounded-lg max-w-fit ${
                  msg.senderModel === "User"
                    ? "ml-auto bg-blue-100"
                    : "mr-auto bg-gray-200"
                }`}
              >
                {msg.deleted ? (
                  <div className="text-gray-400 italic">
                    This message was deleted
                  </div>
                ) : (
                  <>
                    <p>{msg.content}</p>
                    {msg.fileUrl && msg.fileType.startsWith("image/") && (
                      <img
                        src={msg.fileUrl}
                        alt={msg.fileName}
                        className="mt-2 max-w-xs h-auto rounded-lg"
                      />
                    )}
                    <div className="flex items-center justify-between text-xs text-gray-500 mt-1">
                      <span>
                        {msg.createdAt
                          ? format(new Date(msg.createdAt), "p")
                          : ""}
                      </span>
                      <span className="text-gray-400">
                        {msg.isRead ? (
                          <MdDoneAll style={{ color: "blue" }} />
                        ) : (
                          <MdDone />
                        )}
                      </span>
                    </div>
                  </>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          {selectedRoom && (
            <div className="p-4 border-t border-gray-200 flex items-center space-x-2 relative">
              <button
                className="p-2 bg-[#a39f74] rounded-full hover:bg-[#ccc89b] text-white"
                onClick={() => setShowEmojiPicker((prev) => !prev)}
              >
                <GrEmoji />
              </button>
              {showEmojiPicker && (
                <div className="absolute bottom-20 z-10">
                  <EmojiPicker
                    onEmojiClick={(emoji) =>
                      setMessageInput((prev) => prev + emoji.emoji)
                    }
                  />
                </div>
              )}
              <input
                type="text"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                placeholder="Type a message..."
                className="flex-grow p-2 border rounded-lg focus:outline-none"
              />
              <input
                type="file"
                onChange={(e) => setSelectedFile(e.target.files[0])}
                className="hidden"
                id="fileUpload"
              />
              <label
                htmlFor="fileUpload"
                className="cursor-pointer p-2 bg-[#a39f74] rounded-full text-white"
              >
                <IoAttachSharp />
              </label>
              <button
                onClick={handleSendMessage}
                className="bg-[#a39f74] text-white p-2 rounded-full hover:bg-[#ccc89b]"
              >
                <IoIosSend />
              </button>
              {filePreview && (
                <div className="absolute bottom-16 right-16 bg-white p-2 border rounded-lg shadow-md">
                  <img
                    src={filePreview}
                    alt="Preview"
                    className="max-w-xs max-h-32"
                  />
                  <button
                    onClick={() => setFilePreview(null)}
                    className="text-red-500 mt-1"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserChat;
