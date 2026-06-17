import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Cake from "./Cake";
import GiftBox from "./GiftBox";
import ConfettiBurst, { fireConfetti } from "./ConfettiBurst";
import PhotoGallery from "./PhotoGallery";
import VideoGallery from "./VideoGallery";



// Permanent surprise video — replace the file at public/surprise-video.mp4
const SURPRISE_VIDEO_URL = "/surprise-video.mp4";

type Props = {
  recipientName: string;
  senderName: string;
  message: string;
  birthdayDate: string;
};

function formatDate(d: string) {
  try {
    return new Date(d).toLocaleDateString(undefined, {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return d;
  }
}

export default function WishReveal({
  recipientName,
  senderName,
  message,
  birthdayDate,
}: Props) {
  const [opened, setOpened] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [confettiTick, setConfettiTick] = useState(0);
  const [activeTab, setActiveTab] = useState<"photos" | "videos">("photos");

  // initial celebratory burst
  useEffect(() => {
    const t1 = setTimeout(() => fireConfetti(1), 700);
    const t2 = setTimeout(() => fireConfetti(0.6), 2200);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  const handleOpen = () => {
    if (opened) return;
    setOpened(true);
    fireConfetti(1.4);
    setTimeout(() => setShowVideo(true), 900);
  };

  const letters = recipientName.split("");

  return (
    <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center px-4 sm:px-6 py-10 sm:py-16 text-center">
      <ConfettiBurst trigger={confettiTick} />

      <motion.p
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="text-xs sm:text-sm uppercase tracking-[0.3em] text-deep-rose/70 font-medium"
      >
        Happy Birthday
      </motion.p>

      <h1 className={`mt-4 font-display font-medium text-deep-rose flex flex-wrap justify-center gap-x-2 sm:gap-x-3 gap-y-1 select-none leading-none ${
        recipientName.length <= 6
          ? "text-5xl sm:text-7xl md:text-8xl"
          : recipientName.length <= 10
            ? "text-4xl sm:text-6xl md:text-8xl"
            : "text-3xl sm:text-5xl md:text-7xl"
      }`}>
        {recipientName.split(" ").map((word, wIdx) => {
          const prevLettersCount = recipientName.split(" ").slice(0, wIdx).join(" ").length + (wIdx > 0 ? 1 : 0);
          return (
            <span key={wIdx} className="inline-block whitespace-nowrap">
              {word.split("").map((ch, cIdx) => {
                const globalIdx = prevLettersCount + cIdx;
                return (
                  <motion.span
                    key={cIdx}
                    initial={{ opacity: 0, y: 30, rotate: -8, scale: 0.6 }}
                    animate={{ opacity: 1, y: 0, rotate: 0, scale: 1 }}
                    transition={{
                      type: "spring",
                      damping: 12,
                      stiffness: 200,
                      delay: 0.3 + globalIdx * 0.05,
                    }}
                    className="inline-block"
                    onAnimationComplete={() => {
                      if (globalIdx === recipientName.length - 1) setConfettiTick((t) => t + 1);
                    }}
                  >
                    {ch}
                  </motion.span>
                );
              })}
            </span>
          );
        })}
      </h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 + recipientName.length * 0.05 + 0.2 }}
        className="mt-3 font-display italic text-deep-rose/70 text-sm sm:text-base"
      >
        {formatDate(birthdayDate)}
      </motion.p>

      <div className="mt-6 sm:mt-8 scale-90 sm:scale-100 origin-center transition-transform">
        <Cake />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        whileHover={{ y: -5, scale: 1.01 }}
        transition={{ 
          type: "spring", 
          stiffness: 100, 
          damping: 15,
          delay: 1.0
        }}
        className="mt-6 sm:mt-8 w-full max-w-xl rounded-3xl bg-card/85 backdrop-blur-sm border border-blush px-6 py-6 sm:px-8 sm:py-7 shadow-[0_30px_80px_-30px_rgba(196,92,124,0.35)] cursor-default select-none transition-shadow hover:shadow-[0_40px_90px_-25px_rgba(196,92,124,0.45)]"
      >
        <p className="font-display text-lg sm:text-xl md:text-2xl leading-relaxed text-foreground whitespace-pre-wrap">
          {message}
        </p>
        <p className="mt-4 sm:mt-6 font-script text-2xl sm:text-3xl text-deep-rose text-right">
          — with love, {senderName}
        </p>
      </motion.div>

      <div className="mt-10 sm:mt-14 flex flex-col items-center w-full">
        {!showVideo && (
          <>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
              className="mb-4 text-xs sm:text-sm uppercase tracking-[0.25em] text-deep-rose/70 font-medium select-none"
            >
              {opened ? "Unwrapping..." : "Tap to open your surprise"}
            </motion.p>
            <div className="scale-90 sm:scale-100 origin-center transition-transform">
              <GiftBox open={opened} onClick={handleOpen} />
            </div>
          </>
        )}

        <motion.div
          initial={{ opacity: 0, scale: 0.7, y: 20 }}
          animate={
            showVideo
              ? { opacity: 1, scale: 1, y: 0 }
              : { opacity: 0, scale: 0.7, y: 20 }
          }
          transition={{ type: "spring", damping: 14, stiffness: 120 }}
          className={showVideo ? "flex flex-col items-center w-full" : "hidden"}
        >
          {/* Tab Selection Switcher */}
          <div className="flex bg-card/60 backdrop-blur-sm p-1 rounded-full border border-blush/60 gap-1 mb-8 shadow-sm">
            <button
              onClick={() => {
                setActiveTab("photos");
                fireConfetti(0.5);
              }}
              className={`px-6 py-2.5 rounded-full text-xs sm:text-sm font-semibold tracking-wide transition-all cursor-pointer ${
                activeTab === "photos"
                  ? "bg-deep-rose text-cream shadow-sm"
                  : "text-deep-rose/85 hover:bg-blush/25"
              }`}
            >
              📸 Photo Memories
            </button>
            <button
              onClick={() => {
                setActiveTab("videos");
                fireConfetti(0.5);
              }}
              className={`px-6 py-2.5 rounded-full text-xs sm:text-sm font-semibold tracking-wide transition-all cursor-pointer ${
                activeTab === "videos"
                  ? "bg-deep-rose text-cream shadow-sm"
                  : "text-deep-rose/85 hover:bg-blush/25"
              }`}
            >
              🎬 Special Videos
            </button>
          </div>

          {/* Conditional rendering */}
          <div className="w-full flex justify-center">
            {activeTab === "photos" ? <PhotoGallery /> : <VideoGallery />}
          </div>
        </motion.div>
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2 }}
        className="mt-16 text-xs uppercase tracking-[0.3em] text-deep-rose/40"
      >
        Made with love · A birthday surprise
      </motion.p>
    </div>
  );
}
