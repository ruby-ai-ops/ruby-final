import fs from 'node:fs';

function update(name, transform) {
  const before = fs.readFileSync(name, 'utf8');
  const after = transform(before);
  if (before === after) return;
  const temporary = `${name}.ruby-rebrand-tmp`;
  fs.writeFileSync(temporary, after);
  for (let attempt = 0; ; attempt++) {
    try { fs.renameSync(temporary, name); break; }
    catch (error) {
      if (!['EPERM', 'EBUSY', 'EACCES', 'UNKNOWN'].includes(error.code) || attempt >= 20) throw error;
      Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 250);
    }
  }
}

update('front/lib/api/sandbox/image/registry.ts', text => {
  if (!text.includes('import { readSandboxArtifact }')) text = 'import { readSandboxArtifact } from "@app/lib/api/sandbox/image/artifacts";\n' + text;
  for (const [tool, version, release] of [['rbx','RBX_CLI_VERSION','rbx'], ['apply_patch','APPLY_PATCH_VERSION','apply-patch']]) {
    const start = text.indexOf('  .runCmd(\n    `curl -fsSL https://github.com/ruby-ai-ops/ruby-final/releases/download/' + release + '-v');
    if (start < 0) continue;
    const end = text.indexOf('\n  .registerTool(', start);
    if (end < 0) throw new Error('Cannot find sandbox tool boundary');
    text = text.slice(0, start) + `  .copy(() => readSandboxArtifact("${tool}", ${version}), "/opt/bin/${tool}", { user: "root" })\n  .runCmd("chown root:root /opt/bin/${tool} && chmod 755 /opt/bin/${tool}", { user: "root" })` + text.slice(end);
  }
  return text.replace('// Released via the "Release sandbox tool" GitHub Actions workflow.', '// Built by the manual sandbox-artifacts workflow and injected during assembly.');
});
update('front/lib/api/sandbox/image/registry.test.ts', text => text.replace('installs the current rbx CLI release', 'installs the built rbx CLI with root-owned executable permissions').replace(/        expect\.stringContaining\(\n          "https:\/\/github.com\/ruby-ai-ops\/ruby-final\/releases\/download\/rbx-v0.1.63\/rbx-linux-x86_64"\n        \),\n/, ''));
update('.github/actions/setup-node-deps/action.yml', text => text.replace('npm@11.10.0', 'npm@11.11.0'));
update('.gitignore', text => text.includes('/.artifacts/') ? text : text + '\n# Authenticated CI artifacts, injected during image assembly.\n/.artifacts/\n');
update('marketing/pages/_app.tsx', text => text.replace(/\/\/ Developer console recruitment message\.[\s\S]*?(?=export type NextPageWithLayout)/, '').replace(/const CONSOLE_MESSAGE_SHOWN_KEY = .*\n/, ''));
for (const browser of ['chrome','firefox']) {
  update(`extension/platforms/${browser}/webpack.config.ts`, text => text.replace(/  if \(!isDevelopment && !process\.env\.DATADOG_CLIENT_TOKEN\) \{[\s\S]*?\n  \}/, '  // Optional Ruby analytics: initialized by the runtime only when configured.'));
}
update('front/config/cors.ts', text => {
  text = text.replace(/  "chrome-extension:\/\/(?:okjldflokifdjecnhbmkdanjjbnmlihg|fnkfcndbgingjcbdhaofkcnhcjpljhdn)",\n/g, '');
  text = text.replaceAll('preview\\\\.ruby\\\\.tt', 'preview\\\\.ruby\\\\.ad');
  if (!text.includes('EnvironmentConfig')) text = 'import { EnvironmentConfig } from "@app/types/shared/utils/config";\n\n' + text;
  if (!text.includes('RUBY_CHROME_EXTENSION_IDS')) text = text.replace('    STATIC_ALLOWED_ORIGINS.includes(origin as StaticAllowedOriginType) ||', '    STATIC_ALLOWED_ORIGINS.includes(origin as StaticAllowedOriginType) ||\n    (EnvironmentConfig.getOptionalEnvVariable("RUBY_CHROME_EXTENSION_IDS") ?? "").split(",").map(id => id.trim()).filter(id => /^[a-p]{32}$/.test(id)).some(id => origin === `chrome-extension://${id}`) ||');
  return text;
});
update('marketing/pages/home/chrome-extension.tsx', text => text.replace('"https://chromewebstore.google.com/detail/ruby/fnkfcndbgingjcbdhaofkcnhcjpljhdn"', 'process.env.NEXT_PUBLIC_CHROME_EXTENSION_URL || "/home/contact"'));
update('front/lib/api/cells/config.ts', text => text.replace('"https://ruby.ad"', '"https://app.ruby.ad"'));
update('marketing/lib/api/hubspot/hubspot.ts', text => {
  text = text.replace(/^import type \{ EbookFormData \}.*\n/m, '').replace(/^const HUBSPOT_EBOOK_FORM_ID = .*\n/m,'');
  text = text.replace(/\nexport async function submitToHubSpotEbookForm[\s\S]*$/, '\n');
  if(!text.includes('import { EnvironmentConfig }')) text = 'import { EnvironmentConfig } from "@marketing/types/shared/utils/config";\n' + text;
  for(const key of ['HUBSPOT_PORTAL_ID','HUBSPOT_CONTACT_FORM_ID','HUBSPOT_PARTNER_FORM_ID']) {
    text=text.replace(new RegExp(`const ${key} = "[^"]+";`),`const ${key} = EnvironmentConfig.getOptionalEnvVariable("${key}");`);
  }
  for(const form of ['CONTACT','PARTNER']) {
    const marker='  const endpoint = `https://api.hsforms.com/submissions/v3/integration/submit/${HUBSPOT_PORTAL_ID}/${HUBSPOT_'+form+'_FORM_ID}`;';
    if(!text.includes(`if (!HUBSPOT_PORTAL_ID || !HUBSPOT_${form}_FORM_ID)`)) text=text.replace(marker,`  if (!HUBSPOT_PORTAL_ID || !HUBSPOT_${form}_FORM_ID) {\n    return new Err(new Error("Ruby contact service is not configured"));\n  }\n\n`+marker);
  }
  return text;
});
update('marketing/lib/api/config.ts', text=>text.replace(/  \/\/ Secret for signing gated asset[\s\S]*?\n  \},\n/,''));
update('marketing/components/home/ContactFormThankYou.tsx', text=>text
  .replace(/const DEFAULT_FORM_ID = \d+;/, 'const DEFAULT_FORM_ID = Number(process.env.NEXT_PUBLIC_DEFAULT_FORM_ID || 0);')
  .replace(/const DEFAULT_TEAM_ID = \d+;/, 'const DEFAULT_TEAM_ID = Number(process.env.NEXT_PUBLIC_DEFAULT_TEAM_ID || 0);')
  .replace('if (defaultTriggeredRef.current) {','if (!DEFAULT_FORM_ID || !DEFAULT_TEAM_ID || defaultTriggeredRef.current) {'));

function replaceVideos(directory) {
  for(const entry of fs.readdirSync(directory,{withFileTypes:true})) {
    const file=`${directory}/${entry.name}`;
    if(entry.isDirectory()) replaceVideos(file);
    else if(/\.tsx?$/.test(file)) update(file,text=>text.replace(/https:\/\/fast\.wistia\.net\/embed\/iframe\/[^"'`\s]+/g,'/static/workspace-demo/index.html'));
  }
}
replaceVideos('marketing/components');
replaceVideos('marketing/pages');
update('marketing/components/home/content/Product/ProductVideoSection.tsx',text=>text
  .replace('const videoUrl = new URL("/static/workspace-demo/index.html");','const videoUrl = "/static/workspace-demo/index.html";')
  .replace(/^videoUrl\.searchParams\.set\(.*\);\n/gm,''));
