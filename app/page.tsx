import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="relative min-h-screen bg-black flex flex-col items-center justify-center px-6">
      <div className="max-w-2xl w-full text-center space-y-10">
        <div className="space-y-4">
          <h1 className="text-5xl sm:text-7xl font-bold tracking-tight text-white">
            Ambivator
          </h1>
          <p className="text-lg text-zinc-400 max-w-md mx-auto leading-relaxed">
            Make better decisions. Move forward with clarity.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/signup"
            className="px-8 py-3 bg-white text-black text-sm font-semibold rounded-lg hover:bg-zinc-100 transition-colors"
          >
            Get Started
          </Link>
          <Link
            href="/login"
            className="px-8 py-3 border border-zinc-700 text-white text-sm font-semibold rounded-lg hover:bg-zinc-900 hover:border-zinc-600 transition-colors"
          >
            Log in
          </Link>
        </div>
      </div>

      <p className="absolute bottom-8 text-xs text-zinc-700">
        &copy; {new Date().getFullYear()} Ambivator
      </p>
    </div>
  );
}
