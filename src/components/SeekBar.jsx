import { useCallback, useRef, useState } from 'react';
import { usePlayer } from '../context/PlayerContext';
import { formatTime } from '../utils/time';

export default function SeekBar() {
  const { state, mediaRef } = usePlayer();
  const [hoverTime, setHoverTime] = useState(null);
  const [hoverX, setHoverX] = useState(0);
  const barRef = useRef(null);

  const progress = state.duration > 0 ? (state.currentTime / state.duration) * 100 : 0;

  const handleSeek = useCallback(
    (e) => {
      if (!mediaRef.current || !barRef.current) return;
      const rect = barRef.current.getBoundingClientRect();
      const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      mediaRef.current.currentTime = x * state.duration;
    },
    [state.duration, mediaRef]
  );

  const handleMouseMove = useCallback(
    (e) => {
      if (!barRef.current) return;
      const rect = barRef.current.getBoundingClientRect();
      const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      setHoverTime(formatTime(x * state.duration));
      setHoverX(e.clientX - rect.left);
    },
    [state.duration]
  );

  return (
    <div className="w-full px-4">
      <div
        ref={barRef}
        className="group relative w-full h-6 flex items-center cursor-pointer"
        onClick={handleSeek}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setHoverTime(null)}
      >
        <div className="w-full h-1 group-hover:h-1.5 rounded-full bg-white/[0.08] transition-all duration-200 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-accent to-purple-500 transition-[width] duration-100"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div
          className="absolute top-0 w-3 h-3 rounded-full bg-white shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 -translate-x-1/2 translate-y-1.5"
          style={{ left: `${progress}%` }}
        />

        {hoverTime && (
          <div
            className="absolute -top-8 px-2 py-1 rounded-md bg-surface-300 text-[10px] text-white/70 -translate-x-1/2 pointer-events-none"
            style={{ left: `${hoverX}px` }}
          >
            {hoverTime}
          </div>
        )}
      </div>

      <div className="flex justify-between px-0.5 -mt-1">
        <span className="text-[10px] text-white/25 font-medium tabular-nums">
          {formatTime(state.currentTime)}
        </span>
        <span className="text-[10px] text-white/25 font-medium tabular-nums">
          {formatTime(state.duration)}
        </span>
      </div>
    </div>
  );
}
