import { getAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import SignOutButton from "@/components/ui/SignOutButton";

export default async function PerfilPage() {
  const session = await getAuthSession();
  if (!session) redirect("/login");
  const userId = (session.user as any).id;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { _count: { select: { posts: true, followers: true, following: true } } },
  });

  if (!user) redirect("/login");

  return (
    <div className="max-w-lg mx-auto px-4 py-6 space-y-4">
      <div className="bg-white rounded-2xl border border-zinc-100 p-6 text-center">
        {user.image ? (
          <img src={user.image} className="w-20 h-20 rounded-full mx-auto mb-3 object-cover" alt=""/>
        ) : (
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-violet-500 to-pink-500 mx-auto mb-3 flex items-center justify-center text-3xl font-bold text-white">
            {(user.name ?? user.email ?? "?")[0].toUpperCase()}
          </div>
        )}
        <h2 className="text-lg font-bold text-zinc-800">{user.username ?? user.name ?? "Usuario"}</h2>
        <p className="text-sm text-zinc-400">{user.email}</p>
        {user.bio && <p className="text-sm text-zinc-600 mt-2">{user.bio}</p>}
        <div className="flex justify-center gap-8 mt-4 pt-4 border-t border-zinc-100">
          {[["Posts", user._count.posts], ["Seguidores", user._count.followers], ["Siguiendo", user._count.following]].map(([label, count]) => (
            <div key={label as string} className="text-center">
              <p className="text-lg font-bold text-zinc-800">{count}</p>
              <p className="text-xs text-zinc-400">{label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-zinc-100 overflow-hidden">
        {[["✏️","Editar perfil"],["🔔","Notificaciones"],["🔒","Privacidad"],["💳","Suscripción"]].map(([icon, label]) => (
          <button key={label as string} className="w-full flex items-center gap-3 px-4 py-3.5 text-left hover:bg-zinc-50 transition-colors border-b border-zinc-100 last:border-0">
            <span className="text-lg">{icon}</span>
            <span className="text-sm font-medium text-zinc-700">{label}</span>
            <svg className="w-4 h-4 text-zinc-300 ml-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5"/></svg>
          </button>
        ))}
      </div>

      <SignOutButton />
    </div>
  );
}
