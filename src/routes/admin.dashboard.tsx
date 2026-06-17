import {
  createFileRoute,
  redirect,
  useNavigate,
  useRouter,
} from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  checkAdmin,
  deleteWish,
  listWishes,
  logoutAdmin,
} from "@/lib/wishes.functions";

export const Route = createFileRoute("/admin/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard · Birthday Wishes" },
      { name: "robots", content: "noindex" },
    ],
  }),
  beforeLoad: async () => {
    try {
      const { isAdmin } = await checkAdmin();
      if (!isAdmin) throw redirect({ to: "/admin" });
    } catch (err) {
      if (err && typeof err === "object" && "isRedirect" in err) throw err;
      throw redirect({ to: "/admin" });
    }
  },
  component: Dashboard,
});

function Dashboard() {
  const navigate = useNavigate();
  const router = useRouter();

  const listFn = useServerFn(listWishes);
  const deleteFn = useServerFn(deleteWish);
  const logoutFn = useServerFn(logoutAdmin);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["wishes"],
    queryFn: () => listFn(),
  });

  const origin = typeof window !== "undefined" ? window.location.origin : "";

  const onDelete = async (id: string) => {
    if (!confirm("Delete this wish? The shareable link will stop working.")) return;
    await deleteFn({ data: { id } });
    refetch();
  };

  const onLogout = async () => {
    await logoutFn();
    await router.invalidate();
    navigate({ to: "/admin" });
  };

  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {}
  };

  const wishes = data?.wishes ?? [];
  const totalViews = wishes.reduce((sum, w) => sum + (w.views ?? 0), 0);

  return (
    <div className="relative min-h-screen bg-background">
      <div className="blob" style={{ width: 500, height: 500, top: -160, left: -120, background: "#f8c8d8" }} />
      <div className="blob" style={{ width: 420, height: 420, bottom: -120, right: -100, background: "#fde68a", opacity: 0.4 }} />

      <header className="relative z-10 border-b border-blush/60 bg-card/60 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-deep-rose/70 font-semibold">Admin</p>
            <h1 className="font-display text-2xl text-deep-rose">All Birthday Wishes</h1>
          </div>
          <button
            onClick={onLogout}
            className="rounded-full border border-blush bg-card px-4 py-2 text-sm font-medium text-foreground transition hover:bg-blush/50"
          >
            Sign out
          </button>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-6xl px-6 py-10">
        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-3 mb-8">
          <StatCard label="Total wishes" value={wishes.length} emoji="💌" />
          <StatCard label="Total views" value={totalViews} emoji="👀" />
          <StatCard
            label="Unique senders"
            value={new Set(wishes.map((w) => w.sender_name.toLowerCase())).size}
            emoji="🎁"
          />
        </div>

        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl bg-card/90 backdrop-blur border border-blush p-6 shadow-[0_30px_80px_-30px_rgba(196,92,124,0.3)]"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-2xl text-deep-rose">Every wish ever sent</h2>
            <span className="text-sm text-muted-foreground">{wishes.length} total</span>
          </div>

          {isLoading && (
            <p className="py-8 text-center text-sm text-muted-foreground">Loading...</p>
          )}
          {!isLoading && wishes.length === 0 && (
            <div className="py-16 text-center">
              <div className="text-5xl">🎈</div>
              <p className="mt-3 text-sm text-muted-foreground">
                No wishes yet. Share the homepage with someone to get started!
              </p>
            </div>
          )}

          <ul className="space-y-3">
            {wishes.map((w) => {
              const link = `${origin}/wish/${w.slug}`;
              return (
                <li
                  key={w.id}
                  className="rounded-2xl border border-blush bg-cream/50 p-5"
                >
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap font-display text-lg">
                        <span className="text-deep-rose/70">From</span>
                        <span className="text-deep-rose font-semibold">{w.sender_name}</span>
                        <span className="text-deep-rose/70">→ To</span>
                        <span className="text-deep-rose font-semibold">{w.recipient_name}</span>
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">
                        🎂 {new Date(w.birthday_date).toLocaleDateString()} ·
                        👀 {w.views} views ·
                        🕒 {new Date(w.created_at).toLocaleString()}
                      </p>
                      <p className="mt-3 text-sm text-foreground/80 whitespace-pre-wrap line-clamp-4">
                        {w.message}
                      </p>
                    </div>
                    <button
                      onClick={() => onDelete(w.id)}
                      className="shrink-0 rounded-lg border border-destructive/30 px-2 py-1 text-xs text-destructive hover:bg-destructive hover:text-destructive-foreground transition"
                    >
                      Delete
                    </button>
                  </div>
                  <div className="mt-4 flex items-center gap-2 flex-wrap">
                    <code className="flex-1 min-w-0 truncate rounded-lg bg-background px-2 py-1 text-xs">
                      {link}
                    </code>
                    <button
                      onClick={() => copy(link)}
                      className="rounded-lg bg-rose px-3 py-1 text-xs font-medium text-cream hover:opacity-90"
                    >
                      Copy
                    </button>
                    <a
                      href={link}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-lg border border-rose px-3 py-1 text-xs font-medium text-deep-rose hover:bg-rose hover:text-cream transition"
                    >
                      Open
                    </a>
                  </div>
                </li>
              );
            })}
          </ul>
        </motion.section>
      </main>
    </div>
  );
}

function StatCard({ label, value, emoji }: { label: string; value: number; emoji: string }) {
  return (
    <div className="rounded-2xl border border-blush bg-card/80 backdrop-blur px-5 py-4">
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase tracking-[0.2em] text-deep-rose/70 font-semibold">{label}</p>
        <span className="text-xl">{emoji}</span>
      </div>
      <p className="mt-2 font-display text-3xl text-deep-rose">{value}</p>
    </div>
  );
}
