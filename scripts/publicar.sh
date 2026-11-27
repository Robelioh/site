#!/usr/bin/env bash
# Publica o site numa VPS por SSH (rsync). Mostra uma SIMULAÇÃO antes e pede confirmação.
#
#   bash scripts/publicar.sh deploy@IP_DA_VPS [/var/www/rbitecnologia]
#   SSH_OPTS="-i ~/.ssh/vps-rbi -p 22" bash scripts/publicar.sh ...   # chave e porta SSH (opcional)
#   APACHE=1 bash scripts/publicar.sh ...     # envia também o .htaccess (só se a VPS usar Apache)
#
# Atenção: usa --delete. A pasta de destino deve ser SÓ deste site: o que não existir aqui é apagado lá.
set -euo pipefail
cd "$(dirname "$0")/.."
ALVO="${1:?Uso: bash scripts/publicar.sh deploy@IP_DA_VPS [/var/www/rbitecnologia]}"
DEST="${2:-/var/www/rbitecnologia}"

node scripts/gerar-paginas.mjs > /dev/null
EXCLUIR=(--exclude=.git --exclude=.gitignore --exclude=scripts --exclude=servidor --exclude=deploy --exclude=README.md --exclude=node_modules)
[ "${APACHE:-0}" = "1" ] || EXCLUIR+=(--exclude=.htaccess)
# BatchMode: nunca pede senha (só chave), para falhar claro em vez de travar.
SSH_CMD="ssh -o BatchMode=yes -o StrictHostKeyChecking=accept-new ${SSH_OPTS:-}"
OPCOES=(-azc -e "$SSH_CMD" --delete --chmod=D755,F644 "${EXCLUIR[@]}")

echo "== Simulação: nada foi alterado ainda =="
SIM="$(rsync -n --itemize-changes "${OPCOES[@]}" ./ "$ALVO:$DEST/")"
echo "$SIM" | head -60
echo "-- arquivos a enviar/atualizar: $(echo "$SIM" | grep -c '^[<>c]')  |  a APAGAR no servidor: $(echo "$SIM" | grep -c '^\*deleting')"
echo "$SIM" | grep '^\*deleting' | head -20 || true
read -r -p "Publicar de verdade em $ALVO:$DEST ? [s/N] " resp
[ "$resp" = "s" ] || { echo "Cancelado."; exit 1; }
rsync "${OPCOES[@]}" ./ "$ALVO:$DEST/"
echo "Publicado. Confira: https://rbitecnologia.com.br/"
