import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axiosInstanceUser from "../../services/axiosInstanceUser";
import { useSelector } from "react-redux";
import { selectUser } from "../../features/auth/authSlice";
import Header from "../../components/UserComponents/Header";
import ProfileSidebar from "../../components/UserComponents/ProfileSidebar";

const ChangePasswordSchema = Yup.object().shape({
  currentPassword: Yup.string().required("Current password is required"),
  newPassword: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("New password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("newPassword"), null], "Passwords must match")
    .required("Confirm new password is required"),
});

function ChangePassword() {
  const user = useSelector(selectUser);
  const userId = user.id;

  const changePassword = async (values, { setSubmitting, resetForm }) => {
    try {
      console.log(values);
      const response = await axiosInstanceUser.put("/change-password", {
        ...values,
        userId,
      });
      console.log("Password changed successfully:", response.data);
      resetForm();
    } catch (error) {
      console.error("Error changing password:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <Header />
      <div className="flex flex-grow overflow-hidden">
        <ProfileSidebar />
        <div className="flex-grow overflow-y-auto flex justify-center items-center p-6 ml-64">
          {" "}
          {/* Adjusted margin-left */}
          <div className="bg-[#F8F4EF] p-8 rounded-lg shadow-lg w-full max-w-lg">
            <h2 className="text-3xl font-semibold mb-8 text-gray-800 text-center">
              Change Password
            </h2>
            <Formik
              initialValues={{
                currentPassword: "",
                newPassword: "",
                confirmPassword: "",
              }}
              validationSchema={ChangePasswordSchema}
              onSubmit={changePassword}
            >
              {({ isSubmitting, errors, touched }) => (
                <Form>
                  <div className="mb-6">
                    <Field
                      type="password"
                      name="currentPassword"
                      className={`block w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none sm:text-sm ${
                        errors.currentPassword && touched.currentPassword
                          ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                          : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      }`}
                      placeholder="Enter your current password"
                    />
                    <ErrorMessage
                      name="currentPassword"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>
                  <div className="mb-6">
                    <Field
                      type="password"
                      name="newPassword"
                      className={`block w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none sm:text-sm ${
                        errors.newPassword && touched.newPassword
                          ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                          : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      }`}
                      placeholder="Enter your new password"
                    />
                    <ErrorMessage
                      name="newPassword"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>
                  <div className="mb-8">
                    <Field
                      type="password"
                      name="confirmPassword"
                      className={`block w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none sm:text-sm ${
                        errors.confirmPassword && touched.confirmPassword
                          ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                          : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      }`}
                      placeholder="Confirm new password"
                    />
                    <ErrorMessage
                      name="confirmPassword"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-[#a39f74] hover:bg-[#827f57] text-white font-bold py-2 px-4 rounded-lg transition duration-300"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Updating..." : "Update Password"}
                  </button>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChangePassword;
