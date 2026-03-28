"use client";
import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";

type Post = {
  id: string;
  content: string;
  isAnonymous: boolean;
  isPremium: boolean;
  price?: number | null;
  tags: string[];
  createdAt: Date;
  user: { id: string; name?: string | null; username?: string | null; image?: string | null };
  media: { id: string; url: string; type: string }[];
  _count: { likes: number; comments: number };
  userHasLiked?: boolean;
};

export default function PostCard({ post, currentUserId }: { post: Post; currentUserId: string }) {
  const [likes, setLikes] = useState(post._count.likes);
  const [liked, setLiked] = useState(post.userHasLiked ?? false);
  const [loading, setLoading] = useState(false);

  const authorName = post.isAnonymous ? "Anónimo" : (post.user.username ?? post.user.name ?? "Usuario");
  const timeAgo = formatDistanceToNow(new Date(post.createdAt), { addSuffix: true, locale: es });

  const handleLike = async () => {
    if (loading) return;
    setLoading(true);
    const prev = liked;
    setLiked(!liked);
    setLikes((l) => l + (liked ? -1 : 1));
    try {
      const res = await fetch("/api/likes", {
        method: liked ? "DELETE" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId: post.id }),
      });
      if (!res.ok) throw new Error();
    } catch {
      setLiked(prev);
      setLikes((l) => l + (prev ? 1 : -1));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <div className="flex items-center gap-2">
          {post.user.image && !post.isAnonymous ? (
            <img src={post.user.image} className="w-9 h-9 rounded-full object-cover" alt="" />
          ) : (
            <div className="w-9 h-9 rounded-full bg-violet-500 flex items-center justify-center text-white text-sm font-bold">
              {post.isAnonymous ? "?" : authorName[0].toUpperCase()}
            </div>
          )}
          <div>
            <p className="text-sm font-semibold text-zinc-800">{authorName}</p>
            <p className="text-xs text-zinc-400">
              {timeAgo}
              {post.isPremium && <span className="ml-2 text-amber-500 font-medium">· Premium</span>}
            </p>
          </div>
        </div>
        <button className="w-8 h-8 flex items-center justify-center text-zinc-400 rounded-full hover:bg-zinc-50">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM18.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"/>
          </svg>
        </button>
      </div>

      {/* Media */}
      {post.media.length > 0 && (
        <div className="w-full">
          {post.media[0].type === "image" && (
            <img src={post.media[0].url} className="w-full object-cover max-h-80" alt="" />
          )}
          {post.media[0].type === "video" && (
            <video src={post.media[0].url} controls className="w-full max-h-80 bg-black" />
          )}
          {post.media[0].type === "audio" && (
            <div className="mx-4 my-2 bg-violet-50 rounded-xl p-3 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-violet-500 flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
              </div>
              <audio src={post.media[0].url} controls className="flex-1 h-8" />
            </div>
          )}
        </div>
      )}

      {/* Premium lock */}
      {post.isPremium && post.price && (
        <div className="mx-4 my-3 border border-zinc-100 rounded-xl p-4 text-center">
          <div className="text-2xl mb-1">🔒</div>
          <p className="text-sm font-semibold text-zinc-700">Contenido para suscriptores</p>
          <button className="mt-2 px-5 py-1.5 bg-zinc-900 text-white text-sm font-medium rounded-lg hover:bg-zinc-700 transition-colors">
            Ver por ${post.price}
          </button>
        </div>
      )}

      {/* Content */}
      <div className="px-4 py-2">
        <p className="text-sm text-zinc-700 leading-relaxed">{post.content}</p>
      </div>

      {/* Tags */}
      {post.tags.length > 0 && (
        <div className="px-4 pb-2 flex flex-wrap gap-1">
          {post.tags.map((tag) => (
            <span key={tag} className="text-xs text-violet-600 bg-violet-50 px-2 py-0.5 rounded-full">#{tag}</span>
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="px-4 pb-4 pt-1 flex items-center gap-2">
        <button onClick={handleLike} className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-sm font-medium transition-all ${liked ? "bg-red-50 border-red-200 text-red-500" : "bg-white border-zinc-200 text-zinc-600 hover:border-red-200"}`}>
          <svg className="w-4 h-4" fill={liked?"currentColor":"none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"/>
          </svg>
          {likes.toLocaleString()}
        </button>
        <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-zinc-200 text-sm font-medium text-zinc-600 hover:border-violet-200 bg-white">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.923 1.785A5.969 5.969 0 006 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337z"/>
          </svg>
          {post._count.comments}
        </button>
        <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-zinc-200 text-sm font-medium text-zinc-600 hover:border-violet-200 bg-white">
          <span className="text-base">💀</span> Conectar
        </button>
        <button className="ml-auto w-9 h-9 flex items-center justify-center rounded-xl border border-zinc-200 text-zinc-400 hover:text-violet-500 bg-white">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"/>
          </svg>
        </button>
      </div>
    </div>
  );
}
