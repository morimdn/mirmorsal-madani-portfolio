"""Buildless static validation: python check_site.py from any directory."""
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit, unquote
import xml.etree.ElementTree as ET
import json
import hashlib
import re
from html import unescape

ROOT = Path(__file__).resolve().parent
home_v9 = (ROOT/'index.html').read_text(encoding='utf-8')
about_v9 = re.search(r'<section[^>]+id="about".*?</section>', home_v9, re.S).group()
assert all(company not in about_v9 for company in ('Top Fast','DeltaFX','SJI'))
assert home_v9.count('class="capability-node"') == 8
assert 'Product Manager &amp; Product Leader' in home_v9
assert 'Wrocław, Poland — Open to product opportunities across Europe' in home_v9
for slug, title, role in [
    ('risk-management','Risk Management Platform','Product Owner — End-to-End Product Ownership'),
    ('brokerage-crm','Brokerage CRM','Product Manager — Discovery, Redesign & Delivery'),
    ('ib-referral','IB & Referral Platform','Product Owner'),
    ('social-trading','Social Trading Platform','Product Owner'),
    ('mobile-crm','Native CRM Mobile App','Hands-on Product Manager'),
]:
    case = unescape((ROOT/'case-studies'/f'{slug}.html').read_text(encoding='utf-8'))
    assert f'<h1>{title}</h1>' in case and f'<strong>{role}</strong>' in case, slug
for page_v9 in [ROOT/'index.html',ROOT/'projects.html',*(ROOT/'case-studies').glob('*.html')]:
    assert 'Riskotik' not in page_v9.read_text(encoding='utf-8'), page_v9
BASE = 'https://morimdn.github.io/mirmorsal-madani-portfolio/'
MANIFEST=json.loads((ROOT/'assets/manifest.json').read_text())
PUBLISHERS=json.loads((ROOT/'assets/publishers.json').read_text())
MANIFEST+=PUBLISHERS
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
assert len(pages)==15
home=(ROOT/'index.html').read_text(encoding='utf-8')
for contact in ('mailto:mirmorsal.madani1361@gmail.com','tel:+48452984012','https://wa.me/48452984012','https://t.me/mirmorsal','https://github.com/morimdn','https://www.linkedin.com/in/mirmorsal-madani/'):
    assert contact in home
for slug in ('brokerage-crm','risk-management','ib-referral','social-trading','loyalty-club','ai-market-analyst','mobile-crm','payments','enterprise-onboarding','enterprise-performance','plan-chin','deltafx-website','topfast-website'):
    assert (ROOT/'case-studies'/f'{slug}.html').exists()
sitemap=ET.parse(ROOT/'sitemap.xml')
assert len(sitemap.getroot())==15
assert 'Jan 2026' not in home and 'Sep 2024–Dec 2025' not in home
for date in ('May 2023–May 2024','May 2024–Present','August 2020 — March 2023','July 2019 — August 2020','Dec 2010–Jul 2022','Aug 2022–Sep 2024','Dec 2010–Apr 2022'):
    assert date in home,f'Missing corrected CV date: {date}'
assert home.count('class="project-card"')==6
assert './projects.html' in home
assert 'https://scholar.google.com/scholar?hl=en&amp;as_sdt=0%2C5&amp;q=mirmorsal+madani&amp;oq=' in home
collection=(ROOT/'projects.html').read_text(encoding='utf-8')
assert collection.count('class="project-card"')==13
assert './case-studies/ai-market-analyst.html' in collection and 'AI Market Analyst' in collection
for p in pages:
    text=p.read_text(encoding='utf-8')
    assert not any(word in text.lower() for word in ('redacted','privacy edited','data redacted')),f'{p}: stale redaction description'
    public=unescape(re.sub(r'<[^>]*>',' ',text)).lower()
    editorial=('pending confirmation','coming soon','pending verification','the cv establishes','the cv reports','the supplied brief','supplied artifact','portfolio leadership','edited for privacy','visuals pending','product visuals are pending','evidence unavailable','original portfolio states')
    assert not any(word in public for word in editorial),f'{p}: internal editorial or obsolete placeholder text'
    if 'data-lightbox' in text:assert 'class="lightbox-original"' in text,f'{p}: missing full-size image action'

# Guard against the previously incorrect Riskotik employer and role mapping.
mapping=json.loads((ROOT/'ASSET-MAPPING.json').read_text(encoding='utf-8'))
for project in mapping['projects']:
    case=(ROOT/'case-studies'/f'{project["slug"]}.html').read_text(encoding='utf-8')
    assert project['company'] in unescape(case),f'{project["slug"]}: employer/context inconsistent with mapping'
    assert project['role'] in unescape(case),f'{project["slug"]}: role inconsistent with mapping'
    assert project['summary'] in unescape(case),f'{project["slug"]}: summary inconsistent with mapping'
    for listing in (home,collection):
        cards=re.findall(r'<article class="project-card".*?</article>',listing,re.S)
        card=next((c for c in cards if f'case-studies/{project["slug"]}.html' in c),None)
        if card:assert project['role'] in unescape(card) and project['summary'] in unescape(card),f'{project["slug"]}: stale project card'
