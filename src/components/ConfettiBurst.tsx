import { useEffect } from "react";
import confetti from "canvas-confetti";

type Props = {
  /** Trigger key — changing this value fires a burst */
  trigger?: number | string | boolean;
  /** intensity multiplier */
  scale?: number;
};

const PASTEL = ["#f8c8d8", "#e88aab", "#c45c7c", "#fff9f0", "#fde68a", "#a7f3d0"];

export function fireConfetti(scale = 1) {
  const count = Math.round(80 * scale);
  confetti({
    particleCount: count,
    spread: 80,
    startVelocity: 45,
    origin: { y: 0.6 },
    colors: PASTEL,
    scalar: 1.1,
  });
  setTimeout(() => {
    confetti({
      particleCount: Math.round(count * 0.7),
      angle: 60,
      spread: 70,
      origin: { x: 0, y: 0.7 },
      colors: PASTEL,
    });
    confetti({
      particleCount: Math.round(count * 0.7),
      angle: 120,
      spread: 70,
      origin: { x: 1, y: 0.7 },
      colors: PASTEL,
    });
  }, 200);
}

export default function ConfettiBurst({ trigger, scale = 1 }: Props) {
  useEffect(() => {
    if (trigger === undefined || trigger === false) return;
    fireConfetti(scale);
  }, [trigger, scale]);
  return null;
}
