import React, { useState, useEffect } from "react";
import axiosInstanceUser from "../../services/axiosInstanceUser";
import { useSelector } from "react-redux";
import { selectUser } from "../../features/auth/authSlice";
import { FaEdit } from "react-icons/fa";
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
      console.log(response.data);

      setIsAddFamilyModalOpen(false);
      fetchFamilyMembers();
    } catch (error) {
      console.error("Error adding family member:", error);
    }
  };

  return (
    <div className="h-screen flex">
      <ProfileSidebar />
      <div className="flex-grow p-6 ml-64 bg-gray-100">
        <h1 className="text-2xl font-bold mb-4">Profile Details</h1>
        <div className="space-y-4 bg-white shadow p-6 rounded-lg">
          <div className="flex justify-between items-center">
            <p className="text-lg">Name: {userData?.name}</p>
            <button
              onClick={() => handleEditClick("name")}
              className="text-blue-500 hover:text-blue-700"
            >
              <FaEdit />
            </button>
          </div>

          <div className="flex justify-between items-center">
            <p className="text-lg">Mobile: {userData?.mobile}</p>
            <button
              onClick={() => handleEditClick("mobile")}
              className="text-blue-500 hover:text-blue-700"
            >
              <FaEdit />
            </button>
          </div>

          <div className="flex justify-between items-center">
            <p className="text-lg">Address: {userData?.address}</p>
            <button
              onClick={() => handleEditClick("address")}
              className="text-blue-500 hover:text-blue-700"
            >
              <FaEdit />
            </button>
          </div>

          {/* Gender Field */}
          <div className="flex justify-between items-center">
            <p className="text-lg">Gender: {userData?.gender}</p>
            <button
              onClick={() => handleEditClick("gender")}
              className="text-blue-500 hover:text-blue-700"
            >
              <FaEdit />
            </button>
          </div>

          <div className="flex justify-between items-center">
            <p className="text-lg">Age: {userData?.age}</p>
            <button
              onClick={() => handleEditClick("age")}
              className="text-blue-500 hover:text-blue-700"
            >
              <FaEdit />
            </button>
          </div>

          <button
            onClick={() => setIsAddFamilyModalOpen(true)}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg"
          >
            Add Family Member
          </button>
        </div>

        {/* Family Members Grid */}
        <h2 className="text-2xl font-bold mt-8">Family Members</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
          {familyMembers.length > 0 ? (
            familyMembers.map((member) => (
              <div key={member._id} className="bg-white shadow p-4 rounded-lg">
                <h3 className="text-xl font-bold">{member.name}</h3>
                <p>Relation: {member.relationToUser}</p>
                <p>Age: {member.age}</p>
                <p>Gender: {member.gender}</p>
                <p>Contact: {member.contactNumber}</p>
              </div>
            ))
          ) : (
            <p>No family members added yet.</p>
          )}
        </div>

        {/* Edit Modal for specific field */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg max-w-sm w-full">
              <h2 className="text-xl font-bold mb-4">Edit {currentField}</h2>

              {/* Use a dropdown for editing gender field */}
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

        {/* Modal for Adding Family Member */}
        {isAddFamilyModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg max-w-sm w-full">
              <h2 className="text-xl font-bold mb-4">Add Family Member</h2>
              <input
                type="text"
                value={familyMemberData.name}
                onChange={(e) =>
                  setFamilyMemberData({
                    ...familyMemberData,
                    name: e.target.value,
                  })
                }
                placeholder="Name"
                className="border border-gray-300 rounded-md p-2 w-full mb-2"
              />
              <input
                type="text"
                value={familyMemberData.relationToUser}
                onChange={(e) =>
                  setFamilyMemberData({
                    ...familyMemberData,
                    relationToUser: e.target.value,
                  })
                }
                placeholder="Relation"
                className="border border-gray-300 rounded-md p-2 w-full mb-2"
              />
              <input
                type="number"
                value={familyMemberData.age}
                onChange={(e) =>
                  setFamilyMemberData({
                    ...familyMemberData,
                    age: e.target.value,
                  })
                }
                placeholder="Age"
                className="border border-gray-300 rounded-md p-2 w-full mb-2"
              />
              <select
                value={familyMemberData.gender}
                onChange={(e) =>
                  setFamilyMemberData({
                    ...familyMemberData,
                    gender: e.target.value,
                  })
                }
                className="border border-gray-300 rounded-md p-2 w-full mb-2"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
              <input
                type="text"
                value={familyMemberData.contactNumber}
                onChange={(e) =>
                  setFamilyMemberData({
                    ...familyMemberData,
                    contactNumber: e.target.value,
                  })
                }
                placeholder="Contact Number"
                className="border border-gray-300 rounded-md p-2 w-full mb-2"
              />
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
