import { execFileSync, spawnSync } from 'node:child_process';

if (process.argv[2] === 'branch') {
  const branch = execFileSync('git', ['branch','--show-current'], {encoding:'utf8'}).trim();
  if (branch === 'ruby-main' || branch === 'main') {
    throw new Error('Commit on a review branch, not the production branch.');
  }
} else if (process.argv[2] === 'secrets') {
  const available = spawnSync(process.platform === 'win32' ? 'where.exe' : 'which', ['ggshield'], {stdio:'ignore'});
  if (available.status !== 0) {
    console.log('ggshield is not installed; optional secret scan skipped.');
  } else {
    const scan = spawnSync('ggshield', ['secret','scan','pre-commit'], {stdio:'inherit',shell:process.platform === 'win32'});
    process.exit(scan.status ?? 1);
  }
} else {
  throw new Error('Unknown pre-commit check');
}
