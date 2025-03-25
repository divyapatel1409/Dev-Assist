import React, { useState, useContext } from "react";
import axios from "axios";
import appConfig from "../appConfig";
import { FaSpinner } from "react-icons/fa"; // Importing loading spinner icon
import { AuthContext } from "../context/AuthContext";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const {user, setUser } = useContext(AuthContext);

  const loginApiEndpoint = `${appConfig.API_BASE_URL}/api/login`;

  const validate = () => {
    const errors = {};
    if (!email) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = "Invalid email format";
    }
    if (!password) {
      errors.password = "Password is required";
    } else if (password.length < 8) {
      errors.password = "Password must be at least 8 characters";
    }
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setSuccessMessage("");
    const validationErrors = validate();

    if (Object.keys(validationErrors).length === 0) {
      try {
        setLoading(true);
        const requestData = { email, password };
        const response = await axios.post(loginApiEndpoint, requestData);
        if (response.data.success) {
          setEmail("");
          setPassword("");
          const user={
            email: response.data.user,
            token: response.data.token
          }
          console.log(user);
          localStorage.setItem("token", user.token)
          setUser(user);
        } else {
          setErrors({ api: "Invalid credentials!" });
        }
      } catch (error) {
        setErrors({ api: error.response?.data?.message || "Invalid credentials!" });
      } finally {
        setLoading(false);
      }
    } else {
      setErrors(validationErrors);
    }
  };

  return (
    <>
        {/* Success Message */}
        {successMessage && (
          <div className="mb-4 p-3 text-green-700 bg-green-100 border border-green-300 rounded-md text-center">
            {successMessage}
          </div>
        )}

        {/* Error Message */}
        {errors.api && (
          <div className="mb-4 p-3 text-red-700 bg-red-100 border border-red-300 rounded-md text-center">
            {errors.api}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-300"
              placeholder="Enter your email"
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-300"
              placeholder="Enter your password"
            />
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md flex justify-center items-center"
            disabled={loading}
          >
            {loading ? (
              <FaSpinner className="animate-spin mr-2" size={20} />
            ) : (
              "Login"
            )}
          </button>
        </form>
      </>
  );
};

export default LoginForm;
