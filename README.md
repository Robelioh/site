# Site TeAtende — RBI Tecnologia em Gestão

Site estático (HTML + CSS + JS puro, sem framework). Domínio: https://rbitecnologia.com.br

## Rodar localmente

O JS usa módulos ES (`<script type="module">`), que **não funcionam abrindo `index.html` por duplo clique** (`file://`). Sirva a pasta:

```bash
python3 -m http.server 8000
```

Depois abra http://localhost:8000. Os caminhos são absolutos (`/css/...`), então o site precisa ficar na raiz do domínio.

## Páginas por segmento (geradas)

As páginas `sistema-para-*/`, o hub `segmentos/`, `sitemap.xml`, `robots.txt` e a lista de links na home **são geradas** a partir de `js/segmentos.js`. Depois de editar esse arquivo:

```bash
node scripts/gerar-paginas.mjs
```

e faça commit dos arquivos gerados (o hospedeiro só serve arquivos estáticos). Não edite as páginas geradas à mão: a próxima geração sobrescreve.

Para enriquecer uma página de segmento, adicione campos ao objeto do segmento em `js/segmentos.js`:

- `faq: [["Pergunta?", "Resposta."], ...]` — perguntas extras, somadas às padrão (e ao schema FAQPage).
- `slug` e `kw` — URL (`/sistema-para-<slug>/`) e a expressão que o cliente pesquisa (usada em título, H1 e textos).

## Publicar numa VPS (Nginx ou Caddy + HTTPS)

Os arquivos de servidor ficam em `servidor/`: `nginx.conf` (final, com HTTPS), `nginx-provisorio.conf` (só HTTP, usado uma vez para emitir o certificado) e `Caddyfile` (alternativa mais simples, emite e renova o HTTPS sozinho). Escolha **um**: Nginx **ou** Caddy. Os comandos abaixo supõem Ubuntu/Debian.

### 1. DNS (Registro.br)

Primeiro descubra **onde o DNS do domínio é servido**:

```bash
dig +short NS rbitecnologia.com.br
```

- Se aparecerem servidores do Registro.br (`*.auth.nic.br`): edite a zona no painel do Registro.br (o nome exato dos menus pode variar).
- Se aparecerem servidores do HostGator: o Registro.br só aponta para eles; os registros se editam **no HostGator** (cPanel → *Zone Editor*). Mudar os servidores DNS no Registro.br obriga a recriar todos os registros, inclusive os do e-mail.

Registros a criar/alterar (troque `IP_DA_VPS`):

| Nome | Tipo | Valor |
|---|---|---|
| `rbitecnologia.com.br` (`@`) | A | `IP_DA_VPS` |
| `www` | CNAME | `rbitecnologia.com.br.` (ou A para o mesmo IP) |

**Não apague nem altere os registros de e-mail** (MX, e os TXT de SPF/DKIM, e o host `mail`): o e-mail `comercial@rbitecnologia.com.br` depende deles. Só o `@` e o `www` mudam. Antes, baixe o TTL desses registros para 300 s para poder voltar atrás rápido. Confira: `dig +short rbitecnologia.com.br` deve mostrar o IP da VPS.

### 2. Preparar a VPS (uma vez)

```bash
sudo apt update && sudo apt install -y nginx certbot rsync
sudo mkdir -p /var/www/rbitecnologia /var/www/certbot
sudo chown -R "$USER": /var/www/rbitecnologia
```

Abra as portas 80 e 443 (firewall da VPS/`ufw`). Se a VPS já tem outros sites no Nginx, tudo bem: os blocos se separam por `server_name`. O Caddy não convive com Nginx/Apache nas mesmas portas.

### 3. Primeiro envio + certificado HTTPS (Nginx)

```bash
# a) configuração provisória (só HTTP) para o certbot validar o domínio
sudo cp servidor/nginx-provisorio.conf /etc/nginx/sites-available/rbitecnologia.com.br
sudo ln -sf /etc/nginx/sites-available/rbitecnologia.com.br /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default      # só se o "default" estiver em conflito
sudo nginx -t && sudo systemctl reload nginx

# b) enviar o site (do seu computador, na pasta do projeto)
bash scripts/publicar.sh usuario@IP_DA_VPS

# c) emitir o certificado (o DNS já precisa apontar para a VPS). Teste antes com --dry-run:
sudo certbot certonly --webroot -w /var/www/certbot -d rbitecnologia.com.br -d www.rbitecnologia.com.br --dry-run
sudo certbot certonly --webroot -w /var/www/certbot -d rbitecnologia.com.br -d www.rbitecnologia.com.br

# d) trocar pela configuração final (HTTPS)
sudo cp servidor/nginx.conf /etc/nginx/sites-available/rbitecnologia.com.br
sudo nginx -t && sudo systemctl reload nginx
sudo certbot renew --dry-run                     # confere a renovação automática
```

Se a VPS não tiver IPv6, apague as linhas `listen [::]:...` do `nginx.conf` (sem isso o `nginx -t` falha).

**Caddy (alternativa):** `sudo apt install -y caddy rsync`, copie `servidor/Caddyfile` para `/etc/caddy/Caddyfile`, crie e libere `/var/www/rbitecnologia` como acima, `sudo systemctl reload caddy` e envie o site com `publicar.sh`. O HTTPS sai sozinho.

### 4. Atualizar o site depois

