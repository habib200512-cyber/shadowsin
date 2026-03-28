"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/feed", label: "Inicio", icon: (a: boolean) => <svg className="w-6 h-6" fill={a?"currentColor":"none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"/></svg> },
  { href: "/publicar", label: "Publicar", icon: (a: boolean) => <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15"/></svg> },
  { href: "/conexiones", label: "Conexiones", icon: (a: boolean) => <svg className="w-6 h-6" fill={a?"currentColor":"none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"/></svg> },
  { href: "/perfil", label: "Perfil", icon: (a: boolean) => <svg className="w-6 h-6" fill={a?"currentColor":"none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"/></svg> },
];

export default function BottomNav() {
  const path = usePathname();
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-zinc-200 z-50">
      <div className="max-w-lg mx-auto flex">
        {items.map((item) => {
          const active = path === item.href;
          return (
            <Link key={item.href} href={item.href} className={`flex-1 flex flex-col items-center gap-1 py-3 text-[10px] font-medium transition-colors ${active ? "text-violet-600" : "text-zinc-400"}`}>
              {item.icon(active)}
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
