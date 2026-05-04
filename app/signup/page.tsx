"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full py-3 bg-white text-black text-sm font-semibold rounded-lg hover:bg-zinc-100 transition-colors disabled:opacity-50"
    >
      {pending ? "Creating account…" : "Create account"}
    </button>
  );
}

export default function SignupPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function handleSubmit(formData: FormData) {
    setError("");
    setMessage("");
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const { data, error } = await supabase.auth.signUp({ email, password });

    if (error) {
      if (error.message.toLowerCase().includes("email rate limit")) {
        const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
        if (!signInError) {
          router.push("/dashboard");
          router.refresh();
          return;
        }
        setError("Too many sign-up attempts. Please wait a moment and try again, or log in if you already have an account.");
      } else {
        setError(error.message);
      }
    } else if (data.session) {
      router.push("/dashboard");
      router.refresh();
    } else {
      setMessage("Check your email to confirm your account.");
    }
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-6">
      <div className="w-full max-w-sm space-y-8">
        <div>
          <Link href="/" className="text-sm text-zinc-600 hover:text-zinc-400 transition-colors">
            &larr; Ambivator
          </Link>
          <h1 className="mt-6 text-3xl font-bold text-white">Create account</h1>
          <p className="mt-2 text-sm text-zinc-500">
            Already have an account?{" "}
            <Link href="/login" className="text-white underline underline-offset-4 hover:text-zinc-300">
              Log in
            </Link>
          </p>
        </div>

        <form action={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label htmlFor="email" className="block text-xs font-medium text-zinc-400 uppercase tracking-wide">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg text-white placeholder:text-zinc-600 focus:outline-none focus:border-zinc-600 transition-colors text-sm"
              placeholder="you@example.com"
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="password" className="block text-xs font-medium text-zinc-400 uppercase tracking-wide">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg text-white placeholder:text-zinc-600 focus:outline-none focus:border-zinc-600 transition-colors text-sm"
              placeholder="••••••••"
            />
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}
          {message && <p className="text-green-400 text-sm">{message}</p>}

          <SubmitButton />
        </form>
      </div>
    </div>
  );
}
