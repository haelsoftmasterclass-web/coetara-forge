"""
Turn the static export in /out into a self-contained, relative-path preview in /preview.
Only used to publish a design preview (no Next.js runtime, fonts inlined, forms simulated).
Production deploys use /out directly.
"""
import base64, os, re, shutil, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "out")
PRE = os.path.join(ROOT, "preview")
shutil.rmtree(PRE, ignore_errors=True)
os.makedirs(PRE)

used = set()

def inline_fonts(css, css_dir):
    def rep(m):
        url = m.group(1)
        if url.startswith("data:"):
            return m.group(0)
        p = os.path.join(OUT, url.lstrip("/")) if url.startswith("/") else os.path.normpath(os.path.join(css_dir, url))
        data = base64.b64encode(open(p, "rb").read()).decode()
        return f"url(data:font/woff2;base64,{data})"
    return re.sub(r"url\(([^)]+\.woff2)\)", rep, css)

# CSS
css_files = []
for dp, _, fs in os.walk(os.path.join(OUT, "_next", "static")):
    for f in fs:
        if f.endswith(".css"):
            src = os.path.join(dp, f)
            rel = os.path.relpath(src, OUT)
            css = inline_fonts(open(src).read(), dp)
            # the artifact host reserves names starting with "_", so CSS moves to assets/
            dst = os.path.join(PRE, "assets", f)
            os.makedirs(os.path.dirname(dst), exist_ok=True)
            open(dst, "w").write(css)
            css_files.append(rel)

def rewrite(html, depth):
    prefix = "../" * depth
    # drop Next.js runtime scripts and preloads; keep JSON-LD and forge.js
    def keep_script(m):
        tag = m.group(0)
        if 'application/ld+json' in tag:
            return tag
        if 'src="/forge.js"' in tag:
            return tag
        return ""
    # Next.js inline RSC payload scripts are written as <script>self.__next_f.push(...)</script>
    html = re.sub(r"<script>\(?self\.__next_f.*?\)</script>", "", html, flags=re.S)
    html = re.sub(r"<script\b[^>]*>.*?</script>", keep_script, html, flags=re.S)
    html = re.sub(r'<link rel="(?:preload|modulepreload)"[^>]*>', "", html)
    html = re.sub(r'<link rel="expect"[^>]*>', "", html)
    def fix(m):
        attr, url = m.group(1), m.group(2)
        if url.startswith("//"):
            return m.group(0)
        path, sep, rest = re.match(r"([^?#]*)([?#]?)(.*)", url).groups()
        if path.startswith("/_next/") and path.endswith(".css"):
            return f'{attr}="{prefix}assets/{os.path.basename(path)}"'
        if path == "/" or path.endswith("/"):
            target = path.lstrip("/") + "index.html"
        else:
            target = path.lstrip("/")
            used.add(target)
        return f'{attr}="{prefix}{target}{sep}{rest}"'
    html = re.sub(r'\b(href|src)="(/[^"]*)"', fix, html)
    html = html.replace('data-form-endpoint=""', 'data-form-endpoint="__preview__"')
    return html

pages = []
for dp, _, fs in os.walk(OUT):
    if "/_next" in dp or dp.endswith("_not-found") or "/admin" in dp or "/review" in dp:
        continue
    for f in fs:
        if f == "index.html":
            src = os.path.join(dp, f)
            rel = os.path.relpath(src, OUT)
            depth = rel.count("/")
            html = rewrite(open(src).read(), depth)
            if rel == "index.html":
                html = re.sub(r"<title>[^<]*</title>", "<title>Coetara Forge</title>", html, count=1)
            dst = os.path.join(PRE, rel)
            os.makedirs(os.path.dirname(dst), exist_ok=True)
            open(dst, "w").write(html)
            pages.append(rel)

for rel in sorted(used):
    src = os.path.join(OUT, rel)
    if os.path.isfile(src) and not rel.startswith("_next"):
        dst = os.path.join(PRE, rel)
        os.makedirs(os.path.dirname(dst), exist_ok=True)
        shutil.copy(src, dst)

print(len(pages), "pages;", len(css_files), "css;", "assets:", sorted(r for r in used if not r.startswith("_next")))
