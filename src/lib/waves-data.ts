// WAVES — six sound spaces are the product. Each is a felt acoustic room.
export type Module = {
  id: "focus" | "ground" | "float" | "release" | "nest" | "recall";
  name: string;          // internal canonical
  humanName: string;     // user-facing
  shortLabel: string;    // very short
  purpose: string;
  sound: string;
  hue: number;
  accentName: string;
  freqLabel: string;
  line: string;
  body: string;
};

export const MODULES: Module[] = [
  {
    id: "focus",
    name: "FOCUS", humanName: "FOCUS", shortLabel: "FOCUS",
    purpose: "A quiet acoustic room for sustained attention.",
    sound: "Steady textures · soft pulse · narrow stereo",
    hue: 230, accentName: "Electric Blue", freqLabel: "14 Hz · Beta",
    line: "Narrow the field. Hold the thread.",
    body: "A steady, lucid room. Attention settles without effort. The work becomes the only thing in the room.",
  },
  {
    id: "ground",
    name: "GROUND", humanName: "GROUND", shortLabel: "GROUND",
    purpose: "Slow, warm low frequencies to settle the body.",
    sound: "Warm low end · earth resonance · slow motion",
    hue: 145, accentName: "Moss Green", freqLabel: "4 Hz · Theta",
    line: "Weight. Earth. A long exhale.",
    body: "Low, warm, weighted. The nervous system softens. The body remembers gravity.",
  },
  {
    id: "float",
    name: "FLOAT", humanName: "FLOAT", shortLabel: "FLOAT",
    purpose: "Wide, open space for thought to spread out.",
    sound: "Open air · long reverb · weightless",
    hue: 190, accentName: "Deep Teal", freqLabel: "6 Hz · Theta",
    line: "Open the ceiling. Let it breathe.",
    body: "Wide air and long decay. The mind uncrowds itself. Edges loosen.",
  },
  {
    id: "release",
    name: "RELEASE", humanName: "RELEASE", shortLabel: "RELEASE",
    purpose: "Slow dissolves that let tension move and exit.",
    sound: "Long exhalations · dissolving harmonics",
    hue: 285, accentName: "Soft Violet", freqLabel: "4.5 Hz · Theta",
    line: "Soften what you've been holding.",
    body: "Sound opens, dissolves, and leaves. What was held finds somewhere to go.",
  },
  {
    id: "nest",
    name: "NEST", humanName: "NEST", shortLabel: "NEST",
    purpose: "Close, warm, protective sound. A room tuned to the Earth.",
    sound: "Intimate warmth · close acoustics · Schumann tone",
    hue: 45, accentName: "Warm Amber", freqLabel: "7.83 Hz · Schumann",
    line: "A small room with the lights low.",
    body: "Close, warm, and held. Tuned to the Earth's resonance. For comfort, not performance.",
  },
  {
    id: "recall",
    name: "RECALL", humanName: "RECALL", shortLabel: "RECALL",
    purpose: "Step back into your own memories through sound.",
    sound: "Voice · place · fragment · resonance",
    hue: 70, accentName: "Muted Gold", freqLabel: "6 Hz · Theta",
    line: "Return to a place that is yours.",
    body: "An archive of your own recordings, photographs, and notes. Walk back in and listen.",
  },
];

export const EMOTIONS = MODULES.map((m) => ({
  id: m.id, name: m.name, shortLabel: m.shortLabel, hue: m.hue,
  description: m.purpose, module: m.name, frequency: m.freqLabel,
}));
export type Emotion = (typeof EMOTIONS)[number];

// Personal-layer categories mirror the six sound spaces.
export const SOUND_CATEGORIES = [
  { id: "focus",   label: "FOCUS" },
  { id: "ground",  label: "GROUND" },
  { id: "float",   label: "FLOAT" },
  { id: "release", label: "RELEASE" },
  { id: "nest",    label: "NEST" },
  { id: "recall",  label: "RECALL" },
] as const;
export type CategoryId = typeof SOUND_CATEGORIES[number]["id"];

export const SCIENCE = [
  { id: "psy",  title: "Psychoacoustics",            body: "How the ear and brain translate pressure into emotion, location, and meaning." },
  { id: "bin",  title: "Binaural Beats",             body: "Two slightly different tones, one per ear. The brain perceives a slow pulse and quietly entrains to it." },
  { id: "mem",  title: "Memory",                     body: "Sound binds context. The right environment helps memories form — and helps you walk back into them." },
  { id: "att",  title: "Attention",                  body: "A predictable acoustic room frees the part of the brain that would otherwise stand guard." },
  { id: "neu",  title: "Neuroplasticity",            body: "Repeated states leave a trace. Returning to the same room teaches the body how to find it." },
  { id: "ner",  title: "Nervous System Regulation",  body: "Low, warm sound signals safety. Brighter, faster sound brings you back online. The body listens first." },
  { id: "ada",  title: "Adaptive Audio",             body: "WAVES listens back. It learns the rooms that work for you, and quietly tunes itself toward them." },
];

export const MEMORIES = [
  { id: "m1", title: "Snowfall on the cabin roof",  year: "2019", tag: "NEST",    ms: "3:42" },
  { id: "m2", title: "Mother's kitchen at dusk",    year: "2007", tag: "NEST",    ms: "5:10" },
  { id: "m3", title: "First subway ride alone",     year: "2014", tag: "FLOAT",   ms: "2:55" },
  { id: "m4", title: "Harbor before the storm",     year: "2021", tag: "GROUND",  ms: "6:30" },
  { id: "m5", title: "Calling them, the last time", year: "2022", tag: "RELEASE", ms: "8:12" },
  { id: "m6", title: "Sunlight through eucalyptus", year: "2024", tag: "FOCUS",   ms: "4:04" },
];
