import { readFile } from 'node:fs/promises';
import { StlcOrchestrator } from '../src/runtime/orchestrator.mjs';

const arg = (name, fallback) => {
  const index = process.argv.indexOf(`--${name}`);
  return index >= 0 ? process.argv[index + 1] : fallback;
};

const inputPath = arg('input', 'data/requirements/example.md');
const projectId = arg('project', 'demo-project');
const execute = process.argv.includes('--execute');
const openDefects = process.argv.includes('--open-defects');

const source = await readFile(inputPath, 'utf8');
const orchestrator = new StlcOrchestrator();
const result = await orchestrator.run({
  projectId,
  source: { type: 'file', value: source },
  targetEnvironment: process.env.TEST_ENV || 'local',
  executeAfterGeneration: execute,
  openDefects,
  grep: process.env.PW_GREP,
  playwrightProject: process.env.PW_PROJECT,
  workers: process.env.PW_WORKERS
});

console.log(JSON.stringify({ projectId, generatedTestCases: result.testCases?.length || 0, executed: result.executionResults?.length || 0, defects: result.defects?.defects?.length || 0 }, null, 2));
