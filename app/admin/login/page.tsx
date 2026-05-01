"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError("Invalid email or password.");
    } else {
      router.push("/admin");
    }
  };

  return (
    <div className="min-h-screen bg-dark flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-10">
          <span className="text-display text-4xl text-cream block leading-none">Elite Superior</span>
          <span className="text-xs text-stone uppercase tracking-[0.2em]">Admin Panel</span>
          <div className="mt-4 w-12 mx-auto h-0.5 bg-red" />
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-surface border border-stone/15 p-8 space-y-5"
        >
          <div>
            <label className="text-xs font-semibold uppercase tracking-widest text-stone-light mb-2 block">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              className="w-full bg-surface-2 border border-stone/20 text-cream placeholder:text-muted px-4 py-3 text-sm focus:outline-none focus:border-stone transition-colors"
              placeholder="admin@example.com"
            />
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-widest text-stone-light mb-2 block">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              className="w-full bg-surface-2 border border-stone/20 text-cream placeholder:text-muted px-4 py-3 text-sm focus:outline-none focus:border-stone transition-colors"
              placeholder="••••••••"
            />
          </div>

          {error && <p className="text-red-light text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-red text-white font-semibold uppercase tracking-widest text-sm hover:bg-red-dark disabled:opacity-60 transition-colors flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Signing in…
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <p className="text-center text-xs text-muted mt-6">
          Elite Superior Construction · Admin Access Only
        </p>
      </div>
    </div>
  );
}
