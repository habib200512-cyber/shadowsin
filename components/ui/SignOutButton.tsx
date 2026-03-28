"use client";
import { signOut } from "next-auth/react";
export default function SignOutButton() {
  return (
    <button onClick={() => signOut({ callbackUrl: "/login" })} className="w-full py-3 rounded-2xl border border-red-200 text-red-500 text-sm font-medium hover:bg-red-50 transition-colors">
      Cerrar sesión
    </button>
  );
}
