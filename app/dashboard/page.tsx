import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import LogoutButton from "./LogoutButton";
import BrainDump from "./BrainDump";
import CheckIn from "./CheckIn";
import History from "./History";

export type BrainDumpRow = {
  id: string;
  input: string;
  output: {
    priorities: string[];
    plan: string;
    uncomfortableAction: string;
    growthAction: string;
  };
  checkin_result: "yes" | "partially" | "no" | null;
  created_at: string;
};

function getGreeting(hour: number) {
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

function getFirstName(email: string) {
  const raw = email.split("@")[0].split(/\d/)[0].split(".")[0];
  return raw.charAt(0).toUpperCase() + raw.slice(1);
}

export default async function DashboardPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const email = user.email ?? "";
  const firstName = getFirstName(email);
  const greeting = getGreeting(new Date().getUTCHours());

  const { data } = await supabase
    .from("brain_dumps")
    .select("id, input, output, checkin_result, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(6);

  const allDumps = (data ?? []) as BrainDumpRow[];
  const isFirstVisit = allDumps.length === 0;

  const todayUTC = new Date();
  todayUTC.setUTCHours(0, 0, 0, 0);

  const mostRecent = allDumps[0] ?? null;
  const needsCheckin =
    mostRecent &&
    !mostRecent.checkin_result &&
    new Date(mostRecent.created_at) < todayUTC;

  const history = needsCheckin ? allDumps.slice(1, 6) : allDumps.slice(0, 5);

  return (
    <div className="min-h-screen bg-black">
      <nav className="border-b border-zinc-900 px-6 py-4 flex items-center justify-between">
        <span className="text-white font-semibold tracking-tight text-sm">Ambivator</span>
        <div className="flex items-center gap-4">
          <span className="text-zinc-500 text-xs hidden sm:block">{email}</span>
          <LogoutButton />
        </div>
      </nav>

      <main className="max-w-2xl mx-auto px-6 py-12 space-y-10">

        {/* Greeting */}
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-white">
            {greeting}, {firstName}.
          </h1>
          <p className="text-zinc-500 text-sm">
            {isFirstVisit
              ? "Your AI operator is ready. Let's get you clarity."
              : needsCheckin
              ? "Check in on yesterday, then build today's plan."
              : "What's on your mind today?"}
          </p>
        </div>

        {/* First-visit onboarding */}
        {isFirstVisit && (
          <div className="border border-zinc-800 rounded-xl p-6 space-y-5">
            <p className="text-sm font-medium text-white">How Ambivator works</p>
            <div className="space-y-4">
              {[
                {
                  n: "01",
                  text: "Write everything on your mind — tasks, stress, goals, fears. No filters.",
                },
                {
                  n: "02",
                  text: "Ambivator reads it and extracts what actually matters.",
                },
                {
                  n: "03",
                  text: "You get your top 3 priorities, a clear action plan, and one move that changes things.",
                },
              ].map((s) => (
                <div key={s.n} className="flex gap-4">
                  <span className="text-zinc-700 font-mono text-xs pt-0.5 shrink-0">{s.n}</span>
                  <p className="text-zinc-400 text-sm leading-relaxed">{s.text}</p>
                </div>
              ))}
            </div>
            <p className="text-xs text-zinc-600 pt-1">
              Start by typing in the box below. Takes 15 seconds.
            </p>
          </div>
        )}

        {/* Check-in */}
        {needsCheckin && <CheckIn dump={mostRecent} />}

        {/* Brain dump */}
        <BrainDump isFirstVisit={isFirstVisit} />

        {/* History */}
        {history.length > 0 && (
          <div className="border-t border-zinc-900 pt-10">
            <History dumps={history} />
          </div>
        )}

      </main>
    </div>
  );
}
