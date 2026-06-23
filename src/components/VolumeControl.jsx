import { useCallback } from 'react';
import { motion } from 'framer-motion';
import { Volume2, Volume1, VolumeX } from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';

export default function VolumeControl() {
  const { state, dispatch } = usePlayer();

  const effectiveVolume = state.isMuted ? 0 : state.volume;

  const VolumeIcon = effectiveVolume === 0 ? VolumeX : effectiveVolume < 0.5 ? Volume1 : Volume2;

  const handleVolumeChange = useCallback(
    (e) => {
      const v = parseFloat(e.target.value);
      dispatch({ type: 'SET_VOLUME', payload: v });
      if (v > 0 && state.isMuted) {
        dispatch({ type: 'TOGGLE_MUTE' });
      }
    },
    [dispatch, state.isMuted]
  );

  return (
    <div className="flex items-center gap-2 group">
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => dispatch({ type: 'TOGGLE_MUTE' })}
        className="p-1 rounded-md hover:bg-white/5 transition-colors duration-200"
      >
        <VolumeIcon className="w-4 h-4 text-white/50 hover:text-white/70 transition-colors" strokeWidth={1.5} />
      </motion.button>

      <div className="w-0 group-hover:w-20 overflow-hidden transition-all duration-300 ease-out">
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={effectiveVolume}
          onChange={handleVolumeChange}
          className="w-20 h-4"
          style={{
            background: `linear-gradient(to right, rgba(99,102,241,0.7) ${effectiveVolume * 100}%, rgba(255,255,255,0.08) ${effectiveVolume * 100}%)`,
          }}
        />
      </div>
    </div>
  );
}
