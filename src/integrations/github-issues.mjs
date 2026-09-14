export class GitHubIssuesAdapter {
  constructor({ token = process.env.GITHUB_TOKEN, owner, repo } = {}) {
    this.token = token;
    this.owner = owner || process.env.GITHUB_OWNER;
    this.repo = repo || process.env.GITHUB_REPO;
  }

  async createIssue(defect) {
    if (!this.token || !this.owner || !this.repo) {
      throw new Error('GITHUB_TOKEN, GITHUB_OWNER, and GITHUB_REPO are required.');
    }
    const body = [
      `## Actual`, defect.actual,
      '', '## Expected', defect.expected,
      '', '## Reproduction steps', ...defect.reproductionSteps.map((s, i) => `${i + 1}. ${s}`),
      '', '## Traceability', `Requirements: ${defect.requirementIds.join(', ') || 'n/a'}`, `Test cases: ${defect.testCaseIds.join(', ') || 'n/a'}`, `Executions: ${defect.executionIds.join(', ') || 'n/a'}`,
      '', '## Evidence', ...defect.evidence.map((e) => `- ${e}`)
    ].join('\n');
    const response = await fetch(`https://api.github.com/repos/${this.owner}/${this.repo}/issues`, {
      method: 'POST',
      headers: { authorization: `Bearer ${this.token}`, accept: 'application/vnd.github+json', 'content-type': 'application/json' },
      body: JSON.stringify({ title: `[${defect.severity}/${defect.priority}] ${defect.title}`, body, labels: ['defect'] })
    });
    if (!response.ok) throw new Error(`GitHub issue creation failed: ${response.status} ${await response.text()}`);
    return response.json();
  }
}
