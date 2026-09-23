import fs from 'node:fs';
const root='front/public/static/landing/logos/ruby';
const mark=fs.readFileSync(`${root}/Ruby_LogoSquare.png`).toString('base64');
const image=`data:image/png;base64,${mark}`;
for(const variant of ['', '_Gray', '_Mono', '_White', '_MonoWhite']) {
  const fill=variant.includes('White')?'#ffffff':variant==='_Gray'?'#64748b':'#0f172a';
  const wordmark=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 380 100"><image width="100" height="100" href="${image}"/><text x="118" y="68" font-family="Inter,system-ui,sans-serif" font-size="60" font-weight="500" fill="${fill}">Ruby AI</text></svg>\n`;
  const square=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><image width="100" height="100" href="${image}"/></svg>\n`;
  for(const [name,content] of [[`Ruby_Logo${variant}.svg`,wordmark],[`Ruby_LogoSquare${variant}.svg`,square]]) {
    fs.writeFileSync(`${root}/${name}`,content);
    fs.writeFileSync(`marketing/public/static/landing/logos/ruby/${name}`,content);
  }
}
