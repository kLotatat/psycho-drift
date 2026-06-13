export type Emotion = {
  id: string;
  name: string;
  hue: number;        // for accent
  description: string;
  module: string;
  frequency: string;  // psychoacoustic descriptor
};

export const EMOTIONS: Emotion[] = [
  { id: "calm",       name: "Calm",       hue: 215, description: "Parasympathetic settle. Slow tidal rhythms.",       module: "Breathe",  frequency: "7.83 Hz · Schumann" },
  { id: "focus",      name: "Focus",      hue: 195, description: "Attention scaffolding through gentle entrainment.", module: "Focus",    frequency: "14 Hz · Beta low" },
  { id: "release",    name: "Release",    hue: 280, description: "Emotional decompression. Sustained exhalations.",   module: "Float",    frequency: "4 Hz · Theta" },
  { id: "grounding",  name: "Grounding",  hue: 40,  description: "Low-frequency ballast. Weighted spatial acoustics.", module: "Ground",   frequency: "40 Hz · Gamma" },
  { id: "clarity",    name: "Clarity",    hue: 175, description: "Crystalline harmonic stacks. Mental visibility.",    module: "Focus",    frequency: "10 Hz · Alpha" },
  { id: "awe",        name: "Awe",        hue: 250, description: "Expansive cathedral fields. Vastness response.",     module: "Float",    frequency: "Sub 32 Hz" },
  { id: "joy",        name: "Joy",        hue: 55,  description: "Warm overtone shimmer. Major-mode resonance.",       module: "Nest",     frequency: "528 Hz · Solfeggio" },
  { id: "renewal",    name: "Renewal",    hue: 145, description: "Forest-floor reverberance. Restorative pacing.",     module: "Recall",   frequency: "6 Hz · Theta" },
];

export const MODULES = [
  { id: "breathe", name: "Breathe", line: "Respiratory entrainment.", body: "Slow rhythmic environments synchronize with inhale and exhale. Visuals breathe with you." },
  { id: "ground",  name: "Ground",  line: "Nervous system ballast.",  body: "Low-frequency environmental sound. Weighted motion. Earth-resonant acoustic textures." },
  { id: "float",   name: "Float",   line: "Emotional decompression.", body: "Open atmospheric fields. Lightweight visual behavior. Designed for mental spaciousness." },
  { id: "focus",   name: "Focus",   line: "Cognitive enhancement.",   body: "Attention-supportive sound structures. Subtle rhythmic entrainment. Minimal distractions." },
  { id: "nest",    name: "Nest",    line: "Psychological safety.",    body: "Comforting sonic architecture. Warm spatial acoustics. The feeling of being held." },
  { id: "recall",  name: "Recall",  line: "Memory through sound.",    body: "Memories become acoustic environments. Photographs, voice notes, and fragments rendered as resonance." },
] as const;

export const SCIENCE = [
  { id: "psy",  title: "Psychoacoustics",     body: "How the auditory system interprets pressure waves as emotion, location, and meaning." },
  { id: "neu",  title: "Neuroplasticity",     body: "Repeated acoustic environments reshape attention, regulation, and emotional baselines." },
  { id: "mem",  title: "Memory Formation",    body: "Sound binds context. Resonant environments improve consolidation and gentle retrieval." },
  { id: "ent",  title: "Brainwave Entrainment", body: "Binaural and isochronic stimuli softly bias cortical rhythms toward chosen states." },
  { id: "ves",  title: "Vestibular Processing", body: "Spatial low-frequency information modulates balance, gravity, and felt safety." },
  { id: "pol",  title: "Polyvagal Theory",    body: "Acoustic cues recruit the social engagement system and downshift threat physiology." },
];

export const MEMORIES = [
  { id: "m1", title: "Snowfall on the cabin roof",       year: "2019", tag: "Renewal",   ms: "3:42" },
  { id: "m2", title: "Mother's kitchen at dusk",         year: "2007", tag: "Nest",      ms: "5:10" },
  { id: "m3", title: "First subway ride alone",          year: "2014", tag: "Awe",       ms: "2:55" },
  { id: "m4", title: "The harbor before the storm",      year: "2021", tag: "Grounding", ms: "6:30" },
  { id: "m5", title: "Calling them, the last time",      year: "2022", tag: "Release",   ms: "8:12" },
  { id: "m6", title: "Sunlight through eucalyptus",      year: "2024", tag: "Calm",      ms: "4:04" },
];
