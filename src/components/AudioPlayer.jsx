import { useEffect, useCallback, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Music } from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';

export default function AudioPlayer({ track }) {
  const { state, dispatch, mediaRef } = usePlayer();
  const canvasRef = useRef(null);
  const animFrameRef = useRef(null);
  const analyserRef = useRef(null);
  const audioCtxRef = useRef(null);
  const sourceRef = useRef(null);
  const [isVisualizerReady, setIsVisualizerReady] = useState(false);

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

  useEffect(() => {
    const audio = mediaRef.current;
    if (!audio) return;
    if (state.isPlaying) {
      audio.play().catch(() => {});
    } else {
      audio.pause();
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

  useEffect(() => {
    const audio = mediaRef.current;
    if (!audio) return;

    const setupVisualizer = () => {
      try {
        if (!audioCtxRef.current) {
          audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
        }
        const ctx = audioCtxRef.current;

        if (!sourceRef.current) {
          sourceRef.current = ctx.createMediaElementSource(audio);
        }

        const analyser = ctx.createAnalyser();
        analyser.fftSize = 128;
        analyserRef.current = analyser;

        sourceRef.current.connect(analyser);
        analyser.connect(ctx.destination);
        setIsVisualizerReady(true);
      } catch (e) {
        // Visualizer setup failed, non-critical
      }
    };

    setupVisualizer();

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [track.url]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const analyser = analyserRef.current;
    if (!canvas || !analyser || !isVisualizerReady) return;

    const ctx = canvas.getContext('2d');
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      animFrameRef.current = requestAnimationFrame(draw);
      analyser.getByteFrequencyData(dataArray);

      const { width, height } = canvas;
      ctx.clearRect(0, 0, width, height);

      const barCount = 48;
      const gap = 3;
      const barWidth = (width - (barCount - 1) * gap) / barCount;
      const step = Math.floor(bufferLength / barCount);

      for (let i = 0; i < barCount; i++) {
        const value = dataArray[i * step] / 255;
        const barHeight = Math.max(2, value * height * 0.8);

        const gradient = ctx.createLinearGradient(0, height, 0, height - barHeight);
        gradient.addColorStop(0, 'rgba(99, 102, 241, 0.3)');
        gradient.addColorStop(1, 'rgba(168, 85, 247, 0.8)');

        const x = i * (barWidth + gap);
        const y = height - barHeight;

        ctx.beginPath();
        ctx.roundRect(x, y, barWidth, barHeight, 2);
        ctx.fillStyle = gradient;
        ctx.fill();
      }
    };

    draw();
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isVisualizerReady]);

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center gap-8">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative"
      >
        <motion.div
          className="w-40 h-40 rounded-3xl bg-gradient-to-br from-accent/20 via-purple-600/15 to-pink-500/10 flex items-center justify-center"
          animate={state.isPlaying ? { rotate: 360 } : {}}
          transition={state.isPlaying ? { duration: 8, repeat: Infinity, ease: 'linear' } : {}}
        >
          <Music className="w-16 h-16 text-accent-light/60" strokeWidth={1} />
        </motion.div>

        {state.isPlaying && (
          <motion.div
            className="absolute inset-0 rounded-3xl"
            animate={{ boxShadow: ['0 0 30px rgba(99,102,241,0.2)', '0 0 60px rgba(99,102,241,0.1)', '0 0 30px rgba(99,102,241,0.2)'] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}
      </motion.div>

      <div className="text-center">
        <p className="text-sm font-medium text-white/80 truncate max-w-xs">
          {track.name}
        </p>
      </div>

      <canvas
        ref={canvasRef}
        width={500}
        height={120}
        className="w-[500px] max-w-full h-[120px] opacity-80"
      />

      <audio
        ref={mediaRef}
        key={track.url}
        src={track.url}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
        crossOrigin="anonymous"
      />
    </div>
  );
}
