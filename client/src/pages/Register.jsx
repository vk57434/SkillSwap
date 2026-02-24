import { useState } from "react";
import api from "../utils/api";
import { useNavigate } from "react-router-dom";

export default function Register() {

  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [location, setLocation] = useState("");
  const [teachSkills, setTeachSkills] = useState("");
  const [learnSkills, setLearnSkills] = useState("");
  const [availability, setAvailability] = useState("Flexible");
  const [visibility, setVisibility] = useState("Public (Others can find you)");
  const [showPassword, setShowPassword] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      return alert("Passwords do not match");
    }

    try {
      const res = await api.post("/auth/register", {
        name,
        email,
        password,
        location,
        teachSkills,
        learnSkills,
        availability,
        visibility
      });

      localStorage.setItem("skillswapUser", JSON.stringify(res.data));
      navigate("/dashboard");

    } catch (error) {
      console.log(error.response?.data || error.message);
      alert(error.response?.data || "Registration Failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500">
      <form
        onSubmit={handleRegister}
        className="bg-white/20 backdrop-blur-lg p-10 rounded-2xl w-96 shadow-2xl"
      >
        <h2 className="text-3xl text-white font-bold mb-6 text-center">Create Account</h2>

        <label className="text-sm text-white">Name</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-3 mb-4 border rounded-md"
          placeholder="your name"
          required
        />

        <label className="text-sm text-white">Email Address</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 mb-4 border rounded-md"
          placeholder="you@domain.com"
          required
        />

        <label className="text-sm text-white">Password</label>
        <div className="relative mb-4">
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border rounded-md"
            placeholder="********"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-3 text-gray-500"
            aria-label="toggle password"
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>

        <label className="text-sm text-white">Confirm Password</label>
        <div className="relative mb-4">
          <input
            type={showPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full p-3 border rounded-md"
            placeholder="********"
            required
          />
        </div>

        <label className="text-sm text-white">Location (Optional)</label>
        <input
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="w-full p-3 mb-4 border rounded-md"
          placeholder="Lucknow"
        />

        <label className="text-sm text-white">Skills You Can Teach (Optional)</label>
        <input
          value={teachSkills}
          onChange={(e) => setTeachSkills(e.target.value)}
          className="w-full p-3 mb-4 border rounded-md"
          placeholder="JS, Node, React, Mongodb"
        />

        <label className="text-sm text-white">Skills You Want to Learn (Optional)</label>
        <input
          value={learnSkills}
          onChange={(e) => setLearnSkills(e.target.value)}
          className="w-full p-3 mb-4 border rounded-md"
          placeholder="Python, Photography, Cooking, etc. (comma-separated)"
        />

        <label className="text-sm text-white">Availability</label>
        <select
          value={availability}
          onChange={(e) => setAvailability(e.target.value)}
          className="w-full p-3 mb-4 border rounded-md"
        >
          <option>Flexible</option>
          <option>Weekdays</option>
          <option>Weekends</option>
          <option>Mornings</option>
          <option>Evenings</option>
        </select>

        <label className="text-sm text-white">Profile Visibility</label>
        <select
          value={visibility}
          onChange={(e) => setVisibility(e.target.value)}
          className="w-full p-3 mb-6 border rounded-md"
        >
          <option>Public (Others can find you)</option>
          <option>Private (Only matches can see you)</option>
        </select>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-3 rounded-md font-semibold hover:bg-blue-700 transition"
        >
          Create Account
        </button>
      </form>
    </div>
  );
}
