/**
 * WAVES Audio Engine — procedural psychoacoustic synthesis.
 *
 * Production refinement pass:
 *   - Per-module "chain" objects with seamless crossfade between modules
 *   - Master soft-limiter (DynamicsCompressor) for safe-listening ceiling
 *   - Sub-bass body oscillator (carrier / 2) for vestibular weight
 *   - Haas-delay stereo widening on the harmonic pad
 *   - Slow vibrato + drift on pad voices ("living" detune)
 *   - High-shelf shimmer noise bed for air
 *   - Personal layers routed through the active chain's reverb bus
 *
 * Public API preserved: start, stop, setIntensity, setDepth, setBinaural,
 * addLayer, setLayerGain, removeLayer, hasLayer, subscribe, getters.
 */

import type { Module } from "./waves-data";

type ModuleId = Module["id"];

interface Preset {
  carrier: number;       // Hz — base tone
  binaural: number;      // Hz — interaural delta (target brainwave)
  filter: number;        // Hz — lowpass cutoff
  q: number;
  noise: number;         // 0..1
  harmonics: number[];   // multipliers over carrier
  reverb: number;        // 0..1 wet
  pulseRate?: number;    // Hz — isochronic amplitude pulse
  sub?: number;          // 0..1 sub-bass body gain
  shimmer?: number;      // 0..1 high-shelf air gain
}

const PRESETS: Record<ModuleId, Preset> = {
  focus:   { carrier: 220, binaural: 14.0, filter: 2200, q: 0.7, noise: 0.05, harmonics: [1.5, 2, 3],     reverb: 0.22, pulseRate: 14, sub: 0.05, shimmer: 0.12 },
  ground:  { carrier: 65,  binaural: 4.0,  filter: 420,  q: 0.6, noise: 0.10, harmonics: [2, 3],          reverb: 0.55,                sub: 0.35, shimmer: 0.04 },
  float:   { carrier: 174, binaural: 6.0,  filter: 1400, q: 0.5, noise: 0.10, harmonics: [1.5, 2, 3, 4],  reverb: 0.85,                sub: 0.10, shimmer: 0.18 },
  release: { carrier: 136, binaural: 4.5,  filter: 900,  q: 0.8, noise: 0.06, harmonics: [2, 2.5, 3],     reverb: 0.70,                sub: 0.18, shimmer: 0.10 },
  nest:    { carrier: 110, binaural: 7.83, filter: 700,  q: 0.7, noise: 0.05, harmonics: [2, 3, 4],       reverb: 0.45,                sub: 0.22, shimmer: 0.06 },
  recall:  { carrier: 192, binaural: 6.0,  filter: 1100, q: 0.9, noise: 0.06, harmonics: [1.5, 2, 2.5],   reverb: 0.60,                sub: 0.14, shimmer: 0.10 },
};

interface Chain {
  module: ModuleId;
  master: GainNode;
  wet: GainNode;
  convolver: ConvolverNode;
  reverbInput: GainNode;
  nodes: AudioNode[];
}

class WavesEngine {
  private ctx: AudioContext | null = null;
  private limiter: DynamicsCompressorNode | null = null;
  private analyser: AnalyserNode | null = null;
  private chain: Chain | null = null;
  private intensity = 0.5;
  private depth = 0.6;
  private binauralOn = true;
  private listeners = new Set<() => void>();

  get isRunning() { return this.ctx?.state === "running" && !!this.chain; }
  get module() { return this.chain?.module ?? null; }
  get level() { return this.intensity; }
  get spatial() { return this.depth; }
  get binaural() { return this.binauralOn; }
  get analyserNode() { return this.analyser; }

  subscribe(fn: () => void) { this.listeners.add(fn); return () => this.listeners.delete(fn); }
  private emit() { this.listeners.forEach((f) => f()); }

  private ensureCtx() {
    if (!this.ctx) {
      const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new Ctx();
      // Master safe-listening chain: limiter -> analyser -> destination
      const limiter = this.ctx.createDynamicsCompressor();
      limiter.threshold.value = -8;
      limiter.knee.value = 6;
      limiter.ratio.value = 12;
      limiter.attack.value = 0.003;
      limiter.release.value = 0.18;
      const analyser = this.ctx.createAnalyser();
      analyser.fftSize = 1024;
      analyser.smoothingTimeConstant = 0.85;
// Master output: limiter -> analyser -> speakers
limiter.connect(analyser).connect(this.ctx.destination);
      this.limiter = limiter;
      this.analyser = analyser;
    }
    return this.ctx;
  }

