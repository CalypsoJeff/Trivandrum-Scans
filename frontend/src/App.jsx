import React from "react";
import { Routes, Route } from "react-router-dom";
import "./index.css"; // Ensure this is importing Tailwind CSS
import { Toaster } from "sonner";
import UserRoutes from "./routes/userRoutes/UserRoutes";
function app() {
  return (
    <>
      <Toaster
        position="top-center" // Correct positioning prop
        toastOptions={{
          style: {
            background: "#fff", // Custom background color
            color: "#ff6347", // Custom text color
            borderRadius: "8px", // Custom border radius
            padding: "16px", // Custom padding
            fontSize: "16px", // Increase text size
          },
        }}
      />

      <Routes>
        <Route path="/*" element={<UserRoutes />} />
      </Routes>
    </>
  );
}

export default app;
