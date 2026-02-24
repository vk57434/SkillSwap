import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";
import { useNavigate } from "react-router-dom";

export default function EditProfile() {
  const { user, login } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [location, setLocation] = useState("");
  const [offerInput, setOfferInput] = useState("");
  const [wantInput, setWantInput] = useState("");
  const [offered, setOffered] = useState([]); // array of skill objects
  const [wanted, setWanted] = useState([]); // array of skill objects

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
      setLocation(user.location || "");
    }

    // load user's skills from API
    const loadSkills = async () => {
      try {
        const res = await api.get('/skills');
        const skills = res.data || [];
        setOffered(skills.filter(s => s.type === 'offered'));
        setWanted(skills.filter(s => s.type === 'wanted'));
      } catch (err) {
        console.error('Failed to load skills', err);
      }
    };

    loadSkills();
  }, [user]);

  const addOffered = async () => {
    const v = offerInput.trim();
    if (!v) return;
    try {
      const res = await api.post('/skills', { name: v, type: 'offered' });
      setOffered(prev => [res.data, ...prev]);
      setOfferInput("");
    } catch (err) {
      console.error('Failed to add offered skill', err);
      alert('Failed to add skill');
    }
  };

  const removeOffered = async (idx) => {
    const skill = offered[idx];
    if (!skill?._id) return;
    try {
      await api.delete(`/skills/${skill._id}`);
      setOffered(prev => prev.filter((_,i)=>i!==idx));
    } catch (err) {
      console.error('Failed to remove offered skill', err);
      alert('Failed to remove skill');
    }
  };

  const addWanted = async () => {
    const v = wantInput.trim();
    if (!v) return;
    try {
      const res = await api.post('/skills', { name: v, type: 'wanted' });
      setWanted(prev => [res.data, ...prev]);
      setWantInput("");
    } catch (err) {
      console.error('Failed to add wanted skill', err);
      alert('Failed to add skill');
    }
  };

  const removeWanted = async (idx) => {
    const skill = wanted[idx];
    if (!skill?._id) return;
    try {
      await api.delete(`/skills/${skill._id}`);
      setWanted(prev => prev.filter((_,i)=>i!==idx));
    } catch (err) {
      console.error('Failed to remove wanted skill', err);
      alert('Failed to remove skill');
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    // No server endpoint for full profile update in current API; just attempt to update skills if available
    try {
      // Optionally send skills to /skills endpoint
      // For now store locally in localStorage and navigate back to profile
      const updated = { ...user, name, email, location };
      // update context + localStorage
      login(updated);
      // In a real app, call API to persist changes
      navigate('/profile');
    } catch (err) {
      console.error(err);
      alert('Failed to save changes');
    }
  };

  return (
    <div className="min-h-screen pt-32 px-8 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 text-gray-900">
      <header className="max-w-6xl mx-auto mb-6">
        <h1 className="text-4xl font-bold text-white">Edit Profile</h1>
        <p className="text-white/90 mt-2">Manage your personal information and skills</p>
      </header>

      <main className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <div className="bg-white/90 p-6 rounded-xl shadow-sm">
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 rounded-full bg-blue-600 text-white flex items-center justify-center text-2xl font-bold">{name?.[0] || 'A'}</div>
              <h3 className="mt-4 font-semibold text-gray-800">{name}</h3>
              <p className="text-sm text-gray-600">{email}</p>
              {location && <p className="text-sm text-gray-500 mt-2">📍 {location}</p>}

              <div className="mt-4 w-full text-center">
                <div className="text-sm text-gray-500">★★★★★</div>
                <div className="text-xs text-gray-500 mt-1">0 stars (0 reviews)</div>
              </div>

            </div>
          </div>
        </div>

        <div className="md:col-span-2">
          <form onSubmit={handleSave} className="bg-white/90 p-6 rounded-xl shadow-sm">
            <div className="mb-4">
              <label className="block text-sm text-gray-700 mb-1">Name</label>
              <input value={name} onChange={e=>setName(e.target.value)} className="w-full p-3 border rounded" />
            </div>

            <div className="mb-4">
              <label className="block text-sm text-gray-700 mb-1">Email</label>
              <input value={email} onChange={e=>setEmail(e.target.value)} className="w-full p-3 border rounded" />
            </div>

            <div className="mb-4">
              <label className="block text-sm text-gray-700 mb-1">Location</label>
              <input value={location} onChange={e=>setLocation(e.target.value)} className="w-full p-3 border rounded" />
            </div>

            <div className="mb-4">
              <label className="block text-sm text-gray-700 mb-1">Skills I Offer</label>
              <div className="flex gap-3">
                <input value={offerInput} onChange={e=>setOfferInput(e.target.value)} placeholder="Add a skill you can teach" className="flex-1 p-3 border rounded" />
                <button type="button" onClick={addOffered} className="bg-green-600 text-white px-4 rounded">Add</button>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {offered.map((s,i)=> (
                  <span key={s._id || `${s}-${i}`} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm flex items-center gap-2">
                    {s.name || s} <button type="button" onClick={()=>removeOffered(i)} className="text-green-600">×</button>
                  </span>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm text-gray-700 mb-1">Skills I Want to Learn</label>
              <div className="flex gap-3">
                <input value={wantInput} onChange={e=>setWantInput(e.target.value)} placeholder="Add a skill you want to learn" className="flex-1 p-3 border rounded" />
                <button type="button" onClick={addWanted} className="bg-blue-600 text-white px-4 rounded">Add</button>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {wanted.map((s,i)=> (
                  <span key={s._id || `${s}-${i}`} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm flex items-center gap-2">
                    {s.name || s} <button type="button" onClick={()=>removeWanted(i)} className="text-blue-600">×</button>
                  </span>
                ))}
              </div>
            </div>

            <div className="flex gap-4">
              <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded">Save Changes</button>
              <button type="button" onClick={()=>navigate('/profile')} className="bg-gray-300 text-gray-700 px-6 py-2 rounded">Cancel</button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
