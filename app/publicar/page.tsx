"use client";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function PublicarPage() {
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  const [price, setPrice] = useState("");
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<"image"|"audio"|"video"|null>(null);
  const [loading, setLoading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setMediaFile(file);
    setMediaPreview(URL.createObjectURL(file));
    if (file.type.startsWith("image/")) setMediaType("image");
    else if (file.type.startsWith("video/")) setMediaType("video");
    else if (file.type.startsWith("audio/")) setMediaType("audio");
  };

  const handleSubmit = async () => {
    if (!content.trim()) return toast.error("Escribí algo primero");
    setLoading(true);
    try {
      let mediaData = null;
      if (mediaFile) {
        const fd = new FormData();
        fd.append("file", mediaFile);
        const up = await fetch("/api/upload", { method: "POST", body: fd });
        if (!up.ok) throw new Error("Error al subir archivo");
        mediaData = await up.json();
      }
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: content.trim(),
          tags: tags.split(",").map((t) => t.trim().replace("#", "")).filter(Boolean),
          isAnonymous,
          isPremium,
          price: isPremium && price ? parseFloat(price) : null,
          media: mediaData,
        }),
      });
      if (!res.ok) throw new Error("Error al publicar");
      toast.success("¡Publicado!");
      router.push("/feed");
      router.refresh();
    } catch (err: any) {
      toast.error(err.message ?? "Error al publicar");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-6 space-y-4">
      <h1 className="text-lg font-bold text-zinc-800">Nueva publicación</h1>

      <div className="bg-white rounded-2xl border border-zinc-100 p-4">
        <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="¿Qué querés compartir hoy?" rows={4} className="w-full text-sm text-zinc-700 placeholder:text-zinc-400 resize-none outline-none"/>
        {mediaPreview && (
          <div className="mt-3 relative">
            {mediaType === "image" && <img src={mediaPreview} className="w-full rounded-xl object-cover max-h-60" alt=""/>}
            {mediaType === "video" && <video src={mediaPreview} controls className="w-full rounded-xl max-h-60"/>}
            {mediaType === "audio" && <audio src={mediaPreview} controls className="w-full"/>}
            <button onClick={() => { setMediaFile(null); setMediaPreview(null); setMediaType(null); }} className="absolute top-2 right-2 w-7 h-7 bg-black/60 rounded-full flex items-center justify-center text-white text-xs">✕</button>
          </div>
        )}
        <div className="mt-3 flex gap-2 border-t border-zinc-100 pt-3">
          <input ref={fileRef} type="file" accept="image/*,video/*,audio/*" onChange={handleFile} className="hidden"/>
          <button onClick={() => fileRef.current?.click()} className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-violet-600 px-2 py-1 rounded-lg hover:bg-violet-50">
            📷 Imagen/Video
          </button>
          <button onClick={() => fileRef.current?.click()} className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-violet-600 px-2 py-1 rounded-lg hover:bg-violet-50">
            🎵 Audio
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-zinc-100 p-4">
        <label className="text-xs font-medium text-zinc-500 block mb-2">Etiquetas</label>
        <input value={tags} onChange={(e) => setTags(e.target.value)} placeholder="#confesión, #anonimato" className="w-full text-sm text-zinc-700 placeholder:text-zinc-400 outline-none"/>
      </div>

      <div className="bg-white rounded-2xl border border-zinc-100 p-4 space-y-3">
        <label className="flex items-center justify-between cursor-pointer">
          <div>
            <p className="text-sm font-medium text-zinc-700">Publicar anónimo</p>
            <p className="text-xs text-zinc-400">Tu nombre no aparecerá</p>
          </div>
          <button onClick={() => setIsAnonymous(!isAnonymous)} className={`w-11 h-6 rounded-full transition-colors relative ${isAnonymous ? "bg-violet-600" : "bg-zinc-200"}`}>
            <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${isAnonymous ? "translate-x-5" : "translate-x-0.5"}`}/>
          </button>
        </label>
        <label className="flex items-center justify-between cursor-pointer">
          <div>
            <p className="text-sm font-medium text-zinc-700">Contenido premium</p>
            <p className="text-xs text-zinc-400">Solo suscriptores de pago</p>
          </div>
          <button onClick={() => setIsPremium(!isPremium)} className={`w-11 h-6 rounded-full transition-colors relative ${isPremium ? "bg-amber-500" : "bg-zinc-200"}`}>
            <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${isPremium ? "translate-x-5" : "translate-x-0.5"}`}/>
          </button>
        </label>
        {isPremium && (
          <div className="pt-2 border-t border-zinc-100">
            <label className="text-xs font-medium text-zinc-500 block mb-1">Precio (USD)</label>
            <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="4.99" className="w-full text-sm outline-none border border-zinc-200 rounded-lg px-3 py-2"/>
          </div>
        )}
      </div>

      <button onClick={handleSubmit} disabled={loading || !content.trim()} className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-violet-600 to-pink-600 text-white font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2">
        {loading && <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>}
        {loading ? "Publicando..." : "Publicar ahora"}
      </button>
    </div>
  );
}
