"use client";
const STORIES = [
  { id: "1", username: "Luna_mx", color: "bg-violet-500", emoji: "🎵" },
  { id: "2", username: "AnonUser", color: "bg-zinc-600", emoji: "📷" },
  { id: "3", username: "Sombra_K", color: "bg-pink-500", emoji: "🎬" },
  { id: "4", username: "Xeno_77", color: "bg-amber-500", emoji: "🌙" },
];

export default function Stories() {
  return (
    <div className="max-w-lg mx-auto px-4 py-3">
      <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-1">
        <div className="flex flex-col items-center gap-1 flex-shrink-0">
          <button className="w-14 h-14 rounded-full border-2 border-dashed border-zinc-300 bg-white flex items-center justify-center hover:border-violet-400 transition-colors">
            <svg className="w-6 h-6 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15"/>
            </svg>
          </button>
          <span className="text-[10px] text-zinc-500">Tu historia</span>
        </div>
        {STORIES.map((s) => (
          <div key={s.id} className="flex flex-col items-center gap-1 flex-shrink-0">
            <button className="w-14 h-14 rounded-full border-2 border-violet-500 p-0.5 hover:scale-105 transition-transform">
              <div className={`w-full h-full rounded-full ${s.color} flex items-center justify-center text-xl`}>{s.emoji}</div>
            </button>
            <span className="text-[10px] text-zinc-500 whitespace-nowrap">{s.username}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
