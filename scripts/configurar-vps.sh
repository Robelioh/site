#!/usr/bin/env bash
# Prepara a VPS (Ubuntu/Debian) por SSH, usando chave (nunca senha):
#   - instala Nginx, certbot e rsync
#   - cria o usuário "deploy" e autoriza a chave pública (servidor/vps-rbi.pub)
#   - cria /var/www/rbitecnologia e instala o Nginx provisório (só HTTP)
#
#   Passo 1 (agora):                bash scripts/configurar-vps.sh root@IP_DA_VPS
#   Passo 2 (DNS já apontando):     bash scripts/configurar-vps.sh root@IP_DA_VPS --https [--email voce@exemplo.com]
#
# Opções:  --chave ~/.ssh/vps-rbi   chave PRIVADA para entrar na VPS (a que combina com a pública)
#          --porta 22               porta SSH
#          --pub servidor/vps-rbi.pub   chave PÚBLICA a autorizar para o usuário deploy
# O usuário de entrada precisa ser root, ou ter sudo sem senha. Nada daqui lê ou envia a sua chave privada
# (ela só é usada localmente pelo ssh).
set -euo pipefail
cd "$(dirname "$0")/.."

ALVO="${1:?Uso: bash scripts/configurar-vps.sh root@IP_DA_VPS [--https] [--chave ARQ] [--porta N] [--email E] [--pub ARQ]}"; shift
HTTPS=0; CHAVE=""; PORTA=22; EMAIL=""; PUB="servidor/vps-rbi.pub"
while [ $# -gt 0 ]; do
  case "$1" in
    --https) HTTPS=1 ;;
    --chave) CHAVE="${2:?}"; shift ;;
    --porta) PORTA="${2:?}"; shift ;;
    --email) EMAIL="${2:?}"; shift ;;
    --pub)   PUB="${2:?}"; shift ;;
    *) echo "Opção desconhecida: $1" >&2; exit 2 ;;
  esac
  shift
done
[ -f "$PUB" ] || { echo "Chave pública não encontrada: $PUB" >&2; exit 1; }
CHAVE_PUBLICA="$(cat "$PUB")"
case "$CHAVE_PUBLICA" in ssh-*|ecdsa-*|sk-*) ;; *) echo "$PUB não parece uma chave PÚBLICA (deve começar com ssh-ed25519 ...)." >&2; exit 1 ;; esac

SSH_OPTS=(-p "$PORTA" -o BatchMode=yes -o StrictHostKeyChecking=accept-new)
[ -n "$CHAVE" ] && SSH_OPTS+=(-i "$CHAVE")
SUDO=""; [ "${ALVO%%@*}" = "root" ] || SUDO="sudo -n"

echo "== Testando o acesso SSH por chave a $ALVO"
ssh "${SSH_OPTS[@]}" "$ALVO" 'echo "conectado como $(whoami) em $(hostname)"; . /etc/os-release; echo "$PRETTY_NAME"'

if [ "$HTTPS" = "0" ]; then
  echo "== Enviando a configuração provisória do Nginx"
  # Envio por ssh+cat (não depende de SFTP/scp, que algumas VPS desativam)
  ssh "${SSH_OPTS[@]}" "$ALVO" 'cat > /tmp/rbi-nginx-provisorio.conf' < servidor/nginx-provisorio.conf
  echo "== Preparando a VPS"
  ssh "${SSH_OPTS[@]}" "$ALVO" "$SUDO bash -s -- $(printf '%q' "$CHAVE_PUBLICA")" <<'REMOTO'
