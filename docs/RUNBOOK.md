# Runbook

## Generate STLC artifacts locally

```bash
npm install
npx playwright install --with-deps
export OPENAI_API_KEY=your-key
export OPENAI_MODEL=gpt-5.6
export PROJECT_ID=demo
node src/runtime/cli.mjs generate data/sample-requirement.md
```

Expected outputs:

```text
.runtime/demo/requirements.json
.runtime/demo/test-strategy.json
.runtime/demo/test-cases.json
.runtime/demo/automation.json
.runtime/demo/quality-report.json
```

## Run E2E tests

```bash
npm run test:e2e
```

The existing Playwright configuration retains failure screenshots, video, and traces. Test artifacts can then be fed into the Failure Analysis and Defect Management agents.

## Defect publishing

Enable GitHub issue publishing only in a controlled CI environment. The adapter requires `GITHUB_TOKEN`, `GITHUB_OWNER`, and `GITHUB_REPO`. Use least-privilege credentials and require human review for high-severity issues before publishing in production workflows.

## Production hardening

Use a persistent database or artifact store instead of the local `.runtime` directory, add authentication and authorization to an HTTP API, add idempotency keys for generation requests, validate all LLM outputs against the JSON schemas, and add approval gates before external defect creation or release decisions.
