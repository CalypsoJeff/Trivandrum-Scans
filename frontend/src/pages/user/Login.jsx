import React, { useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { loginUser, clearError } from "../../features/auth/authSlice"; // Assuming you have loginUser and clearError actions

const LoginModal = ({ show, onClose }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user) {
      toast.success("Login successful");
      onClose(); // Close the modal when login is successful
      navigate("/home");
    }

    if (error) {
      toast.error(error || "Login failed");
    }
  }, [user, error, navigate, onClose]);

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      await dispatch(loginUser(values)).unwrap();
    } catch (error) {
      toast.error(error || "Login failed");
    } finally {
      setSubmitting(false);
    }
  };

  const validationSchema = Yup.object({
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  });

  return (
    <>
      {show && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-800 bg-opacity-50">
          <div className="bg-white rounded-lg w-96 p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold">Login</h2>
              <button
                className="text-gray-500 hover:text-gray-700"
                onClick={onClose}
              >
                &times;
              </button>
            </div>

            <Formik
              initialValues={{ email: "", password: "" }}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting }) => (
                <Form className="space-y-4">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium">
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
                    <button
                      type="submit"
                      className="w-full bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 focus:outline-none"
                      disabled={isSubmitting || loading}
                    >
                      {isSubmitting || loading ? "Signing in..." : "Login"}
                    </button>
                  </div>
                </Form>
              )}
            </Formik>

            <p className="text-center text-sm mt-4">
              Don't have an account?{" "}
              <a href="/signup" className="text-red-500 hover:underline">
                Sign Up
              </a>
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default LoginModal;
