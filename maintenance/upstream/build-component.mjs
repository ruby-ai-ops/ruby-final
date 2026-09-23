import { spawnSync } from 'node:child_process';

const commands = {
  front: [['front','tsgo'],['front','build:workers'],['front','build:temporal-bundles'],['front','build:migrate']],
  'front-api': [['front-api','tsgo'],['front-api','build'],['front-api','check:bundled-deps']],
  'front-spa': [['front-spa','tsgo'],['front-spa','build']],
  marketing: [['marketing','tsgo'],['marketing','build'],['marketing','demo:test'],['marketing','test:workspace-demo-host']],
  connectors: [['connectors','build'],['connectors','build:temporal-bundles']],
  extension: [['extension','tsgo'],['extension','package:chrome:production']],
  viz: [['viz','build'],['viz','test']],
  cli: [['cli/ruby-cli','build:prod']],
};
const component = process.argv[2];
if (!Object.hasOwn(commands, component)) throw new Error('Unknown build component');
for (const [workspace, script] of commands[component]) {
  const result = spawnSync('npm', ['-w',workspace,'run',script], {stdio:'inherit',shell:process.platform === 'win32'});
  if (result.status !== 0) process.exit(result.status ?? 1);
}
