import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { useSelector } from "react-redux";

const UserOtp = ({ email }) => {
  const inputRefs = useRef([]);
  const navigate = useNavigate();
  const submitRef = useRef(null);
  const { user } = useSelector((state) => state.auth);

  const [timer, setTimer] = useState(60); // Timer starts at 60 seconds
  const [isResendEnabled, setIsResendEnabled] = useState(false);
  const intervalRef = useRef(null); // For keeping track of the interval

  // Submit OTP
  const handleSubmit = async (e) => {
    e.preventDefault();
    const otp = inputRefs.current.map((input) => input.value).join(""); // Get OTP from inputs
    console.log("OTP submitted:", email, otp);

    if (!email) {
      return toast.error("Email not provided");
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/users/otp-verification",
        { otp, email }
      );
      console.log(response.data);
      toast.success(response.data.message);
      navigate("/home");
    } catch (error) {
      console.error("Error response:", error);
      if (error.response && error.response.data) {
        toast.error(error.response.data.error);
      } else {
        toast.error(error.message);
      }
    }
  };

  // Resend OTP
  const handleResend = async () => {
    try {
      await axios.post("http://localhost:5000/api/users/resend-otp", { email });
      toast.success("OTP resent successfully");
      resetTimer(); // Reset the timer when OTP is resent
    } catch (error) {
      console.error("Error resending OTP:", error);
      toast.error("Failed to resend OTP");
    }
  };

  // Timer logic
  const startTimer = () => {
    intervalRef.current = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer === 1) {
          clearInterval(intervalRef.current); // Stop timer when it reaches 0
          setIsResendEnabled(true); // Enable resend button
          return 0;
        }
        return prevTimer - 1;
      });
    }, 1000);
  };

  // Reset timer and disable resend button
  const resetTimer = () => {
    setTimer(60); // Reset the timer to 60 seconds
    setIsResendEnabled(false); // Disable the resend button
    clearInterval(intervalRef.current); // Clear any existing interval
    startTimer(); // Start the timer again
  };

  useEffect(() => {
    startTimer(); // Start the timer when component is mounted
    return () => clearInterval(intervalRef.current); // Clean up interval on unmount
  }, []);

  const handleChange = (e, index) => {
    const { value } = e.target;
    if (value.length === 1 && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus(); // Move focus to the next input
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && index > 0 && !inputRefs.current[index].value) {
      inputRefs.current[index - 1].focus(); // Move focus to the previous input on backspace
    }
  };

  return (
    <div className="bg-white rounded-lg w-96 p-6 shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Mobile Phone Verification</h2>
      </div>

      <header className="mb-8">
        <p className="text-sm text-slate-500">
          Enter the 4-digit verification code that was sent to your phone
          number.
        </p>
      </header>

      <form id="otp-form" onSubmit={handleSubmit}>
        <div className="flex items-center justify-center gap-3">
          {[...Array(4)].map((_, index) => (
            <input
              key={index}
              type="text"
              className="w-14 h-14 text-center text-2xl font-extrabold text-slate-900 bg-slate-100 border border-transparent hover:border-slate-200 appearance-none rounded p-4 outline-none focus:bg-white focus:border-[#8e8852] focus:ring-2 focus:ring-[#a39f7436]"
              maxLength="1"
              ref={(el) => (inputRefs.current[index] = el)}
              onChange={(e) => handleChange(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
            />
          ))}
        </div>

        <div className="max-w-[260px] mx-auto mt-4">
          <button
            type="submit"
            className="w-full inline-flex justify-center whitespace-nowrap rounded-lg bg-[#A39F74] px-3.5 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-[#8e8852] focus:outline-none focus:ring focus:ring-indigo-300 focus-visible:outline-none focus-visible:ring focus-visible:ring-indigo-300 transition-colors duration-150"
            ref={submitRef}
          >
            Verify Account
          </button>
        </div>
      </form>

      <div className="text-sm text-slate-500 mt-4">
        Didn't receive code?{" "}
        <button
          onClick={handleResend}
          disabled={!isResendEnabled} // Disable if timer is still running
          className={`font-medium ${
            isResendEnabled
              ? "text-[#A39F74] hover:text-[#8e8852]"
              : "text-gray-400 cursor-not-allowed"
          }`}
        >
          Resend {timer > 0 && `(${timer}s)`} {/* Show timer */}
        </button>
      </div>
    </div>
  );
};

export default UserOtp;
