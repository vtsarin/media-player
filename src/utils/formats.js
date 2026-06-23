const VIDEO_EXTENSIONS = ['mp4', 'webm', 'ogg', 'ogv', 'mkv', 'avi', 'wmv', 'flv', 'mov', 'rmvb', 'rm', 'asf', 'm4v', '3gp'];
const AUDIO_EXTENSIONS = ['mp3', 'ogg', 'oga', 'wav', 'flac', 'aac', 'm4a', 'wma', 'opus', 'webm', 'amr'];
const SUBTITLE_EXTENSIONS = ['srt', 'vtt', 'ass', 'ssa'];

export function getFileExtension(filename) {
  return filename.split('.').pop().toLowerCase();
}

export function getMediaType(file) {
  const ext = getFileExtension(file.name);
  if (VIDEO_EXTENSIONS.includes(ext)) return 'video';
  if (AUDIO_EXTENSIONS.includes(ext)) return 'audio';
  if (SUBTITLE_EXTENSIONS.includes(ext)) return 'subtitle';
  if (file.type.startsWith('video/')) return 'video';
  if (file.type.startsWith('audio/')) return 'audio';
  return 'unknown';
}

export function isNativelySupported(file) {
  const ext = getFileExtension(file.name);

  const nativeVideo = ['mp4', 'webm', 'ogg', 'ogv', 'mkv', 'mov', 'm4v'];
  const nativeAudio = ['mp3', 'wav', 'flac', 'aac', 'm4a', 'ogg', 'oga', 'opus', 'webm'];

  if (nativeVideo.includes(ext) || nativeAudio.includes(ext)) return true;

  return false;
}

export function needsTranscoding(file) {
  const ext = getFileExtension(file.name);
  return ['avi', 'wmv', 'flv', 'rmvb', 'rm', 'asf', 'wma', 'amr', '3gp'].includes(ext);
}

export function getAcceptString() {
  const allExts = [...VIDEO_EXTENSIONS, ...AUDIO_EXTENSIONS, ...SUBTITLE_EXTENSIONS];
  return allExts.map(ext => `.${ext}`).join(',');
}

export function getMediaAcceptString() {
  const allExts = [...VIDEO_EXTENSIONS, ...AUDIO_EXTENSIONS];
  return allExts.map(ext => `.${ext}`).join(',');
}

export function formatFileSize(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}
