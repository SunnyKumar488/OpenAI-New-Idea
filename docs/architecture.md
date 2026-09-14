# Framework Architecture

## System flow

```text
Requirements / PRD / Story
          |
          v
Requirements Agent
          |
          v
Test Strategy Agent
          |
          v
Test Design Agent -----> Traceability Matrix
          |
          v
Automation Agent
          |
          v
Execution Agent -----> Evidence Store
          |
          v
Failure Analysis Agent
          |
      +---+---+
      |       |
   Product  Non-product
    defect    failure
      |         |
      v         v
Defect Agent   Fix/retry workflow
      |
      v
Retest
      |
      v
Quality Reporter -----> Release Risk
```

## Artifact IDs

- `REQ-*`: requirement
- `AC-*`: acceptance criterion
- `TS-*`: test scenario
- `TC-*`: test case
- `AUTO-*`: automation mapping
- `RUN-*`: execution
- `FAIL-*`: analyzed failure
- `DEF-*`: defect

## Traceability rules

A test case without a requirement link is a coverage gap. An automated test without a test case mapping is an automation governance gap. A defect without execution evidence requires manual review. A closed defect requires a retest reference unless explicitly waived.

## Integration boundaries

The core framework is provider-neutral. Adapters can be added for:

- Requirement sources: Jira, Azure DevOps, GitHub issues, documents.
- Defect systems: Jira, Azure DevOps, GitHub issues.
- Source control: GitHub.
- Test runtime: Playwright and API runners.
- CI/CD: GitHub Actions or another pipeline provider.
- LLM provider: any approved model/runtime that supports structured output.

## Security

Never place credentials in prompts, schemas, fixtures, or repository files. Use CI secrets/environment variables and redact sensitive evidence before persistence.
