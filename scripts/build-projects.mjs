// Builds every project under projects/ and publishes it to dist/projects/<name>/.
// Run after `astro build` (the root build empties dist/ first) — see `npm run build:all`.
import { execSync } from 'node:child_process';
import { cpSync, existsSync, mkdirSync, readdirSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const projectsDir = join(root, 'projects');
const outDir = join(root, 'dist', 'projects');

if (!existsSync(join(root, 'dist'))) {
  throw new Error('dist/ not found — run `astro build` before building projects.');
}

const names = existsSync(projectsDir)
  ? readdirSync(projectsDir).filter((n) => statSync(join(projectsDir, n)).isDirectory())
  : [];

for (const name of names) {
  const dir = join(projectsDir, name);
  const target = join(outDir, name);
  mkdirSync(target, { recursive: true });

  if (existsSync(join(dir, 'package.json'))) {
    console.log(`\n[projects] building ${name}`);
    const install = existsSync(join(dir, 'package-lock.json')) ? 'npm ci' : 'npm install';
    execSync(install, { cwd: dir, stdio: 'inherit' });
    execSync('npm run build', { cwd: dir, stdio: 'inherit' });
    cpSync(join(dir, 'dist'), target, { recursive: true });
  } else {
    console.log(`\n[projects] copying static project ${name}`);
    cpSync(dir, target, { recursive: true });
  }
}

console.log(`\n[projects] published ${names.length} project(s) to dist/projects/`);
