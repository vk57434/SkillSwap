import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";

export default function Login() {

  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("/auth/login", { email, password });

      // Save user + token via context (also persists to localStorage inside context if needed)
      login(res.data);

      // redirect
      navigate("/dashboard");

    } catch (error) {
      const errorMsg = error.response?.data?.message || error.response?.data || error.message || "Login Failed";
      console.log(errorMsg);
      alert(errorMsg);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500">

      <form onSubmit={handleLogin} className="bg-white/20 backdrop-blur-lg p-10 rounded-2xl w-96 shadow-2xl">

        <h2 className="text-3xl text-white font-bold mb-6 text-center">
          Welcome Back 👋
        </h2>

        {/* Email */}
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 mb-4 rounded-lg outline-none"
          placeholder="Email"
          required
        />

        {/* Password */}
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 mb-6 rounded-lg outline-none"
          placeholder="Password"
          type="password"
          required
        />

        {/* Login Button */}
        <button type="submit" className="w-full bg-white text-indigo-700 p-3 rounded-lg font-bold hover:scale-105 transition cursor-pointer">
          Login
        </button>

        {/* Register Navigation */}
        <p className="text-white text-center mt-6">
          Don’t have an account?{" "}
          <Link to="/register" className="font-bold text-yellow-300 hover:underline">
            Register here
          </Link>
        </p>

      </form>
    </div>
  );
}
