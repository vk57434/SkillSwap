import SkillCard from "../components/SkillCard";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 pt-32 px-6">

      <div className="text-center">
        <h1 className="text-6xl font-extrabold text-white">
          Exchange Skills, Not Money.
        </h1>

        <p className="text-white/90 mt-4 max-w-2xl mx-auto">
          Teach what you know. Learn what you don’t.
          SkillSwap connects passionate learners worldwide.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 mt-16 max-w-6xl mx-auto">
        <SkillCard title="Teach Skills" description="Help others while growing your network." />
        <SkillCard title="Learn Fast" description="Gain real-world skills from real people." />
        <SkillCard title="Build Connections" description="Collaborate with talented learners." />
      </div>

    </div>
  );
}
