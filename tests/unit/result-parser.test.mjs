import assert from 'node:assert/strict';
import { parsePlaywrightResults } from '../../src/runtime/result-parser.mjs';

const report = {
  suites: [{
    specs: [{
      id: 'spec-1',
      title: 'TC-101 Valid login succeeds',
      tests: [{
        testId: 't1',
        status: 'failed',
        results: [{
          status: 'failed',
          startTime: '2026-09-14T18:00:00.000Z',
          endTime: '2026-09-14T18:00:01.500Z',
          duration: 1500,
          error: { message: 'Expected dashboard' },
          attachments: [{ name: 'screenshot', path: 'test-results/login.png' }]
        }]
      }]
    }]
  }]
};

const [result] = parsePlaywrightResults(report, { environment: 'ci' });
assert.equal(result.testCaseId, 'TC-101');
assert.equal(result.status, 'failed');
assert.equal(result.durationMs, 1500);
assert.deepEqual(result.evidence, ['test-results/login.png']);
assert.equal(result.error, 'Expected dashboard');
console.log('result-parser: ok');
