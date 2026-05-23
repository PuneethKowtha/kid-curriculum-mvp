import * as Tone from 'tone';

const SHARED_VOLUME = -12;

function drumKit() {
  const kick = new Tone.MembraneSynth({ pitchDecay: 0.02, octaves: 5 }).toDestination();
  const snare = new Tone.NoiseSynth({ noise: { type: 'white' }, envelope: { attack: 0.001, decay: 0.2, sustain: 0 } }).toDestination();
  const hihat = new Tone.NoiseSynth({ noise: { type: 'white' }, envelope: { attack: 0.001, decay: 0.05, sustain: 0 } }).toDestination();
  const clap = new Tone.NoiseSynth({ noise: { type: 'white' }, envelope: { attack: 0.001, decay: 0.15, sustain: 0 } }).toDestination();
  kick.volume.value = SHARED_VOLUME + 3;
  snare.volume.value = SHARED_VOLUME - 4;
  hihat.volume.value = SHARED_VOLUME - 8;
  clap.volume.value = SHARED_VOLUME - 3;
  return { kick, snare, hihat, clap };
}

function padSynth() {
  const pads = new Tone.PolySynth(Tone.FMSynth, { harmonicity: 1.5, modulationIndex: 2, volume: SHARED_VOLUME - 6 }).toDestination();
  return pads;
}

function leadSynth() {
  const lead = new Tone.Synth({ oscillator: { type: 'triangle' }, envelope: { attack: 0.01, decay: 0.2, sustain: 0.3, release: 0.4 }, volume: SHARED_VOLUME - 4 }).toDestination();
  return lead;
}

function bassSynth() {
  const bass = new Tone.Synth({ oscillator: { type: 'sine' }, envelope: { attack: 0.05, decay: 0.3, sustain: 0.4, release: 0.5 }, volume: SHARED_VOLUME - 2 }).toDestination();
  return bass;
}

// === RAP ===
export function createRapPattern() {
  const d = drumKit();
  const bass = bassSynth();
  const events = [];

  events.push(Tone.Transport.scheduleRepeat(time => {
    d.kick.triggerAttackRelease('C2', '8n', time);
  }, '2n', '0m'));

  events.push(Tone.Transport.scheduleRepeat(time => {
    d.hihat.triggerAttackRelease('16n', time);
  }, '8n', '0m'));

  events.push(Tone.Transport.scheduleRepeat(time => {
    d.snare.triggerAttackRelease('16n', time);
  }, '2n', '2n'));

  events.push(Tone.Transport.scheduleRepeat(time => {
    bass.triggerAttackRelease('D1', '2n', time);
  }, '1m', '0m'));

  return {
    start: () => {},
    stop: () => { events.forEach(id => Tone.Transport.clear(id)); },
    dispose: () => { events.forEach(id => Tone.Transport.clear(id)); d.kick.dispose(); d.snare.dispose(); d.hihat.dispose(); d.clap.dispose(); bass.dispose(); }
  };
}

// === POP ===
export function createPopPattern() {
  const d = drumKit();
  const pads = padSynth();
  const lead = leadSynth();
  const bass = bassSynth();
  const events = [];

  const chords = ['C3', 'E3', 'G3', 'A3', 'C3', 'E3', 'G3', 'A3', 'F3', 'A3', 'C4', 'F3', 'G3', 'B3', 'D4'];

  events.push(Tone.Transport.scheduleRepeat(time => {
    d.kick.triggerAttackRelease('C2', '4n', time);
  }, '2n', '0m'));

  events.push(Tone.Transport.scheduleRepeat(time => {
    d.hihat.triggerAttackRelease('16n', time);
  }, '8n', '0m'));

  events.push(Tone.Transport.scheduleRepeat(time => {
    d.clap.triggerAttackRelease('16n', time);
  }, '2n', '2n'));

  events.push(Tone.Transport.scheduleRepeat(time => {
    const c = chords[Math.floor(Math.random() * chords.length)];
    const c2 = chords[Math.floor(Math.random() * chords.length)];
    pads.triggerAttackRelease([c, c2], '1n', time);
  }, '1m', '0m'));

  events.push(Tone.Transport.scheduleRepeat(time => {
    bass.triggerAttackRelease('E1', '2n', time);
  }, '2n', '0m'));

  return {
    start: () => {},
    stop: () => { events.forEach(id => Tone.Transport.clear(id)); },
    dispose: () => { events.forEach(id => Tone.Transport.clear(id)); Object.values(d).forEach(i => i.dispose()); pads.dispose(); lead.dispose(); bass.dispose(); }
  };
}

