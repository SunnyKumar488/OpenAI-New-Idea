# STLC Automated Framework

AI-assisted software quality engineering framework for requirements analysis, test design, end-to-end automation, execution, failure analysis, defect management, and release reporting.

## Goals

- Convert requirements into testable acceptance criteria.
- Maintain traceability from requirement to test and defect.
- Generate maintainable UI/API/integration tests.
- Classify failures before opening defects.
- Standardize defect creation, deduplication, triage, retest, and closure.
- Produce release-oriented quality evidence.

## Agent lifecycle

`Requirement -> Acceptance Criteria -> Test Strategy -> Test Scenario -> Test Case -> Automation -> Execution -> Failure Analysis -> Defect -> Retest -> Closure -> Report`

## Repository layout

```text
agents/             Agent instructions and contracts
config/              Runtime configuration
schemas/             Shared JSON contracts
src/                 Orchestration and shared domain models
tests/               Playwright/API examples and fixtures
data/                Sample project artifacts
defects/             Defect templates and examples
reports/             Report definitions
.github/             CI and issue templates
```

## Quick start

1. Install Node.js 20+.
2. Run `npm install`.
3. Run `npx playwright install --with-deps`.
4. Copy `.env.example` to `.env` and configure the target application.
5. Run `npm test` for the framework checks.
6. Run `npm run test:e2e` for the example E2E suite.

Agent execution is intentionally provider-neutral. The prompts and schemas can be used with an LLM runtime, CI job, or an orchestration service.

## Design principles

- Structured outputs over free-form agent handoffs.
- Evidence before defect creation.
- Idempotent artifact generation.
- Requirement traceability is mandatory.
- Automation code must be deterministic, readable, and reviewable.
- Secrets never belong in source control.
- Human approval remains available at requirement, release-risk, and defect-severity gates.

## Initial implementation

The current scaffold includes eight collaborating agents: Orchestrator, Requirements, Test Strategy, Test Design, Automation, Execution, Failure Analysis, Defect Management, and Quality Reporting.
