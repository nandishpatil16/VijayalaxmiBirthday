import { motion } from "framer-motion";

type Props = {
  open: boolean;
  onClick?: () => void;
};

export default function GiftBox({ open, onClick }: Props) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={!open ? { scale: 1.05 } : undefined}
      whileTap={!open ? { scale: 0.95 } : undefined}
      animate={
        open
          ? { scale: 1.15, rotate: [0, -6, 6, 0] }
          : { scale: [1, 1.04, 1] }
      }
      transition={
        open
          ? { duration: 0.6 }
          : { duration: 1.6, repeat: Infinity, ease: "easeInOut" }
      }
      className="relative outline-none focus-visible:ring-4 focus-visible:ring-rose/40 rounded-3xl"
      aria-label="Open your surprise"
    >
      <svg width="200" height="200" viewBox="0 0 200 200">
        {/* shadow */}
        <ellipse cx="100" cy="186" rx="80" ry="8" fill="#c45c7c" opacity="0.2" />
        {/* box body */}
        <rect x="28" y="80" width="144" height="100" rx="10" fill="#e88aab" />
        <rect x="92" y="80" width="16" height="100" fill="#c45c7c" />
        {/* lid */}
        <motion.g
          animate={
            open
              ? { y: -80, rotate: -18, opacity: 0 }
              : { y: 0, rotate: 0, opacity: 1 }
          }
          style={{ transformOrigin: "100px 70px" }}
          transition={{ type: "spring", damping: 12, stiffness: 120 }}
        >
          <rect x="20" y="60" width="160" height="28" rx="6" fill="#fff9f0" stroke="#e88aab" strokeWidth="2" />
          <rect x="92" y="60" width="16" height="28" fill="#c45c7c" />
          {/* bow */}
          <circle cx="100" cy="56" r="10" fill="#c45c7c" />
          <path d="M100 56 Q80 36 70 50 Q72 64 100 60 Z" fill="#e88aab" />
          <path d="M100 56 Q120 36 130 50 Q128 64 100 60 Z" fill="#e88aab" />
        </motion.g>
        {/* sparkles when open */}
        {open &&
          Array.from({ length: 8 }).map((_, i) => {
            const angle = (i / 8) * Math.PI * 2;
            return (
              <motion.circle
                key={i}
                cx={100 + Math.cos(angle) * 12}
                cy={70 + Math.sin(angle) * 12}
                r="3"
                fill={i % 2 ? "#fde68a" : "#fff"}
                initial={{ opacity: 0, scale: 0 }}
                animate={{
                  opacity: [0, 1, 0],
                  scale: [0, 1.6, 0],
                  cx: 100 + Math.cos(angle) * 70,
                  cy: 70 + Math.sin(angle) * 70,
                }}
                transition={{ duration: 0.9, delay: 0.1 + i * 0.04 }}
              />
            );
          })}
      </svg>
    </motion.button>
  );
}
