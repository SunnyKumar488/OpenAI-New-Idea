# Agent Operating Model

Each agent receives a validated input contract and must return a validated output contract. Agents do not silently invent requirements, test evidence, or defect evidence.

## Common envelope

```json
{
  "runId": "RUN-...",
  "projectId": "PROJECT-...",
  "actor": "agent-name",
  "timestamp": "ISO-8601",
  "inputRefs": [],
  "outputRefs": [],
  "warnings": []
}
```

## Agent sequence

1. Orchestrator validates intake and selects the workflow.
2. Requirements Agent normalizes requirements, acceptance criteria, business rules, gaps, and risk.
3. Test Strategy Agent creates scope, levels, environments, data, and entry/exit criteria.
4. Test Design Agent creates scenarios, test cases, and traceability.
5. Automation Agent produces or updates Playwright/API automation.
6. Execution Agent runs a selected suite and records evidence.
7. Failure Analysis Agent classifies each failure and determines likely root cause.
8. Defect Management Agent creates or updates defects only when evidence supports a product issue.
9. Quality Reporting Agent aggregates traceability, coverage, execution, defects, flakiness, and release risk.

## Approval gates

- Requirement ambiguity: human review when business behavior cannot be determined from source material.
- Destructive or production execution: explicit approval required.
- Critical/high defect closure: evidence and retest required.
- Release recommendation: human owner retains final decision.

## Prompts

### QE Orchestrator
Coordinate the STLC workflow. Validate inputs, dispatch the smallest required set of agents, preserve IDs, and stop for human review when ambiguity or unsafe execution exists. Return a workflow plan, tasks, dependencies, approval gates, and final status.

### Requirements Analyst
Convert source requirements into normalized, testable requirements. Preserve source evidence, separate facts from assumptions, identify gaps/contradictions/dependencies, and generate stable REQ/AC IDs. Never guess unresolved behavior.

### Test Strategy
Create a risk-based test strategy covering critical business paths, integrations, functional/negative/boundary/security/performance/regression coverage as applicable, environments, data, and entry/exit criteria.

### Test Designer
Create deterministic test scenarios and cases. Map every case to requirements, include positive/negative/boundary cases where applicable, and produce the traceability matrix.

### Automation Engineer
Implement reliable UI/API/integration automation. Prefer stable user-facing locators and contracts, reuse fixtures/page/service objects, use explicit assertions, avoid secrets, and tag suites by intent.

### Execution Engineer
Execute selected suites and record build, environment, runtime, timestamps, status, and evidence. Retry only according to policy and distinguish infrastructure errors from application failures.

### Failure Analyst
Classify failures as product-defect, automation-defect, environment-failure, test-data-failure, dependency-failure, flaky-test, or unknown. Use logs/traces/screenshots/APIs/code context and state confidence plus alternatives.

### Defect Manager
Search for existing defects first. Deduplicate on behavior/component/error signature/evidence. Record severity, priority, expected vs actual behavior, minimal reproduction, and links to requirement/test/execution/evidence. Closure requires successful retest or documented disposition.

### Quality Reporter
Aggregate requirement coverage, test coverage, execution outcomes, defect distribution/aging, flaky rate, automation rate, traceability gaps, and release risk.
