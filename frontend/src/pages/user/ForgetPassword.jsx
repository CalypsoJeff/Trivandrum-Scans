import React from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { toast } from "sonner"; // Assuming you have the toast notifications
import logo from "/Images/Logo.png";
import BackgroundImgLogin from "/Images/pexels-tima-miroshnichenko-9574411.jpg";

function ForgetPassword() {
  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      // Sending request to the backend API for password reset
      const response = await axios.post(
        "http://localhost:5000/api/users/forget-password",
        {
          email: values.email,
        }
      );

      // Check if response is successful
      if (response.status === 200) {
        toast.success("Password reset link sent! Check your email.");
      } else {
        toast.error("Failed to send reset email. Please try again.");
      }
    } catch (error) {
      console.error("Error in forget password:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
  });

  return (
    <div
      className="flex justify-center items-center min-h-screen select-none relative"
      style={{
        backgroundImage: `url(${BackgroundImgLogin})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Overlay for background */}
      <div className="absolute inset-0 bg-black opacity-50"></div>

      <div className="relative w-full max-w-md p-8 bg-white bg-opacity-90 rounded-lg shadow-lg">
        <div className="flex items-center justify-center mb-6">
          <img src={logo} alt="Logo" className="h-20 w-auto" />
          <span className="ml-2 font-bold text-2xl text-gray-900">
            Trivandrum Scans
          </span>
        </div>
        <h1 className="text-2xl font-semibold text-center mb-6 text-gray-900">
          Forgot Password
        </h1>

        <Formik
          initialValues={{ email: "" }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-gray-700 mb-2">
                  Enter your email (Gmail)
                </label>
                <Field
                  type="email"
                  name="email"
                  id="email"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  placeholder="Enter your Gmail"
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-2 px-4 rounded-lg focus:outline-none focus:ring-4 
                  ${
                    isSubmitting
                      ? "bg-blue-400 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700"
                  }
                  text-white transition duration-300 ease-in-out focus:ring-blue-500`}
              >
                {isSubmitting ? "Sending..." : "Send Reset Link"}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}

export default ForgetPassword;
