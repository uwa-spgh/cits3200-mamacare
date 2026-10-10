import { spawnSync } from 'node:child_process';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
for (const TZ of ['Australia/Perth', 'America/Los_Angeles', 'Asia/Kathmandu', 'Pacific/Kiritimati']) {
  console.log(`\nTesting local dates and reminders in ${TZ}`);
  const result = spawnSync(process.execPath, ['--import', 'tsx', '--test',
    'src/pregnancy/progress.test.ts', 'src/pregnancy/storage.test.ts',
    'src/notifications/planning.test.ts', 'tests/reminder-boundaries.test.mjs'],
    { cwd: root, env: { ...process.env, TZ }, stdio: 'inherit' });
  if (result.error) throw result.error;
  if (result.status !== 0) { process.exitCode = result.status ?? 1; break; }
}
