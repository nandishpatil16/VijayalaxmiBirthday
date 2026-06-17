import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { fireConfetti } from "./ConfettiBurst";

const VIDEOS = [
  {
    url: "/videos/VN20260614_141511.mp4",
    title: "My Best Friend 💖",
    description: "A special tribute to my best friend",
    emoji: "🎬",
  },
  {
    url: "/videos/VN20260614_151459.mp4",
    title: "Your Always Mine ✨",
    description: "Forever and always, you are mine",
    emoji: "🎂",
  },
  {
    url: "/videos/VN20260606_160248.mp4",
    title: "Our Sweet Memories 🎀",
    description: "Beautiful moments we shared together",
    emoji: "🎈",
  },
];

export default function VideoGallery() {
  const [activeVideo, setActiveVideo] = useState(VIDEOS[0]);

  const handleSelectVideo = (video: typeof VIDEOS[0]) => {
    setActiveVideo(video);
    fireConfetti(0.8);
  };

  return (
    <div className="flex flex-col items-center w-full max-w-2xl px-4 py-6">
      {/* Video Player Box */}
      <div className="w-full max-w-[340px] sm:max-w-[360px] rounded-3xl bg-black border-4 border-blush overflow-hidden shadow-[0_20px_50px_rgba(196,92,124,0.25)] relative flex flex-col">
        <div className="w-full bg-black flex items-center justify-center h-[480px] sm:h-[520px]">
          <video
            key={activeVideo.url}
            src={activeVideo.url}
            controls
            autoPlay
            playsInline
            className="w-full h-full object-contain"
          />
        </div>
        <div className="p-4 sm:p-5 border-t border-blush/35 bg-card/95 backdrop-blur-sm">
          <span className="text-xl mr-2">{activeVideo.emoji}</span>
          <h3 className="inline-block font-display text-lg sm:text-xl font-semibold text-deep-rose">
            {activeVideo.title}
          </h3>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            {activeVideo.description}
          </p>
        </div>
      </div>

      {/* Video Playlist Grid */}
      <div className="w-full mt-6 grid gap-3 sm:grid-cols-3">
        {VIDEOS.map((video) => {
          const isActive = activeVideo.url === video.url;
          return (
            <motion.button
              key={video.url}
              onClick={() => handleSelectVideo(video)}
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.97 }}
              className={`flex flex-col text-left p-4 rounded-2xl border transition-all cursor-pointer select-none ${
                isActive
                  ? "bg-deep-rose text-cream border-deep-rose shadow-md"
                  : "bg-card hover:bg-blush/20 text-foreground border-blush/50"
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-2xl">{video.emoji}</span>
                <span className={`text-xs font-semibold uppercase tracking-wider ${
                  isActive ? "text-cream/80" : "text-deep-rose/70"
                }`}>
                  Video
                </span>
              </div>
              <h4 className="font-display font-medium text-sm mt-2 line-clamp-1">
                {video.title}
              </h4>
              <p className={`text-[10px] mt-1 line-clamp-1 ${
                isActive ? "text-cream/70" : "text-muted-foreground"
              }`}>
                {video.description}
              </p>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
