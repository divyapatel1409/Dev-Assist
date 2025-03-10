import React, { useState } from "react";
import LoginForm from "./LoginForm";
import RegistrationForm from "./RegistrationForm";

const AccountWrapper = () => {
  const [isLogin, setIsLogin] = useState(true); // State to toggle between forms

  return (
    <div className="flex justify-center items-center min-h-screen bg-white p-6">
      <div className="bg-white shadow-lg rounded-lg px-8 py-6 w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl border border-gray-200">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
          {isLogin ? "Login to Your Account" : "Create an Account"}
        </h2>

        {/* Toggle Forms Based on State */}
        {isLogin ? <LoginForm /> : <RegistrationForm />}

        {/* Toggle Link */}
        <p className="mt-4 text-sm text-gray-600 text-center">
          {isLogin ? (
            <>
              Don't have an account?{" "}
              <button
                onClick={() => setIsLogin(false)}
                className="text-blue-500 hover:underline font-medium"
              >
                Sign up
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button
                onClick={() => setIsLogin(true)}
                className="text-blue-500 hover:underline font-medium"
              >
                Login
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
};

export default AccountWrapper;
