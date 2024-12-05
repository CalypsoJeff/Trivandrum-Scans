import React, { useEffect } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { signupUser } from "../../features/auth/authSlice";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { auth, provider, signInWithPopup } from "../../firebase/firebase";
import { GoogleAuthProvider } from "firebase/auth";
import { Link } from "react-router-dom";
import logo from "/Images/Logo.png";
import BackgroundImgLogin from "/Images/pexels-tima-miroshnichenko-9574411.jpg";

const Signup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  // useEffect(() => {
  //   if (user) {
  //     navigate("/otp-verification");
  //   }
  // }, [user, navigate]);

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      await dispatch(signupUser(values)).unwrap();
      toast.success("User Signup Success");
      navigate("/otp-verification", { state: { email: values.email } });
    } catch (error) {
      console.error("User already exists!:", error);
      toast.error("User already exists!");
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleSignup = async () => {
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

      dispatch(signupUser(userData))
        .then((response) => {
          if (response.meta.requestStatus === "fulfilled") {
            toast.success("User signed up with Google");
            navigate("/home");
          } else {
            toast.error("Google signup failed");
          }
        })
        .catch((error) => {
          console.error("Error during Google sign-up:", error);
          toast.error("Google sign-up failed");
        });
    } catch (error) {
      console.error("Error during Google sign-up:", error);
      toast.error("Google sign-up failed");
    }
  };

  const validationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Confirm Password is required"),
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
      <div className="text-container flex justify-between w-full max-w-4xl p-8 shadow-lg bg-gray-800 rounded-lg select-none">
        {/* Left Side (Sidemark + Features) */}
        <div className="w-1/2 pr-8 text-white">
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
                `We are a team of highly spirited individuals dedicated to
                providing world-class medical diagnostic imaging services, with
                the mission to save lives and contribute to the ever-expanding
                medical fraternity.`
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold">
                Illuminating Health, One Scan at a Time
              </h3>
            </div>
          </div>
        </div>

        {/* Right Side (Signup Form) */}
        <div className="w-1/2 p-6 bg-gray-900 rounded-lg">
          <h2 className="text-2xl font-semibold text-white mb-6 text-center">
            Sign up
          </h2>
          <Formik
            initialValues={{
              name: "",
              email: "",
              password: "",
              confirmPassword: "",
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ errors, touched }) => (
              <Form className="space-y-4">
                <div>
                  <Field
                    type="text"
                    name="name"
                    id="name"
                    className={`w-full bg-gray-800 text-white border ${
                      errors.name && touched.name
                        ? "border-red-500"
                        : "border-gray-600"
                    } rounded-lg p-3 focus:outline-none focus:border-blue-500`}
                    placeholder="Full name"
                  />
                  <ErrorMessage
                    name="name"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

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

                <div>
                  <Field
                    type="password"
                    name="confirmPassword"
                    id="confirmPassword"
                    className={`w-full bg-gray-800 text-white border ${
                      errors.confirmPassword && touched.confirmPassword
                        ? "border-red-500"
                        : "border-gray-600"
                    } rounded-lg p-3 focus:outline-none focus:border-blue-500`}
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
                  className="w-full bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-500"
                >
                  Sign up
                </button>
              </Form>
            )}
          </Formik>

          <div className="mt-6 text-center text-gray-400">or</div>

          <div className="flex items-center justify-center mt-5">
            <div className="w-full px-6 sm:px-0 max-w-sm">
              <button
                type="button"
                onClick={handleGoogleSignup}
                className="text-white w-full bg-red-600 hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center justify-center mb-2"
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
                Sign up with Google
              </button>
            </div>
          </div>

          <div className="mt-6 text-center text-gray-400">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-blue-500 hover:underline transition"
            >
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Signup;
