# Closed-loop execution

The framework now has an executable path:

1. Read a requirement file.
2. Requirements Agent produces structured requirements and acceptance criteria.
3. Test Strategy Agent produces risk/scope guidance.
4. Test Design Agent produces requirement-linked test cases.
5. Automation Agent produces automation plans.
6. The generator emits Playwright TypeScript spec scaffolds for automation candidates.
7. Playwright runs with JSON reporting, screenshots, traces, and video configured by `playwright.config.ts`.
8. The result parser converts individual Playwright test results into execution records with status, duration, error, and evidence.
9. Failed executions are sent to Failure Analysis.
10. Only analyzed product defects are sent to Defect Management when defect opening is enabled.
11. Quality Reporting receives the full evidence-backed context.

## Run

```bash
npm install
npx playwright install
export OPENAI_API_KEY="..."
export OPENAI_MODEL="gpt-5.6"
export PROJECT_ID="demo"
export TEST_ENV="local"
node scripts/run-e2e.mjs data/sample-requirement.md
```

Set `MOCK_LLM=true` to exercise the plumbing without a model API call.

## Important review gate

Generated Playwright files are deliberately marked as application-specific scaffolds. The agent can produce a correct test intent from a requirement, but reliable selectors, authentication setup, test data, and domain-specific assertions must be grounded in the target application's actual UI/API contract before a test is accepted into the release suite.

## Next integrations

- Jira/Azure DevOps adapter for defect lifecycle synchronization.
- GitHub pull-request adapter for generated-test review.
- API test generator and OpenAPI ingestion.
- Persistent database store for multi-user projects.
- Web API and dashboard over the same orchestrator.
