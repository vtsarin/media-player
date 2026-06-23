import { motion } from 'framer-motion';
import { Loader, Zap } from 'lucide-react';

export default function TranscodeOverlay({ filename, progress, isLoading }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-40 flex items-center justify-center bg-surface/95 backdrop-blur-sm"
    >
      <div className="flex flex-col items-center gap-6 max-w-sm text-center">
        <motion.div
          animate={{ rotate: isLoading ? 360 : 0 }}
          transition={{ duration: 2, repeat: isLoading ? Infinity : 0, ease: 'linear' }}
          className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center"
        >
          {isLoading ? (
            <Loader className="w-7 h-7 text-amber-400" strokeWidth={1.5} />
          ) : (
            <Zap className="w-7 h-7 text-amber-400" strokeWidth={1.5} />
          )}
        </motion.div>

        <div>
          <p className="text-sm font-medium text-white/80 mb-1">
            {isLoading ? 'Loading converter...' : 'Converting for playback'}
          </p>
          <p className="text-xs text-white/30 truncate max-w-[280px]">{filename}</p>
        </div>

        {!isLoading && (
          <div className="w-64">
            <div className="w-full h-1.5 rounded-full bg-white/5 overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-amber-500 to-orange-500"
                initial={{ width: '0%' }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
              />
            </div>
            <p className="text-xs text-white/30 mt-2">{progress}%</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
