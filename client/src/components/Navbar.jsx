import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/skillswap-logo.svg";

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();

  return (
    <nav className="fixed w-full backdrop-blur-lg bg-white/10 border-b border-white/20 z-50">
      <div className="max-w-6xl mx-auto flex justify-between items-center px-4 py-3">

        <div className="flex items-center gap-3">
          <img src={logo} alt="SkillSwap" className="w-8 h-8" />
          <h1 className="text-2xl font-bold text-white">SkillSwap</h1>
        </div>

        <div className="space-x-4 flex items-center">
          {isAuthenticated && (
            <>
              <Link className="text-white hover:text-yellow-300" to="/dashboard">Dashboard</Link>
            </>
          )}

          {isAuthenticated ? (
            <>
              <span className="text-white/90 mr-1 max-w-32 truncate">{user?.name}</span>
              <button
                onClick={logout}
                className="bg-white text-indigo-700 px-3 py-1.5 rounded-lg font-semibold hover:bg-yellow-300 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              className="bg-white text-indigo-700 px-3 py-1.5 rounded-lg font-semibold hover:bg-yellow-300 transition"
              to="/login"
            >
              Login
            </Link>
          )}

        </div>

      </div>
    </nav>
  );
}
