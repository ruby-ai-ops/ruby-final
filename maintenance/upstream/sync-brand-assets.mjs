import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { transform } = require('@svgr/core');
const canonical = 'front/public/static/landing/logos/ruby';
const sourceRoot = 'ui/src/logo/src/ruby';
const blank = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"/>';
for (const name of fs.readdirSync(sourceRoot)) {
  const target = path.join(sourceRoot, name);
  const source = path.join(canonical, name);
  if (fs.existsSync(source)) fs.copyFileSync(source, target);
  else if (name.includes('layer2')) fs.writeFileSync(target, blank);
  else if (name.includes('layer1')) fs.copyFileSync(path.join(canonical, name.includes('Square') ? 'Ruby_LogoSquare.svg' : 'Ruby_Logo.svg'), target);
}
const options = { plugins: ['@svgr/plugin-jsx'], typescript: true, icon: true, expandProps: 'end', prettier: false };
for (const name of fs.readdirSync(sourceRoot).filter(name => name.endsWith('.svg'))) {
  const componentName = name.replace(/\.svg$/, '').replace(/_([a-zA-Z0-9])/g, (_, char) => char.toUpperCase());
  const code = await transform(fs.readFileSync(path.join(sourceRoot, name), 'utf8'), options, { componentName });
  fs.writeFileSync(`ui/src/logo/ruby/${componentName}.tsx`, code);
}
for (const [name, square] of [['LogoFullColor',false], ['LogoColoredGrey',false], ['LogoSquareFullColor',true], ['LogoSquareColoredGrey',true]]) {
  const code = await transform(fs.readFileSync(path.join(canonical, square ? 'Ruby_LogoSquare.svg' : 'Ruby_Logo.svg'), 'utf8'), options, { componentName: `Svg${name}` });
  fs.writeFileSync(`ui/src/logo/${name}.tsx`, code);
}
const mark = fs.readFileSync(path.join(canonical, 'Ruby_LogoSquare.svg'), 'utf8');
const iconSource = 'ui/src/icons/src/v2-stroke/intersect-ruby.svg';
fs.writeFileSync(iconSource, mark);
fs.writeFileSync('ui/src/icons/v2-stroke/IntersectRuby.tsx', await transform(mark, options, { componentName: 'SvgIntersectRuby' }));
const png = fs.readFileSync('front/public/static/ruby-logo.png').toString('base64');
const animation = { v: '5.12.2', fr: 30, ip: 0, op: 60, w: 1280, h: 1280, nm: 'Ruby AI loading', ddd: 0,
  assets: [{id:'ruby-mark',w:1280,h:1280,u:'',p:`data:image/png;base64,${png}`,e:1}],
  layers: [{ddd:0,ind:1,ty:2,nm:'Ruby AI',refId:'ruby-mark',sr:1,ks:{o:{a:1,k:[{t:0,s:[65],e:[100],i:{x:[0.5],y:[1]},o:{x:[0.5],y:[0]}},{t:30,s:[100],e:[65],i:{x:[0.5],y:[1]},o:{x:[0.5],y:[0]}},{t:60,s:[65]}]},r:{a:0,k:0},p:{a:0,k:[640,640,0]},a:{a:0,k:[640,640,0]},s:{a:0,k:[100,100,100]}},ao:0,ip:0,op:60,st:0,bm:0}] };
for (const name of fs.readdirSync('ui/src/lottie').filter(name => /^spinner(?:Ruby|Light|Dark|Color).*\.ts$/.test(name))) {
  fs.writeFileSync(path.join('ui/src/lottie', name), `// Generated from the canonical Ruby AI mark.\nexport default ${JSON.stringify(animation)};\n`);
  const source = path.join('ui/src/lottie/src', name.replace(/\.ts$/, '.json'));
  if (fs.existsSync(source)) fs.writeFileSync(source, JSON.stringify(animation) + '\n');
}
process.stdout.write('Ruby logo and animation modules regenerated from canonical assets.\n');
