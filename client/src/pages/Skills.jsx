import { useEffect, useState } from "react";
import api from "../utils/api";
import { useNavigate } from "react-router-dom";

export default function Skills() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [allSkills, setAllSkills] = useState([]);
  const [userSkills, setUserSkills] = useState({});
  const [search, setSearch] = useState("");
  const [filterSkill, setFilterSkill] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUsersAndSkills();
  }, []);

  const loadUsersAndSkills = async () => {
    try {
      const usersRes = await api.get("/auth/all");
      setUsers(usersRes.data || []);

      const skillsRes = await api.get("/skills/all/users");
      const allSkillRecords = skillsRes.data || [];
      const skillNames = [...new Set(allSkillRecords.map((s) => s.name))];
      setAllSkills(skillNames);

      const byUser = {};
      allSkillRecords.forEach((skill) => {
        const userId = typeof skill.user === "string" ? skill.user : skill.user?._id;
        if (!userId) return;
        if (!byUser[userId]) {
          byUser[userId] = { offered: [], wanted: [] };
        }
        if (skill.type === "offered") {
          byUser[userId].offered.push(skill.name);
        } else if (skill.type === "wanted") {
          byUser[userId].wanted.push(skill.name);
        }
      });
      setUserSkills(byUser);
    } catch (err) {
      console.error("Failed to load users or skills", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      !search ||
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase());

    if (filterSkill === "all") return matchesSearch;

    const offeredSkills = userSkills[user._id]?.offered || [];
    const wantedSkills = userSkills[user._id]?.wanted || [];
    const matchesSkill = [...offeredSkills, ...wantedSkills].some(
      (s) => s.toLowerCase() === filterSkill.toLowerCase()
    );
    return matchesSearch && matchesSkill;
  });

  return (
    <div className="min-h-screen pt-32 px-8 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500">
      <header className="max-w-6xl mx-auto mb-8">
        <h1 className="text-4xl font-bold text-white">Browse Users</h1>
        <p className="text-white/90 mt-2">
          Find users with skills you need or who want skills you offer
        </p>
      </header>

      <main className="max-w-6xl mx-auto">
        <div className="flex gap-6 mb-6">
          <input
            type="text"
            placeholder="Type to search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 p-3 border border-gray-300 rounded-lg text-gray-900"
          />
          <select
            value={filterSkill}
            onChange={(e) => setFilterSkill(e.target.value)}
            className="p-3 border border-gray-300 rounded-lg w-48 text-gray-900"
          >
            <option value="all">All skills</option>
            {allSkills.map((skill) => (
              <option key={skill} value={skill}>
                {skill}
              </option>
            ))}
          </select>
        </div>

        <p className="mb-6 font-semibold text-white">{filteredUsers.length} users found</p>

        {loading ? (
          <div className="text-center py-12 text-white">Loading users...</div>
        ) : filteredUsers.length === 0 ? (
          <div className="text-center py-12 text-white/80">No users found</div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {filteredUsers.map((user) => (
              <UserCard
                key={user._id}
                user={user}
                offered={userSkills[user._id]?.offered || []}
                wanted={userSkills[user._id]?.wanted || []}
                navigate={navigate}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

function UserCard({ user, offered, wanted, navigate }) {
  const [showSwapModal, setShowSwapModal] = useState(false);
  const [teachSkill, setTeachSkill] = useState("");
  const [learnSkill, setLearnSkill] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const closeModal = () => {
    setShowSwapModal(false);
    setTeachSkill("");
    setLearnSkill("");
    setMessage("");
  };

  const handleRequestSubmit = async (e) => {
    e.preventDefault();
    if (teachSkill.trim().toLowerCase() === learnSkill.trim().toLowerCase()) {
      alert("Teach skill and learn skill should be different.");
      return;
    }

    try {
      setIsSubmitting(true);
      await api.post("/requests", {
        receiver: user._id,
        skillOffered: teachSkill.trim(),
        skillWanted: learnSkill.trim(),
        message: message.trim(),
      });
      closeModal();
      navigate("/requests", { state: { toast: "Swap request sent successfully!" } });
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to send request.";
      alert(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center text-lg font-bold">
            {user.name?.[0] || "A"}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{user.name}</h3>
            <p className="text-sm text-gray-600">{user.email}</p>
          </div>
        </div>

        <div className="mb-3">
          <div className="text-sm text-gray-500">★★★★★ 0 (0 reviews)</div>
        </div>

        <div className="mb-3">
          <p className="text-sm font-semibold text-gray-700 mb-2">Skills Offered:</p>
          <div className="flex flex-wrap gap-2">
            {offered.length === 0 ? (
              <span className="text-xs text-gray-500">None</span>
            ) : (
              offered.map((skill) => (
                <span key={skill} className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                  {skill}
                </span>
              ))
            )}
          </div>
        </div>

        <div className="mb-4">
          <p className="text-sm font-semibold text-gray-700 mb-2">Skills Wanted:</p>
          <div className="flex flex-wrap gap-2">
            {wanted.length === 0 ? (
              <span className="text-xs text-gray-500">None</span>
            ) : (
              wanted.map((skill) => (
                <span key={skill} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                  {skill}
                </span>
              ))
            )}
          </div>
        </div>

        {user.location && <p className="text-sm text-gray-600 mb-4">Location: {user.location}</p>}

        <button
          type="button"
          onClick={() => setShowSwapModal(true)}
          className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          Request Skill Swap
        </button>
      </div>

      {showSwapModal && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4"
          onClick={closeModal}
        >
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute -top-16 -left-20 h-60 w-60 rounded-full bg-cyan-400/30 blur-3xl" />
            <div className="absolute top-1/3 -right-16 h-72 w-72 rounded-full bg-fuchsia-500/30 blur-3xl" />
            <div className="absolute -bottom-20 left-1/3 h-64 w-64 rounded-full bg-blue-500/30 blur-3xl" />
          </div>

          <div
            className="relative w-full max-w-md rounded-2xl border border-white/30 bg-white/95 shadow-2xl p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={closeModal}
              className="absolute right-4 top-4 text-gray-500 hover:text-gray-800 text-xl leading-none"
              aria-label="Close swap request form"
            >
              ×
            </button>

            <h3 className="text-2xl font-bold text-gray-900 mb-1">Create Swap Request</h3>
            <p className="text-sm text-gray-600 mb-5">Request swap with {user.name}</p>

            <form onSubmit={handleRequestSubmit} className="space-y-4">
              <div>
                <label htmlFor={`teach-${user._id}`} className="block text-sm font-semibold text-gray-700 mb-1">
                  Skill you&apos;ll teach
                </label>
                <input
                  id={`teach-${user._id}`}
                  type="text"
                  placeholder="Enter the skill you'll teach"
                  value={teachSkill}
                  onChange={(e) => setTeachSkill(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label htmlFor={`learn-${user._id}`} className="block text-sm font-semibold text-gray-700 mb-1">
                  Skill you want to learn
                </label>
                <select
                  id={`learn-${user._id}`}
                  value={learnSkill}
                  onChange={(e) => setLearnSkill(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select a skill</option>
                  {[...new Set(offered)].map((skill) => (
                    <option key={skill} value={skill}>
                      {skill}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor={`msg-${user._id}`} className="block text-sm font-semibold text-gray-700 mb-1">
                  Message (optional)
                </label>
                <textarea
                  id={`msg-${user._id}`}
                  placeholder="Add a personal message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={3}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-gray-900 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 rounded-lg bg-gray-200 text-gray-700 py-2.5 font-semibold hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 rounded-lg bg-blue-600 text-white py-2.5 font-semibold hover:bg-blue-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Sending..." : "Send Request"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}


