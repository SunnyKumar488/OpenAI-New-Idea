import fs from 'node:fs/promises';

export class LlmClient {
  constructor({ apiKey = process.env.OPENAI_API_KEY, model = process.env.OPENAI_MODEL || 'gpt-5.6', baseUrl = process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1/responses', mock = process.env.MOCK_LLM === 'true' } = {}) {
    this.apiKey = apiKey;
    this.model = model;
    this.baseUrl = baseUrl;
    this.mock = mock;
  }

  async completeJson({ system, input, schemaName = 'agent_output' }) {
    if (this.mock) return mockOutput(schemaName, input);
    if (!this.apiKey) throw new Error('OPENAI_API_KEY is required for live agent execution (or set MOCK_LLM=true).');
    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers: { authorization: `Bearer ${this.apiKey}`, 'content-type': 'application/json' },
      body: JSON.stringify({
        model: this.model,
        input: [
          { role: 'system', content: [{ type: 'input_text', text: system }] },
          { role: 'user', content: [{ type: 'input_text', text: input }] }
        ],
        text: { format: { type: 'json_schema', name: schemaName, strict: true, schema: { type: 'object', additionalProperties: true } } }
      })
    });
    if (!response.ok) throw new Error(`LLM request failed: ${response.status} ${await response.text()}`);
    const body = await response.json();
    const text = body.output?.flatMap((item) => item.content || []).find((part) => part.type === 'output_text')?.text;
    if (!text) throw new Error('LLM response did not contain output_text.');
    return JSON.parse(text);
  }
}

function mockOutput(schemaName, input) {
  if (schemaName === 'requirements_output') return { requirements: [{ id: 'REQ-001', title: 'Authentication', description: String(input).slice(0, 500), priority: 'P1', acceptanceCriteria: [{ id: 'AC-001', given: 'A registered user', when: 'Valid credentials are submitted', then: 'Access is granted' }, { id: 'AC-002', given: 'A registered user', when: 'An invalid password is submitted', then: 'Access is denied' }], businessRules: [], nonFunctionalRequirements: [], risks: ['Authentication failure blocks the primary journey.'] }] };
  if (schemaName === 'test_strategy_output') return { strategy: { scope: ['Authentication'], levels: ['E2E', 'API'], regression: ['Authentication smoke'], environments: ['local'] }, risks: [] };
  if (schemaName === 'test_design_output') return { testCases: [{ id: 'TC-001', requirementIds: ['REQ-001'], title: 'Valid login succeeds', type: 'functional', priority: 'P1', preconditions: ['Registered user exists'], testData: {}, steps: [{ action: 'Submit valid credentials', expected: 'User reaches authenticated state' }], automationCandidate: true }, { id: 'TC-002', requirementIds: ['REQ-001'], title: 'Invalid password is rejected', type: 'negative', priority: 'P1', preconditions: ['Registered user exists'], testData: {}, steps: [{ action: 'Submit invalid password', expected: 'Access denied message is shown' }], automationCandidate: true }] };
  if (schemaName === 'automation_output') return { automationPlans: [{ testCaseId: 'TC-001', framework: 'playwright', specPath: 'tests/e2e/REQ-001/TC-001.spec.ts', status: 'planned' }, { testCaseId: 'TC-002', framework: 'playwright', specPath: 'tests/e2e/REQ-001/TC-002.spec.ts', status: 'planned' }] };
  if (schemaName === 'failure_analysis_output') return { executionId: 'RUN-MOCK', category: 'unknown', confidence: 0, rootCause: 'No live execution evidence supplied.', evidence: [], recommendedAction: 'Run the generated suite and provide its evidence.' };
  if (schemaName === 'defect_management_output') return { defects: [], dedupCandidates: [] };
  if (schemaName === 'quality_reporting_output') return { metrics: { requirements: 1, testCases: 2, executions: 0, defects: 0 }, risks: ['Execution has not been performed.'], recommendation: 'Generate and execute the automation before release assessment.' };
  return { status: 'mock', inputLength: String(input).length };
}
