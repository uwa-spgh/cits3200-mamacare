import { spawnSync } from 'node:child_process';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const results = [];
for (const [name, args] of [
  ['Tests (known bugs are reported as TODO)', ['scripts/test.mjs']],
  ['TypeScript', ['node_modules/typescript/bin/tsc', '--noEmit']],
  ['iOS, Android and web bundles', ['scripts/build-check.mjs']],
]) {
  console.log(`\n${name}`);
  const result = spawnSync(process.execPath, args, { cwd: root, stdio: 'inherit' });
  if (result.error) throw result.error;
  results.push({ name, status: result.status ?? 1 });
}
console.log('\nCheck results');
for (const result of results) console.log(`${result.status === 0 ? 'PASS' : 'FAIL'} ${result.name}`);
process.exitCode = results.some(result => result.status !== 0) ? 1 : 0;
