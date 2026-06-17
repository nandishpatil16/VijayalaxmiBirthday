import { motion } from "framer-motion";

export default function Cake() {
  return (
    <motion.svg
      width="220"
      height="220"
      viewBox="0 0 220 220"
      initial={{ scale: 0.4, opacity: 0, rotate: -8 }}
      animate={{ scale: 1, opacity: 1, rotate: 0 }}
      transition={{ type: "spring", damping: 10, stiffness: 110, delay: 0.4 }}
    >
      {/* plate */}
      <ellipse cx="110" cy="190" rx="92" ry="10" fill="#c45c7c" opacity="0.25" />
      {/* bottom tier */}
      <rect x="28" y="130" width="164" height="55" rx="10" fill="#fff9f0" stroke="#e88aab" strokeWidth="2" />
      <path d="M28 138 Q60 152 92 138 T156 138 T192 138" stroke="#e88aab" strokeWidth="3" fill="none" />
      {/* mid tier */}
      <rect x="56" y="92" width="108" height="44" rx="8" fill="#f8c8d8" stroke="#e88aab" strokeWidth="2" />
      <path d="M56 100 Q80 112 104 100 T152 100 T164 100" stroke="#c45c7c" strokeWidth="2.5" fill="none" />
      {/* top tier */}
      <rect x="82" y="62" width="56" height="32" rx="6" fill="#fff9f0" stroke="#e88aab" strokeWidth="2" />
      {/* sprinkles */}
      {Array.from({ length: 14 }).map((_, i) => (
        <circle
          key={i}
          cx={40 + (i * 11) % 150}
          cy={150 + ((i * 7) % 25)}
          r="2.2"
          fill={["#c45c7c", "#fde68a", "#a7f3d0", "#e88aab"][i % 4]}
        />
      ))}
      {/* candles */}
      {[96, 110, 124].map((cx, i) => (
        <g key={cx}>
          <rect x={cx - 3} y={36} width="6" height="26" rx="1.5" fill={["#e88aab", "#fde68a", "#a7f3d0"][i]} />
          {/* flame */}
          <motion.path
            d={`M${cx} 28 Q${cx - 5} 22 ${cx} 14 Q${cx + 5} 22 ${cx} 28 Z`}
            fill="#fbbf24"
            animate={{ scaleY: [1, 1.15, 0.9, 1], opacity: [0.9, 1, 0.85, 1] }}
            style={{ transformOrigin: `${cx}px 28px` }}
            transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15 }}
          />
          <motion.circle
            cx={cx}
            cy={20}
            r="2"
            fill="#fff"
            opacity="0.6"
            animate={{ opacity: [0.4, 0.9, 0.4] }}
            transition={{ duration: 1, repeat: Infinity, delay: i * 0.15 }}
          />
        </g>
      ))}
    </motion.svg>
  );
}
