import React from "react";
import Header from "../../components/UserComponents/Header";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUser } from "../../features/auth/authSlice";

function Home() {
  const user = useSelector(selectUser);
  console.log(user, "rjjsdjsdjsjds");

  // Redirect to login if the user is not logged in
  if (!user && user.isBlocked) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div>
      <Header />
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 select-none">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Hey, hello{" "}
          <span className="text-blue-600">{user.name || user.user.name}</span>!
        </h1>
        <p className="text-lg text-gray-600">
          Welcome back! We hope you have a great experience.
        </p>
      </div>
    </div>
  );
}

export default Home;
