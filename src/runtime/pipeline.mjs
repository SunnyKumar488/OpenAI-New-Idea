import { generatePlaywrightSpecs } from './test-generator.mjs';
import { parsePlaywrightResults } from './result-parser.mjs';

export async function runGeneratedTests({ projectId, testCases, executor, environment, outputRoot = '.runtime' }) {
  const generated = await generatePlaywrightSpecs(projectId, testCases, { outputRoot });
  if (!generated.length) return { generated, rawExecution: null, executions: [] };

  const rawExecution = await executor({ workers: 2, project: 'chromium', reportFile: `${outputRoot}/${projectId}/playwright-results.json` });
  const executions = parsePlaywrightResults(rawExecution.report, { environment });
  return { generated, rawExecution, executions };
}
