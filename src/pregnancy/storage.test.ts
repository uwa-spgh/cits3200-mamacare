import assert from "node:assert/strict";
import { test } from "node:test";
import { createDueDateStorage, DUE_DATE_STORAGE_KEY } from "./storage";
import { getPregnancyProgress } from "./progress";

function memoryStorage() {
  const values = new Map<string, string>();
  return {
    values,
    async getItem(key: string) { return values.get(key) ?? null; },
    async setItem(key: string, value: string) { values.set(key, value); },
  };
}

test("a saved picker date restores after restarting and drives the same pregnancy estimate", async () => {
  const disk = memoryStorage();
  const firstSession = createDueDateStorage(disk);
  await firstSession.save(new Date(2026, 9, 15, 18).toISOString());
  assert.equal(disk.values.get(DUE_DATE_STORAGE_KEY), "2026-10-15");
  const restartedSession = createDueDateStorage(disk);
  const restored = await restartedSession.load();
  assert.equal(restored, "2026-10-15");
  const progress = getPregnancyProgress(restored, new Date(2026, 9, 9))!;
  assert.deepEqual([progress.weeks, progress.days, progress.daysUntilDue], [39, 1, 6]);
});

test("an edited EDD replaces the old EDD on the next restart", async () => {
  const disk = memoryStorage();
  const session = createDueDateStorage(disk);
  await session.save("2026-10-15");
  await session.save("2026-10-22");
  assert.equal(await createDueDateStorage(disk).load(), "2026-10-22");
});

test("missing or corrupt persisted dates load as unset, while storage read errors are surfaced", async () => {
  const disk = memoryStorage();
  assert.equal(await createDueDateStorage(disk).load(), "");
  disk.values.set(DUE_DATE_STORAGE_KEY, "2026-02-30");
  assert.equal(await createDueDateStorage(disk).load(), "");
  const broken = { ...disk, getItem: async () => { throw new Error("Read failed"); } };
  await assert.rejects(createDueDateStorage(broken).load(), /Read failed/);
});

test("invalid dates or failed writes do not erase the previous saved EDD", async () => {
  const disk = memoryStorage();
  const session = createDueDateStorage(disk);
  await session.save("2026-10-15");
  await assert.rejects(session.save("2026-02-30"), /Invalid due date/);
  const failing = createDueDateStorage({ ...disk, setItem: async () => { throw new Error("Disk full"); } });
  await assert.rejects(failing.save("2026-10-22"), /Disk full/);
  assert.equal(await session.load(), "2026-10-15");
});

test("concurrent saves cannot let a slow older write overwrite the latest EDD", async () => {
  const disk = memoryStorage();
  let finishFirst: (() => void) | undefined;
  let signalFirst: (() => void) | undefined;
  const started = new Promise<void>((resolve) => { signalFirst = resolve; });
  const session = createDueDateStorage({ ...disk, async setItem(key, value) {
    if (value === "2026-10-15") {
      signalFirst!();
      await new Promise<void>((resolve) => { finishFirst = resolve; });
    }
    await disk.setItem(key, value);
  } });
  const older = session.save("2026-10-15");
  await started;
  const newer = session.save("2026-10-22");
  finishFirst!();
  await Promise.all([older, newer]);
  assert.equal(await session.load(), "2026-10-22");
});

test("a failed write does not block the next successful save", async () => {
  const disk = memoryStorage();
  let fail = true;
  const session = createDueDateStorage({ ...disk, async setItem(key, value) {
    if (fail) { fail = false; throw new Error("Temporary error"); }
    return disk.setItem(key, value);
  } });
  await assert.rejects(session.save("2026-10-15"));
  await session.save("2026-10-22");
  assert.equal(await session.load(), "2026-10-22");
});
