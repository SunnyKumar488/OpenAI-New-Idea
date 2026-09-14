export function parsePlaywrightResults(report, { environment = 'unknown' } = {}) {
  const executions = [];
  walk(report?.suites || [], executions, environment);
  return executions;
}

function walk(suites, executions, environment) {
  for (const suite of suites) {
    for (const spec of suite.specs || []) {
      for (const test of spec.tests || []) {
        const results = test.results || [];
        const last = results.at(-1) || {};
        const status = mapStatus(test.status, last.status);
        executions.push({
          id: `RUN-${stableId(spec.id || spec.title || test.testId, last.startTime || '')}`,
          testCaseId: extractTestCaseId(spec.title, spec.id, test.testId),
          status,
          startedAt: last.startTime || new Date().toISOString(),
          endedAt: last.endTime || last.startTime || new Date().toISOString(),
          durationMs: Number(last.duration || 0),
          environment,
          evidence: collectEvidence(last),
          error: last.error?.message || last.error?.stack
        });
      }
    }
    walk(suite.suites || [], executions, environment);
  }
}

function mapStatus(testStatus, resultStatus) {
  const value = resultStatus || testStatus;
  if (value === 'passed') return 'passed';
  if (value === 'skipped' || value === 'pending') return 'skipped';
  if (value === 'interrupted') return 'blocked';
  return 'failed';
}

function collectEvidence(result) {
  return (result.attachments || []).map((a) => a.path || a.name).filter(Boolean);
}

function extractTestCaseId(...values) {
  const match = values.map(String).map((v) => v.match(/TC-\d{3,}/i)).find(Boolean);
  return match ? match[0].toUpperCase() : 'TC-UNKNOWN';
}

function stableId(...values) {
  let h = 2166136261;
  for (const value of values.join('|')) { h ^= value.charCodeAt(0); h = Math.imul(h, 16777619); }
  return (h >>> 0).toString(16).padStart(8, '0');
}
