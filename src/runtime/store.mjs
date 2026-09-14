import fs from 'node:fs/promises';
import path from 'node:path';

export class ArtifactStore {
  constructor(root = process.env.ARTIFACT_ROOT || '.runtime') { this.root = root; }
  async put(projectId, kind, value) {
    const dir = path.join(this.root, projectId);
    await fs.mkdir(dir, { recursive: true });
    const file = path.join(dir, `${kind}.json`);
    await fs.writeFile(file, JSON.stringify(value, null, 2), 'utf8');
    return file;
  }
  async get(projectId, kind) {
    const file = path.join(this.root, projectId, `${kind}.json`);
    return JSON.parse(await fs.readFile(file, 'utf8'));
  }
}
