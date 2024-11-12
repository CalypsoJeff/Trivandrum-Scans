import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/AdminComponents/Sidebar";
import { fetchChatList } from "../../services/adminService";

export default function ChatList() {
  const [chats, setChats] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const getChatList = async () => {
      try {
        const chatData = await fetchChatList();
        setChats(chatData);
      } catch (error) {
        console.error("Failed to load chat list:", error);
      }
    };
    getChatList();
  }, []);

  const handleChatClick = (chatId, userName) => {
    navigate(`/admin/chat/${chatId}`, { state: { userName } });
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      <Sidebar />
      <div className="flex-1  p-6">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
          <h5 className="text-2xl font-semibold text-center text-gray-800 mb-6">
            Chats
          </h5>
          <div className="space-y-4">
            {chats.length > 0 ? (
              chats.map((chat) => {
                const user = chat.users?.find(
                  (u) => u._id !== "66ee588d1e1448fbea1f40bb"
                );
                return (
                  <div
                    key={chat._id}
                    onClick={() =>
                      handleChatClick(chat._id, user?.name || "User")
                    }
                    className="flex items-center space-x-4 p-4 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition duration-200 shadow-sm hover:shadow-md"
                  >
                    <img
                      src="https://mdbcdn.b-cdn.net/img/Photos/Avatars/avatar-2.webp"
                      alt="user-avatar"
                      className="rounded-full w-12 h-12"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-gray-800 text-lg">
                        {user?.name || "User"}
                      </p>
                      <p className="text-sm text-gray-500 truncate">
                        {chat.latestMessage?.content || "No messages yet"}
                      </p>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-gray-500 text-center">No chats available.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
