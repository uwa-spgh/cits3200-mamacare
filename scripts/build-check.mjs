import { spawnSync } from 'node:child_process';
import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, resolve, join } from 'node:path';
import { fileURLToPath } from 'node:url';
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const output = mkdtempSync(join(tmpdir(), 'mamacare-build-check-'));
const result = spawnSync(process.execPath, [resolve(root, 'node_modules/expo/bin/cli'), 'export', '--platform', 'all', '--output-dir', output], {
  cwd: root, stdio: 'inherit', env: { ...process.env, CI: '1' },
});
console.log(`Build artifacts: ${output}`);
if (result.error) throw result.error;
process.exitCode = result.status ?? 1;
