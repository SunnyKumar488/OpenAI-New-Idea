import fs from 'node:fs/promises';
import { StlcOrchestrator } from './orchestrator.mjs';
import { runGeneratedTests } from './pipeline.mjs';
import { runPlaywright } from './playwright-executor.mjs';

export async function executeRequirementFile(sourcePath, {
  projectId = process.env.PROJECT_ID || 'demo',
  environment = process.env.TEST_ENV || 'local',
  openDefects = process.env.OPEN_DEFECTS === 'true'
} = {}) {
  const source = await fs.readFile(sourcePath, 'utf8');
  const request = {
    projectId,
    source: { type: 'file', value: source },
    targetEnvironment: environment,
    executeAfterGeneration: true,
    openDefects
  };

  const orchestrator = new StlcOrchestrator();
  const requirements = await orchestrator.analyzeRequirements(request);
  const testArtifacts = await orchestrator.generateTests(request, requirements);
  const automation = await orchestrator.planAutomation(request, requirements, testArtifacts.testCases);
  const execution = await runGeneratedTests({
    projectId,
    testCases: testArtifacts.testCases,
    executor: runPlaywright,
    environment
  });
  const failures = await orchestrator.analyzeFailures(request, execution.executions);
  const defects = openDefects ? await orchestrator.manageDefects(request, failures) : { defects: [], dedupCandidates: [] };
  const report = await orchestrator.report(request, {
    requirements,
    ...testArtifacts,
    automation,
    executions: execution.executions,
    failures,
    defects
  });

  return { requirements, testCases: testArtifacts.testCases, automation, ...execution, failures, defects, report };
}
