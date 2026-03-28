"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

type Props = { user: { name?: string | null; image?: string | null } };

export default function Navbar({ user }: Props) {
  const path = usePathname();

  const tabs = [
    { href: "/feed", label: "Inicio" },
    { href: "/publicar", label: "+ Publicar" },
    { href: "/conexiones", label: "Conexiones", badge: 4 },
    { href: "/perfil", label: "Mi perfil" },
  ];

  return (
    <header className="bg-[#F0EDE8] sticky top-0 z-50">
      <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-violet-600">ShadowSin</h1>
          <p className="text-[10px] text-zinc-400 tracking-widest uppercase">share without limits</p>
        </div>
        <div className="flex gap-2">
          <button className="w-9 h-9 rounded-full bg-white border border-zinc-200 flex items-center justify-center text-zinc-500">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
            </svg>
          </button>
          <button className="w-9 h-9 rounded-full bg-white border border-zinc-200 flex items-center justify-center text-zinc-500">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
            </svg>
          </button>
        </div>
      </div>
      <div className="max-w-lg mx-auto px-4 pb-2 flex gap-2 overflow-x-auto scrollbar-hide">
        {tabs.map((tab) => (
          <Link
            key={tab.href}
            href={tab.href}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all flex items-center gap-1 ${
              path === tab.href
                ? "bg-violet-600 text-white"
                : "bg-white border border-zinc-200 text-zinc-700 hover:bg-zinc-50"
            }`}
          >
            {tab.label}
            {tab.badge && (
              <span className="bg-red-500 text-white text-[10px] rounded-full px-1.5 py-0.5 leading-none">
                {tab.badge}
              </span>
            )}
          </Link>
        ))}
      </div>
    </header>
  );
}
