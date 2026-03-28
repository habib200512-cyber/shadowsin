import { getAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function ConexionesPage() {
  const session = await getAuthSession();
  if (!session) redirect("/login");
  const userId = (session.user as any).id;

  const users = await prisma.user.findMany({
    where: { id: { not: userId } },
    take: 20,
    select: { id: true, name: true, username: true, image: true, bio: true, _count: { select: { posts: true, followers: true } } },
  });

  return (
    <div className="max-w-lg mx-auto px-4 py-6">
      <h1 className="text-lg font-bold text-zinc-800 mb-4">Conexiones</h1>
      {users.length === 0 ? (
        <div className="bg-white rounded-2xl border border-zinc-100 p-8 text-center">
          <div className="text-4xl mb-3">👥</div>
          <p className="text-zinc-500 text-sm">Aún no hay otros usuarios.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {users.map((user) => (
            <div key={user.id} className="bg-white rounded-2xl border border-zinc-100 p-4 flex items-center gap-3">
              {user.image ? (
                <img src={user.image} className="w-12 h-12 rounded-full object-cover flex-shrink-0" alt=""/>
              ) : (
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center text-white font-bold flex-shrink-0">
                  {(user.username ?? user.name ?? "?")[0].toUpperCase()}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-zinc-800 truncate">{user.username ?? user.name ?? "Usuario"}</p>
                <p className="text-xs text-zinc-400">{user._count.posts} posts · {user._count.followers} seguidores</p>
                {user.bio && <p className="text-xs text-zinc-500 truncate mt-0.5">{user.bio}</p>}
              </div>
              <button className="flex-shrink-0 px-3 py-1.5 rounded-xl border border-violet-200 text-violet-600 text-xs font-medium hover:bg-violet-50">
                Conectar
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