set -euo pipefail
CHAVE_PUBLICA="$1"
export DEBIAN_FRONTEND=noninteractive
apt-get update -qq
apt-get install -y -qq nginx certbot rsync >/dev/null
# usuário de deploy (sem senha; só entra por chave)
id deploy >/dev/null 2>&1 || adduser --disabled-password --gecos "" deploy >/dev/null
# "*" = sem login por senha, mas conta NÃO trancada (com "!" o sshd recusa até a chave quando UsePAM=no)
usermod -p '*' deploy
install -d -m 700 -o deploy -g deploy /home/deploy/.ssh
touch /home/deploy/.ssh/authorized_keys
grep -qxF "$CHAVE_PUBLICA" /home/deploy/.ssh/authorized_keys || echo "$CHAVE_PUBLICA" >> /home/deploy/.ssh/authorized_keys
chown deploy:deploy /home/deploy/.ssh/authorized_keys && chmod 600 /home/deploy/.ssh/authorized_keys
# pastas do site e do desafio do certbot
install -d -m 755 -o deploy -g deploy /var/www/rbitecnologia
install -d -m 755 /var/www/certbot
# Nginx provisório (só HTTP). Não removemos o site "default": o nosso server_name tem precedência.
# Sem IPv6 na VPS, remove as linhas listen [::] (senão o nginx -t falha).
if [ -f /proc/net/if_inet6 ]; then
  install -m 644 /tmp/rbi-nginx-provisorio.conf /etc/nginx/sites-available/rbitecnologia.com.br
else
  sed '/listen \[::\]/d' /tmp/rbi-nginx-provisorio.conf > /etc/nginx/sites-available/rbitecnologia.com.br
  chmod 644 /etc/nginx/sites-available/rbitecnologia.com.br
fi
ln -sf /etc/nginx/sites-available/rbitecnologia.com.br /etc/nginx/sites-enabled/rbitecnologia.com.br
nginx -t
systemctl enable --now nginx >/dev/null 2>&1 || true
systemctl reload nginx
# firewall: só mexe se o ufw já estiver ativo
if command -v ufw >/dev/null && ufw status | grep -q "Status: active"; then ufw allow 'Nginx Full' >/dev/null; echo "ufw: portas 80/443 liberadas"; fi
rm -f /tmp/rbi-nginx-provisorio.conf
echo "VPS preparada. Usuário deploy autorizado; pasta /var/www/rbitecnologia pronta."
REMOTO
  IP="${ALVO#*@}"
  echo
  echo "Próximo passo: enviar o site:"
  echo "  SSH_OPTS=\"-p $PORTA${CHAVE:+ -i $CHAVE}\" bash scripts/publicar.sh deploy@$IP"
  echo "Depois, com o DNS apontando para a VPS, emita o certificado:"
  echo "  bash scripts/configurar-vps.sh $ALVO --https${CHAVE:+ --chave $CHAVE}${EMAIL:+ --email $EMAIL}"
else
  echo "== Emitindo o certificado (primeiro um teste --dry-run; se falhar, nada é emitido)"
  ssh "${SSH_OPTS[@]}" "$ALVO" 'cat > /tmp/rbi-nginx.conf' < servidor/nginx.conf
  ssh "${SSH_OPTS[@]}" "$ALVO" "$SUDO bash -s -- $(printf '%q' "$EMAIL")" <<'REMOTO'
set -euo pipefail
EMAIL="$1"
DOMINIOS=(-d rbitecnologia.com.br -d www.rbitecnologia.com.br)
if [ -n "$EMAIL" ]; then CONTA=(--email "$EMAIL" --no-eff-email); else CONTA=(--register-unsafely-without-email); fi
certbot certonly --webroot -w /var/www/certbot "${DOMINIOS[@]}" --non-interactive --agree-tos "${CONTA[@]}" --dry-run
certbot certonly --webroot -w /var/www/certbot "${DOMINIOS[@]}" --non-interactive --agree-tos "${CONTA[@]}"
# Nginx final. Sem IPv6 na VPS, remove as linhas listen [::].
if [ -f /proc/net/if_inet6 ]; then
  cp /tmp/rbi-nginx.conf /etc/nginx/sites-available/rbitecnologia.com.br
else
  sed '/listen \[::\]/d' /tmp/rbi-nginx.conf > /etc/nginx/sites-available/rbitecnologia.com.br
fi
nginx -t
systemctl reload nginx
certbot renew --dry-run >/dev/null && echo "Renovação automática do certificado: OK"
rm -f /tmp/rbi-nginx.conf
echo "HTTPS ativo. Teste: https://rbitecnologia.com.br/"
REMOTO
fi
