import { motion } from 'framer-motion';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Repeat,
  Repeat1,
  Shuffle,
  Maximize,
  Minimize,
  PictureInPicture2,
  Gauge,
} from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';
import SeekBar from './SeekBar';
import VolumeControl from './VolumeControl';
import SubtitleLoader from './SubtitleLoader';
import { useState, useRef, useEffect } from 'react';

const SPEED_OPTIONS = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2, 2.5, 3];

export default function Controls() {
  const { state, dispatch, mediaRef } = usePlayer();
  const [showSpeed, setShowSpeed] = useState(false);
  const speedRef = useRef(null);

  const currentTrack = state.currentIndex >= 0 ? state.playlist[state.currentIndex] : null;

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (speedRef.current && !speedRef.current.contains(e.target)) {
        setShowSpeed(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleFullscreen = () => {
    const el = document.getElementById('player-area');
    if (el) {
      if (document.fullscreenElement) document.exitFullscreen();
      else el.requestFullscreen();
    }
  };

  const handlePiP = async () => {
    if (mediaRef.current?.tagName === 'VIDEO' && document.pictureInPictureEnabled) {
      if (document.pictureInPictureElement) await document.exitPictureInPicture();
      else await mediaRef.current.requestPictureInPicture();
    }
  };

  const RepeatIcon = state.repeat === 'one' ? Repeat1 : Repeat;

  if (!currentTrack) return null;

  return (
    <motion.div
      initial={{ y: 80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      className="w-full glass-strong"
    >
      <SeekBar />

      <div className="flex items-center justify-between px-4 pb-3 pt-1">
        {/* Left: Track info */}
        <div className="flex-1 min-w-0 mr-4">
          <p className="text-xs font-medium text-white/60 truncate max-w-[200px]">
            {currentTrack.name}
          </p>
        </div>

        {/* Center: Playback controls */}
        <div className="flex items-center gap-1">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => dispatch({ type: 'TOGGLE_SHUFFLE' })}
            className={`p-2 rounded-lg transition-colors duration-200 ${
              state.shuffle ? 'text-accent-light bg-accent/10' : 'text-white/30 hover:text-white/50 hover:bg-white/5'
            }`}
          >
            <Shuffle className="w-3.5 h-3.5" strokeWidth={1.5} />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => dispatch({ type: 'PREV_TRACK' })}
            className="p-2 rounded-lg text-white/50 hover:text-white/80 hover:bg-white/5 transition-colors duration-200"
          >
            <SkipBack className="w-4 h-4" strokeWidth={1.5} fill="currentColor" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            onClick={() => dispatch({ type: 'SET_PLAYING', payload: !state.isPlaying })}
            className="p-3 mx-1 rounded-2xl bg-white text-surface hover:bg-white/90 transition-colors duration-200"
          >
            {state.isPlaying ? (
              <Pause className="w-5 h-5" strokeWidth={2} fill="currentColor" />
            ) : (
              <Play className="w-5 h-5 ml-0.5" strokeWidth={2} fill="currentColor" />
            )}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => dispatch({ type: 'NEXT_TRACK' })}
            className="p-2 rounded-lg text-white/50 hover:text-white/80 hover:bg-white/5 transition-colors duration-200"
          >
            <SkipForward className="w-4 h-4" strokeWidth={1.5} fill="currentColor" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => dispatch({ type: 'TOGGLE_REPEAT' })}
            className={`p-2 rounded-lg transition-colors duration-200 ${
              state.repeat !== 'off' ? 'text-accent-light bg-accent/10' : 'text-white/30 hover:text-white/50 hover:bg-white/5'
            }`}
          >
            <RepeatIcon className="w-3.5 h-3.5" strokeWidth={1.5} />
          </motion.button>
        </div>

        {/* Right: Secondary controls */}
        <div className="flex-1 flex items-center justify-end gap-1">
          <VolumeControl />

          {/* Speed control */}
          <div className="relative" ref={speedRef}>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setShowSpeed(!showSpeed)}
              className={`px-2 py-1 rounded-md text-[10px] font-semibold transition-colors duration-200 ${
                state.playbackRate !== 1
                  ? 'text-accent-light bg-accent/10'
                  : 'text-white/40 hover:text-white/60 hover:bg-white/5'
              }`}
            >
              {state.playbackRate}x
            </motion.button>

            {showSpeed && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8 }}
                className="absolute bottom-full right-0 mb-2 py-1.5 rounded-xl bg-surface-200 border border-white/[0.06] shadow-xl min-w-[80px] z-50"
              >
                {SPEED_OPTIONS.map((speed) => (
                  <button
                    key={speed}
                    onClick={() => {
                      dispatch({ type: 'SET_PLAYBACK_RATE', payload: speed });
                      setShowSpeed(false);
                    }}
                    className={`w-full px-3 py-1.5 text-xs text-left transition-colors duration-150 ${
                      state.playbackRate === speed
                        ? 'text-accent-light bg-accent/10'
                        : 'text-white/50 hover:text-white/80 hover:bg-white/5'
                    }`}
                  >
                    {speed}x
                  </button>
                ))}
              </motion.div>
            )}
          </div>

          <SubtitleLoader />

          {currentTrack.mediaType === 'video' && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handlePiP}
              className="p-1.5 rounded-md hover:bg-white/5 text-white/40 hover:text-white/60 transition-colors duration-200"
              title="Picture in Picture"
            >
              <PictureInPicture2 className="w-4 h-4" strokeWidth={1.5} />
            </motion.button>
          )}

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleFullscreen}
            className="p-1.5 rounded-md hover:bg-white/5 text-white/40 hover:text-white/60 transition-colors duration-200"
            title="Fullscreen"
          >
            {state.isFullscreen ? (
              <Minimize className="w-4 h-4" strokeWidth={1.5} />
            ) : (
              <Maximize className="w-4 h-4" strokeWidth={1.5} />
            )}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
