"""Optional local source-fidelity check; requires Pillow, pypdf and the original ZIP."""
from pathlib import Path
from io import BytesIO
from contextlib import ExitStack
import argparse,hashlib,json,zipfile,re
from PIL import Image
from pypdf import PdfReader

parser=argparse.ArgumentParser()
parser.add_argument('--source-zip',required=True)
parser.add_argument('--legacy-source-zip',required=True)
parser.add_argument('--mobile-source-dir',required=True)
args=parser.parse_args()
root=Path(__file__).resolve().parent
manifest=json.loads((root/'assets/manifest.json').read_text())
def digest(data):return hashlib.sha256(data).hexdigest()
with ExitStack() as stack:
    archives={'portfolio_final_images_for_codex.zip':stack.enter_context(zipfile.ZipFile(args.source_zip)), 'portfolio_v2_complete_inputs.zip':stack.enter_context(zipfile.ZipFile(args.legacy_source_zip))}
    for item in manifest:
        source=item['source']
        if item['source_archive']=='owner_mobile_crm_originals':
            assert source in ('image 39.png','image 47 (1).png','iPhone 14 & 15 Pro - 18.png')
            data=(Path(args.mobile_source_dir)/source).read_bytes()
        else:
            archive=archives[item['source_archive']]
            if '#page=' in source:
                name,page,embedded=re.fullmatch(r'(.*)#page=(\d+);embedded=(.*)',source).groups()
                page=PdfReader(BytesIO(archive.read(name))).pages[int(page)-1]
                data=next(image.data for image in page.images if image.name==embedded)
            else:data=archive.read(source)
        original=Image.open(BytesIO(data)).convert(item['pixel_mode'])
        current_path=root/item['file']
        current=Image.open(current_path).convert(item['pixel_mode'])
        assert item['redacted'] is False and item['lossless'] is True
        assert current.size==original.size==(item['width'],item['height']),item['id']
        assert original.tobytes()==current.tobytes(),f'Visual content changed: {item["id"]}'
        assert digest(data)==item['source_sha256']
        assert digest(original.tobytes())==item['pixel_sha256']
        assert digest(current_path.read_bytes())==item['sha256']
print(f'PASS: {len(manifest)} assets match their assigned original sources, native dimensions and every decoded pixel; no masks, blur, crops or reconstruction.')
