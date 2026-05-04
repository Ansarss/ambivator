"use client";

import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await supabase.auth.signOut();
    router.refresh();
    router.push("/login");
  }

  return (
    <button
      onClick={handleLogout}
      className="px-4 py-2 text-xs font-medium border border-zinc-700 text-zinc-400 rounded-lg hover:border-zinc-500 hover:text-white transition-colors"
    >
      Log out
    </button>
  );
}
