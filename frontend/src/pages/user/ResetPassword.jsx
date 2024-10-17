import React, { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { toast } from "sonner";
import { resetPassword } from "../../features/auth/authSlice";
import { useDispatch } from "react-redux";
import logo from "/Images/Logo.png";
import BackgroundImgLogin from "/Images/pexels-tima-miroshnichenko-9574411.jpg";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!token) {
      console.error("Reset token is missing.");
    } else {
      console.log("Received reset token:", token);
    }
  }, [token]);

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      await dispatch(
        resetPassword({ token, password: values.password })
      ).unwrap();
      navigate("/login");
      toast.success("Password reset successfully");
    } catch (error) {
      console.error("Error during password reset:", error);
      toast.error("Failed to reset password");
    } finally {
      setSubmitting(false);
    }
  };

  const validationSchema = Yup.object({
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Confirm password is required"),
  });

  return (
    <section
      className="relative min-h-screen bg-cover bg-center bg-no-repeat bg-gray-50 dark:bg-gray-900"
      style={{ backgroundImage: `url(${BackgroundImgLogin})` }}
    >
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="relative flex flex-col items-center justify-center min-h-screen">
        <div className="w-full max-w-md p-10 bg-white bg-opacity-90 rounded-lg shadow dark:bg-gray-800 dark:bg-opacity-40">
          <img
            src={logo}
            alt="Website Logo"
            className="h-28 w-auto mx-auto mb-3"
          />
          <h1 className="text-center text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white mb-3">
            Reset Password
          </h1>
          <Formik
            initialValues={{ password: "", confirmPassword: "" }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form className="space-y-4 md:space-y-4">
                <div>
                  <Field
                    type="password"
                    name="password"
                    id="password"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:outline-none focus:border-[#a39f74d6] block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                    placeholder="New Password"
                  />
                  <ErrorMessage
                    name="password"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>
                <div>
                  <Field
                    type="password"
                    name="confirmPassword"
                    id="confirmPassword"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:outline-none focus:border-[#a39f74d6] block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                    placeholder="Confirm Password"
                  />
                  <ErrorMessage
                    name="confirmPassword"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full text-white bg-[#1D4ED8] hover:bg-blue-500 focus:ring-4 focus:outline-none focus:ring-[#8B8964] font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                >
                  {isSubmitting ? "Submitting..." : "Reset Password"}
                </button>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </section>
  );
};

export default ResetPassword;
