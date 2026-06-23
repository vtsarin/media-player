import { useMemo } from 'react';
import { getMediaType, isNativelySupported, needsTranscoding } from '../utils/formats';

export function useMediaFile(track) {
  return useMemo(() => {
    if (!track) return { mediaType: null, supported: false, needsTranscode: false };
    return {
      mediaType: getMediaType(track.file),
      supported: isNativelySupported(track.file),
      needsTranscode: needsTranscoding(track.file),
    };
  }, [track]);
}
