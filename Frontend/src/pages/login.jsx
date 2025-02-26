import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post(
        "/api/v1/users/login",
        { email, password },
        { withCredentials: true }
      );

      console.log("Login successful:", response.data);
      alert("Login successful");

      // Redirect to home page after successful login
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <section className="bg-gray-50 dark:bg-gray-900 min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md bg-white rounded-lg shadow dark:border dark:bg-gray-800 dark:border-gray-700">
        <div className="p-6 space-y-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Login to your account
          </h1>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-900 dark:text-white">
                Your email
              </label>
              <input
                type="email"
                id="email"
                className="w-full p-2.5 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-white"
                placeholder="name@company.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-900 dark:text-white">
                Password
              </label>
              <input
                type="password"
                id="password"
                className="w-full p-2.5 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-white"
                placeholder="••••••••"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="w-full py-2.5 text-white bg-blue-600 hover:bg-blue-700 rounded-lg font-medium"
            >
              Login
            </button>
          </form>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Don’t have an account? <a href="/register" className="text-blue-600 hover:underline">Sign up here</a>
          </p>
        </div>
      </div>
    </section>
  );
}

export default LoginPage;
