import React from 'react';
import Header from '../../components/UserComponents/Header';
import ProfileSidebar from '../../components/UserComponents/ProfileSidebar';
import ProfileEdit from '../../components/UserComponents/ProfileEdit';

function UserProfile() {
  return (
    <div className="h-screen flex flex-col select-none">
      <Header />
      <div className="flex flex-grow overflow-hidden">
        <ProfileSidebar />
        <div className="flex-grow  overflow-y-auto ml-64 p-6">
          <ProfileEdit />
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
