"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Plan = {
  priorities: string[];
  plan: string;
  uncomfortableAction: string;
  growthAction: string;
};

export default function BrainDump({ isFirstVisit }: { isFirstVisit: boolean }) {
  const router = useRouter();
  const [input, setInput] = useState("");
  const [plan, setPlan] = useState<Plan | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleGenerate() {
    if (!input.trim()) return;
    setLoading(true);
    setError("");
    setPlan(null);

    const res = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ input }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error ?? "Something went wrong. Try again.");
    } else {
      setPlan(data);
      router.refresh();
    }

    setLoading(false);
  }

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <div className="space-y-1">
          <label className="block text-xs font-medium text-zinc-500 uppercase tracking-widest">
            {isFirstVisit ? "Your first brain dump" : "Brain Dump"}
          </label>
          {!plan && (
            <p className="text-xs text-zinc-600">
              {isFirstVisit
                ? "Don't think, just type. Messy is fine — that's the point."
                : "What's competing for your attention right now?"}
            </p>
          )}
        </div>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={
            isFirstVisit
              ? "e.g. I have a deadline on Friday, haven't called mum back, want to start the gym but keep avoiding it, money is stressing me out, need to reply to 3 emails…"
              : "Write everything on your mind. Don't filter. Just get it all out…"
          }
          rows={7}
          className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg text-white placeholder:text-zinc-600 focus:outline-none focus:border-zinc-700 transition-colors text-sm resize-none leading-relaxed"
        />
        <div className="flex items-center gap-4">
          <button
            onClick={handleGenerate}
            disabled={loading || !input.trim()}
            className="px-6 py-2.5 bg-white text-black text-sm font-semibold rounded-lg hover:bg-zinc-100 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            {loading ? "Generating…" : "Generate Plan"}
          </button>
          {!loading && !plan && (
            <p className="text-xs text-zinc-600">Takes ~15 seconds</p>
          )}
        </div>
      </div>

      {error && <p className="text-red-400 text-sm">{error}</p>}

      {plan && (
        <div className="space-y-8 border-t border-zinc-900 pt-10">
          <PlanSection label="Top 3 Priorities">
            <ol className="space-y-3">
              {plan.priorities.map((p, i) => (
                <li key={i} className="flex gap-3 text-sm text-zinc-200 leading-relaxed">
                  <span className="text-zinc-600 font-mono shrink-0">{i + 1}.</span>
                  <span>{p}</span>
                </li>
              ))}
            </ol>
          </PlanSection>

          <PlanSection label="Structured Plan">
            <p className="text-sm text-zinc-300 leading-relaxed whitespace-pre-line">
              {plan.plan}
            </p>
          </PlanSection>

          <PlanSection label="Uncomfortable Action" dot="amber">
            <p className="text-sm text-zinc-300 leading-relaxed">
              {plan.uncomfortableAction}
            </p>
          </PlanSection>

          <PlanSection label="Growth Action" dot="green">
            <p className="text-sm text-zinc-300 leading-relaxed">
              {plan.growthAction}
            </p>
          </PlanSection>
        </div>
      )}
    </div>
  );
}

function PlanSection({
  label,
  dot,
  children,
}: {
  label: string;
  dot?: "amber" | "green";
  children: React.ReactNode;
}) {
  const dotClass =
    dot === "amber"
      ? "bg-amber-500"
      : dot === "green"
      ? "bg-green-500"
      : "bg-white";

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotClass}`} />
        <span className="text-xs font-medium text-zinc-500 uppercase tracking-widest">
          {label}
        </span>
      </div>
      {children}
    </div>
  );
}
