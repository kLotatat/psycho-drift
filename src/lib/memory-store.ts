// Personal sound layers — saved to localStorage as base64 data URLs.
// Small, simple, persistent across reloads. No backend.
import type { CategoryId } from "./waves-data";

const KEY = "waves.layers.v1";

export type Layer = {
  id: string;
  name: string;
  categories: CategoryId[];
  dataUrl: string;      // audio/* data URL
  durationSec?: number;
  createdAt: number;
};

export function loadLayers(): Layer[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Layer[]) : [];
  } catch { return []; }
}

export function saveLayers(layers: Layer[]) {
  try { localStorage.setItem(KEY, JSON.stringify(layers)); } catch { /* quota */ }
}

export function addLayer(layer: Layer) {
  const all = loadLayers();
  all.unshift(layer);
  saveLayers(all);
  return all;
}

export function removeLayer(id: string) {
  const all = loadLayers().filter((l) => l.id !== id);
  saveLayers(all);
  return all;
}

export function fileToDataUrl(file: File): Promise<string> {
  return new Promise((res, rej) => {
    const r = new FileReader();
    r.onload = () => res(String(r.result));
    r.onerror = () => rej(r.error);
    r.readAsDataURL(file);
  });
}