```bash
bash scripts/publicar.sh usuario@IP_DA_VPS      # mostra uma simulação e pede confirmação
```

O script usa `rsync --delete`: a pasta de destino deve ser **só deste site**, pois o que não existir aqui é apagado lá. A simulação lista o que será apagado antes de você confirmar. Não envia `.htaccess` (use `APACHE=1` só se a VPS usar Apache).

### 5. Conferir

```bash
curl -sI http://rbitecnologia.com.br/ | head -3         # 301 para https://rbitecnologia.com.br/
curl -sI https://www.rbitecnologia.com.br/ | head -3    # 301 para https://rbitecnologia.com.br/
curl -sI https://rbitecnologia.com.br/nao-existe/ | head -1   # 404 (com a página do site)
```

Depois: envie `https://rbitecnologia.com.br/sitemap.xml` no Google Search Console.

## Alternativa: hospedagem compartilhada com Apache (HostGator/cPanel)

O site é 100% estático: basta colocar os arquivos em `public_html`. O `.htaccess` incluso cuida de HTTPS, `www` → sem `www`, cache, compressão e da página 404.

**Antes de subir (importante)**

1. **Veja o que já existe em `public_html`** (cPanel → Gerenciador de Arquivos). O domínio já tem e-mail, então pode haver um site ou arquivos lá. Faça backup (botão *Compress*) antes de substituir qualquer coisa. O e-mail não é afetado por trocar os arquivos do site.
2. **Confirme o SSL ativo**: cPanel → *SSL/TLS Status* → *Run AutoSSL*. O `.htaccess` força HTTPS; sem certificado, o site fica inacessível.
3. O `.htaccess` assume o domínio `rbitecnologia.com.br` (sem `www`). Se o site ficar em outro endereço ou em subpasta, edite o arquivo e os caminhos `/css/...` (o site precisa estar na raiz do domínio).

**Subir**

```bash
bash scripts/empacotar.sh        # gera deploy/teatende-site.zip (só o que vai ao servidor)
```

1. cPanel → Gerenciador de Arquivos → `public_html` → **Carregar** o `teatende-site.zip`.
2. Clique com o botão direito no zip → **Extract** (extraia em `public_html`). Marque *Show Hidden Files (dotfiles)* nas configurações para ver o `.htaccess`.
3. Apague o zip do servidor depois de extrair.

**Conferir depois de subir**

- `http://rbitecnologia.com.br`, `https://www.rbitecnologia.com.br` e `http://www...` redirecionam para `https://rbitecnologia.com.br/`.
- `/segmentos/`, `/sistema-para-padaria/` e um endereço inexistente (deve mostrar a página 404 do site).
- Se o site inteiro der **Erro 500**, renomeie o `.htaccess` para `htaccess.txt` (o site volta sem as regras) e investigue.
- Depois: envie `https://rbitecnologia.com.br/sitemap.xml` no Google Search Console.

**Atualizar depois**: edite, rode `bash scripts/empacotar.sh` de novo e extraia o novo zip por cima (*Overwrite*). Alternativa, se o seu plano tiver *Git Version Control* no cPanel: clone este repositório e use um `.cpanel.yml` para copiar os arquivos (não incluído, pois depende do usuário do cPanel).

## Estrutura

- `index.html` — home (contato e rodapé legal estão no HTML, visíveis sem JS).
- `css/style.css` — tokens de cor em `light-dark()`; o tema segue o sistema ou o botão (`[data-theme]`).
- `js/segmentos.js` — fonte de verdade do conteúdo: `CONFIG`, segmentos, `AREAS` (os 6 módulos oficiais: ERP, Financeiro, Fiscal, Produção, Balança, Ponto), funcionalidades (`MODULOS`), descrições e documentos fiscais.
- `js/app.js` (home), `js/comum.js` (tema, menu, ano — todas as páginas), `js/icones.js`.
- `scripts/gerar-paginas.mjs` — gerador (Node 18+, sem dependências). `scripts/publicar.sh` — envia à VPS por rsync/SSH. `scripts/empacotar.sh` — gera o zip para hospedagem compartilhada.
- `servidor/` — `nginx.conf`, `nginx-provisorio.conf` e `Caddyfile` para a VPS.
- `.htaccess` — regras do Apache (só para Apache: hospedagem compartilhada ou VPS com Apache). `404.html` é gerada.
- `fonts/` — Plus Jakarta Sans (latin) hospedada localmente. `img/` — logos em WebP, `og-image.png` (1200×630), `apple-touch-icon.png`.

## Pendências

- **Contato duplicado:** WhatsApp, e-mail e endereço existem no `index.html` e em `CONFIG` (as páginas geradas leem de `CONFIG`). Ao mudar, altere nos dois.
- **Textos dos segmentos** (`js/segmentos.js`) são rascunho comercial, inclusive as descrições em `MODULOS_DESC`: remova qualquer recurso que o sistema não tenha. Revise também a terceira dor de `danca` ("Matrícula e rematrícula em papel"), cuja solução não a resolve.
- **Módulos (`AREAS`):** a classificação das 15 funcionalidades nos 6 módulos é decisão de produto e foi feita por inferência: confirme. O **Ponto** só tem a descrição "controle de ponto e da jornada dos funcionários" e nenhum segmento o lista ainda; ao incluir `"ponto"` em `modulos` de um segmento, ele aparece na página dele.
- Logo em SVG (hoje WebP) e política de privacidade (LGPD) ainda não existem.
