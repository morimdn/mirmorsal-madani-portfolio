"""Buildless static validation: python check_site.py from any directory."""
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit, unquote
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parent
BASE = 'https://morimdn.github.io/mirmorsal-madani-portfolio/'
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
        if tag=='img':assert 'alt' in a, f'{self.path}: missing alt'
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
assert len(pages)==13
home=(ROOT/'index.html').read_text(encoding='utf-8')
for contact in ('mailto:mirmorsal.madani1361@gmail.com','tel:+48452984012','https://wa.me/48452984012','https://t.me/mirmorsal','https://github.com/morimdn'):
    assert contact in home
for slug in ('brokerage-crm','risk-management','ib-referral','social-trading','loyalty-club','sales-crm','ai-market-analyst','trading-plugins','mobile-crm'):
    assert (ROOT/'case-studies'/f'{slug}.html').exists()
sitemap=ET.parse(ROOT/'sitemap.xml')
assert len(sitemap.getroot())==13
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

