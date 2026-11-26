#!/usr/bin/env bash
# Gera deploy/teatende-site.zip só com o que vai para o servidor (public_html).
# Uso:  bash scripts/empacotar.sh
set -euo pipefail
cd "$(dirname "$0")/.."
node scripts/gerar-paginas.mjs > /dev/null
mkdir -p deploy
rm -f deploy/teatende-site.zip
# Só estes caminhos vão para o servidor (sem .git, scripts, README, deploy).
python3 - <<'PY'
import glob, os, zipfile
itens = ["index.html", "404.html", "robots.txt", "sitemap.xml", ".htaccess", "css", "js", "img", "fonts", "segmentos"] + sorted(glob.glob("sistema-para-*"))
n = 0
with zipfile.ZipFile("deploy/teatende-site.zip", "w", zipfile.ZIP_DEFLATED) as z:
    for item in itens:
        if os.path.isdir(item):
            for raiz, _, arqs in os.walk(item):
                for a in sorted(arqs):
                    z.write(os.path.join(raiz, a)); n += 1
        else:
            z.write(item); n += 1
print(f"deploy/teatende-site.zip: {n} arquivos, {os.path.getsize('deploy/teatende-site.zip')//1024} KB")
PY
