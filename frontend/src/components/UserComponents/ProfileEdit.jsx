import React, { useState, useEffect } from "react";
import { FaEdit, FaUser } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { selectUser } from "../../features/auth/authSlice";
import { updateUser } from "../../features/auth/authSlice";

const ProfileEdit = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const [name, setName] = useState(user?.name || "");
  const [address, setAddress] = useState(user?.address || "");
  const [mobile, setMobile] = useState(user?.mobile || "");
  const [age, setAge] = useState(user?.age || "");
  const [isEditing, setIsEditing] = useState(false);
  useEffect(() => {
    if (user) {
      setName(user.name);
      setAddress(user.address || "");
      setMobile(user.mobile || "");
      setAge(user.age || "");
    }
  }, [user]);
  const handleEditClick = () => {
    setIsEditing(true);
  };
  const handleSaveClick = () => {
    dispatch(
      updateUser({
        userId: user.id,
        name,
        address,
        mobile,
        age,
      })
    )
      .unwrap()
      .then(() => {
        setIsEditing(false);
      })
      .catch((error) => {
        console.error("Error updating user:", error);
      });
  };
  if (!user) {
    return <div>Loading...</div>;
  }
  return (
    <div className="flex-grow flex flex-col items-center p-6">
      <div className="bg-white shadow-md rounded-lg p-8 max-w-md w-full text-center">
        <div className="flex items-center justify-center mb-4">
          <div className="rounded-full bg-[#F8F4EF] p-3">
            <FaUser className="text-[#a39f74]" size={24} />
          </div>
        </div>
        <div className="flex items-center justify-center mb-4">
          {isEditing ? (
            <input
              type="text"
              className="border border-gray-300 rounded-md px-2 py-1 text-center"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          ) : (
            <h2 className="text-2xl font-semibold">{name}</h2>
          )}
          <button
            className="ml-2 bg-transparent border-none cursor-pointer"
            onClick={isEditing ? handleSaveClick : handleEditClick}
          >
            <FaEdit className="text-[#a39f74]" />
          </button>
        </div>

        {/* Email (Non-editable) */}
        <div className="text-gray-600 mb-4">
          <p>{user.email}</p>
        </div>

        {/* Mobile Number */}
        <div className="mb-4">
          {isEditing ? (
            <input
              type="text"
              className="border border-gray-300 rounded-md px-2 py-1 w-full"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              placeholder="Mobile Number"
            />
          ) : (
            <p className="text-gray-600">Mobile: {mobile}</p>
          )}
        </div>

        {/* Address */}
        <div className="mb-4">
          {isEditing ? (
            <input
              type="text"
              className="border border-gray-300 rounded-md px-2 py-1 w-full"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Address"
            />
          ) : (
            <p className="text-gray-600">Address: {address}</p>
          )}
        </div>

        {/* Age */}
        <div className="mb-4">
          {isEditing ? (
            <input
              type="number"
              className="border border-gray-300 rounded-md px-2 py-1 w-full"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="Age"
            />
          ) : (
            <p className="text-gray-600">Age: {age}</p>
          )}
        </div>

        {/* Save Button */}
        {isEditing && (
          <button
            className="mt-4 bg-[#a39f74] text-white font-semibold py-2 px-4 rounded-lg"
            onClick={handleSaveClick}
          >
            Save
          </button>
        )}
      </div>
    </div>
  );
};
export default ProfileEdit;
