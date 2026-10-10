import { normalizeDueDate } from "./progress";

export const DUE_DATE_STORAGE_KEY = "mamacare:pregnancy-due-date:v1";

interface DueDateStorage {
  getItem: (key: string) => Promise<string | null>;
  setItem: (key: string, value: string) => Promise<void>;
}

export function createDueDateStorage(storage: DueDateStorage) {
  let pendingWrite = Promise.resolve();
  return {
    async load() {
      const value = await storage.getItem(DUE_DATE_STORAGE_KEY);
      return value ? normalizeDueDate(value) ?? "" : "";
    },
    async save(value: string) {
      const normalized = normalizeDueDate(value);
      if (!normalized) throw new Error("Invalid due date");
      // Serialize writes so an older, slower save cannot overwrite a newer EDD.
      const write = pendingWrite.then(() => storage.setItem(DUE_DATE_STORAGE_KEY, normalized));
      pendingWrite = write.catch(() => undefined);
      await write;
      return normalized;
    },
  };
}
