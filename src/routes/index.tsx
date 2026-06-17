import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import FloatingBalloons from "@/components/FloatingBalloons";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Happy Birthday — A little something just for you" },
      {
        name: "description",
        content:
          "A confetti-filled corner of the internet for sending magical birthday surprises.",
      },
      { property: "og:title", content: "Happy Birthday ✨" },
      {
        property: "og:description",
        content: "A personalized animated birthday surprise.",
      },
    ],
  }),
  component: Landing,
});

function Sparkle({
  className,
  delay = 0,
  size = 14,
}: {
  className?: string;
  delay?: number;
  size?: number;
}) {
  return (
    <span
      className={`twinkle absolute pointer-events-none ${className ?? ""}`}
      style={{ animationDelay: `${delay}s` }}
    >
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M12 2 L13.5 9.5 L21 11 L13.5 12.5 L12 20 L10.5 12.5 L3 11 L10.5 9.5 Z"
          fill="#e88aab"
        />
      </svg>
    </span>
  );
}

function Landing() {
  const year = new Date().getFullYear();

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <div className="blob" style={{ width: 560, height: 560, top: -160, left: -160, background: "#f8c8d8" }} />
      <div className="blob" style={{ width: 620, height: 620, bottom: -200, right: -160, background: "#fde68a", opacity: 0.45 }} />
      <div className="blob" style={{ width: 420, height: 420, top: "30%", right: "10%", background: "#a7f3d0", opacity: 0.35 }} />
      <div className="blob" style={{ width: 380, height: 380, bottom: "10%", left: "8%", background: "#c4b5fd", opacity: 0.28 }} />

      <div className="grain-overlay" />
      <FloatingBalloons />

      <Sparkle className="top-[18%] left-[12%]" size={22} delay={0} />
      <Sparkle className="top-[26%] right-[14%]" size={16} delay={1.2} />
      <Sparkle className="bottom-[30%] left-[18%]" size={12} delay={0.6} />
      <Sparkle className="bottom-[22%] right-[20%]" size={20} delay={1.8} />
      <Sparkle className="top-[44%] left-[7%]" size={10} delay={2.4} />

      <main className="relative z-10 mx-auto flex min-h-screen max-w-5xl flex-col items-center justify-center px-6 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="flex items-center gap-4"
        >
          <span className="h-px w-10 bg-deep-rose/40" />
          <p className="text-[10px] sm:text-xs uppercase tracking-[0.5em] text-deep-rose/80 font-semibold">
            A little gift · {year}
          </p>
          <span className="h-px w-10 bg-deep-rose/40" />
        </motion.div>

        <div className="relative mt-8">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="font-display text-[3.25rem] leading-[0.95] sm:text-7xl md:text-8xl lg:text-[9rem] font-medium text-deep-rose"
          >
            <span className="block">Happy</span>
            <span className="relative inline-block">
              <motion.span
                initial={{ opacity: 0, y: 24, rotate: -6 }}
                animate={{ opacity: 1, y: 0, rotate: -3 }}
                transition={{ duration: 1.1, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
                className="font-script italic font-semibold shimmer-text inline-block text-[4.5rem] sm:text-[6.5rem] md:text-[8.5rem] lg:text-[10rem] leading-[1]"
                style={{ paddingInline: "0.25em" }}
              >
                Birthday
              </motion.span>
              <motion.svg
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 1.2, delay: 1.4, ease: "easeInOut" }}
                viewBox="0 0 300 18"
                preserveAspectRatio="none"
                className="absolute -bottom-2 left-0 w-full h-3 sm:h-4"
              >
                <motion.path
                  d="M5 12 Q 75 2, 150 9 T 295 8"
                  stroke="#e88aab"
                  strokeWidth="3"
                  fill="none"
                  strokeLinecap="round"
                />
              </motion.svg>
            </span>
          </motion.h1>

          <motion.span
            initial={{ opacity: 0, scale: 0.4, rotate: -20 }}
            animate={{ opacity: 1, scale: 1, rotate: -8 }}
            transition={{ delay: 1.6, type: "spring", damping: 10 }}
            className="absolute -top-6 -right-2 sm:-top-8 sm:right-6 text-3xl sm:text-5xl"
          >
            🎀
          </motion.span>
          <motion.span
            initial={{ opacity: 0, scale: 0.4, rotate: 20 }}
            animate={{ opacity: 1, scale: 1, rotate: 12 }}
            transition={{ delay: 1.8, type: "spring", damping: 10 }}
            className="absolute -bottom-4 -left-1 sm:-bottom-6 sm:left-4 text-3xl sm:text-5xl"
          >
            🎂
          </motion.span>
        </div>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.9 }}
          className="mt-16 max-w-xl font-display italic text-lg md:text-xl text-foreground/70 leading-relaxed"
        >
          “Another trip around the sun, wrapped in confetti and made just for you.”
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 1.5, type: "spring", damping: 14 }}
          className="mt-10"
        >
          <Link
            to="/create"
            className="group relative inline-flex items-center gap-3 rounded-full bg-deep-rose px-9 py-5 text-cream font-semibold text-lg shadow-[0_20px_50px_-15px_rgba(196,92,124,0.6)] transition-transform hover:scale-[1.04]"
          >
            <span className="absolute -inset-1 rounded-full bg-gradient-to-r from-rose/60 via-butter/60 to-mint/60 opacity-50 blur-lg group-hover:opacity-90 transition-opacity -z-10" />
            <span className="text-2xl">🎁</span>
            Create a wish
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </Link>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.9 }}
          className="mt-5 text-sm text-foreground/60"
        >
          Or open a magical link someone shared with you 💌
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="mt-14 flex items-center gap-5 sm:gap-7 text-2xl sm:text-3xl"
        >
          {["🎈", "🎂", "🎁", "🎉", "✨"].map((e, i) => (
            <motion.span
              key={e}
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 2.6, delay: i * 0.2, repeat: Infinity, ease: "easeInOut" }}
              className="inline-block"
            >
              {e}
            </motion.span>
          ))}
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.4 }}
          className="mt-16 text-[10px] uppercase tracking-[0.4em] text-deep-rose/50"
        >
          made with love · for the special one
        </motion.p>
      </main>
    </div>
  );
}
