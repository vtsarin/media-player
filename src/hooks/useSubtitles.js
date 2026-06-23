import { useState, useCallback } from 'react';
import { parseSubtitleFile } from '../utils/subtitleParser';

export function useSubtitles() {
  const [subtitleUrl, setSubtitleUrl] = useState(null);
  const [error, setError] = useState(null);

  const loadSubtitle = useCallback(async (file) => {
    try {
      setError(null);
      const result = await parseSubtitleFile(file);
      const url = URL.createObjectURL(result.blob);

      if (subtitleUrl) {
        URL.revokeObjectURL(subtitleUrl);
      }

      setSubtitleUrl(url);
      return url;
    } catch (err) {
      setError(err.message);
      return null;
    }
  }, [subtitleUrl]);

  const clearSubtitles = useCallback(() => {
    if (subtitleUrl) {
      URL.revokeObjectURL(subtitleUrl);
    }
    setSubtitleUrl(null);
  }, [subtitleUrl]);

  return { subtitleUrl, loadSubtitle, clearSubtitles, error };
}
