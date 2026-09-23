import { execFileSync } from 'node:child_process';

export function readSnapshot(root, ref = null) {
  const records = execFileSync('git', ref ? ['ls-tree', '-rz', ref] : ['ls-files', '--stage', '-z'], { cwd: root, maxBuffer: 32 * 1024 * 1024 })
    .toString().split('\0').filter(Boolean).map(record => {
      const tab = record.indexOf('\t');
      const [mode, second, third] = record.slice(0, tab).split(' ');
      return { mode, hash: ref ? third : second, name: record.slice(tab + 1) };
    });
  if (!records.length) return new Map();
  const output = execFileSync('git', ['cat-file', '--batch'], { cwd: root, input: records.map(r => r.hash).join('\n') + '\n', maxBuffer: 1024 * 1024 * 1024 });
  let offset = 0;
  const result = new Map();
  for (const record of records) {
    const end = output.indexOf(10, offset);
    const header = output.subarray(offset, end).toString().split(' ');
    if (header[1] !== 'blob') throw new Error(`Unsupported git object: ${record.name}`);
    const length = Number(header[2]);
    const bytes = Buffer.from(output.subarray(end + 1, end + 1 + length));
    Object.defineProperty(bytes, 'gitMode', { value: record.mode });
    result.set(record.name, bytes);
    offset = end + 1 + length + 1;
  }
  return result;
}