// === EPIC STORY ===
export function createEpicPattern() {
  const pads = padSynth();
  const bass = bassSynth();
  const reverb = new Tone.Reverb({ decay: 4, wet: 0.6 }).toDestination();
  const events = [];

  const strings = new Tone.PolySynth(Tone.Synth, { oscillator: { type: 'sawtooth' }, envelope: { attack: 0.8, decay: 0.5, sustain: 0.6, release: 1.5 }, volume: SHARED_VOLUME - 8 }).connect(reverb);

  events.push(Tone.Transport.scheduleRepeat(time => {
    strings.triggerAttackRelease(['C3', 'E3', 'G3', 'A3'], '2n', time);
  }, '2n', '0m'));

  events.push(Tone.Transport.scheduleRepeat(time => {
    bass.triggerAttackRelease('C1', '1n', time);
  }, '1m', '0m'));

  events.push(Tone.Transport.scheduleRepeat(time => {
    pads.triggerAttackRelease('G2', '4n', time);
  }, '1m', '2n'));

  return {
    start: () => {},
    stop: () => { events.forEach(id => Tone.Transport.clear(id)); },
    dispose: () => { events.forEach(id => Tone.Transport.clear(id)); strings.dispose(); pads.dispose(); bass.dispose(); reverb.dispose(); }
  };
}

// === LULLABY ===
export function createLullabyPattern() {
  const piano = new Tone.Synth({ oscillator: { type: 'triangle' }, envelope: { attack: 0.05, decay: 0.5, sustain: 0.3, release: 1 }, volume: SHARED_VOLUME - 4 }).toDestination();
  const bass = bassSynth();
  const events = [];

  const melody = ['C4', 'D4', 'E4', 'C4', 'E4', 'F4', 'G4', 'C4'];
  const bassNotes = ['C2', 'G1', 'A1', 'F1'];

  events.push(Tone.Transport.scheduleRepeat((time) => {
    melody.forEach((note, i) => {
      piano.triggerAttackRelease(note, '4n', time + i * 0.5);
    });
  }, '2m', '0m'));

  events.push(Tone.Transport.scheduleRepeat(time => {
    bass.triggerAttackRelease(bassNotes[Math.floor(Math.random() * bassNotes.length)], '2n', time);
  }, '2n', '0m'));

  return {
    start: () => {},
    stop: () => { events.forEach(id => Tone.Transport.clear(id)); },
    dispose: () => { events.forEach(id => Tone.Transport.clear(id)); piano.dispose(); bass.dispose(); }
  };
}

// === DANCE ===
export function createDancePattern() {
  const d = drumKit();
  const synth = new Tone.Synth({ oscillator: { type: 'square' }, envelope: { attack: 0.01, decay: 0.1, sustain: 0.1, release: 0.1 }, volume: SHARED_VOLUME - 3 }).toDestination();
  const bass = bassSynth();
  const events = [];

  events.push(Tone.Transport.scheduleRepeat(time => {
    d.kick.triggerAttackRelease('C2', '8n', time);
  }, '4n', '0m'));

  events.push(Tone.Transport.scheduleRepeat(time => {
    d.hihat.triggerAttackRelease('16n', time);
  }, '8n', '0m'));

  events.push(Tone.Transport.scheduleRepeat(time => {
    d.clap.triggerAttackRelease('16n', time);
  }, '4n', '2n'));

  events.push(Tone.Transport.scheduleRepeat(time => {
    synth.triggerAttackRelease('E4', '8n', time);
  }, '2n', '0m'));

  events.push(Tone.Transport.scheduleRepeat(time => {
    bass.triggerAttackRelease('E1', '2n', time);
  }, '2n', '0m'));

  return {
    start: () => {},
    stop: () => { events.forEach(id => Tone.Transport.clear(id)); },
    dispose: () => { events.forEach(id => Tone.Transport.clear(id)); Object.values(d).forEach(i => i.dispose()); synth.dispose(); bass.dispose(); }
  };
}

// === CHANT ===
export function createChantPattern() {
  const drum = new Tone.MembraneSynth({ pitchDecay: 0.05, octaves: 3 }).toDestination();
  const drone = new Tone.Oscillator({ type: 'sine', frequency: 65.41, volume: SHARED_VOLUME - 8 }).toDestination();
  const tap = new Tone.NoiseSynth({ noise: { type: 'brown' }, envelope: { attack: 0.001, decay: 0.03, sustain: 0 } }).toDestination();
  const events = [];

  events.push(Tone.Transport.scheduleRepeat(time => {
    drum.triggerAttackRelease('C1', '4n', time);
  }, '2n', '0m'));

  events.push(Tone.Transport.scheduleRepeat(time => {
    tap.triggerAttackRelease('32n', time);
  }, '4n', '4n'));

  drone.start();

  return {
    start: () => {},
    stop: () => { events.forEach(id => Tone.Transport.clear(id)); drone.stop(); },
    dispose: () => { events.forEach(id => Tone.Transport.clear(id)); drum.dispose(); drone.dispose(); tap.dispose(); }
  };
}

const GENRE_FACTORIES = {
  rap: createRapPattern,
  pop: createPopPattern,
  'epic story': createEpicPattern,
  lullaby: createLullabyPattern,
  dance: createDancePattern,
  chant: createChantPattern
};

export function getGenrePattern(genre) {
  const fn = GENRE_FACTORIES[genre];
  if (!fn) return GENRE_FACTORIES.pop();
  return fn();
}
