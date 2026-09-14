import { spawn } from 'node:child_process';

export function runPlaywright({ grep, project, workers } = {}) {
  return new Promise((resolve, reject) => {
    const args = ['playwright', 'test', '--reporter=json'];
    if (grep) args.push('--grep', grep);
    if (project) args.push('--project', project);
    if (workers) args.push('--workers', String(workers));
    const child = spawn('npx', args, { shell: true, env: process.env });
    let stdout = '';
    let stderr = '';
    child.stdout.on('data', (chunk) => { stdout += chunk.toString(); });
    child.stderr.on('data', (chunk) => { stderr += chunk.toString(); });
    child.on('error', reject);
    child.on('close', (code) => resolve({ code, stdout, stderr }));
  });
}