major=('brokerage-crm','risk-management','mobile-crm','loyalty-club','ib-referral','social-trading','ai-market-analyst','enterprise-onboarding','enterprise-performance')
for slug in major:
    case=pages[ROOT/'case-studies'/f'{slug}.html']
    assert {'product-overview','business-problem','target-users','role','discovery','workflows','delivery','evidence'}.issubset(case.ids),f'{slug}: incomplete major case'
risk=(ROOT/'case-studies/risk-management.html').read_text(encoding='utf-8')
assert 'Top Fast Technology' in risk and 'Product Owner — End-to-End Product Ownership' in risk
assert 'I initiated the product concept' in risk and 'prioritized backlog' in risk
assert 'Product Manager / BI' not in risk
assert 'under eight months' in home and 'under eight months' in (ROOT/'case-studies/brokerage-crm.html').read_text(encoding='utf-8')
ai=(ROOT/'case-studies/ai-market-analyst.html').read_text(encoding='utf-8')
assert 'without automated trade execution' in ai and 'Top Fast Technology' in ai
assert 'https://doi.org/10.1002/spy2.264' in home and 'https://doi.org/10.1007/s11227-022-04851-3' in home
research=home.split('id="research"',1)[1].split('</section>',1)[0]
topics=re.findall(r'<li>.*?<span>(.*?)</span></li>',research,re.S)
assert topics==['Privacy-Preserving Data Mining','Text Mining','Imbalanced Data Classification','Anomaly Detection','Fraud Detection','Deep Learning','Natural Language Processing (NLP)','Feature Engineering']
assert re.findall(r'<h3>(.*?)</h3>',research)==['Core Research','Intelligent Detection','AI &amp; Machine Learning']
topic_grid=research.split('<div class="research-grid"',1)[1].split('<p class="research-publications"',1)[0]
assert topic_grid.count('<svg ')==8 and topic_grid.count('aria-hidden="true"')==8
assert research.count('scholar.google.com')==1 and research.count('assets/publishers/')==3
assert 'A research foundation.<br>An applied perspective.' in research
assert home.count('class="service')==6  # service grid and five offerings
assert 'AI-Augmented<br>Product Management' in home and 'End-to-End B2B<br>Product Delivery' in home
assert 'while keeping product decisions and quality under human control.' in home
assert 'Helped establish and develop the Product Management function' in home and 'native Flutter CRM' in home
print('V6: eight topics, three groups, decorative icons, three publisher logos, single research Scholar CTA, B2B/AI offerings and hands-on leadership passed.')
print('Content consistency: 13 company/context and role mappings, 9 major cases, correct Riskotik ownership, delivery milestones and publication links passed.')
assert not list(ROOT.rglob('*.docx')) and not list(ROOT.rglob('*.pdf')),'CV/reference documents should not be committed'
manifest=json.loads((ROOT/'assets/manifest.json').read_text())
assert len(manifest)==33
native=(ROOT/'case-studies/mobile-crm.html').read_text(encoding='utf-8')
assert native.count('data-lightbox ')==1 and 'native-gallery' in native
assert 'crm-mobile-finance-original' not in native and 'crm-mobile-wallet-original' not in native
assert 'native-screen-preview' in collection
assert len(PUBLISHERS)==3
for logo in PUBLISHERS:
    data=(ROOT/logo['file']).read_bytes()
    assert len(data)==logo['bytes'] and hashlib.sha256(data).hexdigest()==logo['sha256']
assert len({a['id'] for a in manifest})==len(manifest)
retired=json.loads((ROOT/'retired-projects.json').read_text(encoding='utf-8'))
retired_images={image for project in retired for image in project['images']}
for project in retired:
    assert not (ROOT/'case-studies'/f'{project["slug"]}.html').exists()
    assert all(f'case-studies/{project["slug"]}.html' not in page.path.read_text(encoding='utf-8') for page in pages.values())
assert len(mapping['projects'])==13
for asset in manifest:
    image=ROOT/asset['file']
    assert image.is_file() and image.stat().st_size==asset['bytes']
    native_mobile=asset['source_archive']=='owner_mobile_crm_originals'
    assert image.suffix=='.webp' and 0<asset['width']<=(7208 if native_mobile else 4096) and 0<asset['height']<=(5400 if native_mobile else 4096)
    assert asset['alt'] and asset['caption'] and asset['bytes']<(10_000_000 if native_mobile else 2_000_000)
    assert asset['redacted'] is False and asset['lossless'] is True
    assert hashlib.sha256(image.read_bytes()).hexdigest()==asset['sha256'],f'Asset checksum mismatch: {asset["id"]}'
    assert len(asset['pixel_sha256'])==64 and len(asset['source_sha256'])==64
    assert asset['id'] in retired_images or any(asset['file'] in page.path.read_text(encoding='utf-8') for page in pages.values()),f'Unused asset: {asset["id"]}'
assert sum(a['bytes'] for a in manifest)<24_000_000
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

