import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import LogoutButton from "./LogoutButton";

export default async function DashboardPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const email = user.email ?? "your account";

  return (
    <div className="min-h-screen bg-black">
      <nav className="border-b border-zinc-900 px-6 py-4 flex items-center justify-between">
        <span className="text-white font-semibold tracking-tight">Ambivator</span>
        <div className="flex items-center gap-4">
          <span className="text-zinc-500 text-xs hidden sm:block">{email}</span>
          <LogoutButton />
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-16 space-y-2">
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <p className="text-zinc-500 text-sm">Welcome back, {email}</p>
      </main>
    </div>
  );
}
