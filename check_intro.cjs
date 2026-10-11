const fs = require('node:fs');
const assert = require('node:assert/strict');
const html = fs.readFileSync(__dirname+'/index.html','utf8');
const css = fs.readFileSync(__dirname+'/styles.css','utf8');
assert(!html.includes('homepage-intro') && !html.includes('hero-signature'));
assert(!css.includes('intro-pending') && !css.includes('intro-entry'));
assert(html.includes('portrait-trigger') && html.includes('profile-portrait'));
console.log('PASS: logo intro and floating MM removed; static branding and portrait disclosure retained.');
