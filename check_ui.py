"""Dependency-free checks for shared style invariants, not a browser/a11y certification."""
from pathlib import Path
import re

css = Path(__file__).with_name('styles.css').read_text(encoding='utf-8')
css = re.sub(r'/\*.*?\*/', '', css, flags=re.S)
rules = {}
def inspect(text, context='base'):
    pos = 0
    while pos < len(text):
        start = text.find('{', pos)
        if start < 0:
            assert not text[pos:].strip(), 'Unparsed CSS'
            break
        selector = text[pos:start].strip()
        end, depth = start+1, 1
        while depth and end < len(text):
            depth += (text[end] == '{') - (text[end] == '}')
            end += 1
        assert depth == 0, 'Unbalanced CSS'
        body = text[start+1:end-1]
        key = (context, selector)
        assert key not in rules, f'Duplicate rule: {key}'
        rules[key] = {}
        if selector.startswith('@media'):
            inspect(body, selector)
        else:
            for declaration in body.split(';'):
                if not declaration.strip(): continue
                name, value = declaration.split(':', 1)
                name, value = name.strip(), value.strip()
                assert name not in rules[key], f'Duplicate property: {key} {name}'
                rules[key][name] = value
        pos = end
inspect(css)
tokens = rules['base', ':root']
for token in ['--type-label','--type-small','--type-card','--type-body','--type-h2','--type-h3','--space-1','--space-2','--space-4','--space-8','--gutter']:
    assert token in tokens, token
assert rules['base','.project-image img']['object-fit'] == 'scale-down'
assert rules['base','.lightbox-image']['object-fit'] == 'scale-down'
assert rules['base','.projects .artifact-note,.projects .gallery-item figcaption']['color'] == 'var(--light-muted)'
assert rules['base','.case-link']['min-height'] == '44px'
assert rules['base','.nav-links a']['min-height'] == '44px'
assert rules['base','h1']['font-size'] == 'clamp(3rem,6.2vw,5.4rem)'
assert '.project-art' not in css and 'Phase 2' not in css and 'Phase 3' not in css
assert '@media(max-width:900px)' in css
assert "min-width: 901px" in Path(__file__).with_name('ui.js').read_text(encoding='utf-8')
assert '@media(prefers-reduced-motion:reduce)' in css
root = Path(__file__).parent
for page in [root/'index.html', root/'projects.html', *sorted((root/'case-studies').glob('*.html'))]:
    html = page.read_text(encoding='utf-8')
    assert 'styles.css?v=4-20261010' in html and 'ui.js?v=4-20261010' in html, page

def luminance(color):
    rgb = [int(color[i:i+2],16)/255 for i in (1,3,5)]
    rgb = [x/12.92 if x <= .04045 else ((x+.055)/1.055)**2.4 for x in rgb]
    return sum(x*w for x,w in zip(rgb,[.2126,.7152,.0722]))
def contrast(a,b):
    low,high = sorted([luminance(a),luminance(b)])
    return (high+.05)/(low+.05)
for foreground, background, minimum in [
    (tokens['--light-muted'],'#F7F8FA',4.5),
    (tokens['--control-border'],tokens['--surface'],3),
    (tokens['--light-border'],'#F7F8FA',3),
    ('#91b2ff',tokens['--surface'],3),
    ('#2456b7','#F7F8FA',3),
]:
    ratio=contrast(foreground,background)
    assert ratio >= minimum, (foreground,background,ratio)
    print(f'Contrast {foreground} on {background}: {ratio:.2f}:1 (minimum {minimum})')
print(f'PASS: {len(rules)} unique style rules; responsive/type/spacing tokens; uncropped images; prominent H1; targets; reduced motion; gallery and control contrast.')
