import type { LocalProfile } from "./types";

const DB_NAME = "waves.local";
const DB_VERSION = 1;

const LOCAL_PROFILE_ID = "local-default-profile";

const STORES = {
  profiles: "profiles",
  sessions: "sessions",
  reflections: "reflections",
  mediaAssets: "mediaAssets",
  mediaBlobs: "mediaBlobs",
} as const;

let dbPromise: Promise<IDBDatabase> | null = null;

function ensureIndex(
  store: IDBObjectStore,
  name: string,
  keyPath: string,
) {
  if (!store.indexNames.contains(name)) {
    store.createIndex(name, keyPath, { unique: false });
  }
}

export function openWavesDatabase(): Promise<IDBDatabase> {
  if (typeof window === "undefined") {
    return Promise.reject(
      new Error("WAVES database is only available in the browser."),
    );
  }

  if (!window.indexedDB) {
    return Promise.reject(
      new Error("IndexedDB is not available in this browser."),
    );
  }

  if (dbPromise) return dbPromise;

  dbPromise = new Promise<IDBDatabase>((resolve, reject) => {
    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      const tx = request.transaction;

      if (!tx) {
        throw new Error("Could not initialize the WAVES database.");
      }

      const getStore = (name: string) =>
        db.objectStoreNames.contains(name)
          ? tx.objectStore(name)
          : db.createObjectStore(name, { keyPath: "id" });

      getStore(STORES.profiles);

      const sessions = getStore(STORES.sessions);
      ensureIndex(sessions, "byOwnerId", "ownerId");
      ensureIndex(sessions, "byStartedAt", "startedAt");
      ensureIndex(sessions, "byStatus", "status");

      const reflections = getStore(STORES.reflections);
      ensureIndex(reflections, "byOwnerId", "ownerId");
      ensureIndex(reflections, "bySessionId", "sessionId");
      ensureIndex(reflections, "byUpdatedAt", "updatedAt");

      const mediaAssets = getStore(STORES.mediaAssets);
      ensureIndex(mediaAssets, "byOwnerId", "ownerId");
      ensureIndex(mediaAssets, "byKind", "kind");

      const mediaBlobs = getStore(STORES.mediaBlobs);
      ensureIndex(mediaBlobs, "byOwnerId", "ownerId");
    };

    request.onsuccess = () => {
      const db = request.result;

      db.onversionchange = () => {
        db.close();
        dbPromise = null;
      };

      resolve(db);
    };

    request.onerror = () => {
      dbPromise = null;
      reject(request.error ?? new Error("Could not open WAVES database."));
    };

    request.onblocked = () => {
      dbPromise = null;
      reject(
        new Error(
          "Database upgrade blocked. Close other WAVES tabs and reload.",
        ),
      );
    };
  });

  return dbPromise;
}

export async function getOrCreateLocalProfile(): Promise<LocalProfile> {
  const db = await openWavesDatabase();

  return new Promise<LocalProfile>((resolve, reject) => {
    const tx = db.transaction(STORES.profiles, "readwrite");
    const store = tx.objectStore(STORES.profiles);

    let profile: LocalProfile | null = null;

    tx.oncomplete = () => {
      if (profile) {
        resolve(profile);
      } else {
        reject(new Error("Could not load the local WAVES profile."));
      }
    };

    tx.onerror = () => {
      reject(tx.error ?? new Error("Could not read the local profile."));
    };

    tx.onabort = () => {
      reject(tx.error ?? new Error("Profile transaction was aborted."));
    };

    const request = store.get(LOCAL_PROFILE_ID);

    request.onsuccess = () => {
      if (request.result) {
        profile = request.result as LocalProfile;
        return;
      }

      const now = Date.now();

      profile = {
        id: LOCAL_PROFILE_ID,
        createdAt: now,
        updatedAt: now,
      };

      store.add(profile);
    };

    request.onerror = () => {
      try {
        tx.abort();
      } catch {
        // The transaction may already have ended.
      }
    };
  });
}