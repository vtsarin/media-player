import { motion } from 'framer-motion';
import { PanelLeftClose, PanelLeft } from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';
import Sidebar from './Sidebar';
import PlayerArea from './PlayerArea';
import Controls from './Controls';
import DropZone from './DropZone';

export default function Layout() {
  const { state, dispatch } = usePlayer();
  useKeyboardShortcuts();

  return (
    <DropZone>
      <div className="flex flex-col h-full w-full">
        {/* Top Bar */}
        <div className="flex-shrink-0 flex items-center justify-between px-4 py-2.5 border-b border-white/[0.04] bg-surface-50/80 backdrop-blur-md z-20">
          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => dispatch({ type: 'TOGGLE_SIDEBAR' })}
              className="p-1.5 rounded-lg hover:bg-white/5 text-white/30 hover:text-white/50 transition-colors duration-200"
            >
              {state.sidebarOpen ? (
                <PanelLeftClose className="w-4 h-4" strokeWidth={1.5} />
              ) : (
                <PanelLeft className="w-4 h-4" strokeWidth={1.5} />
              )}
            </motion.button>

            <div className="flex items-center gap-2">
              <img src="/logo.svg" alt="LocalPlay" className="w-6 h-6 rounded-lg" />
              <span className="text-sm font-semibold text-white/70 tracking-tight">
                LocalPlay
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-[10px] text-white/15">
            <kbd className="px-1.5 py-0.5 rounded bg-white/[0.03] border border-white/[0.04]">Space</kbd>
            <span>Play</span>
            <span className="mx-1">·</span>
            <kbd className="px-1.5 py-0.5 rounded bg-white/[0.03] border border-white/[0.04]">←→</kbd>
            <span>Seek</span>
            <span className="mx-1">·</span>
            <kbd className="px-1.5 py-0.5 rounded bg-white/[0.03] border border-white/[0.04]">F</kbd>
            <span>Fullscreen</span>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden">
          <Sidebar />
          <PlayerArea />
        </div>

        {/* Bottom Controls */}
        <Controls />
      </div>
    </DropZone>
  );
}
