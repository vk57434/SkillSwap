import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";

export default function Profile() {
  const { user } = useAuth();
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get("/skills");
        setSkills(res.data || []);
      } catch (e) {
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const offered = skills.filter(s => s.type === "offered");
  const wanted = skills.filter(s => s.type === "wanted");

  return (
    <div className="min-h-screen pt-32 px-8 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 text-gray-900">
      <header className="max-w-6xl mx-auto mb-6">
        <h1 className="text-4xl font-bold text-white">My Profile</h1>
        <p className="text-white/90 mt-2">Manage your personal information and skills</p>
      </header>

      <main className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <div className="bg-white/90 p-6 rounded-xl shadow-sm">
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 rounded-full bg-blue-600 text-white flex items-center justify-center text-2xl font-bold">{user?.name?.[0] || 'A'}</div>
              <h3 className="mt-4 font-semibold text-gray-800">{user?.name}</h3>
              <p className="text-sm text-gray-600">{user?.email}</p>
              {user?.location && <p className="text-sm text-gray-500 mt-2">📍 {user.location}</p>}

              <div className="mt-4 w-full text-center">
                <div className="text-sm text-gray-500">★★★★★</div>
                <div className="text-xs text-gray-500 mt-1">0 stars (0 reviews)</div>
              </div>

              <a href="/profile/edit" className="mt-6 inline-block w-full text-center bg-blue-600 text-white py-2 rounded-md">Edit Profile</a>
            </div>
          </div>
        </div>

        <div className="md:col-span-2">
          <div className="bg-white/90 p-6 rounded-xl shadow-sm">
            <div className="mb-4">
              <h4 className="font-semibold text-gray-800">Skills I Offer</h4>
              <div className="mt-3 flex flex-wrap gap-2">
                {loading ? (
                  <div className="text-sm text-gray-500">Loading...</div>
                ) : offered.length === 0 ? (
                  <div className="text-sm text-gray-500">No skills listed</div>
                ) : (
                  offered.map(s => (
                    <span key={s._id} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">{s.name}</span>
                  ))
                )}
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-gray-800">Skills I Want to Learn</h4>
              <div className="mt-3 flex flex-wrap gap-2">
                {loading ? (
                  <div className="text-sm text-gray-500">Loading...</div>
                ) : wanted.length === 0 ? (
                  <div className="text-sm text-gray-500">No skills listed</div>
                ) : (
                  wanted.map(s => (
                    <span key={s._id} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">{s.name}</span>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
