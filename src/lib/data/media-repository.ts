import {
  getOrCreateLocalProfile,
  openWavesDatabase,
} from "./database";
import type { MediaAssetRecord } from "./types";

interface StoredMediaBlob {
  id: string;
  ownerId: string;
  blob: Blob;
  createdAt: number;
  updatedAt: number;
}

function createMediaAssetId(): string {
  const id =
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
      ? crypto.randomUUID()
      : `${Date.now().toString(36)}-${Math.random()
          .toString(36)
          .slice(2)}`;

  return `voice-${id}`;
}

export async function saveVoiceRecording(
  blob: Blob,
  durationSeconds: number,
): Promise<MediaAssetRecord> {
  if (blob.size === 0) {
    throw new Error("The recording is empty.");
  }

  const profile = await getOrCreateLocalProfile();
  const db = await openWavesDatabase();
  const now = Date.now();
  const id = createMediaAssetId();

  const asset: MediaAssetRecord = {
    id,
    ownerId: profile.id,
    kind: "voice-recording",
    mimeType: blob.type || "application/octet-stream",
    sizeBytes: blob.size,
    localKey: id,
    durationSeconds: Math.max(0, Math.floor(durationSeconds)),
    createdAt: now,
    updatedAt: now,
  };

  const storedBlob: StoredMediaBlob = {
    id,
    ownerId: profile.id,
    blob,
    createdAt: now,
    updatedAt: now,
  };

  return new Promise<MediaAssetRecord>((resolve, reject) => {
    const tx = db.transaction(
      ["mediaAssets", "mediaBlobs"],
      "readwrite",
    );

    tx.objectStore("mediaAssets").add(asset);
    tx.objectStore("mediaBlobs").add(storedBlob);

    tx.oncomplete = () => resolve(asset);

    tx.onerror = () => {
      reject(
        tx.error ?? new Error("Could not save the voice recording."),
      );
    };

    tx.onabort = () => {
      reject(
        tx.error ?? new Error("The voice recording save was cancelled."),
      );
    };
  });
}

export async function loadVoiceRecording(
  assetId: string,
): Promise<{ asset: MediaAssetRecord; blob: Blob } | null> {
  const profile = await getOrCreateLocalProfile();
  const db = await openWavesDatabase();

  return new Promise((resolve, reject) => {
    const tx = db.transaction(
      ["mediaAssets", "mediaBlobs"],
      "readonly",
    );

    const assetRequest = tx
      .objectStore("mediaAssets")
      .get(assetId);

    const blobRequest = tx
      .objectStore("mediaBlobs")
      .get(assetId);

    let asset: MediaAssetRecord | undefined;
    let storedBlob: StoredMediaBlob | undefined;

    assetRequest.onsuccess = () => {
      asset = assetRequest.result as MediaAssetRecord | undefined;
    };

    blobRequest.onsuccess = () => {
      storedBlob = blobRequest.result as StoredMediaBlob | undefined;
    };

    tx.oncomplete = () => {
      if (
        !asset ||
        !storedBlob ||
        asset.ownerId !== profile.id ||
        storedBlob.ownerId !== profile.id ||
        asset.kind !== "voice-recording"
      ) {
        resolve(null);
        return;
      }

      resolve({
        asset,
        blob: storedBlob.blob,
      });
    };

    tx.onerror = () => {
      reject(
        tx.error ?? new Error("Could not load the voice recording."),
      );
    };

    tx.onabort = () => {
      reject(
        tx.error ?? new Error("Loading the voice recording was cancelled."),
      );
    };
  });
}