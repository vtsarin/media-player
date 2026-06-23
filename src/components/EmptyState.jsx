import { motion } from 'framer-motion';
import { Upload, Film, Music } from 'lucide-react';

export default function EmptyState({ onBrowse }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
      className="flex flex-col items-center justify-center h-full select-none"
    >
      <motion.div
        className="relative mb-8"
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      >
        <div className="w-32 h-32 rounded-3xl flex items-center justify-center glow-accent">
          <img src="/logo.svg" alt="LocalPlay" className="w-28 h-28 rounded-2xl" />
        </div>
        <motion.div
          className="absolute -top-2 -right-2 w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500/30 to-rose-500/30 flex items-center justify-center"
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        >
          <Film className="w-5 h-5 text-pink-400" strokeWidth={1.5} />
        </motion.div>
        <motion.div
          className="absolute -bottom-2 -left-2 w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/30 to-teal-500/30 flex items-center justify-center"
          animate={{ rotate: [0, -10, 10, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        >
          <Music className="w-5 h-5 text-emerald-400" strokeWidth={1.5} />
        </motion.div>
      </motion.div>

      <h2 className="text-2xl font-semibold text-white/90 mb-2">
        Welcome to LocalPlay
      </h2>
      <p className="text-white/40 text-sm mb-8 text-center max-w-md leading-relaxed">
        Drop your media files anywhere or browse from your device.
        <br />
        Supports MP4, MKV, AVI, WMV, FLV, MP3, FLAC, and more.
      </p>

      <motion.button
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.97 }}
        onClick={onBrowse}
        className="flex items-center gap-3 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-accent to-purple-600 text-white font-medium text-sm shadow-lg shadow-accent/25 hover:shadow-accent/40 transition-shadow duration-300"
      >
        <Upload className="w-4 h-4" />
        Browse Files
      </motion.button>

      <div className="mt-12 flex items-center gap-6 text-white/20 text-xs">
        <span className="flex items-center gap-1.5">
          <kbd className="px-1.5 py-0.5 rounded bg-white/5 text-[10px]">Space</kbd>
          Play/Pause
        </span>
        <span className="flex items-center gap-1.5">
          <kbd className="px-1.5 py-0.5 rounded bg-white/5 text-[10px]">F</kbd>
          Fullscreen
        </span>
        <span className="flex items-center gap-1.5">
          <kbd className="px-1.5 py-0.5 rounded bg-white/5 text-[10px]">M</kbd>
          Mute
        </span>
      </div>
    </motion.div>
  );
}
