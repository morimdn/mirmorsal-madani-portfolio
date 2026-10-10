"""Buildless static validation: python check_site.py from any directory."""
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit, unquote
import xml.etree.ElementTree as ET
import json
import hashlib

ROOT = Path(__file__).resolve().parent
BASE = 'https://morimdn.github.io/mirmorsal-madani-portfolio/'
MANIFEST=json.loads((ROOT/'assets/manifest.json').read_text())
class Page(HTMLParser):
    def __init__(self, path):
        super().__init__(convert_charrefs=True)
        self.path=path; self.ids=[]; self.links=[]; self.h1=0; self.title=False; self.description=False; self.canonical=''
        self.headings=[]
    def handle_starttag(self,tag,attrs):
        a=dict(attrs)
        if 'id' in a:self.ids.append(a['id'])
        if tag=='h1':self.h1+=1
        if tag in ('h1','h2','h3'):self.headings.append(int(tag[1]))
        if tag=='title':self.title=True
        if tag=='meta' and a.get('name')=='description':self.description=bool(a.get('content'))
        if tag=='link' and a.get('rel')=='canonical':self.canonical=a.get('href','')
        for key in ('href','src'):
            if key in a:self.links.append(a[key])
        if tag=='a':assert a.get('href') not in ('','#'), f'{self.path}: dead link'
        if tag=='img':
            assert 'alt' in a, f'{self.path}: missing alt'
            if a.get('src'):
                assert a.get('alt'),f'{self.path}: empty product alt'
                assert a.get('width') and a.get('height'),f'{self.path}: missing intrinsic image dimensions'
                assert a.get('loading') in ('lazy','eager'),f'{self.path}: missing image loading strategy'
                asset=next((x for x in MANIFEST if a['src'].endswith(x['file'])),None)
                assert asset and int(a['width'])==asset['width'] and int(a['height'])==asset['height'],f'{self.path}: incorrect native image dimensions'
                assert a['alt']==asset['alt'],f'{self.path}: image alt differs from provenance manifest'
        if a.get('target')=='_blank':assert 'noopener' in a.get('rel',''),f'{self.path}: unsafe new tab'

pages={}
for path in ROOT.rglob('*.html'):
    p=Page(path);p.feed(path.read_text(encoding='utf-8'));pages[path]=p
    assert len(p.ids)==len(set(p.ids)),f'{path}: duplicate IDs'
    assert p.h1==1 and p.title and p.description,f'{path}: incomplete page metadata'
    assert p.canonical==BASE+('' if path.name=='index.html' else path.relative_to(ROOT).as_posix()),f'{path}: canonical'
    for before,after in zip(p.headings,p.headings[1:]):assert after<=before+1,f'{path}: heading level skip'
links=0
for path,p in pages.items():
    for href in p.links:
        u=urlsplit(href)
        if u.scheme or u.netloc:continue
        assert not u.path.startswith('/'),f'{path}: prefix-unsafe absolute URL'
        target=(path.parent/unquote(u.path)).resolve() if u.path else path
        assert target.is_relative_to(ROOT),f'{path}: path outside site'
        assert target.exists(),f'{path}: broken local link {href}'
        if u.fragment:assert target in pages and unquote(u.fragment) in pages[target].ids,f'{path}: broken anchor {href}'
        links+=1
assert len(pages)==22
home=(ROOT/'index.html').read_text(encoding='utf-8')
for contact in ('mailto:mirmorsal.madani1361@gmail.com','tel:+48452984012','https://wa.me/48452984012','https://t.me/mirmorsal','https://github.com/morimdn','https://www.linkedin.com/in/mirmorsal-madani/'):
    assert contact in home
for slug in ('brokerage-crm','risk-management','ib-referral','social-trading','loyalty-club','sales-crm','ai-market-analyst','trading-plugins','mobile-crm','saman-shahr','smart-feeder','payments','enterprise-onboarding','enterprise-performance','kiakooshyar','sji-portals','plan-chin','culture-knowledge','deltafx-website','topfast-website'):
    assert (ROOT/'case-studies'/f'{slug}.html').exists()
