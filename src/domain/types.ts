export type AgentName =
  | 'orchestrator'
  | 'requirements'
  | 'test-strategy'
  | 'test-design'
  | 'automation'
  | 'execution'
  | 'failure-analysis'
  | 'defect-management'
  | 'quality-reporting';

export type Priority = 'P0' | 'P1' | 'P2' | 'P3';
export type Severity = 'blocker' | 'critical' | 'major' | 'minor' | 'trivial';
export type ExecutionStatus = 'passed' | 'failed' | 'skipped' | 'blocked';
export type FailureCategory = 'product-defect' | 'automation-defect' | 'environment' | 'test-data' | 'flaky' | 'unknown';

export interface Requirement {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  acceptanceCriteria: AcceptanceCriterion[];
  businessRules: string[];
  nonFunctionalRequirements: string[];
  risks: string[];
  source?: string;
}

export interface AcceptanceCriterion {
  id: string;
  given: string;
  when: string;
  then: string;
}

export interface TestCase {
  id: string;
  requirementIds: string[];
  title: string;
  type: 'functional' | 'negative' | 'boundary' | 'integration' | 'regression' | 'security' | 'performance';
  priority: Priority;
  preconditions: string[];
  testData: Record<string, unknown>;
  steps: { action: string; expected: string }[];
  automationCandidate: boolean;
}

export interface ExecutionResult {
  id: string;
  testCaseId: string;
  status: ExecutionStatus;
  startedAt: string;
  endedAt: string;
  durationMs: number;
  environment: string;
  evidence: string[];
  error?: string;
}

export interface FailureAnalysis {
  executionId: string;
  category: FailureCategory;
  confidence: number;
  rootCause: string;
  evidence: string[];
  recommendedAction: string;
}

export interface Defect {
  id: string;
  title: string;
  severity: Severity;
  priority: Priority;
  status: 'new' | 'triaged' | 'in-progress' | 'ready-for-retest' | 'closed' | 'rejected' | 'duplicate';
  requirementIds: string[];
  testCaseIds: string[];
  executionIds: string[];
  environment: string;
  reproductionSteps: string[];
  expected: string;
  actual: string;
  evidence: string[];
  suspectedRootCause?: string;
  duplicateOf?: string;
}

export interface QualityRunRequest {
  projectId: string;
  source: { type: 'text' | 'file' | 'url'; value: string };
  targetEnvironment: string;
  executeAfterGeneration?: boolean;
  openDefects?: boolean;
}

export interface AgentContext {
  request: QualityRunRequest;
  requirements: Requirement[];
  testCases: TestCase[];
  executions: ExecutionResult[];
  analyses: FailureAnalysis[];
  defects: Defect[];
}