  private buildReverbIR(seconds = 3.6, decay = 2.6): AudioBuffer {
    const ctx = this.ensureCtx();
    const rate = ctx.sampleRate;
    const len = Math.floor(seconds * rate);
    const buf = ctx.createBuffer(2, len, rate);
    for (let ch = 0; ch < 2; ch++) {
      const data = buf.getChannelData(ch);
      for (let i = 0; i < len; i++) {
        // gentle early-reflection shaping
        const env = Math.pow(1 - i / len, decay);
        data[i] = (Math.random() * 2 - 1) * env;
      }
    }
    return buf;
  }

  private buildNoiseBuffer(seconds = 6): AudioBuffer {
    const ctx = this.ensureCtx();
    const rate = ctx.sampleRate;
    const len = seconds * rate;
    const buf = ctx.createBuffer(1, len, rate);
    const data = buf.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0;
    for (let i = 0; i < len; i++) {
      const w = Math.random() * 2 - 1;
      b0 = 0.99765 * b0 + w * 0.099046;
      b1 = 0.96300 * b1 + w * 0.2965164;
      b2 = 0.57000 * b2 + w * 1.0526913;
      data[i] = (b0 + b1 + b2 + w * 0.1848) * 0.18;
    }
    return buf;
  }

  async start(module: ModuleId) {
    const ctx = this.ensureCtx();
    if (ctx.state === "suspended") await ctx.resume();
    if (this.chain?.module === module) return;
    const previous = this.chain;
    const next = this.spinUp(module);
    this.chain = next;
    this.routeLayersToActiveChain();
    // Crossfade — new chain ramps up while old fades out
    if (previous) this.destroyChain(previous, 1.6);
    this.emit();
  }

