import fs from 'node:fs';
import path from 'node:path';
const source='front/public/static/landing/logos/ruby';
const replacements=[];
for (const file of fs.readdirSync('extension/ui/images').filter(name=>/^ruby\d+(?:green)?\.png$/.test(name))) {
  replacements.push([`${source}/Ruby_LogoSquare.png`,`extension/ui/images/${file}`]);
}
replacements.push([`${source}/Ruby_LogoSquare.svg`,'ui/.storybook/assets/ruby.svg']);
replacements.push([`${source}/Ruby_LogoSquare.png`,'x/adrsimon/mobile/Ruby/Resources/Assets.xcassets/AppIcon.appiconset/RubyLogo.png']);
replacements.push([`${source}/Ruby_LogoSquare.svg`,'x/adrsimon/mobile/RubyUITokens/Sources/RubyUITokens/Resources/Icons.xcassets/Ruby.imageset/ruby.svg']);
for (const directory of ['front','marketing']) {
  const target=`${directory}/public/static/landing/chatgpt-enterprise/ruby_logo.svg`;
  if (fs.existsSync(target)) replacements.push([`${source}/Ruby_Logo.svg`,target]);
}
const mobile='x/adrsimon/mobile/RubyUITokens/Sources/RubyUITokens/Resources/Logos.xcassets';
for (const directory of fs.readdirSync(mobile)) {
  if(!directory.startsWith('Ruby')) continue;
  for(const name of fs.readdirSync(path.join(mobile,directory))) {
    if(name.endsWith('.svg') && fs.existsSync(`${source}/${name}`)) replacements.push([`${source}/${name}`,path.join(mobile,directory,name)]);
  }
}
const protectedFile='maintenance/upstream/protected-assets.json';
const protectedAssets=new Set(JSON.parse(fs.readFileSync(protectedFile,'utf8')));
for(const [from,to] of replacements) { fs.copyFileSync(from,to); protectedAssets.add(to.replaceAll('\\','/')); }
fs.writeFileSync(protectedFile,JSON.stringify([...protectedAssets].sort(),null,2)+'\n');

for(const browser of ['chrome','firefox']) {
  const base=`extension/platforms/${browser}/manifests`;
  for(const name of fs.readdirSync(base).filter(name=>name.endsWith('.json'))) {
    const file=`${base}/${name}`;
    const manifest=JSON.parse(fs.readFileSync(file,'utf8'));
    delete manifest.key;
    if(manifest.name) manifest.name='Ruby AI';
    if(manifest.externally_connectable) manifest.externally_connectable.matches=['https://app.ruby.ad/*'];
    const next=JSON.stringify(manifest,null,2)+'\n';
    if(fs.readFileSync(file,'utf8') !== next) {
      fs.writeFileSync(`${file}.ruby-rebrand-tmp`,next);
      fs.renameSync(`${file}.ruby-rebrand-tmp`,file);
    }
  }
}
process.stdout.write(`Replaced ${replacements.length} remaining logo assets.\n`);
