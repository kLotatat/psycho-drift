// WAVES — six modules are the product. Each is an acoustic architecture.
export type Module = {
  id: "focus" | "ground" | "float" | "release" | "nest" | "recall";
  name: string;
  purpose: string;
  sound: string;
  hue: number;          // accent hue in OKLCH degrees
  accentName: string;
  freqLabel: string;    // dominant entrainment band
  line: string;
  body: string;
};

export const MODULES: Module[] = [
  {
    id: "focus",
    name: "Focus",
    purpose: "Deep work. Concentration. Mental clarity.",
    sound: "Rhythmic textures · subtle entrainment · focused stereo field",
    hue: 230, accentName: "Electric Blue", freqLabel: "14.0 Hz · Beta",
    line: "Cognitive enhancement.",
    body: "Attention-supportive sound architectures. A narrow stereo field, gentle rhythmic entrainment, and minimal harmonic motion. Designed for the long quiet of work.",
  },
  {
    id: "ground",
    name: "Ground",
    purpose: "Reduce anxiety. Regulate the nervous system. Return to stability.",
    sound: "Warm resonance · low-frequency support · environmental acoustics",
    hue: 145, accentName: "Moss Green", freqLabel: "4.0 Hz · Theta",
    line: "Nervous system ballast.",
    body: "Low-frequency environmental sound and weighted motion. Earth-resonant acoustic textures designed to downshift threat physiology.",
  },
  {
    id: "float",
    name: "Float",
    purpose: "Mental spaciousness. Recovery. Decompression.",
    sound: "Wide spatial environments · long reverberation · air and atmosphere",
    hue: 190, accentName: "Deep Teal", freqLabel: "6.0 Hz · Theta",
    line: "Emotional decompression.",
    body: "Open atmospheric fields with long reverberation and lightweight visual behavior. Built for mental altitude.",
  },
  {
    id: "release",
    name: "Release",
    purpose: "Emotional unloading. Stress reduction. Tension relief.",
    sound: "Gradual dissolution · expanding sonic textures · gentle movement",
    hue: 285, accentName: "Soft Violet", freqLabel: "4.5 Hz · Theta",
    line: "Sustained exhalations.",
    body: "Slowly dissolving harmonic stacks. Expanding sonic textures that descend with the breath until tension has somewhere to go.",
  },
  {
    id: "nest",
    name: "Nest",
    purpose: "Psychological comfort. Emotional safety. Restoration.",
    sound: "Intimate acoustics · warm textures · close sonic proximity",
    hue: 45, accentName: "Warm Amber", freqLabel: "7.83 Hz · Schumann",
    line: "The feeling of being held.",
    body: "Close-mic'd warmth. Protective sonic architecture tuned to the Schumann resonance. A room with the lights low.",
  },
  {
    id: "recall",
    name: "Recall",
    purpose: "Memory exploration. Reflection. Emotional storytelling.",
    sound: "Resonant memory environments · voice · place · fragment",
    hue: 70, accentName: "Muted Gold", freqLabel: "6.0 Hz · Theta",
    line: "Memory through sound.",
    body: "Voice notes, photographs and fragments become acoustic environments — rooms you can walk back into and listen to who you were.",
  },
];

// Compatibility alias for any older callers — same shape, treated as states.
export const EMOTIONS = MODULES.map((m) => ({
  id: m.id, name: m.name, hue: m.hue, description: m.purpose,
  module: m.name, frequency: m.freqLabel,
}));
export type Emotion = (typeof EMOTIONS)[number];

export const SCIENCE = [
  { id: "psy",  title: "Psychoacoustics",       body: "How the auditory system interprets pressure waves as emotion, location, and meaning." },
  { id: "ent",  title: "Brainwave Entrainment", body: "Binaural and isochronic stimuli softly bias cortical rhythms toward chosen states." },
  { id: "bin",  title: "Binaural Beats",        body: "Two slightly detuned tones perceived as a third, slow pulse — the brain follows the difference." },
  { id: "ves",  title: "Vestibular Processing", body: "Spatial low-frequency information modulates balance, gravity, and felt safety." },
  { id: "mem",  title: "Memory Formation",      body: "Sound binds context. Resonant environments improve consolidation and gentle retrieval." },
  { id: "neu",  title: "Neuroplasticity",       body: "Repeated acoustic environments reshape attention, regulation, and emotional baselines." },
  { id: "att",  title: "Attention Regulation",  body: "Predictable sonic structure frees executive resources for the work in front of you." },
  { id: "pol",  title: "Polyvagal Theory",      body: "Acoustic cues recruit the social engagement system and downshift threat physiology." },
  { id: "ada",  title: "Adaptive Audio",        body: "Environments that listen back — adjusting timbre, density and depth to your patterns." },
];

export const MEMORIES = [
  { id: "m1", title: "Snowfall on the cabin roof",       year: "2019", tag: "Nest",     ms: "3:42" },
  { id: "m2", title: "Mother's kitchen at dusk",         year: "2007", tag: "Nest",     ms: "5:10" },
  { id: "m3", title: "First subway ride alone",          year: "2014", tag: "Float",    ms: "2:55" },
  { id: "m4", title: "The harbor before the storm",      year: "2021", tag: "Ground",   ms: "6:30" },
  { id: "m5", title: "Calling them, the last time",      year: "2022", tag: "Release",  ms: "8:12" },
  { id: "m6", title: "Sunlight through eucalyptus",      year: "2024", tag: "Focus",    ms: "4:04" },
];
