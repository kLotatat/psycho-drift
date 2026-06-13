/**
 * WAVES Audio Engine — procedural psychoacoustic synthesis.
 * No samples. Generated entirely with the Web Audio API:
 *   - dual-oscillator binaural beat carrier (L / R)
 *   - harmonic pad (sine + detuned saw, filtered)
 *   - filtered pink-ish noise bed (vestibular air)
 *   - slow LFO breathing the lowpass + master amplitude
 *   - convolution reverb from a procedurally generated impulse
 * Designed to begin producing sound within 200ms of resume().
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
}

const PRESETS: Record<ModuleId, Preset> = {
  focus:   { carrier: 220, binaural: 14.0, filter: 2200, q: 0.7, noise: 0.05, harmonics: [1.5, 2, 3],     reverb: 0.22, pulseRate: 14 },
  ground:  { carrier: 65,  binaural: 4.0,  filter: 420,  q: 0.6, noise: 0.10, harmonics: [2, 3],          reverb: 0.55 },
  float:   { carrier: 174, binaural: 6.0,  filter: 1400, q: 0.5, noise: 0.10, harmonics: [1.5, 2, 3, 4],  reverb: 0.85 },
  release: { carrier: 136, binaural: 4.5,  filter: 900,  q: 0.8, noise: 0.06, harmonics: [2, 2.5, 3],     reverb: 0.70 },
  nest:    { carrier: 110, binaural: 7.83, filter: 700,  q: 0.7, noise: 0.05, harmonics: [2, 3, 4],       reverb: 0.45 },
  recall:  { carrier: 192, binaural: 6.0,  filter: 1100, q: 0.9, noise: 0.06, harmonics: [1.5, 2, 2.5],   reverb: 0.60 },
};

class WavesEngine {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private wet: GainNode | null = null;
  private dry: GainNode | null = null;
  private nodes: AudioNode[] = [];
  private analyser: AnalyserNode | null = null;
  private currentModule: ModuleId | null = null;
  private intensity = 0.5;   // 0..1
  private depth = 0.6;       // spatial depth 0..1
  private binauralOn = true;
  private listeners = new Set<() => void>();

  get isRunning() { return this.ctx?.state === "running" && !!this.currentModule; }
  get module() { return this.currentModule; }
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
    }
    return this.ctx;
  }

  private buildReverbIR(seconds = 3.2, decay = 2.4): AudioBuffer {
    const ctx = this.ensureCtx();
    const rate = ctx.sampleRate;
    const len = Math.floor(seconds * rate);
    const buf = ctx.createBuffer(2, len, rate);
    for (let ch = 0; ch < 2; ch++) {
      const data = buf.getChannelData(ch);
      for (let i = 0; i < len; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, decay);
      }
    }
    return buf;
  }

  /** Pink-ish noise via a single biquad on white noise. */
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
    if (this.currentModule === module && this.isRunning) return;
    if (this.currentModule) this.stopVoices(0.6);
    this.currentModule = module;
    this.spinUp(module);
    this.emit();
  }

  private spinUp(module: ModuleId) {
    const ctx = this.ensureCtx();
    const p = PRESETS[module];
    const now = ctx.currentTime;

    // Master chain
    const master = ctx.createGain();
    master.gain.setValueAtTime(0, now);
    master.gain.linearRampToValueAtTime(this.intensity * 0.6, now + 1.5);
    master.connect(ctx.destination);

    const analyser = ctx.createAnalyser();
    analyser.fftSize = 1024;
    analyser.smoothingTimeConstant = 0.85;
    master.connect(analyser);
    this.analyser = analyser;

    // Reverb send/return
    const convolver = ctx.createConvolver();
    convolver.buffer = this.buildReverbIR();
    const wet = ctx.createGain();
    const dry = ctx.createGain();
    wet.gain.value = p.reverb * this.depth;
    dry.gain.value = 1 - 0.3 * p.reverb;
    convolver.connect(wet).connect(master);
    dry.connect(master);

    // Shared lowpass with slow LFO (breathing)
    const lp = ctx.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.value = p.filter;
    lp.Q.value = p.q;
    lp.connect(dry);
    lp.connect(convolver);

    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    lfo.frequency.value = 0.08;          // ~12s breath cycle
    lfoGain.gain.value = p.filter * 0.35;
    lfo.connect(lfoGain).connect(lp.frequency);
    lfo.start();

    // Binaural carrier — split L/R via StereoPanner
    const carrierGain = ctx.createGain();
    carrierGain.gain.value = 0.18;
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

    // Harmonic pad — slightly detuned, slow attack
    const padBus = ctx.createGain();
    padBus.gain.value = 0;
    padBus.gain.linearRampToValueAtTime(0.16, ctx.currentTime + 3);
    padBus.connect(lp);

    const padOscs: OscillatorNode[] = [];
    p.harmonics.forEach((mult, i) => {
      const o = ctx.createOscillator();
      o.type = i % 2 === 0 ? "sine" : "triangle";
      o.frequency.value = p.carrier * mult;
      o.detune.value = (Math.random() - 0.5) * 14;
      const g = ctx.createGain();
      g.gain.value = 0.5 / (i + 1);
      const pan = ctx.createStereoPanner();
      pan.pan.value = ((i % 2) * 2 - 1) * 0.6 * this.depth;
      o.connect(g).connect(pan).connect(padBus);
      o.start();
      padOscs.push(o);
    });

    // Filtered noise air bed
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

    // Optional isochronic pulse on the carrier
    if (p.pulseRate) {
      const pulseLfo = ctx.createOscillator();
      const pulseDepth = ctx.createGain();
      pulseLfo.frequency.value = p.pulseRate;
      pulseDepth.gain.value = 0.06;
      pulseLfo.connect(pulseDepth).connect(carrierGain.gain);
      pulseLfo.start();
      this.nodes.push(pulseLfo);
    }

    this.master = master; this.wet = wet; this.dry = dry;
    this.nodes.push(lfo, oscL, oscR, noiseSrc, ...padOscs, lp, convolver, wet, dry, carrierGain, padBus, noiseGain, noiseBp, master);
  }

  private stopVoices(fadeSec = 0.5) {
    const ctx = this.ctx; if (!ctx || !this.master) return;
    const t = ctx.currentTime;
    this.master.gain.cancelScheduledValues(t);
    this.master.gain.setValueAtTime(this.master.gain.value, t);
    this.master.gain.linearRampToValueAtTime(0, t + fadeSec);
    const toKill = this.nodes;
    this.nodes = [];
    setTimeout(() => {
      toKill.forEach((n) => {
        try { (n as OscillatorNode).stop?.(); } catch { /* not a source */ }
        try { n.disconnect(); } catch { /* already disconnected */ }
      });
    }, fadeSec * 1000 + 60);
    this.master = null; this.wet = null; this.dry = null; this.analyser = null;
  }

  async stop() {
    this.stopVoices(0.8);
    this.currentModule = null;
    this.emit();
  }

  setIntensity(v: number) {
    this.intensity = Math.max(0, Math.min(1, v));
    if (this.master && this.ctx) {
      this.master.gain.linearRampToValueAtTime(this.intensity * 0.6, this.ctx.currentTime + 0.4);
    }
    this.emit();
  }

  setDepth(v: number) {
    this.depth = Math.max(0, Math.min(1, v));
    if (this.wet && this.ctx && this.currentModule) {
      const p = PRESETS[this.currentModule];
      this.wet.gain.linearRampToValueAtTime(p.reverb * this.depth, this.ctx.currentTime + 0.6);
    }
    this.emit();
  }

  setBinaural(on: boolean) {
    this.binauralOn = on;
    // Rebuild silently if running — cheapest path
    if (this.currentModule) {
      const m = this.currentModule;
      this.stopVoices(0.4);
      setTimeout(() => this.spinUp(m), 80);
    }
    this.emit();
  }
}

export const wavesEngine = new WavesEngine();
