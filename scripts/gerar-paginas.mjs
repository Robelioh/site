// Gera as páginas estáticas por segmento, o hub /segmentos/, sitemap.xml, robots.txt
// e a lista de links na home, a partir de js/segmentos.js.
//
//   node scripts/gerar-paginas.mjs
//
// Rode de novo sempre que editar js/segmentos.js e faça commit dos arquivos gerados.
// Não há dependências: só Node 18+.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { CONFIG, GRUPOS, MODULOS, MODULOS_DESC, DOCS_FISCAIS, SEGMENTOS } from "../js/segmentos.js";
import { ICONES } from "../js/icones.js";

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), "..");
const SITE = CONFIG.site;
const HOJE = new Date().toISOString().slice(0, 10);
const avisos = [];

/* ---------- utilidades ---------- */
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
const semPonto = (s) => s.replace(/[.!\s]+$/, "");
const minuscula1 = (s) => s.charAt(0).toLowerCase() + s.slice(1);
const lista = (a) => (a.length < 2 ? a.join("") : a.slice(0, -1).join(", ") + " e " + a[a.length - 1]);
const svg = (n, t = 24) => `<svg viewBox="0 0 24 24" width="${t}" height="${t}" aria-hidden="true">${ICONES[n] || ""}</svg>`;
const json = (o) => JSON.stringify(o, null, 2).replace(/</g, "\\u003c");
const urlSeg = (s) => `/sistema-para-${s.slug}/`;
const linkZap = (msg) => `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(msg)}`;
const grava = (rel, txt) => { const f = join(RAIZ, rel); mkdirSync(dirname(f), { recursive: true }); writeFileSync(f, txt); };

const ETAPAS = [
  ["Diagnóstico", "Conversamos com quem opera o dia a dia para entender processos, documentos fiscais emitidos e o que precisa ser migrado."],
  ["Configuração e migração", "Cadastros de clientes, produtos e fornecedores trazidos do sistema anterior, parâmetros fiscais configurados e certificado digital instalado."],
  ["Treinamento", "Treinamento por função — caixa, faturamento, financeiro — com os dados reais da sua empresa."],
  ["Acompanhamento", "Suporte próximo nas primeiras semanas de uso, quando as dúvidas reais aparecem."],
];

/* ---------- layout comum (cabeçalho, rodapé, scripts) ---------- */
function layout({ titulo, descricao, caminho, jsonld, conteudo }) {
  const url = SITE + caminho;
  if (titulo.length > 65) avisos.push(`título longo (${titulo.length}): ${caminho}`);
  if (descricao.length > 160) avisos.push(`description longa (${descricao.length}): ${caminho}`);
  return `<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(titulo)}</title>
  <meta name="description" content="${esc(descricao)}">
  <link rel="canonical" href="${url}">
  <meta property="og:title" content="${esc(titulo)}">
  <meta property="og:description" content="${esc(descricao)}">
  <meta property="og:type" content="website">
  <meta property="og:locale" content="pt_BR">
  <meta property="og:site_name" content="TeAtende — RBI Tecnologia em Gestão">
  <meta property="og:url" content="${url}">
  <meta property="og:image" content="${SITE}/img/og-image.png">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:alt" content="TeAtende — Tecnologia e Gestão">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="theme-color" content="#F5F7FA" media="(prefers-color-scheme: light)">
  <meta name="theme-color" content="#0A1424" media="(prefers-color-scheme: dark)">
  <link rel="icon" type="image/png" href="/img/favicon.png">
  <link rel="apple-touch-icon" href="/img/apple-touch-icon.png">
  <link rel="preload" href="/fonts/plus-jakarta-sans-latin.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="stylesheet" href="/css/style.css">
  <script>
    try { const t = localStorage.getItem("tema"); if (t) document.documentElement.dataset.theme = t; } catch (e) {}
  </script>
</head>
<body>
  <a class="skip" href="#conteudo">Pular para o conteúdo</a>

  <header class="topo" id="topo">
    <div class="wrap topo__in">
      <a href="/" class="marca" aria-label="Te Atende — Tecnologia e Gestão — início">
        <img class="logo-claro" src="/img/logo.webp" alt="Te Atende — Tecnologia e Gestão" width="951" height="175" loading="lazy">
        <img class="logo-escuro" src="/img/logo-escuro.webp" alt="" width="951" height="175" loading="lazy">
      </a>
      <nav class="menu" id="menu" aria-label="Principal">
        <a href="/segmentos/">Segmentos</a>
        <a href="/#modulos">Módulos</a>
        <a href="/#implantacao">Implantação</a>
        <a href="/#sobre">Sobre</a>
        <a href="/#contato">Contato</a>
      </nav>
      <div class="topo__acoes">
        <button class="btn-icone" id="btnTema" type="button" aria-label="Alternar tema claro/escuro">
          <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path class="sol" d="M12 4V2m0 20v-2m8-8h2M2 12h2m13.66 5.66 1.41 1.41M4.93 4.93l1.41 1.41m11.32-1.41 1.41-1.41M4.93 19.07l1.41-1.41M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10Z"/><path class="lua" d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8Z"/></svg>
        </button>
        <a class="btn btn--pri btn--sm esconde-mob" href="/#contato">Agendar demonstração</a>
        <button class="btn-icone mostra-mob" id="btnMenu" type="button" aria-label="Abrir menu" aria-expanded="false" aria-controls="menu">
          <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>
        </button>
      </div>
    </div>
  </header>

  <main id="conteudo">
${conteudo}
  </main>

  <footer class="rodape">
    <div class="wrap rodape__in">
      <div>
        <a href="/" class="marca" aria-label="Voltar ao início">
          <img class="logo-claro" src="/img/logo.webp" alt="Te Atende — Tecnologia e Gestão" width="951" height="175" loading="lazy">
          <img class="logo-escuro" src="/img/logo-escuro.webp" alt="" width="951" height="175" loading="lazy">
        </a>
        <p>RBI Tecnologia em Gestão — desenvolvedora do sistema TeAtende.</p>
      </div>
      <div class="rodape__legal">
        <span>${esc(CONFIG.razaoSocial)}</span>
        <span>CNPJ ${esc(CONFIG.cnpj)}</span>
        <span>${esc(CONFIG.endereco)} · ${esc(CONFIG.cidade)} · CEP ${esc(CONFIG.cep)}</span>
      </div>
    </div>
    <div class="wrap">
      <p class="rodape__copy">© <span id="ano"></span> RBI Tecnologia em Gestão. Todos os direitos reservados.</p>
    </div>
  </footer>

  <script type="application/ld+json">
${json(jsonld.length === 1 ? jsonld[0] : jsonld)}
  </script>

  <a class="zap" href="${linkZap(`Olá! Quero conhecer o ${CONFIG.produto}.`)}" target="_blank" rel="noopener" aria-label="Conversar no WhatsApp">
    <svg viewBox="0 0 24 24" width="28" height="28" aria-hidden="true"><path fill="currentColor" stroke="none" d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.3-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.1-1.2l-.5-.3Z"/></svg>
  </a>

  <script type="module" src="/js/comum.js"></script>
</body>
</html>
`;
}

