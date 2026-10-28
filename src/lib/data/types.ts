
import type { Module } from "../waves-data";

export type WavesModuleId = Module["id"];

export type SessionStatus =
  | "in-progress"
  | "completed"
  | "abandoned";

export type ReflectionStatus = "draft" | "saved";

/**
 * Identifies a person's local WAVES archive.
 * This is a local identifier, not an authenticated account.
 */
export interface LocalProfile {
  id: string;
  createdAt: number;
  updatedAt: number;
}

/**
 * One listening experience in a WAVES sound space.
 * Timestamps are Unix milliseconds.
 */
export interface SessionRecord {
  id: string;
  ownerId: string;
  moduleId: WavesModuleId;
  startedAt: number;
  endedAt: number | null;
  durationSeconds: number | null;
  status: SessionStatus;

  settings: {
    intensity: number;
    spatialDepth: number;
    binaural: boolean;
  };

  createdAt: number;
  updatedAt: number;
}

/**
 * A private reflection associated with a session,
 * or created independently of a session.
 */
export interface ReflectionRecord {
  id: string;
  ownerId: string;
  sessionId: string | null;

  moodTags: string[];
  note: string;
  voiceAssetId: string | null;

  status: ReflectionStatus;
  createdAt: number;
  updatedAt: number;
}

/**
 * Metadata for media stored separately from its content.
 * The actual audio or image will be stored as a Blob.
 */
export interface MediaAssetRecord {
  id: string;
  ownerId: string;
  kind: "voice-recording" | "personal-layer" | "photo";
  mimeType: string;
  sizeBytes: number;
  localKey: string;
  durationSeconds: number | null;
  createdAt: number;
  updatedAt: number;
}
