export default function SkillCard({ title, description }) {
  return (
    <div className="bg-white/20 backdrop-blur-lg p-6 rounded-2xl shadow-xl hover:scale-105 transition">

      <h3 className="text-2xl font-bold text-white">
        {title}
      </h3>

      <p className="text-white/80 mt-2">
        {description}
      </p>

    </div>
  );
}
