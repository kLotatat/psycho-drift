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
    name: "Focus", humanName: "Help Me Focus", shortLabel: "Focus",
    purpose: "A quiet sound space for deep work and concentration.",
    sound: "Steady textures · soft pulse · narrow stereo",
    hue: 230, accentName: "Electric Blue", freqLabel: "14 Hz · Beta",
    line: "For when you need to get into the work.",
    body: "A calm, steady soundscape that helps your attention settle. Put it on, start your task, and let the room hold the focus for you.",
  },
  {
    id: "ground",
    name: "Ground", humanName: "Feel Grounded", shortLabel: "Grounded",
    purpose: "Slow, warm low frequencies to settle the body.",
    sound: "Warm low end · earth resonance · slow motion",
    hue: 145, accentName: "Moss Green", freqLabel: "4 Hz · Theta",
    line: "For when everything feels too much.",
    body: "Warm, low, weighted sound. It softens a racing nervous system and brings you back into your body without asking anything of you.",
  },
  {
    id: "float",
    name: "Float", humanName: "Clear My Head", shortLabel: "Clear",
    purpose: "Wide, open space to let your thoughts settle.",
    sound: "Open air · long reverb · weightless",
    hue: 190, accentName: "Deep Teal", freqLabel: "6 Hz · Theta",
    line: "For when your head feels crowded.",
    body: "An open, airy sound space. Like stepping outside after being indoors all day. Room for your thoughts to spread out and quiet down.",
  },
  {
    id: "release",
    name: "Release", humanName: "Let Go", shortLabel: "Release",
    purpose: "Slow dissolves that help tension move and exit.",
    sound: "Long exhalations · dissolving harmonics",
    hue: 285, accentName: "Soft Violet", freqLabel: "4.5 Hz · Theta",
    line: "For when you're holding something you don't need to.",
    body: "Sound that slowly opens and dissolves. Tension finds somewhere to go. Useful at the end of a hard day or before sleep.",
  },
  {
    id: "nest",
    name: "Nest", humanName: "Feel Safe", shortLabel: "Safe",
    purpose: "Close, warm, protective sound — like a room with the lights low.",
    sound: "Intimate warmth · close acoustics · Schumann tone",
    hue: 45, accentName: "Warm Amber", freqLabel: "7.83 Hz · Schumann",
    line: "For when you need to be held.",
    body: "A small, warm room made of sound. Close, soft, and protective. Tuned to the Earth's natural resonance. For comfort, not performance.",
  },
  {
    id: "recall",
    name: "Recall", humanName: "Remember", shortLabel: "Remember",
    purpose: "Walk back into your own memories through sound.",
    sound: "Voice · place · fragment · resonance",
    hue: 70, accentName: "Muted Gold", freqLabel: "6 Hz · Theta",
    line: "For when you want to revisit something.",
    body: "A space built from your own recordings, photos, and notes. Step into a memory and listen to who you were.",
  },
];

export const EMOTIONS = MODULES.map((m) => ({
  id: m.id, name: m.humanName, shortLabel: m.shortLabel, hue: m.hue,
  description: m.purpose, module: m.name, frequency: m.freqLabel,
}));
export type Emotion = (typeof EMOTIONS)[number];

// User-facing categories for personal sound layers.
export const SOUND_CATEGORIES = [
  { id: "ground",  label: "Grounded" },
  { id: "focus",   label: "Focus" },
  { id: "recall",  label: "Remember" },
  { id: "nest",    label: "Safe" },
  { id: "release", label: "Release" },
  { id: "float",   label: "Calm" },
] as const;
export type CategoryId = typeof SOUND_CATEGORIES[number]["id"];

export const SCIENCE = [
  { id: "psy",  title: "Psychoacoustics",      body: "How the ear and brain turn pressure waves into emotion, location, and meaning." },
  { id: "bin",  title: "Binaural Beats",       body: "Two slightly different tones, one in each ear. Your brain hears a slow pulse and follows it." },
  { id: "mem",  title: "Memory",               body: "Sound binds context. The right environment helps memories form — and helps you walk back into them." },
  { id: "att",  title: "Attention",            body: "A predictable sound space frees the part of your brain that would otherwise be on guard." },
  { id: "ner",  title: "Nervous System",       body: "Low, warm sound tells your body it's safe. Faster, brighter sound brings you back online." },
  { id: "ada",  title: "Adaptive Audio",       body: "WAVES listens back. It learns the rooms that work for you and quietly tunes itself." },
];

export const MEMORIES = [
  { id: "m1", title: "Snowfall on the cabin roof", year: "2019", tag: "Safe",     ms: "3:42" },
  { id: "m2", title: "Mother's kitchen at dusk",   year: "2007", tag: "Safe",     ms: "5:10" },
  { id: "m3", title: "First subway ride alone",    year: "2014", tag: "Calm",     ms: "2:55" },
  { id: "m4", title: "Harbor before the storm",    year: "2021", tag: "Grounded", ms: "6:30" },
  { id: "m5", title: "Calling them, the last time",year: "2022", tag: "Release",  ms: "8:12" },
  { id: "m6", title: "Sunlight through eucalyptus",year: "2024", tag: "Focus",    ms: "4:04" },
];
