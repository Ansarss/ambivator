import Link from "next/link";

const features = [
  {
    title: "Daily Clarity",
    desc: "Know exactly what deserves your attention today.",
  },
  {
    title: "AI Accountability",
    desc: "Get direct prompts that cut through excuses.",
  },
  {
    title: "Momentum Planning",
    desc: "Turn big goals into small, executable moves.",
  },
  {
    title: "Growth Actions",
    desc: "Take one step daily toward career, money, health, or relationships.",
  },
];

const useCases = [
  {
    label: "Career",
    desc: "Land the job, earn the promotion, build the business.",
  },
  {
    label: "Fitness",
    desc: "Turn health goals into daily non-negotiables.",
  },
  {
    label: "Money",
    desc: "Spend less, save more, invest with intention.",
  },
  {
    label: "Personal Life",
    desc: "Show up for the people and things that actually matter.",
  },
];

const steps = [
  {
    num: "01",
    title: "Dump everything on your mind",
    desc: "No filtering. No structure. Just get it all out.",
  },
  {
    num: "02",
    title: "Ambivator finds what matters",
    desc: "AI cuts through the noise and surfaces your real priorities.",
  },
  {
    num: "03",
    title: "Execute a clear daily plan",
    desc: "Walk away knowing exactly what to do — and in what order.",
  },
];

export default function LandingPage() {
  return (
    <div className="bg-black text-white">

      {/* Nav */}
      <header className="sticky top-0 z-50 border-b border-zinc-900 bg-black/90 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <span className="font-semibold tracking-tight text-sm">Ambivator</span>
          <nav className="flex items-center gap-5">
            <Link
              href="/login"
              className="text-sm text-zinc-400 hover:text-white transition-colors"
            >
              Log in
            </Link>
            <Link
              href="/signup"
              className="px-4 py-2 bg-white text-black text-sm font-semibold rounded-lg hover:bg-zinc-100 transition-colors"
            >
              Start Free
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-6 pt-28 pb-32 text-center">
        <p className="text-xs font-medium text-zinc-500 uppercase tracking-widest mb-8">
          AI Life Operator
        </p>
        <h1 className="text-5xl sm:text-7xl font-bold tracking-tight leading-[1.1] mb-6">
          Your AI Operator<br className="hidden sm:block" /> for Ambitious People.
        </h1>
        <p className="text-base sm:text-lg text-zinc-400 max-w-xl mx-auto leading-relaxed mb-10">
          Brain dump your stress, goals, and scattered thoughts. Ambivator turns them into a clear plan so you know what to do next.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/signup"
            className="w-full sm:w-auto px-8 py-3 bg-white text-black text-sm font-semibold rounded-lg hover:bg-zinc-100 transition-colors"
          >
            Start Free
          </Link>
          <Link
            href="/login"
            className="w-full sm:w-auto px-8 py-3 border border-zinc-800 text-zinc-400 text-sm font-medium rounded-lg hover:border-zinc-600 hover:text-white transition-colors"
          >
            Log in
          </Link>
        </div>
      </section>

      {/* Problem */}
      <section className="border-t border-zinc-900">
        <div className="max-w-3xl mx-auto px-6 py-24 text-center space-y-4">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            You don&apos;t need another to-do list.
          </h2>
          <p className="text-zinc-400 text-lg">
            You need clarity, prioritization, and pressure to act.
          </p>
        </div>
      </section>

      {/* How it works */}
      <section className="border-t border-zinc-900">
        <div className="max-w-5xl mx-auto px-6 py-24">
          <p className="text-xs font-medium text-zinc-500 uppercase tracking-widest mb-16 text-center">
            How it works
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-12 sm:gap-8">
            {steps.map((step) => (
              <div key={step.num} className="space-y-4">
                <span className="text-zinc-700 font-mono text-sm">{step.num}</span>
                <h3 className="text-white font-semibold text-lg leading-snug">
                  {step.title}
                </h3>
                <p className="text-zinc-500 text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-zinc-900">
        <div className="max-w-5xl mx-auto px-6 py-24">
          <p className="text-xs font-medium text-zinc-500 uppercase tracking-widest mb-16 text-center">
            Features
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-zinc-900 border border-zinc-900 rounded-xl overflow-hidden">
            {features.map((f) => (
              <div key={f.title} className="bg-black p-8 space-y-2">
                <h3 className="text-white font-semibold text-sm">{f.title}</h3>
                <p className="text-zinc-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use cases */}
      <section className="border-t border-zinc-900">
        <div className="max-w-5xl mx-auto px-6 py-24">
          <p className="text-xs font-medium text-zinc-500 uppercase tracking-widest mb-16 text-center">
            Built for every part of your life
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {useCases.map((u) => (
              <div
                key={u.label}
                className="border border-zinc-800 rounded-xl p-5 space-y-2 hover:border-zinc-700 transition-colors"
              >
                <h3 className="text-white font-semibold text-sm">{u.label}</h3>
                <p className="text-zinc-600 text-xs leading-relaxed">{u.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="border-t border-zinc-900">
        <div className="max-w-3xl mx-auto px-6 py-32 text-center space-y-6">
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight leading-tight">
            Stop drifting.<br />Start building momentum.
          </h2>
          <p className="text-zinc-500">
            Join ambitious people who use Ambivator to execute every day.
          </p>
          <Link
            href="/signup"
            className="inline-block px-10 py-3 bg-white text-black text-sm font-semibold rounded-lg hover:bg-zinc-100 transition-colors"
          >
            Start Free
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-900">
        <div className="max-w-5xl mx-auto px-6 py-8 flex items-center justify-between">
          <span className="text-zinc-600 text-sm font-medium">Ambivator</span>
          <p className="text-zinc-700 text-xs">
            &copy; {new Date().getFullYear()} Ambivator. All rights reserved.
          </p>
        </div>
      </footer>

    </div>
  );
}
