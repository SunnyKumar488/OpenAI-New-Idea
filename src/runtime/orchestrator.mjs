import { AgentRegistry } from './agent-registry.mjs';
import { ArtifactStore } from './store.mjs';
import { runPlaywright } from './playwright-executor.mjs';

const id = (prefix, n) => `${prefix}-${String(n).padStart(3, '0')}`;

export class StlcOrchestrator {
  constructor({ agents = new AgentRegistry(), store = new ArtifactStore(), executor = runPlaywright } = {}) {
    this.agents = agents;
    this.store = store;
    this.executor = executor;
  }

  async analyzeRequirements(request) {
    const requirements = await this.agents.run('requirements', request.source.value);
    await this.store.put(request.projectId, 'requirements', requirements);
    return requirements;
  }

  async generateTests(request, requirements) {
    const strategy = await this.agents.run('test-strategy', { request, requirements });
    await this.store.put(request.projectId, 'test-strategy', strategy);
    const design = await this.agents.run('test-design', { request, requirements, strategy });
    const cases = (design.testCases || []).map((tc, i) => ({ ...tc, id: tc.id || id('TC', i + 1) }));
    await this.store.put(request.projectId, 'test-cases', { testCases: cases });
    return { strategy, testCases: cases };
  }

  async planAutomation(request, requirements, testCases) {
    const result = await this.agents.run('automation', { request, requirements, testCases });
    await this.store.put(request.projectId, 'automation', result);
    return result;
  }

  async execute(request) {
    const startedAt = new Date().toISOString();
    const raw = await this.executor({ grep: request.grep, project: request.playwrightProject, workers: request.workers });
    const endedAt = new Date().toISOString();
    const result = { id: `RUN-${Date.now()}`, status: raw.code === 0 ? 'passed' : 'failed', startedAt, endedAt, environment: request.targetEnvironment, raw }; 
    await this.store.put(request.projectId, 'execution', result);
    return [result];
  }

  async analyzeFailures(request, executionResults) {
    const analyses = [];
    for (const execution of executionResults) {
      if (execution.status !== 'failed') continue;
      analyses.push(await this.agents.run('failure-analysis', { request, execution }));
    }
    await this.store.put(request.projectId, 'failure-analysis', { analyses });
    return analyses;
  }

  async manageDefects(request, failures) {
    if (!failures.length) {
      const empty = { defects: [], dedupCandidates: [] };
      await this.store.put(request.projectId, 'defects', empty);
      return empty;
    }
    const result = await this.agents.run('defect-management', { request, failures });
    await this.store.put(request.projectId, 'defects', result);
    return result;
  }

  async report(request, context) {
    const report = await this.agents.run('quality-reporting', { request, ...context });
    await this.store.put(request.projectId, 'quality-report', report);
    return report;
  }

  async run(request) {
    const requirements = await this.analyzeRequirements(request);
    const testArtifacts = await this.generateTests(request, requirements);
    const automation = await this.planAutomation(request, requirements, testArtifacts.testCases);
    const executionResults = request.executeAfterGeneration ? await this.execute(request) : [];
    const failures = executionResults.length ? await this.analyzeFailures(request, executionResults) : [];
    const defects = request.openDefects ? await this.manageDefects(request, failures) : { defects: [], dedupCandidates: [] };
    const report = await this.report(request, { requirements, ...testArtifacts, automation, executionResults, failures, defects });
    return { requirements, ...testArtifacts, automation, executionResults, failures, defects, report };
  }
}
