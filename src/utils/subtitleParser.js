export function parseSRT(content) {
  const blocks = content.trim().split(/\n\s*\n/);
  const cues = [];

  for (const block of blocks) {
    const lines = block.trim().split('\n');
    if (lines.length < 3) continue;

    const timeLine = lines[1];
    const timeMatch = timeLine.match(
      /(\d{2}):(\d{2}):(\d{2})[,.](\d{3})\s*-->\s*(\d{2}):(\d{2}):(\d{2})[,.](\d{3})/
    );
    if (!timeMatch) continue;

    const startTime =
      parseInt(timeMatch[1]) * 3600 +
      parseInt(timeMatch[2]) * 60 +
      parseInt(timeMatch[3]) +
      parseInt(timeMatch[4]) / 1000;

    const endTime =
      parseInt(timeMatch[5]) * 3600 +
      parseInt(timeMatch[6]) * 60 +
      parseInt(timeMatch[7]) +
      parseInt(timeMatch[8]) / 1000;

    const text = lines.slice(2).join('\n').replace(/<[^>]*>/g, '');
    cues.push({ startTime, endTime, text });
  }

  return cues;
}

export function parseASS(content) {
  const cues = [];
  const lines = content.split('\n');
  let inEvents = false;
  let formatOrder = [];

  for (const line of lines) {
    if (line.trim() === '[Events]') {
      inEvents = true;
      continue;
    }
    if (line.startsWith('[') && line.endsWith(']')) {
      inEvents = false;
      continue;
    }

    if (inEvents && line.startsWith('Format:')) {
      formatOrder = line.replace('Format:', '').split(',').map(s => s.trim());
      continue;
    }

    if (inEvents && line.startsWith('Dialogue:')) {
      const values = line.replace('Dialogue:', '').split(',');
      const startIdx = formatOrder.indexOf('Start');
      const endIdx = formatOrder.indexOf('End');
      const textIdx = formatOrder.indexOf('Text');

      if (startIdx === -1 || endIdx === -1 || textIdx === -1) continue;

      const startTime = parseASSTime(values[startIdx]?.trim());
      const endTime = parseASSTime(values[endIdx]?.trim());
      const text = values
        .slice(textIdx)
        .join(',')
        .trim()
        .replace(/\{[^}]*\}/g, '')
        .replace(/\\N/g, '\n')
        .replace(/\\n/g, '\n');

      cues.push({ startTime, endTime, text });
    }
  }

  return cues;
}

function parseASSTime(timeStr) {
  if (!timeStr) return 0;
  const match = timeStr.match(/(\d+):(\d{2}):(\d{2})[.](\d{2})/);
  if (!match) return 0;
  return (
    parseInt(match[1]) * 3600 +
    parseInt(match[2]) * 60 +
    parseInt(match[3]) +
    parseInt(match[4]) / 100
  );
}

export function convertToVTTBlob(cues) {
  let vtt = 'WEBVTT\n\n';
  cues.forEach((cue, i) => {
    vtt += `${i + 1}\n`;
    vtt += `${formatVTTTime(cue.startTime)} --> ${formatVTTTime(cue.endTime)}\n`;
    vtt += `${cue.text}\n\n`;
  });
  return new Blob([vtt], { type: 'text/vtt' });
}

function formatVTTTime(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  const ms = Math.floor((seconds % 1) * 1000);
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}.${ms.toString().padStart(3, '0')}`;
}

export function parseSubtitleFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target.result;
      const ext = file.name.split('.').pop().toLowerCase();

      let cues;
      if (ext === 'srt') {
        cues = parseSRT(content);
      } else if (ext === 'ass' || ext === 'ssa') {
        cues = parseASS(content);
      } else if (ext === 'vtt') {
        resolve({ type: 'vtt', blob: new Blob([content], { type: 'text/vtt' }), cues: [] });
        return;
      } else {
        reject(new Error('Unsupported subtitle format'));
        return;
      }

      const blob = convertToVTTBlob(cues);
      resolve({ type: 'converted', blob, cues });
    };
    reader.onerror = reject;
    reader.readAsText(file);
  });
}
