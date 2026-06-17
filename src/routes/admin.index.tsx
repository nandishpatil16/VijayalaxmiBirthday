import { useState } from "react";
import { createFileRoute, useNavigate, useRouter } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { motion } from "framer-motion";
import { loginAdmin } from "@/lib/wishes.functions";

export const Route = createFileRoute("/admin/")({
  head: () => ({
    meta: [{ title: "Admin · Birthday Wishes" }, { name: "robots", content: "noindex" }],
  }),
  component: AdminGate,
});

function AdminGate() {
  const navigate = useNavigate();
  const router = useRouter();
  const login = useServerFn(loginAdmin);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await login({ data: { password } });
      if (res.ok) {
        await router.invalidate();
        navigate({ to: "/admin/dashboard" });
      } else {
        setError("Incorrect password. Please try again.");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <div className="blob" style={{ width: 460, height: 460, top: -140, right: -120, background: "#f8c8d8" }} />
      <div className="blob" style={{ width: 380, height: 380, bottom: -120, left: -100, background: "#fde68a", opacity: 0.4 }} />

      <main className="relative z-10 mx-auto flex min-h-screen max-w-md flex-col items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full rounded-3xl bg-card/90 backdrop-blur-sm border border-blush p-8 shadow-[0_30px_80px_-30px_rgba(196,92,124,0.4)]"
        >
          <p className="text-xs uppercase tracking-[0.3em] text-deep-rose/70 font-semibold">
            Admin
          </p>
          <h1 className="mt-2 font-display text-4xl text-deep-rose">
            Welcome back
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Enter your password to create birthday wishes.
          </p>

          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <div>
              <label
                htmlFor="pwd"
                className="block text-sm font-medium text-foreground mb-2"
              >
                Password
              </label>
              <input
                id="pwd"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoFocus
                required
                className="w-full rounded-2xl border border-input bg-background px-4 py-3 outline-none focus:ring-4 focus:ring-rose/30 focus:border-rose transition"
                placeholder="••••••••"
              />
            </div>
            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}
            <button
              type="submit"
              disabled={loading || !password}
              className="w-full rounded-2xl bg-deep-rose px-6 py-3 font-semibold text-cream shadow-lg transition-transform hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>
        </motion.div>
      </main>
    </div>
  );
}
