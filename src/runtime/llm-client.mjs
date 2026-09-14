import fs from 'node:fs/promises';

export class LlmClient {
  constructor({ apiKey = process.env.OPENAI_API_KEY, model = process.env.OPENAI_MODEL || 'gpt-5.6', baseUrl = process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1/responses' } = {}) {
    this.apiKey = apiKey;
    this.model = model;
    this.baseUrl = baseUrl;
  }

  async completeJson({ system, input, schemaName = 'agent_output' }) {
    if (!this.apiKey) {
      throw new Error('OPENAI_API_KEY is required for live agent execution.');
    }
    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers: { authorization: `Bearer ${this.apiKey}`, 'content-type': 'application/json' },
      body: JSON.stringify({
        model: this.model,
        input: [
          { role: 'system', content: [{ type: 'input_text', text: system }] },
          { role: 'user', content: [{ type: 'input_text', text: input }] }
        ],
        text: { format: { type: 'json_schema', name: schemaName, strict: true, schema: { type: 'object', additionalProperties: true } } }
      })
    });
    if (!response.ok) throw new Error(`LLM request failed: ${response.status} ${await response.text()}`);
    const body = await response.json();
    const text = body.output?.flatMap((item) => item.content || []).find((part) => part.type === 'output_text')?.text;
    if (!text) throw new Error('LLM response did not contain output_text.');
    return JSON.parse(text);
  }

  static async readInput(path) {
    return fs.readFile(path, 'utf8');
  }
}
