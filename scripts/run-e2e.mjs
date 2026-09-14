#!/usr/bin/env node
import { executeRequirementFile } from '../src/runtime/e2e-pipeline.mjs';

const sourcePath = process.argv[2];
if (!sourcePath) {
  console.error('Usage: node scripts/run-e2e.mjs <requirement-file>');
  process.exit(2);
}

try {
  const result = await executeRequirementFile(sourcePath);
  console.log(JSON.stringify({
    testCases: result.testCases.length,
    generated: result.generated.length,
    executions: result.executions.length,
    passed: result.executions.filter((r) => r.status === 'passed').length,
    failed: result.executions.filter((r) => r.status === 'failed').length,
    defects: result.defects.defects?.length || 0,
    report: result.report
  }, null, 2));
  process.exit(result.executions.some((r) => r.status === 'failed') ? 1 : 0);
} catch (error) {
  console.error(error.stack || error.message);
  process.exit(1);
}
