import { motion } from 'framer-motion';
import { Film, Music, X, Loader } from 'lucide-react';
import { formatFileSize } from '../utils/formats';

export default function PlaylistItem({ track, index, isActive, onPlay, onRemove }) {
  const isVideo = track.mediaType === 'video';
  const Icon = isVideo ? Film : Music;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.25, delay: index * 0.03 }}
      onClick={() => onPlay(index)}
      className={`group relative flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-200 ${
        isActive
          ? 'bg-accent/15 border border-accent/20'
          : 'hover:bg-white/[0.04] border border-transparent'
      }`}
    >
      <div
        className={`flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center transition-colors duration-200 ${
          isActive
            ? 'bg-accent/20'
            : isVideo
            ? 'bg-pink-500/10'
            : 'bg-emerald-500/10'
        }`}
      >
        {isActive ? (
          <motion.div
            className="flex items-end gap-[2px] h-4"
            initial={false}
          >
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-[3px] rounded-full bg-accent-light"
                animate={{ height: ['40%', '100%', '40%'] }}
                transition={{
                  duration: 0.8,
                  repeat: Infinity,
                  delay: i * 0.15,
                  ease: 'easeInOut',
                }}
              />
            ))}
          </motion.div>
        ) : (
          <Icon
            className={`w-4 h-4 ${isVideo ? 'text-pink-400/70' : 'text-emerald-400/70'}`}
            strokeWidth={1.5}
          />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <p
          className={`text-xs font-medium truncate transition-colors duration-200 ${
            isActive ? 'text-accent-light' : 'text-white/70 group-hover:text-white/90'
          }`}
        >
          {track.name}
        </p>
        <p className="text-[10px] text-white/25 mt-0.5">
          {formatFileSize(track.size)}
          {track.transcoded && (
            <span className="ml-1.5 text-accent/50">transcoded</span>
          )}
        </p>
      </div>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={(e) => {
          e.stopPropagation();
          onRemove(index);
        }}
        className="flex-shrink-0 opacity-0 group-hover:opacity-100 w-6 h-6 rounded-md flex items-center justify-center hover:bg-white/10 transition-all duration-200"
      >
        <X className="w-3 h-3 text-white/40" />
      </motion.button>
    </motion.div>
  );
}
