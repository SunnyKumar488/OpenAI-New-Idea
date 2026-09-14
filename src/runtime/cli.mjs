import { readFile } from 'node:fs/promises';
import { StlcOrchestrator } from './orchestrator.mjs';

const command = process.argv[2] || 'help';
const inputPath = process.argv[3];

if (command === 'help') {
  console.log('Usage: node src/runtime/cli.mjs generate <requirements-file>');
  process.exit(0);
}

if (!inputPath) throw new Error('A requirements file path is required.');
const source = await readFile(inputPath, 'utf8');
const request = {
  projectId: process.env.PROJECT_ID || 'default',
  source: { type: 'file', value: source },
  targetEnvironment: process.env.TARGET_ENV || 'local',
  executeAfterGeneration: false,
  openDefects: process.env.OPEN_DEFECTS === 'true'
};
const result = await new StlcOrchestrator().run(request);
console.log(JSON.stringify(result, null, 2));
