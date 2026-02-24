export default function UserCard({ name, skill }) {
  return (
    <div className="
      bg-white/90 
      text-gray-800
      p-6 
      rounded-2xl 
      shadow-2xl 
      hover:scale-105 
      transition 
      flex 
      justify-between 
      items-center
    ">

      <div>
        <h2 className="text-xl font-bold">
          {name}
        </h2>

        <p className="opacity-70">
          Teaches: {skill}
        </p>
      </div>

      <button className="
        bg-indigo-600 
        text-white 
        px-5 
        py-2 
        rounded-lg 
        font-semibold
        hover:bg-indigo-700
      ">
        Request
      </button>

    </div>
  );
}
