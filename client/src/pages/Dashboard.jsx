import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [skills, setSkills] = useState([]);
  const [requestStats, setRequestStats] = useState({
    active: 0,
    completed: 0,
    pending: 0,
  });
  const [recentRequests, setRecentRequests] = useState([]);
  const [name, setName] = useState("");
  const [type, setType] = useState("offered");

  const fetchSkills = async () => {
    try {
      const res = await api.get("/skills");
      setSkills(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchRequestStats = async () => {
    try {
      const res = await api.get("/requests");
      const requests = res.data || [];

      const pending = requests.filter((r) => r.status === "pending").length;
      const completed = requests.filter((r) => r.status === "accepted").length;
      const active = requests.filter((r) => ["pending", "accepted"].includes(r.status)).length;

      setRequestStats({ active, completed, pending });
      setRecentRequests(requests.slice(0, 5));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchSkills();
    fetchRequestStats();
  }, []);

  const handleAddSkill = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("/skills", { name, type });
      setSkills((prev) => [res.data, ...prev]);
      setName("");
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data || err.message;
      alert(msg);
    }
  };

  const getStatusClasses = (status) => {
    if (status === "accepted") return "bg-green-100 text-green-700";
    if (status === "pending") return "bg-yellow-100 text-yellow-700";
    if (status === "rejected") return "bg-red-100 text-red-700";
    return "bg-gray-100 text-gray-700";
  };

  return (
    <div className="min-h-screen pt-12 px-8 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 text-gray-900">
      <header className="max-w-6xl mx-auto mb-8">
        <h1 className="text-4xl font-extrabold text-white">Welcome back, {user?.name || "User"}!</h1>
        <p className="mt-2 text-white/90">Here&apos;s what&apos;s happening with your skill swaps</p>
      </header>

      <main className="max-w-6xl mx-auto space-y-6">
        <section className="grid md:grid-cols-3 gap-6">
          <div className="bg-white/90 p-6 rounded-xl shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-blue-100 rounded-md flex items-center justify-center text-blue-600">?</div>
              <div>
                <div className="text-sm text-gray-600">Active Requests</div>
                <div className="text-2xl font-bold">{requestStats.active}</div>
              </div>
            </div>
          </div>

          <div className="bg-white/90 p-6 rounded-xl shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-green-100 rounded-md flex items-center justify-center text-green-600">?</div>
              <div>
                <div className="text-sm text-gray-600">Completed Swaps</div>
                <div className="text-2xl font-bold">{requestStats.completed}</div>
              </div>
            </div>
          </div>

          <div className="bg-white/90 p-6 rounded-xl shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-yellow-100 rounded-md flex items-center justify-center text-yellow-600">?</div>
              <div>
                <div className="text-sm text-gray-600">Pending Requests</div>
                <div className="text-2xl font-bold">{requestStats.pending}</div>
              </div>
            </div>
          </div>
        </section>

        <section className="grid md:grid-cols-2 gap-6">
          <div className="bg-white/90 p-6 rounded-xl shadow-sm">
            <h3 className="font-semibold mb-4 text-gray-800">Quick Actions</h3>

            <div className="space-y-3">
              <button
                type="button"
                onClick={() => navigate("/skills")}
                className="w-full text-left bg-blue-50 p-4 rounded-md flex items-start gap-4 hover:shadow-sm transition"
                aria-label="Browse Skills"
              >
                <div className="text-blue-600">??</div>
                <div>
                  <div className="font-medium">Browse Skills</div>
                  <div className="text-sm text-gray-600">Find users with skills you need</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => navigate("/profile")}
                className="w-full text-left bg-green-50 p-4 rounded-md flex items-start gap-4 hover:shadow-sm transition"
                aria-label="Update Profile"
              >
                <div className="text-green-600">??</div>
                <div>
                  <div className="font-medium">Update Profile</div>
                  <div className="text-sm text-gray-600">Manage your skills and preferences</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => navigate("/requests")}
                className="w-full text-left bg-purple-50 p-4 rounded-md flex items-start gap-4 hover:shadow-sm transition"
                aria-label="Manage Requests"
              >
                <div className="text-purple-600">??</div>
                <div>
                  <div className="font-medium">Manage Requests</div>
                  <div className="text-sm text-gray-600">View and manage your swap requests</div>
                </div>
              </button>
            </div>
          </div>

          <div className="bg-white/90 p-6 rounded-xl shadow-sm h-full">
            <h3 className="font-semibold mb-4 text-gray-800">Recent Activity</h3>

            {recentRequests.length === 0 ? (
              <div className="h-full min-h-52 flex flex-col items-center justify-center opacity-80">
                <div className="text-3xl mb-3">?</div>
                <div className="font-medium text-gray-600">No recent activity</div>
                <div className="text-sm text-gray-500 mt-2">Start by browsing skills or updating your profile</div>
              </div>
            ) : (
              <div className="space-y-3">
                {recentRequests.map((request) => {
                  const isSender = request.sender?._id === user?._id;
                  const otherUser = isSender ? request.receiver : request.sender;

                  return (
                    <div key={request._id} className="rounded-lg border border-gray-200 bg-white p-3">
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-semibold text-gray-800">
                          {request.skillOffered} ? {request.skillWanted}
                        </p>
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold capitalize ${getStatusClasses(request.status)}`}>
                          {request.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">With {otherUser?.name || "User"}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(request.updatedAt || request.createdAt).toLocaleString()}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
