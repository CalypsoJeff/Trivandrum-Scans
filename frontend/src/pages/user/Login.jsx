/* eslint-disable react/no-unescaped-entities */
import React, { useEffect, useState } from "react";
import { auth, provider, signInWithPopup } from "../../firebase/firebase"; // Firebase imports
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { GoogleAuth, loginUser } from "../../features/auth/authSlice";
import { useNavigate, Link } from "react-router-dom"; // Import Link for navigation
import { toast } from "sonner";
import { GoogleAuthProvider } from "firebase/auth";
import logo from "/Images/Logo.png";
import BackgroundImgLogin from "/Images/pexels-tima-miroshnichenko-9574411.jpg";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user && !user.is_blocked) {
      navigate("/home");
    }
  }, [user, navigate]);

  // Handle form login submit
  const handleSubmit = async (values, { setSubmitting }) => {
    setLoading(true);
    try {
      await dispatch(loginUser(values)).unwrap();
      toast.success("User Login Successful", {
        style: { backgroundColor: "#4CAF50", color: "#fff" },
      });
      navigate("/home");
      // eslint-disable-next-line no-unused-vars
    } catch (error) {
      toast.error("Login failed. Please check your credentials.");
    } finally {
      setSubmitting(false);
      setLoading(false);
    }
  };

  const handleForgetPassword = () => {
    navigate("/forget-password");
  };

  // Google login using Firebase
  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, provider);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const idToken = credential.accessToken;
      const user = result.user;

      const userData = {
        idToken,
        email: user.email,
        name: user.displayName,
      };

      dispatch(GoogleAuth(userData))
        .then((response) => {
          if (response.meta.requestStatus === "fulfilled") {
            toast.success("User signed up with Google", {
              style: { backgroundColor: "#4CAF50", color: "#fff" },
            });
            navigate("/home");
          } else {
            toast.error("Google signup failed");
          }
        })
        .catch((error) => {
          console.error("Error during Google login:", error);
          toast.error("Google login failed");
        });
    } catch (error) {
      console.error("Error during Google login:", error);
      toast.error("Google login failed");
    } finally {
      setLoading(false);
    }
  };

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  });

  return (
    <section
      className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"
      style={{
        backgroundImage: `url(${BackgroundImgLogin})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="flex justify-between w-full max-w-4xl p-8 shadow-lg bg-gray-800 rounded-lg">
        {/* Left Side (Sidemark + Features) */}
        <div className="w-1/2 pr-8 text-white select-none">
          <div className="flex items-center mb-6">
            <img src={logo} alt="Logo" className="h-32 w-auto" />
            <span className="ml-2 font-bold text-2xl">Trivandrum Scans</span>
          </div>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mt-5">
                Welcome to the world of cutting-edge Medical Diagnostic Imaging.
              </h3>
              <p className="text-gray-400 mt-10">
                "We are a team of highly spirited individuals dedicated to
                providing world-class medical diagnostic imaging services, with
                the mission to save lives and contribute to the ever-expanding
                medical fraternity."
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold">
                Illuminating Health, One Scan at a Time
              </h3>
            </div>
          </div>
        </div>

        {/* Right Side (Login Form) */}
        <div className="w-1/2 p-6 bg-gray-900 rounded-lg select-none">
          <h2 className="text-2xl font-semibold text-white mb-6 text-center">
            Sign in
          </h2>
          <Formik
            initialValues={{
              email: "",
              password: "",
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ errors, touched }) => (
              <Form className="space-y-4">
                <div>
                  <Field
                    type="email"
                    name="email"
                    id="email"
                    className={`w-full bg-gray-800 text-white border ${
                      errors.email && touched.email
                        ? "border-red-500"
                        : "border-gray-600"
                    } rounded-lg p-3 focus:outline-none focus:border-blue-500`}
                    placeholder="Email"
                  />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>
                <div>
                  <Field
                    type="password"
                    name="password"
                    id="password"
                    className={`w-full bg-gray-800 text-white border ${
                      errors.password && touched.password
                        ? "border-red-500"
                        : "border-gray-600"
                    } rounded-lg p-3 focus:outline-none focus:border-blue-500`}
                    placeholder="Password"
                  />
                  <ErrorMessage
                    name="password"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center text-gray-400">
                    <input
                      type="checkbox"
                      className="form-checkbox text-blue-600 bg-gray-700 border-gray-600"
                    />
                    <span className="ml-2">Remember me</span>
                  </label>

                  <button
                    onClick={handleForgetPassword}
                    className="text-sm text-blue-500 hover:underline focus:outline-none"
                  >
                    Forgot your password?
                  </button>
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-500"
                  disabled={loading}
                >
                  {loading ? "Loading..." : "Sign In"}
                </button>
              </Form>
            )}
          </Formik>

          <div className="mt-6 text-center text-gray-400">or</div>

          <div className="flex items-center justify-center mt-5">
            <div className="w-full px-6 sm:px-0 max-w-sm">
              <button
                type="button"
                onClick={handleGoogleLogin}
                className="text-white w-full bg-red-600 hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center justify-center mb-2"
                disabled={loading}
              >
                <svg
                  className="mr-2 -ml-1 w-4 h-4"
                  aria-hidden="true"
                  focusable="false"
                  data-prefix="fab"
                  data-icon="google"
                  role="img"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 488 512"
                >
                  <path
                    fill="currentColor"
                    d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
                  ></path>
                </svg>
                {loading ? "Loading..." : "Login with Google"}
              </button>
            </div>
          </div>

          <div className="mt-6 text-center text-gray-400">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-blue-500 hover:underline transition"
            >
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;
