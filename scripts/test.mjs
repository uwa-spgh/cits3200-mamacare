import { readdirSync, readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
function discover(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const path = resolve(directory, entry.name);
    return entry.isDirectory() ? discover(path) : /\.test\.(ts|tsx|mjs)$/.test(entry.name) ? [path] : [];
  });
}
const files = ['src', 'tests'].flatMap(folder => discover(resolve(root, folder))).sort();
const strict = process.argv.includes('--known-bugs');
const selected = strict ? files.filter(path => (/\bknownBug\s*\(\s*test\s*,/).test(readFileSync(path, 'utf8'))) : files;
if (!selected.length) {
  if (strict) { console.log('No known-defect tests registered.'); process.exit(0); }
  throw new Error('No test files found');
}
const result = spawnSync(process.execPath, ['--import', 'tsx', '--test', ...(strict ? ['--test-name-pattern=BUG-'] : []), ...selected], {
  cwd: root, stdio: 'inherit', env: { ...process.env, TZ: process.env.TZ ?? 'Australia/Perth',
    ...(strict ? { MAMACARE_STRICT_KNOWN_BUGS: '1' } : {}) },
});
if (result.error) throw result.error;
process.exitCode = result.status ?? 1;
