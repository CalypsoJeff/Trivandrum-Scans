import React, { useState, useEffect } from "react";
import axiosInstanceUser from "../../services/axiosInstanceUser";
import { useSelector } from "react-redux";
import { selectUser } from "../../features/auth/authSlice";
import { FaEdit, FaPlus } from "react-icons/fa";
import ProfileSidebar from "../../components/UserComponents/ProfileSidebar";

const ProfileView = () => {
  const user = useSelector(selectUser);
  const [userData, setUserData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentField, setCurrentField] = useState("");
  const [newValue, setNewValue] = useState("");
  const [familyMembers, setFamilyMembers] = useState([]);

  // State for family member modal
  const [isAddFamilyModalOpen, setIsAddFamilyModalOpen] = useState(false);
  const [familyMemberData, setFamilyMemberData] = useState({
    name: "",
    relationToUser: "",
    age: "",
    gender: "Male",
    contactNumber: "",
  });

  const fetchUser = async () => {
    try {
      const response = await axiosInstanceUser.get(`/UserData/${user.id}`);
      setUserData(response.data);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const fetchFamilyMembers = async () => {
    try {
      const response = await axiosInstanceUser.get(`/familyData/${user.id}`);
      setFamilyMembers(response.data);
    } catch (error) {
      console.error("Error fetching family data:", error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchUser();
      fetchFamilyMembers();
    }
  }, [user]);

  const handleEditClick = (field) => {
    setCurrentField(field);
    setNewValue(userData[field]);
    setIsModalOpen(true);
  };

  const updateUserData = async (field, updatedValue) => {
    try {
      const response = await axiosInstanceUser.put(
        `/UserData/edit/${user.id}`,
        {
          fieldToChange: { [field]: updatedValue },
        }
      );
      setUserData(response.data);
    } catch (error) {
      console.error("Error updating user data:", error);
    }
  };

  const handleSave = () => {
    updateUserData(currentField, newValue);
    setIsModalOpen(false);
  };

  const handleAddFamilyMember = async () => {
    try {
      const response = await axiosInstanceUser.post(`/patients/add`, {
        ...familyMemberData,
        userId: user.id,
      });
      setIsAddFamilyModalOpen(false);
      fetchFamilyMembers();
    } catch (error) {
      console.error("Error adding family member:", error);
    }
  };

  return (
    <div className="min-h-screen flex">
      <ProfileSidebar />
      <div className="flex-grow p-6 ml-64 bg-gray-100">
        
        {/* Profile Header */}
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-24 h-24 rounded-full bg-blue-200 flex items-center justify-center text-4xl text-white font-bold">
            {userData?.name?.charAt(0)}
          </div>
          <div>
            <h1 className="text-3xl font-bold">{userData?.name}</h1>
            <p className="text-gray-500">User ID: {user.id}</p>
          </div>
        </div>

        {/* Profile Details */}
        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Profile Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {["name", "mobile", "address", "gender", "age"].map((field) => (
              <div
                key={field}
                className="flex items-center justify-between py-2 px-4 rounded-lg border border-gray-200"
              >
                <div className="flex flex-1 items-center">
                  <span className="w-32 font-medium text-gray-600 capitalize mr-2">{field}:</span>
                  <span className="font-normal text-gray-800">{userData?.[field]}</span>
                </div>
                <button
                  onClick={() => handleEditClick(field)}
                  className="text-blue-500 hover:text-blue-700 p-2"
                >
                  <FaEdit />
                </button>
              </div>
            ))}
          </div>
          <button
            onClick={() => setIsAddFamilyModalOpen(true)}
            className="mt-6 bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center"
          >
            <FaPlus className="mr-2" /> Add Family Member
          </button>
        </div>

        {/* Family Members Section */}
        <h2 className="text-2xl font-bold mb-4">Family Members</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {familyMembers.length > 0 ? (
            familyMembers.map((member) => (
              <div
                key={member._id}
                className="bg-white shadow p-4 rounded-lg border border-gray-200 space-y-2"
              >
                <h3 className="text-lg font-semibold text-gray-800">{member.name}</h3>
                <p className="text-gray-600">Relation: {member.relationToUser}</p>
                <p className="text-gray-600">Age: {member.age}</p>
                <p className="text-gray-600">Gender: {member.gender}</p>
                <p className="text-gray-600">Contact: {member.contactNumber}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-600">No family members added yet.</p>
          )}
        </div>

        {/* Modals */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg max-w-sm w-full">
              <h2 className="text-xl font-bold mb-4">Edit {currentField}</h2>
              {currentField === "gender" ? (
                <select
                  value={newValue}
                  onChange={(e) => setNewValue(e.target.value)}
                  className="border border-gray-300 rounded-md p-2 w-full"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              ) : (
                <input
                  type="text"
                  value={newValue}
                  onChange={(e) => setNewValue(e.target.value)}
                  className="border border-gray-300 rounded-md p-2 w-full"
                />
              )}
              <div className="mt-4 flex justify-end space-x-4">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="bg-gray-200 px-4 py-2 rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}

        {isAddFamilyModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg max-w-sm w-full">
              <h2 className="text-xl font-bold mb-4">Add Family Member</h2>
              {Object.keys(familyMemberData).map((field) => (
                <input
                  key={field}
                  type={field === "age" ? "number" : "text"}
                  value={familyMemberData[field]}
                  onChange={(e) =>
                    setFamilyMemberData({
                      ...familyMemberData,
                      [field]: e.target.value,
                    })
                  }
                  placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                  className="border border-gray-300 rounded-md p-2 w-full mb-2"
                />
              ))}
              <div className="mt-4 flex justify-end space-x-4">
                <button
                  onClick={() => setIsAddFamilyModalOpen(false)}
                  className="bg-gray-200 px-4 py-2 rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddFamilyMember}
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  Add Member
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileView;
