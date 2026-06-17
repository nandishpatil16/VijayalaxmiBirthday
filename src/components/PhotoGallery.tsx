import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const PHOTOS = [
  {
    url: "/photos/IMG-20250707-WA0007.jpg.jpeg",
    caption: "Our special moments... 📸",
    sticker: "✨",
    rotation: -3,
  },
  {
    url: "/photos/IMG_20260509_231451.jpg.jpeg",
    caption: "Always matching smiles! 😊💖",
    sticker: "🌸",
    rotation: 4,
  },
  {
    url: "/photos/Picsart_26-06-05_23-47-42-950.png",
    caption: "Sweetest birthday memories... 🍬✨",
    sticker: "🎀",
    rotation: -4,
  },
  {
    url: "/photos/Snapchat-1886857511.jpg.jpeg",
    caption: "A beautiful trip around the sun! ☀️",
    sticker: "🌟",
    rotation: 3,
  },
  {
    url: "/photos/Snapchat-772870394.jpg.jpeg",
    caption: "Making every day brighter 🌸",
    sticker: "🎈",
    rotation: -2,
  },
  {
    url: "/photos/Snapchat-978484817.jpg.jpeg",
    caption: "Laughter, love, and joy... 💕",
    sticker: "🧸",
    rotation: 5,
  },
  {
    url: "/photos/1780223302281.png",
    caption: "So glad you are in my life! 🎂",
    sticker: "🍰",
    rotation: -5,
  },
  {
    url: "/photos/1780331460052.png",
    caption: "Happy Birthday! 🎈🍰✨",
    sticker: "👑",
    rotation: 2,
  },
];

export default function PhotoGallery() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  const nextPhoto = () => {
    setCurrentIndex((prev) => (prev + 1) % PHOTOS.length);
  };

  const prevPhoto = () => {
    setCurrentIndex((prev) => (prev - 1 + PHOTOS.length) % PHOTOS.length);
  };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-2xl px-4 py-8">
      {/* Polaroid Slideshow Container */}
      <div className="relative w-[320px] sm:w-[380px] h-[440px] sm:h-[500px] flex items-center justify-center">
        {/* Background stack decoration for organic paper look */}
        <div className="absolute inset-0 bg-white/70 rounded-2xl shadow-md rotate-3 translate-x-2 translate-y-2 border border-blush/30 pointer-events-none" />
        <div className="absolute inset-0 bg-white/50 rounded-2xl shadow-md -rotate-6 -translate-x-2 translate-y-1 border border-blush/20 pointer-events-none" />

        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, scale: 0.8, rotate: PHOTOS[currentIndex].rotation - 10, y: 30 }}
            animate={{ opacity: 1, scale: 1, rotate: PHOTOS[currentIndex].rotation, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, rotate: PHOTOS[currentIndex].rotation + 10, y: -50 }}
            transition={{ type: "spring", damping: 15, stiffness: 100 }}
            className="absolute inset-0 bg-white p-4 sm:p-5 rounded-2xl shadow-[0_20px_50px_rgba(196,92,124,0.15)] border border-blush/40 flex flex-col justify-between cursor-pointer group"
            onClick={() => setSelectedPhoto(PHOTOS[currentIndex].url)}
          >
            {/* Cute Tape Sticker effect */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-28 h-7 bg-cream/80 backdrop-blur-[1px] border border-blush/30 shadow-[0_2px_5px_rgba(0,0,0,0.05)] -rotate-3 z-20 pointer-events-none flex items-center justify-center text-[10px] text-deep-rose/60 font-semibold tracking-wider uppercase">
              ♥ memories ♥
            </div>

            {/* Cute Corner Sticker */}
            <span className="absolute top-2 right-2 text-2xl select-none z-10 filter drop-shadow-sm group-hover:scale-110 transition-transform">
              {PHOTOS[currentIndex].sticker}
            </span>

            {/* Image Box */}
            <div className="w-full flex-1 bg-cream/20 rounded-lg overflow-hidden border border-blush/20 relative">
              <img
                src={PHOTOS[currentIndex].url}
                alt="Birthday Memory"
                className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700"
                loading="eager"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-3">
                <span className="text-white text-xs font-semibold bg-deep-rose/80 px-3 py-1 rounded-full backdrop-blur-sm shadow-sm">
                  🔍 View Full Photo
                </span>
              </div>
            </div>

            {/* Handwritten-style Caption */}
            <div className="h-20 flex items-center justify-center px-2">
              <p className="font-script text-2xl sm:text-3xl text-deep-rose font-semibold text-center leading-snug">
                {PHOTOS[currentIndex].caption}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Slide Navigation Controls */}
      <div className="flex items-center gap-6 mt-8">
        <button
          onClick={prevPhoto}
          className="w-12 h-12 rounded-full border-2 border-blush bg-card flex items-center justify-center text-xl text-deep-rose font-bold hover:bg-deep-rose hover:text-cream shadow-md transition-all active:scale-95"
          aria-label="Previous photo"
        >
          ←
        </button>
        <span className="font-display font-medium text-deep-rose/80">
          {currentIndex + 1} / {PHOTOS.length}
        </span>
        <button
          onClick={nextPhoto}
          className="w-12 h-12 rounded-full border-2 border-blush bg-card flex items-center justify-center text-xl text-deep-rose font-bold hover:bg-deep-rose hover:text-cream shadow-md transition-all active:scale-95"
          aria-label="Next photo"
        >
          →
        </button>
      </div>

      {/* Lightbox / Zoom-in View Modal */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex flex-col items-center justify-center p-4 cursor-zoom-out"
            onClick={() => setSelectedPhoto(null)}
          >
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-2xl border border-white/20 transition-colors"
            >
              ✕
            </button>
            <motion.div
              initial={{ scale: 0.85, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.85, y: 30 }}
              transition={{ type: "spring", damping: 20 }}
              className="relative max-w-full max-h-[85vh] bg-white p-3 rounded-2xl shadow-2xl border border-white/10 flex flex-col items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={selectedPhoto}
                alt="Enlarged birthday memory"
                className="max-w-[90vw] max-h-[75vh] object-contain rounded-xl border border-blush/20"
              />
              <p className="mt-4 font-script text-2xl text-deep-rose font-semibold py-1">
                {PHOTOS.find((p) => p.url === selectedPhoto)?.caption}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
