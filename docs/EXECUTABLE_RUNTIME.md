# Executable runtime

## Live agent execution

The framework uses `src/runtime/llm-client.mjs` as a provider-neutral HTTP client. Set:

```text
OPENAI_API_KEY=...
OPENAI_MODEL=...
OPENAI_BASE_URL=https://api.openai.com/v1/responses
PROJECT_ID=my-project
TARGET_ENV=local
OPEN_DEFECTS=false
```

Then run:

```bash
node src/runtime/cli.mjs generate data/sample-requirement.md
```

Artifacts are written to `.runtime/<project-id>/` as JSON so later stages can consume them.

## Pipeline

1. Requirements agent produces normalized requirements and Given/When/Then acceptance criteria.
2. Test Strategy agent creates risk-based test scope.
3. Test Design agent produces traceable test cases.
4. Automation agent produces automation plans.
5. Playwright executor can run the repository's E2E suite.
6. Failure Analysis classifies execution failures.
7. Defect Management creates normalized defect objects and deduplication candidates.
8. Quality Reporting produces release-readiness metrics and risks.

## Integration boundary

External systems should be connected through adapters rather than embedded inside agents. Recommended adapters are GitHub Issues, Jira, Azure DevOps, TestRail, Slack/Teams notifications, and CI artifact storage. Keep credentials in the CI secret store or environment variables; never commit them.
