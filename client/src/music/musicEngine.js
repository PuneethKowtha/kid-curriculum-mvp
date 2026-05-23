import * as Tone from 'tone';
import { getGenrePattern } from './patterns.js';

let activePattern = null;
let isPlaying = false;
const BPM = { rap: 90, pop: 110, 'epic story': 70, lullaby: 65, dance: 128, chant: 100 };

export async function startMusic(genre = 'pop') {
  if (isPlaying) return;
  await Tone.start();

  const bpm = BPM[genre] || 100;
  Tone.Transport.bpm.value = bpm;
  Tone.Transport.stop();
  Tone.Transport.cancel();

  if (activePattern) {
    activePattern.dispose();
    activePattern = null;
  }

  activePattern = getGenrePattern(genre);
  Tone.Transport.start();
  isPlaying = true;
}

export function stopMusic() {
  if (!isPlaying) return;
  Tone.Transport.stop();
  Tone.Transport.cancel();
  if (activePattern) {
    activePattern.dispose();
    activePattern = null;
  }
  isPlaying = false;
}

export function setVolume(val) {
  Tone.Destination.volume.value = val;
}
