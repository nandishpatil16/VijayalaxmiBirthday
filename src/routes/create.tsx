import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { motion } from "framer-motion";
import FloatingBalloons from "@/components/FloatingBalloons";
import { createWish } from "@/lib/wishes.functions";
import { fireConfetti } from "@/components/ConfettiBurst";

export const Route = createFileRoute("/create")({
  head: () => ({
    meta: [
      { title: "Create a Birthday Wish ✨" },
      {
        name: "description",
        content: "Send a magical, confetti-filled birthday wish with a personal message.",
      },
    ],
  }),
  component: CreatePage,
});

function CreatePage() {
  const navigate = useNavigate();
  const createFn = useServerFn(createWish);

  const [form, setForm] = useState({
    recipient_name: "",
    sender_name: "",
    birthday_date: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [generated, setGenerated] = useState<string | null>(null);

  const origin = typeof window !== "undefined" ? window.location.origin : "";

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await createFn({ data: form });
      const link = `${origin}/wish/${res.slug}`;
      setGenerated(link);
      fireConfetti(1.4);
    } catch (err) {
      alert((err as Error)?.message ?? "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {}
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <div className="blob" style={{ width: 560, height: 560, top: -160, left: -160, background: "#f8c8d8" }} />
      <div className="blob" style={{ width: 620, height: 620, bottom: -200, right: -160, background: "#fde68a", opacity: 0.45 }} />
      <div className="blob" style={{ width: 420, height: 420, top: "30%", right: "10%", background: "#a7f3d0", opacity: 0.3 }} />
      <div className="grain-overlay" />
      <FloatingBalloons />

      <main className="relative z-10 mx-auto flex min-h-screen max-w-3xl flex-col items-center px-6 py-12">
        <Link
          to="/"
          className="self-start text-sm text-deep-rose/80 hover:text-deep-rose transition flex items-center gap-1"
        >
          ← Back
        </Link>

        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="mt-6 flex items-center gap-4"
        >
          <span className="h-px w-10 bg-deep-rose/40" />
          <p className="text-[10px] sm:text-xs uppercase tracking-[0.5em] text-deep-rose/80 font-semibold">
            Send a little magic
          </p>
          <span className="h-px w-10 bg-deep-rose/40" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.1 }}
          className="mt-5 text-center font-display text-5xl sm:text-6xl md:text-7xl font-medium text-deep-rose leading-[1]"
        >
          Make a{" "}
          <span className="font-script italic shimmer-text inline-block">Birthday</span>{" "}
          Wish
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-5 max-w-lg text-center font-display italic text-lg text-foreground/70"
        >
          Fill in a few details and we'll wrap it up with confetti and a surprise — ready to share with a single link.
        </motion.p>

        <motion.form
          onSubmit={onSubmit}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8, type: "spring", damping: 16 }}
          className="mt-10 w-full max-w-xl rounded-3xl border border-blush/70 bg-card/85 backdrop-blur-md p-7 sm:p-9 shadow-[0_30px_80px_-30px_rgba(196,92,124,0.4)] space-y-5"
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Birthday person">
              <input
                required
                maxLength={120}
                value={form.recipient_name}
                onChange={(e) => setForm((f) => ({ ...f, recipient_name: e.target.value }))}
                className="w-full rounded-2xl border border-input bg-background px-4 py-3 outline-none focus:ring-4 focus:ring-rose/30 focus:border-rose transition"
                placeholder="e.g. Ananya"
              />
            </Field>
            <Field label="From">
              <input
                required
                maxLength={120}
                value={form.sender_name}
                onChange={(e) => setForm((f) => ({ ...f, sender_name: e.target.value }))}
                className="w-full rounded-2xl border border-input bg-background px-4 py-3 outline-none focus:ring-4 focus:ring-rose/30 focus:border-rose transition"
                placeholder="e.g. Mallikarjun"
              />
            </Field>
          </div>

          <Field label="Birthday date">
            <input
              required
              type="date"
              value={form.birthday_date}
              onChange={(e) => setForm((f) => ({ ...f, birthday_date: e.target.value }))}
              className="w-full rounded-2xl border border-input bg-background px-4 py-3 outline-none focus:ring-4 focus:ring-rose/30 focus:border-rose transition"
            />
          </Field>

          <Field label="Your message">
            <textarea
              required
              maxLength={4000}
              rows={5}
              value={form.message}
              onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
              className="w-full rounded-2xl border border-input bg-background px-4 py-3 outline-none focus:ring-4 focus:ring-rose/30 focus:border-rose transition resize-none"
              placeholder="Write something heartfelt..."
            />
          </Field>

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-2xl bg-deep-rose px-6 py-4 font-semibold text-cream shadow-lg transition-transform hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100"
          >
            {submitting ? "Wrapping your gift..." : "Generate wish link 🎁"}
          </button>

          {generated && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className="rounded-2xl border border-rose/50 bg-blush/40 p-4"
            >
              <p className="text-xs uppercase tracking-[0.2em] text-deep-rose/80 font-semibold">
                Your wish is ready! ✨
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <code className="flex-1 min-w-0 truncate rounded-xl bg-cream px-3 py-2 text-sm">
                  {generated}
                </code>
                <button
                  type="button"
                  onClick={() => copy(generated)}
                  className="rounded-xl bg-deep-rose px-4 py-2 text-sm font-medium text-cream hover:opacity-90"
                >
                  Copy
                </button>
                <a
                  href={generated}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-xl border border-deep-rose px-4 py-2 text-sm font-medium text-deep-rose hover:bg-deep-rose hover:text-cream transition"
                >
                  Open
                </a>
              </div>
            </motion.div>
          )}
        </motion.form>
      </main>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-foreground mb-2">{label}</label>
      {children}
    </div>
  );
}
