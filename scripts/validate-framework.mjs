import { readFile } from 'node:fs/promises';

const required = [
  'README.md',
  'agents/prompts.md',
  'schemas/requirement.schema.json',
  'schemas/test-case.schema.json',
  'schemas/test-execution.schema.json',
  'schemas/defect.schema.json',
  'config/framework.json',
  'package.json',
  'playwright.config.ts',
  'tests/e2e/smoke.spec.ts'
];

for (const path of required) {
  await readFile(path, 'utf8');
}
console.log(`Framework structure validated: ${required.length} required files present.`);
