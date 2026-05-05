import type { BrainDumpRow } from "./page";

const checkinLabel: Record<string, { text: string; color: string }> = {
  yes: { text: "Executed", color: "text-green-500 border-green-900" },
  partially: { text: "Partial", color: "text-amber-500 border-amber-900" },
  no: { text: "Missed", color: "text-zinc-500 border-zinc-700" },
};

export default function History({ dumps }: { dumps: BrainDumpRow[] }) {
  return (
    <div className="space-y-4">
      <p className="text-xs font-medium text-zinc-500 uppercase tracking-widest">
        Past Plans
      </p>

      <div className="space-y-3">
        {dumps.map((dump) => {
          const badge = dump.checkin_result
            ? checkinLabel[dump.checkin_result]
            : null;

          return (
            <div
              key={dump.id}
              className="border border-zinc-900 rounded-xl p-5 space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs text-zinc-600">
                  {new Date(dump.created_at).toLocaleDateString("en-US", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
                {badge && (
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full border ${badge.color}`}
                  >
                    {badge.text}
                  </span>
                )}
              </div>

              <p className="text-xs text-zinc-700 truncate">{dump.input}</p>

              <ol className="space-y-1.5">
                {dump.output.priorities.map((p, i) => (
                  <li
                    key={i}
                    className="flex gap-2.5 text-xs text-zinc-500 leading-relaxed"
                  >
                    <span className="text-zinc-700 font-mono shrink-0">{i + 1}.</span>
                    <span>{p}</span>
                  </li>
                ))}
              </ol>
            </div>
          );
        })}
      </div>
    </div>
  );
}