sitemap=ET.parse(ROOT/'sitemap.xml')
assert len(sitemap.getroot())==22
assert 'Jan 2026' not in home and 'Sep 2024–Dec 2025' not in home
for date in ('May 2023–May 2024','May 2024–Present','August 2020 — March 2023','July 2019 — August 2020','Dec 2010–Jul 2022','Aug 2022–Sep 2024','Dec 2010–Apr 2022'):
    assert date in home,f'Missing corrected CV date: {date}'
assert home.count('class="project-card"')==6
assert './projects.html' in home
assert 'https://scholar.google.com/scholar?hl=en&amp;as_sdt=0%2C5&amp;q=mirmorsal+madani&amp;oq=' in home
collection=(ROOT/'projects.html').read_text(encoding='utf-8')
assert collection.count('class="project-card"')==20
assert './case-studies/ai-market-analyst.html' in collection and 'AI Market Analyst' in collection
for p in pages:
    text=p.read_text(encoding='utf-8')
    assert not any(word in text.lower() for word in ('redacted','privacy edited','data redacted')),f'{p}: stale redaction description'
    if 'data-lightbox' in text:assert 'class="lightbox-original"' in text,f'{p}: missing full-size image action'
assert not list(ROOT.rglob('*.docx')) and not list(ROOT.rglob('*.pdf')),'CV/reference documents should not be committed'
manifest=json.loads((ROOT/'assets/manifest.json').read_text())
assert len(manifest)==29
assert len({a['id'] for a in manifest})==len(manifest)
for asset in manifest:
    image=ROOT/asset['file']
    assert image.is_file() and image.stat().st_size==asset['bytes']
    assert image.suffix=='.webp' and 0<asset['width']<=4096 and 0<asset['height']<=4096
    assert asset['alt'] and asset['caption'] and asset['bytes']<2_000_000
    assert asset['redacted'] is False and asset['lossless'] is True
    assert hashlib.sha256(image.read_bytes()).hexdigest()==asset['sha256'],f'Asset checksum mismatch: {asset["id"]}'
    assert len(asset['pixel_sha256'])==64 and len(asset['source_sha256'])==64
    assert any(asset['file'] in page.path.read_text(encoding='utf-8') for page in pages.values()),f'Unused asset: {asset["id"]}'
assert sum(a['bytes'] for a in manifest)<12_000_000
assert {p.relative_to(ROOT).as_posix() for p in (ROOT/'assets/projects').iterdir()}=={a['file'] for a in manifest},'Unexpected or obsolete image derivative remains'
print(f'Asset manifest: {len(manifest)} WebP files; {sum(a["bytes"] for a in manifest):,} bytes; image dimensions, paths, budget and usage passed.')
def luminance(hex):
    values=[int(hex[i:i+2],16)/255 for i in (1,3,5)]
    values=[v/12.92 if v<=.04045 else ((v+.055)/1.055)**2.4 for v in values]
    return sum(v*w for v,w in zip(values,(.2126,.7152,.0722)))
def contrast(a,b):
    values=sorted((luminance(a),luminance(b)))
    return (values[1]+.05)/(values[0]+.05)
pairs=[('#F7F8FA','#0E1A2B'),('#b6c3d4','#142338'),('#FFFFFF','#2e68f6'),('#536177','#FFFFFF'),('#2456b7','#F7F8FA'),('#91b2ff','#0E1A2B'),('#C8A96B','#0E1A2B')]
for fg,bg in pairs:
    ratio=contrast(fg,bg);assert ratio>=4.5,f'{fg} / {bg}: {ratio}'
    print(f'Contrast {fg} on {bg}: {ratio:.2f}:1')
print(f'PASS: {len(pages)} HTML pages; {links} local references/anchors; heading hierarchy; metadata; contact links; sitemap; core text contrast.')

