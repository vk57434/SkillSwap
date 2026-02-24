export default function Settings() {
  return (
    <div className="min-h-screen pt-32 px-6 text-white bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500">
      <h1 className="text-4xl font-bold mb-6">Settings</h1>
      <div className="bg-white/20 p-6 rounded-xl max-w-xl space-y-4">
        <label className="block">
          <span className="block mb-2">Notifications</span>
          <select className="w-full p-3 rounded">
            <option>Enabled</option>
            <option>Disabled</option>
          </select>
        </label>
        <button className="bg-white text-indigo-700 px-4 py-2 rounded font-semibold">Save</button>
      </div>
    </div>
  );
}
