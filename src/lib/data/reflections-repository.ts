import { getOrCreateLocalProfile, openWavesDatabase } from "./database";
import type { ReflectionRecord } from "./types";

export type ReflectionInput = Pick<
  ReflectionRecord,
  | "id"
  | "sessionId"
  | "moodTags"
  | "note"
  | "voiceAssetId"
  | "status"
>;

export function createReflectionId(): string {
  const id =
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
      ? crypto.randomUUID()
      : `${Date.now().toString(36)}-${Math.random()
          .toString(36)
          .slice(2)}`;

  return `reflection-${id}`;
}

export async function saveReflection(
  input: ReflectionInput,
): Promise<ReflectionRecord> {
  const profile = await getOrCreateLocalProfile();
  const db = await openWavesDatabase();

  return new Promise<ReflectionRecord>((resolve, reject) => {
    const tx = db.transaction("reflections", "readwrite");
    const store = tx.objectStore("reflections");

    let saved: ReflectionRecord | null = null;

    const request = store.get(input.id);

    request.onsuccess = () => {
      const existing = request.result as
        | ReflectionRecord
        | undefined;

      if (existing && existing.ownerId !== profile.id) {
        reject(new Error("This reflection belongs to another profile."));

        try {
          tx.abort();
        } catch {
          // The transaction may already have ended.
        }

        return;
      }

      const now = Date.now();

      saved = {
        ...input,
        moodTags: [...input.moodTags],
        ownerId: profile.id,
        createdAt: existing?.createdAt ?? now,
        updatedAt: now,
      };

      store.put(saved);
    };

    request.onerror = () => {
      try {
        tx.abort();
      } catch {
        // The transaction may already have ended.
      }
    };

    tx.oncomplete = () => {
      if (saved) {
        resolve(saved);
      } else {
        reject(new Error("The reflection could not be saved."));
      }
    };

    tx.onerror = () => {
      reject(tx.error ?? new Error("Could not save the reflection."));
    };

    tx.onabort = () => {
      reject(tx.error ?? new Error("The save operation was cancelled."));
    };
  });
}

export async function listReflections(): Promise<ReflectionRecord[]> {
  const profile = await getOrCreateLocalProfile();
  const db = await openWavesDatabase();

  return new Promise<ReflectionRecord[]>((resolve, reject) => {
    const tx = db.transaction("reflections", "readonly");
    const index = tx.objectStore("reflections").index("byOwnerId");

    let records: ReflectionRecord[] = [];

    const request = index.getAll(profile.id);

    request.onsuccess = () => {
      records = request.result as ReflectionRecord[];
    };

    tx.oncomplete = () => {
      records.sort((a, b) => b.updatedAt - a.updatedAt);
      resolve(records);
    };

    tx.onerror = () => {
      reject(tx.error ?? new Error("Could not load reflections."));
    };

    tx.onabort = () => {
      reject(tx.error ?? new Error("Loading reflections was cancelled."));
    };
  });
}
export async function deleteReflection(
  reflectionId: string,
): Promise<boolean> {
  const profile = await getOrCreateLocalProfile();
  const db = await openWavesDatabase();

  return new Promise<boolean>((resolve, reject) => {
    const tx = db.transaction(
      ["reflections", "mediaAssets", "mediaBlobs"],
      "readwrite",
    );

    const reflectionStore = tx.objectStore("reflections");
    const mediaAssets = tx.objectStore("mediaAssets");
    const mediaBlobs = tx.objectStore("mediaBlobs");

    let reflection: ReflectionRecord | undefined;
    let ownedReflections: ReflectionRecord[] | undefined;
    let deleted = false;
    let processed = false;

    const processDeletion = () => {
      if (
        processed ||
        reflection === undefined ||
        ownedReflections === undefined
      ) {
        return;
      }

      processed = true;

      // Only delete reflections belonging to this local profile.
      if (!reflection || reflection.ownerId !== profile.id) {
        return;
      }

      reflectionStore.delete(reflection.id);
      deleted = true;

      // Delete the audio only if no other reflection references it.
      if (reflection.voiceAssetId) {
        const audioIsStillUsed = ownedReflections.some(
          (item) =>
            item.id !== reflectionId &&
            item.voiceAssetId === reflection!.voiceAssetId,
        );

        if (!audioIsStillUsed) {
          mediaAssets.delete(reflection.voiceAssetId);
          mediaBlobs.delete(reflection.voiceAssetId);
        }
      }
    };

    const reflectionRequest = reflectionStore.get(reflectionId);
    const ownedRequest = reflectionStore
      .index("byOwnerId")
      .getAll(profile.id);

    reflectionRequest.onsuccess = () => {
      reflection = reflectionRequest.result as
        | ReflectionRecord
        | undefined;
      processDeletion();
    };

    ownedRequest.onsuccess = () => {
      ownedReflections = ownedRequest.result as ReflectionRecord[];
      processDeletion();
    };

    tx.oncomplete = () => resolve(deleted);

    tx.onerror = () => {
      reject(
        tx.error ?? new Error("Could not delete the reflection."),
      );
    };

    tx.onabort = () => {
      reject(
        tx.error ?? new Error("The deletion was cancelled."),
      );
    };
  });
}