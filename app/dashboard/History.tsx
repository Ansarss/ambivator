import type { BrainDumpRow } from "./page";

const checkinBadge: Record<string, { text: string; color: string }> = {
  yes: { text: "Executed", color: "text-green-500 border-green-900" },
  partially: { text: "Partial", color: "text-amber-500 border-amber-900" },
  no: { text: "Missed", color: "text-zinc-500 border-zinc-700" },
};

type Group = "Today" | "Yesterday" | "This Week" | "Earlier";

const GROUP_ORDER: Group[] = ["Today", "Yesterday", "This Week", "Earlier"];

function classify(created_at: string): Group {
  const now = new Date();
  const todayUTC = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  const ts = new Date(created_at).getTime();

  if (ts >= todayUTC) return "Today";
  if (ts >= todayUTC - 864e5) return "Yesterday";
  if (ts >= todayUTC - 6 * 864e5) return "This Week";
  return "Earlier";
}

function formatTimestamp(created_at: string, group: Group): string {
  const date = new Date(created_at);
  if (group === "Today" || group === "Yesterday") {
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
      timeZone: "UTC",
    });
  }
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

export default function History({ dumps }: { dumps: BrainDumpRow[] }) {
  const grouped = GROUP_ORDER.reduce<Record<Group, BrainDumpRow[]>>(
    (acc, g) => ({ ...acc, [g]: [] }),
    {} as Record<Group, BrainDumpRow[]>
  );

  for (const dump of dumps) {
    grouped[classify(dump.created_at)].push(dump);
  }

  const activeGroups = GROUP_ORDER.filter((g) => grouped[g].length > 0);
  if (activeGroups.length === 0) return null;

  return (
    <div className="space-y-10">
      <p className="text-xs font-medium text-zinc-500 uppercase tracking-widest">
        History
      </p>

      {activeGroups.map((group) => (
        <div key={group} className="space-y-3">
          <p className="text-[11px] font-medium text-zinc-600 uppercase tracking-widest">
            {group}
          </p>

          <div className="space-y-2">
            {grouped[group].map((dump) => {
              const badge = dump.checkin_result
                ? checkinBadge[dump.checkin_result]
                : null;

              return (
                <div
                  key={dump.id}
                  className="border border-zinc-900 rounded-xl p-5 space-y-3 hover:border-zinc-800 transition-colors"
                >
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-[11px] text-zinc-600 font-mono tabular-nums">
                      {formatTimestamp(dump.created_at, group)}
                    </span>
                    {badge && (
                      <span
                        className={`text-[11px] px-2 py-0.5 rounded-full border shrink-0 ${badge.color}`}
                      >
                        {badge.text}
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-zinc-700 truncate leading-relaxed">
                    {dump.input}
                  </p>

                  <ol className="space-y-1.5">
                    {dump.output.priorities.map((p, i) => (
                      <li
                        key={i}
                        className="flex gap-2.5 text-xs text-zinc-500 leading-relaxed"
                      >
                        <span className="text-zinc-700 font-mono shrink-0 tabular-nums">
                          {i + 1}.
                        </span>
                        <span>{p}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
