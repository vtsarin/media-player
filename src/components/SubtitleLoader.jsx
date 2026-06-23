import { useRef } from 'react';
import { motion } from 'framer-motion';
import { Subtitles } from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';
import { useSubtitles } from '../hooks/useSubtitles';

export default function SubtitleLoader() {
  const { state, dispatch } = usePlayer();
  const { loadSubtitle } = useSubtitles();
  const fileInputRef = useRef(null);

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const url = await loadSubtitle(file);
    if (url) {
      dispatch({ type: 'SET_SUBTITLE_URL', payload: url });
    }
    e.target.value = '';
  };

  const handleClick = () => {
    if (state.subtitleUrl) {
      dispatch({ type: 'TOGGLE_SUBTITLES' });
    } else {
      fileInputRef.current?.click();
    }
  };

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept=".srt,.vtt,.ass,.ssa"
        onChange={handleFileSelect}
        className="hidden"
      />
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={handleClick}
        onContextMenu={(e) => {
          e.preventDefault();
          fileInputRef.current?.click();
        }}
        className={`p-1.5 rounded-md transition-colors duration-200 ${
          state.subtitleUrl && state.subtitlesEnabled
            ? 'bg-accent/15 text-accent-light'
            : 'hover:bg-white/5 text-white/40 hover:text-white/60'
        }`}
        title={state.subtitleUrl ? 'Toggle subtitles (right-click to load new)' : 'Load subtitles'}
      >
        <Subtitles className="w-4 h-4" strokeWidth={1.5} />
      </motion.button>
    </>
  );
}
