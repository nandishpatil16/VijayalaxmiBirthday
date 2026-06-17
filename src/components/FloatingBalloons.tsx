import { motion } from "framer-motion";

const BALLOONS = [
  { c: "#f8c8d8", left: "6%", delay: 0, size: 60 },
  { c: "#fde68a", left: "18%", delay: 0.7, size: 48 },
  { c: "#a7f3d0", left: "82%", delay: 0.3, size: 54 },
  { c: "#e88aab", left: "92%", delay: 1.2, size: 70 },
  { c: "#c45c7c", left: "70%", delay: 0.5, size: 44 },
  { c: "#fbcfe8", left: "30%", delay: 1.5, size: 40 },
];

export default function FloatingBalloons() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {BALLOONS.map((b, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{ left: b.left, bottom: -120 }}
          initial={{ y: 0, opacity: 0 }}
          animate={{ y: -1200, opacity: [0, 1, 1, 0] }}
          transition={{
            duration: 16 + i * 2,
            delay: b.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          <svg width={b.size} height={b.size * 1.4} viewBox="0 0 60 84">
            <ellipse cx="30" cy="32" rx="26" ry="30" fill={b.c} />
            <ellipse cx="22" cy="22" rx="6" ry="9" fill="white" opacity="0.45" />
            <path d="M30 62 L26 70 L34 70 Z" fill={b.c} />
            <path
              d="M30 70 Q34 76 28 80 Q34 82 30 84"
              stroke={b.c}
              strokeWidth="1.2"
              fill="none"
              opacity="0.7"
            />
          </svg>
        </motion.div>
      ))}
    </div>
  );
}
