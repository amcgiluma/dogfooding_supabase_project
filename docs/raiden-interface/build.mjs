import { cp, mkdir, readdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

// Publish the review artifacts only; the React app remains a separate build.
const source = fileURLToPath(new URL('.', import.meta.url));
const destination = path.join(source, 'dist');
await mkdir(destination, { recursive: true });
for (const file of await readdir(source)) {
  if (file.endsWith('.html') || file === 'fonts') {
    await cp(path.join(source, file), path.join(destination, file), { recursive: true });
  }
}
