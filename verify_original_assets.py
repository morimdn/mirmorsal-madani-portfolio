"""Optional local source-fidelity check; requires Pillow, pypdf and the original ZIP."""
from pathlib import Path
from io import BytesIO
import argparse,hashlib,json,zipfile
from PIL import Image
from pypdf import PdfReader

parser=argparse.ArgumentParser()
parser.add_argument('--source-zip',required=True)
args=parser.parse_args()
root=Path(__file__).resolve().parent
manifest=json.loads((root/'assets/manifest.json').read_text())
def digest(data):return hashlib.sha256(data).hexdigest()
with zipfile.ZipFile(args.source_zip) as archive:
    supplied_images={name for name in archive.namelist() if name.lower().endswith(('.png','.jpg','.jpeg'))}
    assert supplied_images=={item['source'] for item in manifest if '#page=' not in item['source']},'A supplied ZIP image is missing'
    for item in manifest:
        source=item['source']
        if '#page=11;embedded=' in source:
            name,embedded=source.split('#page=11;embedded=')
            page=PdfReader(BytesIO(archive.read(name))).pages[10]
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
print(f'PASS: {len(manifest)} original asset slots match native dimensions and every decoded pixel; all {len(supplied_images)} ZIP images represented, plus the PDF AI image; no masks, blur, crops or reconstruction.')