const breadcrumb = (itens) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: itens.map(([nome, caminho], i) => ({ "@type": "ListItem", position: i + 1, name: nome, item: SITE + caminho })),
});

/* ---------- página de um segmento ---------- */
function relacionados(s) {
  const mesmo = SEGMENTOS.filter((x) => x.id !== s.id && x.grupo === s.grupo);
  const resto = SEGMENTOS.filter((x) => x.id !== s.id && x.grupo !== s.grupo);
  return [...mesmo, ...resto].slice(0, 5);
}

function paginaSegmento(s) {
  const kw = s.kw, Kw = cap(kw);
  const mods = s.modulos.map((m) => MODULOS[m]);
  const docs = s.modulos.filter((m) => DOCS_FISCAIS[m]);
  const caminho = urlSeg(s);
  const titulo = `Sistema para ${kw} | ERP TeAtende`;

  let descricao = "";
  for (const n of [3, 2, 0]) {
    const com = n ? ` com ${lista(mods.slice(0, n))}` : "";
    descricao = `${semPonto(s.frase)}. ERP TeAtende${com} para ${kw}. Peça uma demonstração.`;
    if (descricao.length <= 160) break;
  }

  const msgZap = `Olá! Tenho uma empresa do segmento ${s.nome} e quero conhecer o ${CONFIG.produto}.`;
  const btnZap = `<a class="btn btn--pri btn--lg" href="${linkZap(msgZap)}" target="_blank" rel="noopener">${svg("zap", 18)} Falar no WhatsApp</a>`;
  const btnDemo = `<a class="btn btn--sec btn--lg" href="/?segmento=${s.id}#contato">Agendar demonstração</a>`;

  const faq = [
    [`O TeAtende serve para ${kw}?`, `Sim. O TeAtende tem fluxos pensados para a rotina de ${kw}. ${s.frase} Neste segmento, os módulos mais usados são ${lista(mods)}.`],
    ...(docs.length ? [[`Quais documentos fiscais o sistema emite para ${kw}?`, `Neste segmento o TeAtende emite ${lista(docs.map((m) => DOCS_FISCAIS[m][0]))}, com XML armazenado e enviado ao contador.`]] : []),
    ["Consigo migrar os dados do sistema que uso hoje?", "Sim. Na etapa de configuração e migração, os cadastros de clientes, produtos e fornecedores são trazidos do sistema anterior, os parâmetros fiscais são configurados e o certificado digital é instalado."],
    ["Como é a implantação do TeAtende?", "Em quatro etapas: diagnóstico, configuração e migração, treinamento por função com os dados reais da empresa e acompanhamento próximo nas primeiras semanas de uso."],
    ["Quem dá suporte ao sistema?", `O suporte é feito pela equipe da RBI Tecnologia em Gestão, que desenvolve o TeAtende, de ${CONFIG.cidade}. O contato é pelo WhatsApp ${CONFIG.whatsappExibir} ou por e-mail.`],
    ["Como peço uma demonstração?", "Pelo WhatsApp ou pelo formulário do site. A demonstração é feita com o fluxo do seu segmento, sem compromisso."],
    ...(s.faq || []),
  ];

  const secoes = [];
  secoes.push(`
      <h2>Problemas comuns no segmento de ${esc(kw)} e como o TeAtende resolve</h2>
      <div class="pg-pares">${s.dores.map((d, i) => `
        <div class="gav__linha">
          <div class="gav__dor">${esc(d)}</div>
          <span class="gav__seta">${svg("seta", 20)}</span>
          <div class="gav__sol">${esc(s.solucoes[i] || "")}</div>
        </div>`).join("")}
      </div>`);
  secoes.push(`
      <h2>Módulos do TeAtende para ${esc(kw)}</h2>
      <div class="mods">${s.modulos.map((m) => `
        <article class="mod"><h3>${esc(MODULOS[m])}</h3><p>${esc(MODULOS_DESC[m] || "")}</p></article>`).join("")}
      </div>`);
  if (docs.length) {
    secoes.push(`
      <h2>Documentos fiscais no segmento de ${esc(kw)}</h2>
      <dl class="docs">${docs.map((m) => { const [sigla, nome, txt] = DOCS_FISCAIS[m]; return `
        <div><dt>${esc(sigla)}<small>${esc(nome)}</small></dt><dd>${esc(txt)}</dd></div>`; }).join("")}
      </dl>`);
  }
  secoes.push(`
      <h2>Implantação sem parar a empresa</h2>
      <ol class="etapas">${ETAPAS.map(([t, p], i) => `
        <li class="etapa"><h3 class="etapa__tit"><span class="etapa__n" aria-hidden="true">${i + 1}</span>${esc(t)}</h3><p class="etapa__corpo">${esc(p)}</p></li>`).join("")}
      </ol>`);
  secoes.push(`
      <h2>Perguntas frequentes sobre sistema para ${esc(kw)}</h2>
      <div class="faq">${faq.map(([q, a]) => `
        <details><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join("")}
      </div>`);
  secoes.push(`
      <div class="cta-final">
        <h2>Vamos ver o TeAtende na rotina de ${esc(kw)}?</h2>
        <p>Conte rapidamente sobre sua empresa. A demonstração é feita com o fluxo do seu segmento, sem compromisso.</p>
        <div class="pg-cta">${btnZap}${btnDemo}</div>
      </div>
      <nav class="rel" aria-label="Outros segmentos">
        <h2>Outros segmentos atendidos</h2>
        <ul>${relacionados(s).map((x) => `<li><a href="${urlSeg(x)}">${esc(x.nome)}</a></li>`).join("")}<li><a href="/segmentos/">Ver todos os segmentos</a></li></ul>
      </nav>`);

  const conteudo = `    <section class="pg-hero">
      <div class="wrap">
        <nav class="crumbs" aria-label="Você está em"><ol>
          <li><a href="/">Início</a></li><li><a href="/segmentos/">Segmentos</a></li><li aria-current="page">${esc(s.nome)}</li>
        </ol></nav>
        <p class="selo">${esc(GRUPOS[s.grupo])}</p>
        <h1>ERP para ${esc(kw)}: ${esc(minuscula1(semPonto(s.frase)))}</h1>
        <p class="hero__sub">O TeAtende é o ERP da RBI Tecnologia em Gestão, de ${esc(CONFIG.cidade)}, configurado para a rotina de ${esc(kw)}: ${esc(lista(mods))}.</p>
        <div class="pg-cta">${btnZap}${btnDemo}</div>
        <ul class="pg-chips" aria-label="Módulos deste segmento">${mods.map((m) => `<li>${esc(m)}</li>`).join("")}</ul>
      </div>
    </section>
${secoes.map((h, i) => `
    <section class="secao${i % 2 === 0 ? " secao--alt" : ""}">
      <div class="wrap">${h}
      </div>
    </section>`).join("\n")}`;

  const jsonld = [
    breadcrumb([["Início", "/"], ["Segmentos", "/segmentos/"], [s.nome, caminho]]),
    {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: `${CONFIG.produto} — ERP para ${kw}`,
      applicationCategory: "BusinessApplication",
      description: descricao,
      url: SITE + caminho,
      provider: { "@type": "Organization", name: CONFIG.empresa, url: SITE + "/" },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faq.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
    },
  ];
  return { caminho, html: layout({ titulo, descricao, caminho, jsonld, conteudo }), palavras: conteudo.replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length };
}

/* ---------- hub /segmentos/ ---------- */
function paginaHub() {
  const caminho = "/segmentos/";
  const titulo = "Sistema ERP por segmento | TeAtende";
  const descricao = `ERP TeAtende para ${SEGMENTOS.length} segmentos: transportadora, comércio, indústria, oficinas, agro e mais. Escolha o seu e veja os módulos.`;
  const grupos = Object.entries(GRUPOS).filter(([k]) => SEGMENTOS.some((s) => s.grupo === k));
  const conteudo = `    <section class="pg-hero">
      <div class="wrap">
        <nav class="crumbs" aria-label="Você está em"><ol><li><a href="/">Início</a></li><li aria-current="page">Segmentos</li></ol></nav>
        <p class="selo">Segmentos</p>
        <h1>Sistema ERP por segmento: escolha o seu negócio</h1>
        <p class="hero__sub">O TeAtende é configurado para a rotina de cada setor. Veja os problemas do dia a dia que ele resolve e os módulos usados no seu segmento.</p>
      </div>
    </section>
    <section class="secao secao--alt">
      <div class="wrap">${grupos.map(([k, nome]) => `
        <div class="hub-grupo">
          <h2>${esc(nome)}</h2>
          <div class="seg-grid">${SEGMENTOS.filter((s) => s.grupo === k).map((s) => `
            <a class="seg" href="${urlSeg(s)}">
              <span class="seg__ico">${svg(s.icone)}</span>
              <h3>Sistema para ${esc(s.kw)}</h3>
              <p>${esc(s.frase)}</p>
              <span class="seg__mais">Ver como funciona ${svg("seta", 16)}</span>
            </a>`).join("")}
          </div>
        </div>`).join("")}
      </div>
    </section>`;
  const jsonld = [
    breadcrumb([["Início", "/"], ["Segmentos", caminho]]),
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: titulo,
      url: SITE + caminho,
      mainEntity: { "@type": "ItemList", itemListElement: SEGMENTOS.map((s, i) => ({ "@type": "ListItem", position: i + 1, name: `Sistema para ${s.kw}`, url: SITE + urlSeg(s) })) },
    },
  ];
  return { caminho, html: layout({ titulo, descricao, caminho, jsonld, conteudo }) };
}

/* ---------- execução ---------- */
const slugs = new Set();
const paginas = SEGMENTOS.map((s) => {
  if (!s.slug || !s.kw) throw new Error(`segmento "${s.id}" sem slug/kw`);
  if (slugs.has(s.slug)) throw new Error(`slug duplicado: ${s.slug}`);
  slugs.add(s.slug);
  return paginaSegmento(s);
});
const hub = paginaHub();
for (const p of [...paginas, hub]) grava(p.caminho.slice(1) + "index.html", p.html);

// sitemap.xml e robots.txt
const urls = ["/", hub.caminho, ...paginas.map((p) => p.caminho)];
grava("sitemap.xml", `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((u) => `  <url><loc>${SITE}${u}</loc><lastmod>${HOJE}</lastmod></url>`).join("\n")}\n</urlset>\n`);
grava("robots.txt", `User-agent: *\nAllow: /\n\nSitemap: ${SITE}/sitemap.xml\n`);

// links rastreáveis na home (entre os marcadores)
const homePath = join(RAIZ, "index.html");
let home = readFileSync(homePath, "utf8");
const ini = "<!-- SEG-LINKS:INI -->", fim = "<!-- SEG-LINKS:FIM -->";
if (!home.includes(ini) || !home.includes(fim)) throw new Error("marcadores SEG-LINKS não encontrados em index.html");
const bloco = `${ini}
        <nav class="seg-links" aria-label="Páginas por segmento">
          <h3>Página completa de cada segmento</h3>
          <ul>${SEGMENTOS.map((s) => `<li><a href="${urlSeg(s)}">Sistema para ${esc(s.kw)}</a></li>`).join("")}</ul>
        </nav>
        ${fim}`;
home = home.replace(new RegExp(`${ini}[\\s\\S]*?${fim}`), bloco);
writeFileSync(homePath, home);

console.log(`${paginas.length} páginas de segmento + hub + sitemap (${urls.length} URLs) + robots.txt`);
for (const p of paginas) console.log(`  ${p.caminho.padEnd(40)} ~${p.palavras} palavras`);
if (avisos.length) console.log("\nAVISOS:\n  " + avisos.join("\n  "));
