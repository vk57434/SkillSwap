import { useState } from "react";
import api from "../utils/api";

export default function Matches() {
  const [q, setQ] = useState("");
  const [type, setType] = useState("all");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [lessons, setLessons] = useState({});
  const [queryLesson, setQueryLesson] = useState("");

  const search = async () => {
    setLoading(true);
    try {
      const params = { q };
      if (type !== "all") params.type = type;
      const res = await api.get("/skills/all/users", { params });
      setResults(res.data || []);
      setQueryLesson("");
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data || err.message;
      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  const learnWithAI = async (skillId, name) => {
    try {
      const res = await api.post("/ai/lesson", { skill: name });
      setLessons(prev => ({ ...prev, [skillId]: res.data?.lesson }));
      if (!skillId) {
        setQueryLesson(res.data?.lesson || "");
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data || err.message;
      alert(msg);
    }
  };

  return (
    <div className="min-h-screen pt-32 px-6 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500">

      <h1 className="text-4xl text-white font-bold mb-8">Skill Search</h1>

      <div className="max-w-3xl space-y-4">
        <div className="flex gap-3">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search skills..."
            className="p-3 rounded-lg"
          />
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="p-3 rounded-lg"
          >
            <option value="all">All</option>
            <option value="offered">Offered</option>
            <option value="wanted">Wanted</option>
          </select>
          <button
            onClick={search}
            className="bg-white text-indigo-700 px-4 py-2 rounded-lg font-bold"
          >
            Search
          </button>
        </div>

        {loading && <p className="text-white/90">Searching...</p>}

        <ul className="space-y-4">
          {results.map((s) => (
            <li key={s._id} className="bg-white/20 p-4 rounded-xl text-white">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-bold">{s.name}</p>
                  <p className="text-white/80">{s.type} by {s.user?.name} ({s.user?.email})</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => learnWithAI(s._id, s.name)}
                    className="bg-white text-indigo-700 px-3 py-2 rounded-lg font-semibold"
                  >
                    Learn with AI
                  </button>
                </div>
              </div>
              {lessons[s._id] && (
                <div className="mt-3 bg-white/10 p-3 rounded">
                  <pre className="whitespace-pre-wrap text-white/90">{lessons[s._id]}</pre>
                </div>
              )}
            </li>
          ))}
          {results.length === 0 && !loading && (
            <div className="text-white/80">
              <p>No results</p>
              {q && (
                <div className="mt-3">
                  <button
                    onClick={() => learnWithAI(null, q)}
                    className="bg-white text-indigo-700 px-3 py-2 rounded-lg font-semibold"
                  >
                    Learn “{q}” with AI
                  </button>
                  {queryLesson && (
                    <div className="mt-3 bg-white/10 p-3 rounded">
                      <pre className="whitespace-pre-wrap text-white/90">{queryLesson}</pre>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </ul>
      </div>

    </div>
  );
}
