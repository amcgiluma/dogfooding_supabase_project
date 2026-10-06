import { cp, mkdir, readdir, rm } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

// Package only design previews, keeping app source and review reports private.
const source = fileURLToPath(new URL('.', import.meta.url));
const destination = path.join(source, 'dist');
await rm(destination, { recursive: true, force: true });
await mkdir(destination, { recursive: true });
for (const entry of await readdir(source)) {
  if (/\.(html|css|js)$/.test(entry) || entry === 'fonts') {
    await cp(path.join(source, entry), path.join(destination, entry), { recursive: true });
  }
}
