import { createContext, useContext, useReducer, useRef, useCallback } from 'react';
import { getMediaType } from '../utils/formats';

const PlayerContext = createContext(null);

const initialState = {
  playlist: [],
  currentIndex: -1,
  isPlaying: false,
  volume: 1,
  isMuted: false,
  currentTime: 0,
  duration: 0,
  playbackRate: 1,
  isFullscreen: false,
  repeat: 'off',
  shuffle: false,
  subtitleUrl: null,
  subtitlesEnabled: true,
  isTranscoding: false,
  transcodeProgress: 0,
  sidebarOpen: true,
};

function reducer(state, action) {
  switch (action.type) {
    case 'ADD_FILES':
      return {
        ...state,
        playlist: [...state.playlist, ...action.payload],
        currentIndex: state.currentIndex === -1 ? 0 : state.currentIndex,
      };

    case 'PLAY_INDEX':
      return {
        ...state,
        currentIndex: action.payload,
        isPlaying: true,
        currentTime: 0,
        subtitleUrl: null,
      };

    case 'SET_PLAYING':
      return { ...state, isPlaying: action.payload };

    case 'SET_VOLUME':
      return { ...state, volume: action.payload, isMuted: action.payload === 0 };

    case 'TOGGLE_MUTE':
      return { ...state, isMuted: !state.isMuted };

    case 'SET_CURRENT_TIME':
      return { ...state, currentTime: action.payload };

    case 'SET_DURATION':
      return { ...state, duration: action.payload };

    case 'SET_PLAYBACK_RATE':
      return { ...state, playbackRate: action.payload };

    case 'SET_FULLSCREEN':
      return { ...state, isFullscreen: action.payload };

    case 'TOGGLE_REPEAT': {
      const modes = ['off', 'one', 'all'];
      const next = modes[(modes.indexOf(state.repeat) + 1) % 3];
      return { ...state, repeat: next };
    }

    case 'TOGGLE_SHUFFLE':
      return { ...state, shuffle: !state.shuffle };

    case 'NEXT_TRACK': {
      if (state.playlist.length === 0) return state;
      let nextIndex;
      if (state.shuffle) {
        nextIndex = Math.floor(Math.random() * state.playlist.length);
      } else {
        nextIndex = (state.currentIndex + 1) % state.playlist.length;
      }
      return { ...state, currentIndex: nextIndex, isPlaying: true, currentTime: 0, subtitleUrl: null };
    }

    case 'PREV_TRACK': {
      if (state.playlist.length === 0) return state;
      let prevIndex;
      if (state.shuffle) {
        prevIndex = Math.floor(Math.random() * state.playlist.length);
      } else {
        prevIndex = state.currentIndex <= 0 ? state.playlist.length - 1 : state.currentIndex - 1;
      }
      return { ...state, currentIndex: prevIndex, isPlaying: true, currentTime: 0, subtitleUrl: null };
    }

    case 'REMOVE_TRACK': {
      const newPlaylist = state.playlist.filter((_, i) => i !== action.payload);
      let newIndex = state.currentIndex;
      if (action.payload < state.currentIndex) newIndex -= 1;
      else if (action.payload === state.currentIndex) {
        newIndex = newPlaylist.length > 0 ? Math.min(newIndex, newPlaylist.length - 1) : -1;
      }
      return {
        ...state,
        playlist: newPlaylist,
        currentIndex: newIndex,
        isPlaying: newPlaylist.length === 0 ? false : state.isPlaying,
      };
    }

    case 'CLEAR_PLAYLIST':
      return { ...initialState };

    case 'SET_SUBTITLE_URL':
      return { ...state, subtitleUrl: action.payload };

    case 'TOGGLE_SUBTITLES':
      return { ...state, subtitlesEnabled: !state.subtitlesEnabled };

    case 'SET_TRANSCODING':
      return { ...state, isTranscoding: action.payload };

    case 'SET_TRANSCODE_PROGRESS':
      return { ...state, transcodeProgress: action.payload };

    case 'UPDATE_TRACK_URL': {
      const updated = [...state.playlist];
      updated[action.payload.index] = {
        ...updated[action.payload.index],
        url: action.payload.url,
        transcoded: true,
      };
      return { ...state, playlist: updated };
    }

    case 'TOGGLE_SIDEBAR':
      return { ...state, sidebarOpen: !state.sidebarOpen };

    default:
      return state;
  }
}

export function PlayerProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const mediaRef = useRef(null);

  const addFiles = useCallback((files) => {
    const mediaFiles = files.map((file) => ({
      id: `${file.name}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      file,
      name: file.name,
      mediaType: getMediaType(file),
      size: file.size,
      url: URL.createObjectURL(file),
      transcoded: false,
    }));
    dispatch({ type: 'ADD_FILES', payload: mediaFiles });
  }, []);

  return (
    <PlayerContext.Provider value={{ state, dispatch, mediaRef, addFiles }}>
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const context = useContext(PlayerContext);
  if (!context) throw new Error('usePlayer must be used within PlayerProvider');
  return context;
}