  private spinUp(module: ModuleId): Chain {
    const ctx = this.ensureCtx();
    const limiter = this.limiter!;
    const p = PRESETS[module];
    const now = ctx.currentTime;
    const nodes: AudioNode[] = [];

    // Per-chain master + reverb send
    const master = ctx.createGain();
    master.gain.setValueAtTime(0, now);
    master.gain.linearRampToValueAtTime(this.intensity * 0.55, now + 1.8);
    master.connect(limiter);

    const convolver = ctx.createConvolver();
    convolver.buffer = this.buildReverbIR();
    const wet = ctx.createGain();
    const dry = ctx.createGain();
    const reverbInput = ctx.createGain();
    wet.gain.value = p.reverb * this.depth;
    dry.gain.value = 1 - 0.3 * p.reverb;
    reverbInput.connect(convolver).connect(wet).connect(master);
    dry.connect(master);

    // Lowpass with slow LFO breath
    const lp = ctx.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.value = p.filter;
    lp.Q.value = p.q;
    lp.connect(dry);
    lp.connect(reverbInput);

    const breath = ctx.createOscillator();
    const breathGain = ctx.createGain();
    breath.frequency.value = 0.08;
    breathGain.gain.value = p.filter * 0.32;
    breath.connect(breathGain).connect(lp.frequency);
    breath.start();

    // Binaural carrier — L/R sines
    const carrierGain = ctx.createGain();
    carrierGain.gain.value = 0.16;
    carrierGain.connect(lp);

    const oscL = ctx.createOscillator();
    const oscR = ctx.createOscillator();
    oscL.type = "sine"; oscR.type = "sine";
    oscL.frequency.value = p.carrier;
    oscR.frequency.value = p.carrier + (this.binauralOn ? p.binaural : 0);
    const panL = ctx.createStereoPanner(); panL.pan.value = -1;
    const panR = ctx.createStereoPanner(); panR.pan.value = 1;
    oscL.connect(panL).connect(carrierGain);
    oscR.connect(panR).connect(carrierGain);
    oscL.start(); oscR.start();

    // Sub-bass body — carrier / 2, lowpassed deeper
    if (p.sub && p.sub > 0) {
      const subOsc = ctx.createOscillator();
      subOsc.type = "sine";
      subOsc.frequency.value = p.carrier * 0.5;
      const subLp = ctx.createBiquadFilter();
      subLp.type = "lowpass"; subLp.frequency.value = 180; subLp.Q.value = 0.5;
      const subGain = ctx.createGain();
      subGain.gain.value = 0;
      subGain.gain.linearRampToValueAtTime(p.sub * 0.5, now + 4);
      subOsc.connect(subLp).connect(subGain).connect(master); // bypass reverb — keep low end clean
      subOsc.start();
      nodes.push(subOsc, subLp, subGain);
    }

    // Harmonic pad with Haas widening + slow vibrato
    const padBus = ctx.createGain();
    padBus.gain.value = 0;
    padBus.gain.linearRampToValueAtTime(0.14, now + 3.5);
    padBus.connect(lp);

    const vibrato = ctx.createOscillator();
    const vibratoGain = ctx.createGain();
    vibrato.frequency.value = 0.15;
    vibratoGain.gain.value = 3.5; // cents of drift
    vibrato.connect(vibratoGain);
    vibrato.start();

    const padOscs: OscillatorNode[] = [];
    p.harmonics.forEach((mult, i) => {
      const o = ctx.createOscillator();
      o.type = i % 2 === 0 ? "sine" : "triangle";
      o.frequency.value = p.carrier * mult;
      o.detune.value = (Math.random() - 0.5) * 12;
      vibratoGain.connect(o.detune);

      const g = ctx.createGain();
      g.gain.value = 0.5 / (i + 1);
      const pan = ctx.createStereoPanner();
      const side = ((i % 2) * 2 - 1) * 0.55 * this.depth;
      pan.pan.value = side;

      // Haas micro-delay on the opposite side for stereo width
      const delay = ctx.createDelay(0.05);
      delay.delayTime.value = 0.012 + (i * 0.004);
      const wetSide = ctx.createGain();
      wetSide.gain.value = 0.35 * this.depth;
      const wetPan = ctx.createStereoPanner();
      wetPan.pan.value = -side;

      o.connect(g);
      g.connect(pan).connect(padBus);
      g.connect(delay).connect(wetSide).connect(wetPan).connect(padBus);
      o.start();
      padOscs.push(o);
      nodes.push(g, pan, delay, wetSide, wetPan);
    });

    // Pink noise air bed (bandpassed)
    const noiseSrc = ctx.createBufferSource();
    noiseSrc.buffer = this.buildNoiseBuffer();
    noiseSrc.loop = true;
    const noiseGain = ctx.createGain();
    noiseGain.gain.value = p.noise * this.intensity;
    const noiseBp = ctx.createBiquadFilter();
    noiseBp.type = "bandpass";
    noiseBp.frequency.value = 600 + p.filter * 0.3;
    noiseBp.Q.value = 0.6;
    noiseSrc.connect(noiseBp).connect(noiseGain).connect(lp);
    noiseSrc.start();

    // High-shelf shimmer
    if (p.shimmer && p.shimmer > 0) {
      const shimmer = ctx.createBufferSource();
      shimmer.buffer = this.buildNoiseBuffer(4);
      shimmer.loop = true;
      const hp = ctx.createBiquadFilter();
      hp.type = "highpass"; hp.frequency.value = 4200; hp.Q.value = 0.3;
      const sg = ctx.createGain();
      sg.gain.value = 0;
      sg.gain.linearRampToValueAtTime(p.shimmer * 0.08, now + 5);
      shimmer.connect(hp).connect(sg).connect(reverbInput); // shimmer lives in the reverb tail
      shimmer.start();
      nodes.push(shimmer, hp, sg);
    }

    // Optional isochronic pulse on carrier
    if (p.pulseRate) {
      const pulseLfo = ctx.createOscillator();
      const pulseDepth = ctx.createGain();
      pulseLfo.frequency.value = p.pulseRate;
      pulseDepth.gain.value = 0.05;
      pulseLfo.connect(pulseDepth).connect(carrierGain.gain);
      pulseLfo.start();
      nodes.push(pulseLfo, pulseDepth);
    }

    nodes.push(breath, breathGain, oscL, oscR, panL, panR, carrierGain,
               vibrato, vibratoGain, ...padOscs, padBus, noiseSrc, noiseBp, noiseGain,
               lp, convolver, wet, dry, reverbInput, master);

    return { module, master, wet, convolver, reverbInput, nodes };
  }

