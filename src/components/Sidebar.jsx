import { useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, FolderOpen, Trash2, ListMusic } from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';
import { getMediaType, getMediaAcceptString } from '../utils/formats';
import PlaylistItem from './PlaylistItem';

export default function Sidebar() {
  const { state, dispatch, addFiles } = usePlayer();
  const fileInputRef = useRef(null);

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files).filter((f) => {
      const type = getMediaType(f);
      return type === 'video' || type === 'audio';
    });
    if (files.length > 0) addFiles(files);
    e.target.value = '';
  };

  return (
    <motion.aside
      initial={{ x: -280 }}
      animate={{ x: state.sidebarOpen ? 0 : -280 }}
      transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
      className="flex-shrink-0 w-[280px] h-full flex flex-col bg-surface-50 border-r border-white/[0.04]"
    >
      <div className="flex items-center justify-between px-4 py-4 border-b border-white/[0.04]">
        <div className="flex items-center gap-2">
          <ListMusic className="w-4 h-4 text-white/30" strokeWidth={1.5} />
          <span className="text-xs font-medium text-white/50 uppercase tracking-wider">
            Playlist
          </span>
        </div>
        <span className="text-[10px] text-white/20 font-medium">
          {state.playlist.length} {state.playlist.length === 1 ? 'file' : 'files'}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto px-2 py-2 space-y-0.5">
        <AnimatePresence>
          {state.playlist.map((track, index) => (
            <PlaylistItem
              key={track.id}
              track={track}
              index={index}
              isActive={index === state.currentIndex}
              onPlay={(i) => dispatch({ type: 'PLAY_INDEX', payload: i })}
              onRemove={(i) => dispatch({ type: 'REMOVE_TRACK', payload: i })}
            />
          ))}
        </AnimatePresence>

        {state.playlist.length === 0 && (
          <div className="flex flex-col items-center justify-center h-40 text-white/15 text-xs">
            <ListMusic className="w-8 h-8 mb-2" strokeWidth={1} />
            No files added
          </div>
        )}
      </div>

      <div className="px-3 py-3 border-t border-white/[0.04] space-y-2">
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={getMediaAcceptString()}
          onChange={handleFileSelect}
          className="hidden"
        />

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => fileInputRef.current?.click()}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-accent/10 hover:bg-accent/15 text-accent-light text-xs font-medium transition-colors duration-200"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Files
        </motion.button>

        {state.playlist.length > 0 && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => dispatch({ type: 'CLEAR_PLAYLIST' })}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl hover:bg-red-500/10 text-white/30 hover:text-red-400/70 text-xs font-medium transition-colors duration-200"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Clear All
          </motion.button>
        )}
      </div>
    </motion.aside>
  );
}
