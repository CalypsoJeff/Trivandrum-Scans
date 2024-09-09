import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { signupUser, clearError } from "../../features/auth/authSlice";
import UserOtp from "./UserOtp"; // Import the OTP component

const SignupModal = ({ show, onClose }) => {
  const [email, setEmail] = useState("");
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false); // State for OTP modal
  const dispatch = useDispatch();

  const { loading, error, user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user) {
      setIsOtpModalOpen(true);
    }

    if (error === "User already exists") {
      toast.error("User with this email already exists");
    }
  }, [user, error]);

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      await dispatch(signupUser(values)).unwrap();
      toast.success("User Signup Success");
      setEmail(values.email); // Set email to pass to OTP modal
      setIsOtpModalOpen(true); // Show OTP modal
    } catch (error) {
      toast.error(error || "Signup failed");
    } finally {
      setSubmitting(false);
    }
  };

  const validationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
    phone: Yup.string().required("Phone number is required"),
  });

  return (
    <>
      {show && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-800 bg-opacity-50">
          <div className="bg-white rounded-lg w-96 p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold">Sign Up</h2>
              <button
                className="text-gray-500 hover:text-gray-700"
                onClick={onClose} // Close the modal on click
              >
                &times;
              </button>
            </div>

            {error && (
              <div className="text-red-500 text-sm mb-4">
                {error.message || "Something went wrong"}
              </div>
            )}

            <Formik
              initialValues={{ name: "", email: "", password: "", phone: "" }}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting }) => (
                <Form className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium">
                      Name
                    </label>
                    <Field
                      name="name"
                      type="text"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm"
                    />
                    <ErrorMessage
                      name="name"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium"
                    >
                      Email
                    </label>
                    <Field
                      name="email"
                      type="email"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm"
                    />
                    <ErrorMessage
                      name="email"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium"
                    >
                      Password
                    </label>
                    <Field
                      name="password"
                      type="password"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm"
                    />
                    <ErrorMessage
                      name="password"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-sm font-medium"
                    >
                      Phone Number
                    </label>
                    <Field
                      name="phone"
                      type="text"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm"
                    />
                    <ErrorMessage
                      name="phone"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>

                  <div>
                    <button
                      type="submit"
                      className="w-full bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 focus:outline-none"
                      disabled={isSubmitting || loading}
                    >
                      {isSubmitting || loading ? "Submitting..." : "Sign Up"}
                    </button>
                  </div>
                </Form>
              )}
            </Formik>

            <p className="text-center text-sm mt-4">
              Already have an account?{" "}
              <a href="#" className="text-red-500 hover:underline">
                Log in
              </a>
            </p>
          </div>
        </div>
      )}

      {/* OTP Modal */}
      {isOtpModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-800 bg-opacity-50">
          <UserOtp email={email} /> {/* Display the OTP verification modal */}
        </div>
      )}
    </>
  );
};

export default SignupModal;