  private destroyChain(chain: Chain, fadeSec = 0.8) {
    const ctx = this.ctx; if (!ctx) return;
    const t = ctx.currentTime;
    chain.master.gain.cancelScheduledValues(t);
    chain.master.gain.setValueAtTime(chain.master.gain.value, t);
    chain.master.gain.linearRampToValueAtTime(0, t + fadeSec);
    // Detach personal layers tied to this chain (they were routed via reverbInput)
    setTimeout(() => {
      chain.nodes.forEach((n) => {
        try { (n as OscillatorNode).stop?.(); } catch { /* not a source */ }
        try { n.disconnect(); } catch { /* already disconnected */ }
      });
    }, fadeSec * 1000 + 80);
  }

  async stop() {
    if (this.chain) this.destroyChain(this.chain, 1.0);
    this.chain = null;
    // Tear down all personal layers
    this.layers.forEach((_, id) => this.removeLayer(id));
    this.emit();
  }

  setIntensity(v: number) {
    this.intensity = Math.max(0, Math.min(1, v));
    if (this.chain && this.ctx) {
      this.chain.master.gain.linearRampToValueAtTime(this.intensity * 0.55, this.ctx.currentTime + 0.4);
    }
    this.emit();
  }

  setDepth(v: number) {
    this.depth = Math.max(0, Math.min(1, v));
    if (this.chain && this.ctx) {
      const p = PRESETS[this.chain.module];
      this.chain.wet.gain.linearRampToValueAtTime(p.reverb * this.depth, this.ctx.currentTime + 0.6);
    }
    this.emit();
  }

  setBinaural(on: boolean) {
    if (this.binauralOn === on) return;
    this.binauralOn = on;
    if (this.chain) {
      // Seamless rebuild via crossfade
      const m = this.chain.module;
      const prev = this.chain;
      this.chain = this.spinUp(m);
      this.routeLayersToActiveChain();
      this.destroyChain(prev, 1.2);
    }
    this.emit();
  }

  // ——— Personal layers (user-uploaded sounds) ———
  private layers = new Map<string, { src: AudioBufferSourceNode; gain: GainNode; pan: StereoPannerNode }>();
private routeLayersToActiveChain() {
  if (!this.ctx) return;

  const destination: AudioNode =
    this.chain?.reverbInput ?? this.limiter ?? this.ctx.destination;

  for (const { gain } of this.layers.values()) {
    gain.disconnect();
    gain.connect(destination);
  }
}
  async addLayer(id: string, dataUrl: string, initialGain = 0.5) {
    const ctx = this.ensureCtx();
    if (this.layers.has(id)) return;
    try {
      const res = await fetch(dataUrl);
      const arr = await res.arrayBuffer();
      const buf = await ctx.decodeAudioData(arr.slice(0));
      const src = ctx.createBufferSource();
      src.buffer = buf; src.loop = true;
      const gain = ctx.createGain();
      gain.gain.value = 0;
      const pan = ctx.createStereoPanner();
      pan.pan.value = 0;
      // Route layers through the chain's reverb when available, else dry to limiter
      const destination: AudioNode = this.chain?.reverbInput ?? this.limiter ?? ctx.destination;
      src.connect(pan).connect(gain).connect(destination);
      gain.gain.linearRampToValueAtTime(initialGain, ctx.currentTime + 2.0);
      src.start();
      this.layers.set(id, { src, gain, pan });
    } catch (e) {
      console.warn("WAVES: failed to decode layer", id, e);
    }
  }

  setLayerGain(id: string, v: number) {
    const l = this.layers.get(id); if (!l || !this.ctx) return;
    l.gain.gain.linearRampToValueAtTime(Math.max(0, Math.min(1, v)), this.ctx.currentTime + 0.4);
  }

  removeLayer(id: string) {
    const l = this.layers.get(id); if (!l || !this.ctx) return;
    const t = this.ctx.currentTime;
    l.gain.gain.cancelScheduledValues(t);
    l.gain.gain.setValueAtTime(l.gain.gain.value, t);
    l.gain.gain.linearRampToValueAtTime(0, t + 1.4);
    setTimeout(() => {
      try { l.src.stop(); } catch { /* */ }
      try { l.src.disconnect(); l.gain.disconnect(); l.pan.disconnect(); } catch { /* */ }
      this.layers.delete(id);
    }, 1600);
  }

  hasLayer(id: string) { return this.layers.has(id); }
}

export const wavesEngine = new WavesEngine();
