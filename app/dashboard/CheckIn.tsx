"use client";

import { useTransition, useState } from "react";
import { submitCheckin } from "@/app/actions/checkin";
import type { BrainDumpRow } from "./page";

export default function CheckIn({ dump }: { dump: BrainDumpRow }) {
  const [isPending, startTransition] = useTransition();
  const [done, setDone] = useState(false);

  function handleCheckin(result: "yes" | "partially" | "no") {
    startTransition(async () => {
      await submitCheckin(dump.id, result);
      setDone(true);
    });
  }

  if (done) return null;

  return (
    <div className="border border-zinc-800 rounded-xl p-6 space-y-5">
      <div className="space-y-1">
        <p className="text-xs font-medium text-zinc-500 uppercase tracking-widest">
          Yesterday&apos;s Plan
        </p>
        <p className="text-xs text-zinc-600">
          {new Date(dump.created_at).toLocaleDateString("en-US", {
            weekday: "long",
            month: "short",
            day: "numeric",
          })}
        </p>
      </div>

      <ol className="space-y-2">
        {dump.output.priorities.map((p, i) => (
          <li key={i} className="flex gap-3 text-sm text-zinc-300 leading-relaxed">
            <span className="text-zinc-600 font-mono shrink-0">{i + 1}.</span>
            <span>{p}</span>
          </li>
        ))}
      </ol>

      <div className="space-y-3 pt-1">
        <p className="text-sm text-zinc-400">Did you execute on this?</p>
        <div className="flex gap-2">
          {(["yes", "partially", "no"] as const).map((result) => (
            <button
              key={result}
              onClick={() => handleCheckin(result)}
              disabled={isPending}
              className="px-4 py-2 text-xs font-medium border border-zinc-800 text-zinc-400 rounded-lg hover:bg-white hover:text-black hover:border-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed capitalize"
            >
              {result}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
