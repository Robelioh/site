# Site TeAtende — RBI Tecnologia em Gestão

Site estático (HTML + CSS + JS puro, sem build).

## Rodar localmente

O JS usa módulos ES (`<script type="module">`), que **não funcionam abrindo `index.html` por duplo clique** (`file://`). Sirva a pasta:

```bash
python3 -m http.server 8000
```

Depois abra http://localhost:8000.

## Estrutura

- `index.html` — conteúdo e SEO (contato e rodapé legal estão no HTML, visíveis sem JS).
- `css/style.css` — tokens de cor em `light-dark()`; o tema segue o sistema ou o botão (`[data-theme]`).
- `js/segmentos.js` — conteúdo dos 17 segmentos e `CONFIG` (WhatsApp, e-mail, endereço).
- `js/app.js` — interações (busca, filtros, gaveta `<dialog>`, formulário → WhatsApp).
- `fonts/` — Plus Jakarta Sans (latin) hospedada localmente.
- `img/` — logos em WebP, `og-image.png` (1200×630) e `apple-touch-icon.png` (180×180).

## Pendências antes de publicar

- **Domínio:** `og:url`, `og:image` e o JSON-LD assumem `https://rbitecnologia.com.br/`. Confirme/ajuste e adicione `<link rel="canonical">`.
- **Contato duplicado:** WhatsApp, e-mail e endereço existem no `index.html` (para funcionar sem JS) e em `CONFIG`. Altere nos dois.
- **Textos dos segmentos** (`js/segmentos.js`) são rascunho comercial: remova qualquer recurso que o sistema não tenha.
- Logo em SVG (hoje WebP) e política de privacidade (LGPD) ainda não existem.
