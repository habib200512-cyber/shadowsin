import { getAuthSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import BottomNav from "@/components/layout/BottomNav";

export default async function FeedLayout({ children }: { children: React.ReactNode }) {
  const session = await getAuthSession();
  if (!session) redirect("/login");
  return (
    <div className="min-h-dvh bg-[#F0EDE8] flex flex-col">
      <Navbar user={session.user ?? {}} />
      <main className="flex-1 pb-20 pt-2">{children}</main>
      <BottomNav />
    </div>
  );
}
