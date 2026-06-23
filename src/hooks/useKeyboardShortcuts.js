import { useEffect } from 'react';
import { usePlayer } from '../context/PlayerContext';

export function useKeyboardShortcuts() {
  const { state, dispatch, mediaRef } = usePlayer();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      switch (e.key) {
        case ' ':
          e.preventDefault();
          if (state.currentIndex >= 0) {
            dispatch({ type: 'SET_PLAYING', payload: !state.isPlaying });
          }
          break;

        case 'ArrowLeft':
          e.preventDefault();
          if (mediaRef.current) {
            mediaRef.current.currentTime = Math.max(0, mediaRef.current.currentTime - 5);
          }
          break;

        case 'ArrowRight':
          e.preventDefault();
          if (mediaRef.current) {
            mediaRef.current.currentTime = Math.min(
              mediaRef.current.duration || 0,
              mediaRef.current.currentTime + 5
            );
          }
          break;

        case 'ArrowUp':
          e.preventDefault();
          dispatch({ type: 'SET_VOLUME', payload: Math.min(1, state.volume + 0.05) });
          break;

        case 'ArrowDown':
          e.preventDefault();
          dispatch({ type: 'SET_VOLUME', payload: Math.max(0, state.volume - 0.05) });
          break;

        case 'm':
        case 'M':
          dispatch({ type: 'TOGGLE_MUTE' });
          break;

        case 'f':
        case 'F': {
          e.preventDefault();
          const el = document.getElementById('player-area');
          if (el) {
            if (document.fullscreenElement) document.exitFullscreen();
            else el.requestFullscreen();
          }
          break;
        }

        case 'p':
        case 'P':
          if (mediaRef.current?.tagName === 'VIDEO' && document.pictureInPictureEnabled) {
            if (document.pictureInPictureElement) document.exitPictureInPicture();
            else mediaRef.current.requestPictureInPicture();
          }
          break;

        case 'n':
        case 'N':
          dispatch({ type: 'NEXT_TRACK' });
          break;

        case 'b':
        case 'B':
          dispatch({ type: 'PREV_TRACK' });
          break;

        case '[':
          dispatch({
            type: 'SET_PLAYBACK_RATE',
            payload: Math.max(0.25, state.playbackRate - 0.25),
          });
          break;

        case ']':
          dispatch({
            type: 'SET_PLAYBACK_RATE',
            payload: Math.min(3, state.playbackRate + 0.25),
          });
          break;

        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [state.isPlaying, state.volume, state.playbackRate, state.currentIndex, dispatch, mediaRef]);
}
