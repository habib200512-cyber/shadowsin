import { getAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Stories from "@/components/feed/Stories";
import PostCard from "@/components/feed/PostCard";

export default async function FeedPage() {
  const session = await getAuthSession();
  if (!session) redirect("/login");
  const userId = (session.user as any).id;

  const posts = await prisma.post.findMany({
    orderBy: { createdAt: "desc" },
    take: 30,
    include: {
      user: { select: { id: true, username: true, name: true, image: true } },
      media: true,
      likes: { where: { userId }, select: { id: true } },
      _count: { select: { likes: true, comments: true } },
    },
  });

  const postsWithLike = posts.map((p) => ({ ...p, userHasLiked: p.likes.length > 0 }));

  return (
    <div className="max-w-lg mx-auto">
      <Stories />
      <div className="px-4 space-y-4 pb-4">
        {postsWithLike.length === 0 ? (
          <div className="bg-white rounded-2xl border border-zinc-100 p-8 text-center">
            <div className="text-4xl mb-3">🌙</div>
            <p className="text-zinc-500 text-sm">Aún no hay posts.</p>
            <p className="text-zinc-400 text-xs mt-1">¡Sé el primero en publicar!</p>
          </div>
        ) : (
          postsWithLike.map((post) => <PostCard key={post.id} post={post} currentUserId={userId} />)
        )}
      </div>
    </div>
  );
}
