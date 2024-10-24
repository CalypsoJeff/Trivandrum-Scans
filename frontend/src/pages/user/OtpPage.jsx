import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
// import { useSelector } from "react-redux";
import BackgroundImgLogin from "/Images/pexels-tima-miroshnichenko-9574411.jpg";
import logo from "/Images/Logo.png";

const UserOtp = () => {
  const inputRefs = useRef([]);
  // const { email } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  // const { user } = useSelector((state) => state.auth);

  const [timer, setTimer] = useState(60);
  const [isResendEnabled, setIsResendEnabled] = useState(false);
  const intervalRef = useRef(null);

  const handleSubmit = async (e) => {
  e.preventDefault();
  const otp = inputRefs.current.map((input) => input.value).join("");
  const { email } = location.state || {};
  console.log("heyyyyyy", otp, email);

  if (!email) {
    return <div>Error: Email not provided</div>;
  }

  try {
    const response = await axios.post(
      "http://localhost:5000/api/users/otp-verification",
      { otp, email }
    );
    console.log(response.data);
    navigate("/home");
    toast.success(response.data.message);
  } catch (error) {
    console.error("Error response:", error);
    if (error.response && error.response.data) {
      // Check for "Invalid OTP" in the error response
      if (error.response.data.error ) {
        toast.error("Invalid OTP, please try again.");
      } else {
        toast.error(`${error.response.data.error}`);
      }
    } else {
      console.error("Error message:", error.message);
      toast.error(error.message);
    }
  }
};


  const handleResend = async () => {
    const { email } = location.state || {};
    try {
      await axios.post("http://localhost:5000/api/users/resend-otp", { email });
      toast.success("OTP resent successfully");
      setTimer(60);
      setIsResendEnabled(false);

      clearInterval(intervalRef.current);
      intervalRef.current = setInterval(() => {
        setTimer((prevTimer) => {
          if (prevTimer === 1) {
            clearInterval(intervalRef.current);
            setIsResendEnabled(true);
            return 0;
          }
          return prevTimer - 1;
        });
      }, 1000);
    } catch (error) {
      console.error("Error resending OTP:", error);
      toast.error("Failed to resend OTP");
    }
  };

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer === 1) {
          clearInterval(intervalRef.current);
          setIsResendEnabled(true);
          return 0;
        }
        return prevTimer - 1;
      });
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, []);

  const handleInputChange = (e, index) => {
    const value = e.target.value;

    if (value.length === 1 && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus();
    }

    if (value.length === 0 && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  return (
    <div
  className="min-h-screen flex items-center justify-center select-none"
  style={{
    backgroundImage: `url(${BackgroundImgLogin})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
  }}
>
  <div className="max-w-md mx-auto text-center bg-white px-4 sm:px-8 py-10 rounded-xl shadow-lg">
    <header className="mb-8">
      <div className="flex items-center mb-6">
        <img src={logo} alt="Logo" className="h-32 w-auto" />
        <span className="ml-2 font-bold text-2xl">Trivandrum Scans</span>
      </div>
      <h1 className="text-2xl font-bold mb-1">Mobile Phone Verification</h1>
      <p className="text-[15px] text-slate-500">
        Enter the 4-digit verification code that was sent to your phone number.
      </p>
    </header>
    <form id="otp-form" onSubmit={handleSubmit}>
      <div className="flex items-center justify-center gap-4">
        {[...Array(4)].map((_, index) => (
          <input
            key={index}
            type="text"
            className="w-16 h-16 text-center text-2xl font-bold text-slate-900 bg-white border-2 border-gray-300 rounded-md shadow-md focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600 transition-all duration-200"
            maxLength="1"
            ref={(el) => (inputRefs.current[index] = el)}
            onChange={(e) => handleInputChange(e, index)}
            onKeyDown={(e) => {
              if (
                e.key === "Backspace" &&
                !inputRefs.current[index].value
              ) {
                if (index > 0) {
                  inputRefs.current[index - 1].focus();
                }
              }
            }}
          />
        ))}
      </div>
      <div className="max-w-[260px] mx-auto mt-4">
        <button
          onClick={handleSubmit}
          type="submit"
          className="w-full inline-flex justify-center whitespace-nowrap rounded-lg bg-blue-600 px-3.5 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-blue-500 focus:outline-none focus:ring focus:ring-blue-300 transition-colors duration-150"
        >
          Verify Account
        </button>
      </div>
    </form>
    <div className="text-sm text-slate-500 mt-4">
      Didn&apos;t receive code?{" "}
      <button
        onClick={handleResend}
        disabled={!isResendEnabled}
        className={`font-medium ${
          isResendEnabled
            ? "text-blue-600 hover:text-blue-500"
            : "text-gray-400 cursor-not-allowed"
        }`}
      >
        Resend {timer > 0 && `(${timer}s)`}
      </button>
    </div>
  </div>
</div>

  );
};

export default UserOtp;
