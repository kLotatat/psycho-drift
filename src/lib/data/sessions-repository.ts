import { getOrCreateLocalProfile, openWavesDatabase } from "./database";
import type { SessionRecord, WavesModuleId } from "./types";

export function createSessionId(): string {
  const id =
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
      ? crypto.randomUUID()
      : `${Date.now().toString(36)}-${Math.random()
          .toString(36)
          .slice(2)}`;

  return `session-${id}`;
}

export async function startSession(input: {
  id: string;
  moduleId: WavesModuleId;
  intensity: number;
  spatialDepth: number;
  binaural: boolean;
}): Promise<SessionRecord> {
  const profile = await getOrCreateLocalProfile();
  const db = await openWavesDatabase();
  const now = Date.now();

  const record: SessionRecord = {
    id: input.id,
    ownerId: profile.id,
    moduleId: input.moduleId,
    startedAt: now,
    endedAt: null,
    durationSeconds: null,
    status: "in-progress",
    settings: {
      intensity: input.intensity,
      spatialDepth: input.spatialDepth,
      binaural: input.binaural,
    },
    createdAt: now,
    updatedAt: now,
  };

  return new Promise<SessionRecord>((resolve, reject) => {
    const tx = db.transaction("sessions", "readwrite");
    const store = tx.objectStore("sessions");

    store.add(record);

    tx.oncomplete = () => resolve(record);

    tx.onerror = () => {
      reject(tx.error ?? new Error("Could not save the session."));
    };

    tx.onabort = () => {
      reject(tx.error ?? new Error("The session save was cancelled."));
    };
  });
}

export async function completeSession(
  sessionId: string,
  durationSeconds: number,
): Promise<SessionRecord> {
  const profile = await getOrCreateLocalProfile();
  const db = await openWavesDatabase();

  return new Promise<SessionRecord>((resolve, reject) => {
    const tx = db.transaction("sessions", "readwrite");
    const store = tx.objectStore("sessions");

    let completed: SessionRecord | null = null;

    const request = store.get(sessionId);

    request.onsuccess = () => {
      const existing = request.result as
        | SessionRecord
        | undefined;

      if (!existing || existing.ownerId !== profile.id) {
        reject(new Error("The session could not be found."));

        try {
          tx.abort();
        } catch {
          // The transaction may already have ended.
        }

        return;
      }

      completed = {
        ...existing,
        endedAt: Date.now(),
        durationSeconds: Math.max(0, Math.floor(durationSeconds)),
        status: "completed",
        updatedAt: Date.now(),
      };

      store.put(completed);
    };

    request.onerror = () => {
      try {
        tx.abort();
      } catch {
        // The transaction may already have ended.
      }
    };

    tx.oncomplete = () => {
      if (completed) {
        resolve(completed);
      } else {
        reject(new Error("The session could not be completed."));
      }
    };

    tx.onerror = () => {
      reject(tx.error ?? new Error("Could not update the session."));
    };

    tx.onabort = () => {
      reject(tx.error ?? new Error("The session update was cancelled."));
    };
  });
}