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

## Estrutura

- `index.html` — home (contato e rodapé legal estão no HTML, visíveis sem JS).
- `css/style.css` — tokens de cor em `light-dark()`; o tema segue o sistema ou o botão (`[data-theme]`).
- `js/segmentos.js` — fonte de verdade do conteúdo: `CONFIG`, segmentos, `AREAS` (os 6 módulos oficiais: ERP, Financeiro, Fiscal, Produção, Balança, Ponto), funcionalidades (`MODULOS`), descrições e documentos fiscais.
- `js/app.js` (home), `js/comum.js` (tema, menu, ano — todas as páginas), `js/icones.js`.
- `scripts/gerar-paginas.mjs` — gerador (Node 18+, sem dependências).
- `fonts/` — Plus Jakarta Sans (latin) hospedada localmente. `img/` — logos em WebP, `og-image.png` (1200×630), `apple-touch-icon.png`.

## Pendências

- **Contato duplicado:** WhatsApp, e-mail e endereço existem no `index.html` e em `CONFIG` (as páginas geradas leem de `CONFIG`). Ao mudar, altere nos dois.
- **Textos dos segmentos** (`js/segmentos.js`) são rascunho comercial, inclusive as descrições em `MODULOS_DESC`: remova qualquer recurso que o sistema não tenha. Revise também a terceira dor de `danca` ("Matrícula e rematrícula em papel"), cuja solução não a resolve.
- **Módulos (`AREAS`):** a classificação das 15 funcionalidades nos 6 módulos é decisão de produto e foi feita por inferência: confirme. O **Ponto** só tem a descrição "controle de ponto e da jornada dos funcionários" e nenhum segmento o lista ainda; ao incluir `"ponto"` em `modulos` de um segmento, ele aparece na página dele.
- Logo em SVG (hoje WebP) e política de privacidade (LGPD) ainda não existem.
