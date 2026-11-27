// Gera uma página estática por segmento (solucoes/<id>/index.html), o sitemap.xml
// e a lista de links do rodapé do index.html, a partir de js/segmentos.js.
// Uso (na pasta do site): node tools/gerar-paginas.js
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const raiz = path.join(__dirname, "..");
const BASE = "https://www.rbitecnologia.com.br";
const hoje = new Date().toISOString().slice(0, 10);

const ctx = {};
vm.createContext(ctx);
vm.runInContext(
  fs.readFileSync(path.join(raiz, "js", "segmentos.js"), "utf8") +
    "\nthis.CONFIG=CONFIG;this.GRUPOS=GRUPOS;this.MODULOS=MODULOS;this.SEGMENTOS=SEGMENTOS;",
  ctx
);
const { CONFIG, GRUPOS, MODULOS, SEGMENTOS } = ctx;

const esc = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

function pagina(seg) {
  const url = `${BASE}/solucoes/${seg.id}/`;
  const titulo = `Sistema para ${seg.nome} | ${CONFIG.produto} ERP — ${CONFIG.empresa}`;
  const desc = `${seg.frase} ${CONFIG.produto}: sistema de gestão para ${seg.nome.toLowerCase()} com ${seg.modulos
    .slice(0, 4)
    .map((m) => MODULOS[m])
    .join(", ")}. ${CONFIG.cidade}.`;
  const zap = `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(
    `Olá! Tenho ${seg.nome.toLowerCase()} e quero ver o ${CONFIG.produto}.`
  )}`;
  const li = (a) => a.map((t) => `<li>${esc(t)}</li>`).join("\n          ");
  const ld = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: titulo,
    url,
    description: desc,
    isPartOf: { "@type": "WebSite", name: CONFIG.empresa, url: BASE + "/" },
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Início", item: BASE + "/" },
        { "@type": "ListItem", position: 2, name: seg.nome, item: url },
      ],
    },
  };
  return `<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(titulo)}</title>
  <meta name="description" content="${esc(desc)}">
  <link rel="canonical" href="${url}">
  <meta name="robots" content="index, follow, max-image-preview:large">
  <meta property="og:title" content="${esc(titulo)}">
  <meta property="og:description" content="${esc(desc)}">
  <meta property="og:type" content="website">
  <meta property="og:url" content="${url}">
  <meta property="og:site_name" content="${esc(CONFIG.empresa)}">
  <meta property="og:locale" content="pt_BR">
  <meta property="og:image" content="${BASE}/img/logo.png">
  <meta name="theme-color" content="#0F3159">
  <link rel="icon" type="image/png" href="/img/favicon.png">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="/css/style.css">
  <script>
    try { const t = localStorage.getItem("tema"); if (t) document.documentElement.dataset.theme = t; } catch (e) {}
  </script>
  <script type="application/ld+json">${JSON.stringify(ld)}</script>
</head>
<body>
  <header class="topo">
    <div class="wrap topo__in">
      <a href="/" class="marca" aria-label="${esc(CONFIG.empresa)} — início">
        <img class="logo-claro" src="/img/logo.png" alt="Te Atende — Tecnologia e Gestão" width="951" height="175">
        <img class="logo-escuro" src="/img/logo-escuro.png" alt="" width="951" height="175">
      </a>
      <div class="topo__acoes">
        <a class="btn btn--pri btn--sm" href="${zap}" target="_blank" rel="noopener">Falar no WhatsApp</a>
      </div>
    </div>
  </header>

  <main>
    <section class="secao">
      <div class="wrap">
        <header class="secao__cab">
          <p class="selo">${esc(GRUPOS[seg.grupo] || "Segmentos")}</p>
          <h1>Sistema de gestão para ${esc(seg.nome.toLowerCase())}</h1>
          <p>${esc(seg.frase)}</p>
        </header>

        <h2>Problemas comuns no dia a dia</h2>
        <ul>
          ${li(seg.dores)}
        </ul>

        <h2>Como o ${esc(CONFIG.produto)} resolve</h2>
        <ul>
          ${li(seg.solucoes)}
        </ul>

        <h2>Módulos para ${esc(seg.nome.toLowerCase())}</h2>
        <ul class="pilulas">
          ${seg.modulos.map((m) => `<li>${esc(MODULOS[m] || m)}</li>`).join("\n          ")}
        </ul>

        <p style="margin-top:2rem">
          <a class="btn btn--pri btn--lg" href="${zap}" target="_blank" rel="noopener">Agendar demonstração</a>
          <a class="btn" href="/#segmentos">Ver outros segmentos</a>
        </p>
      </div>
    </section>
  </main>

  <footer class="rodape">
    <div class="wrap">
      <p class="rodape__copy">© ${new Date().getFullYear()} ${esc(CONFIG.empresa)} — ${esc(CONFIG.cidade)}. Todos os direitos reservados.</p>
    </div>
  </footer>
</body>
</html>
`;
}

for (const seg of SEGMENTOS) {
  const dir = path.join(raiz, "solucoes", seg.id);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, "index.html"), pagina(seg), "utf8");
}

const urls = [`<url><loc>${BASE}/</loc><lastmod>${hoje}</lastmod></url>`].concat(
  SEGMENTOS.map((s) => `<url><loc>${BASE}/solucoes/${s.id}/</loc><lastmod>${hoje}</lastmod></url>`)
);
fs.writeFileSync(
  path.join(raiz, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  ${urls.join("\n  ")}\n</urlset>\n`,
  "utf8"
);

// Links rastreáveis no rodapé do index.html (entre os marcadores)
const idx = path.join(raiz, "index.html");
let html = fs.readFileSync(idx, "utf8");
const bloco =
  "<!-- LINKS-SEGMENTOS -->\n      <nav class=\"wrap\" aria-label=\"Segmentos atendidos\"><p class=\"rodape__copy\">" +
  SEGMENTOS.map((s) => `<a href="/solucoes/${s.id}/">${esc(s.nome)}</a>`).join(" · ") +
  "</p></nav>\n      <!-- /LINKS-SEGMENTOS -->";
if (/<!-- LINKS-SEGMENTOS -->/.test(html)) {
  html = html.replace(/<!-- LINKS-SEGMENTOS -->[\s\S]*?<!-- \/LINKS-SEGMENTOS -->/, bloco);
} else {
  html = html.replace('    <div class="wrap">\n      <p class="rodape__copy">', `    ${bloco}\n    <div class="wrap">\n      <p class="rodape__copy">`);
}
fs.writeFileSync(idx, html, "utf8");
console.log(`${SEGMENTOS.length} páginas geradas`);
