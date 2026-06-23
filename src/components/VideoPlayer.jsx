import { useEffect, useCallback } from 'react';
import { usePlayer } from '../context/PlayerContext';

export default function VideoPlayer({ track }) {
  const { state, dispatch, mediaRef } = usePlayer();

  const handleTimeUpdate = useCallback(() => {
    if (mediaRef.current) {
      dispatch({ type: 'SET_CURRENT_TIME', payload: mediaRef.current.currentTime });
    }
  }, [dispatch, mediaRef]);

  const handleLoadedMetadata = useCallback(() => {
    if (mediaRef.current) {
      dispatch({ type: 'SET_DURATION', payload: mediaRef.current.duration });
    }
  }, [dispatch, mediaRef]);

  const handleEnded = useCallback(() => {
    if (state.repeat === 'one') {
      mediaRef.current.currentTime = 0;
      mediaRef.current.play();
    } else if (state.repeat === 'all' || state.currentIndex < state.playlist.length - 1) {
      dispatch({ type: 'NEXT_TRACK' });
    } else {
      dispatch({ type: 'SET_PLAYING', payload: false });
    }
  }, [state.repeat, state.currentIndex, state.playlist.length, dispatch, mediaRef]);

  const handleClick = useCallback(() => {
    dispatch({ type: 'SET_PLAYING', payload: !state.isPlaying });
  }, [state.isPlaying, dispatch]);

  const handleDoubleClick = useCallback(() => {
    const el = document.getElementById('player-area');
    if (el) {
      if (document.fullscreenElement) document.exitFullscreen();
      else el.requestFullscreen();
    }
  }, []);

  useEffect(() => {
    const video = mediaRef.current;
    if (!video) return;
    if (state.isPlaying) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  }, [state.isPlaying, mediaRef]);

  useEffect(() => {
    if (mediaRef.current) {
      mediaRef.current.volume = state.isMuted ? 0 : state.volume;
    }
  }, [state.volume, state.isMuted, mediaRef]);

  useEffect(() => {
    if (mediaRef.current) {
      mediaRef.current.playbackRate = state.playbackRate;
    }
  }, [state.playbackRate, mediaRef]);

  return (
    <div className="relative w-full h-full flex items-center justify-center bg-black">
      <video
        ref={mediaRef}
        key={track.url}
        src={track.url}
        className="max-w-full max-h-full object-contain"
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
        onClick={handleClick}
        onDoubleClick={handleDoubleClick}
        playsInline
        crossOrigin="anonymous"
      >
        {state.subtitleUrl && state.subtitlesEnabled && (
          <track
            kind="subtitles"
            src={state.subtitleUrl}
            srcLang="en"
            label="Subtitles"
            default
          />
        )}
      </video>
    </div>
  );
}
