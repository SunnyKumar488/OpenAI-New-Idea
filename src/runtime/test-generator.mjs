import fs from 'node:fs/promises';
import path from 'node:path';

export async function generatePlaywrightSpecs(projectId, testCases, { outputRoot = '.runtime' } = {}) {
  const generated = [];
  for (const tc of testCases) {
    if (!tc.automationCandidate) continue;
    const dir = path.join(outputRoot, projectId, 'generated-tests');
    await fs.mkdir(dir, { recursive: true });
    const fileName = `${tc.id}.spec.ts`;
    const filePath = path.join(dir, fileName);
    const code = renderSpec(tc);
    await fs.writeFile(filePath, code, 'utf8');
    generated.push({ testCaseId: tc.id, filePath, framework: 'playwright', status: 'generated' });
  }
  return generated;
}

function renderSpec(tc) {
  const title = escapeText(tc.title);
  const steps = (tc.steps || []).map((s, i) => {
    const action = escapeText(s.action);
    const expected = escapeText(s.expected);
    return `  await test.step(${JSON.stringify(`Step ${i + 1}: ${action}`)}, async () => {\n    // Expected: ${expected}\n    // TODO: replace this placeholder with application-specific interaction/assertion.\n  });`;
  }).join('\n');
  return `import { test, expect } from '@playwright/test';\n\n// Generated from ${tc.id}. Application-specific locators and assertions require review.\ntest('${title}', async ({ page }) => {\n${steps}\n  expect(true).toBeTruthy();\n});\n`;
}

function escapeText(value) {
  return String(value ?? '').replaceAll("'", "\\'").replaceAll('\n', ' ');
}
