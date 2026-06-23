import { useRef, useCallback, useEffect, useState } from 'react';
import { usePlayer } from '../context/PlayerContext';
import { useMediaFile } from '../hooks/useMediaFile';
import { useTranscode } from '../hooks/useTranscode';
import VideoPlayer from './VideoPlayer';
import AudioPlayer from './AudioPlayer';
import EmptyState from './EmptyState';
import TranscodeOverlay from './TranscodeOverlay';
import { getMediaAcceptString, getMediaType } from '../utils/formats';

export default function PlayerArea() {
  const { state, dispatch, addFiles } = usePlayer();
  const fileInputRef = useRef(null);

  const currentTrack = state.currentIndex >= 0 ? state.playlist[state.currentIndex] : null;
  const { mediaType, needsTranscode } = useMediaFile(currentTrack);
  const { transcode, progress, isLoading } = useTranscode();
  const [isTranscoding, setIsTranscoding] = useState(false);

  const handleBrowse = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files).filter((f) => {
      const type = getMediaType(f);
      return type === 'video' || type === 'audio';
    });
    if (files.length > 0) addFiles(files);
    e.target.value = '';
  };

  useEffect(() => {
    if (!currentTrack || !needsTranscode || currentTrack.transcoded) return;

    const doTranscode = async () => {
      setIsTranscoding(true);
      dispatch({ type: 'SET_TRANSCODING', payload: true });
      try {
        const url = await transcode(currentTrack.file);
        dispatch({
          type: 'UPDATE_TRACK_URL',
          payload: { index: state.currentIndex, url },
        });
      } catch (err) {
        console.error('Transcode failed:', err);
      } finally {
        setIsTranscoding(false);
        dispatch({ type: 'SET_TRANSCODING', payload: false });
      }
    };

    doTranscode();
  }, [currentTrack?.id, needsTranscode]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      dispatch({ type: 'SET_FULLSCREEN', payload: !!document.fullscreenElement });
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, [dispatch]);

  return (
    <div id="player-area" className="flex-1 relative flex items-center justify-center bg-surface overflow-hidden">
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept={getMediaAcceptString()}
        onChange={handleFileSelect}
        className="hidden"
      />

      {isTranscoding && (
        <TranscodeOverlay
          filename={currentTrack?.name}
          progress={progress}
          isLoading={isLoading}
        />
      )}

      {!currentTrack && <EmptyState onBrowse={handleBrowse} />}

      {currentTrack && !isTranscoding && mediaType === 'video' && (
        <VideoPlayer track={currentTrack} />
      )}

      {currentTrack && !isTranscoding && mediaType === 'audio' && (
        <AudioPlayer track={currentTrack} />
      )}
    </div>
  );
}
