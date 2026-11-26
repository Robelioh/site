import "./comum.js";
import { ICONES } from "./icones.js";
import { CONFIG, GRUPOS, MODULOS, SEGMENTOS } from "./segmentos.js";

(() => {
  /* ---------- Ícones (SVG em traço) ---------- */
  const svg = (n, t = 24) => `<svg viewBox="0 0 24 24" width="${t}" height="${t}" aria-hidden="true">${ICONES[n] || ""}</svg>`;

  const $ = (s, el = document) => el.querySelector(s);
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const norm = (s) => String(s).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
  const linkZap = (msg) => `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(msg)}`;

  /* ---------- Segmentos ---------- */
  const grid = $("#segGrid"), filtros = $("#filtros");
  let grupoAtivo = "todos";
  $("#qtdSegmentos").textContent = SEGMENTOS.length;

  function renderFiltros() {
    const cont = SEGMENTOS.reduce((a, s) => ((a[s.grupo] = (a[s.grupo] || 0) + 1), a), {});
    const itens = [["todos", "Todos", SEGMENTOS.length], ...Object.entries(GRUPOS).filter(([k]) => cont[k]).map(([k, v]) => [k, v, cont[k]])];
    filtros.innerHTML = itens.map(([k, v, n]) =>
      `<button class="filtro" type="button" data-grupo="${k}" aria-pressed="${k === grupoAtivo}">${esc(v)}<span>${n}</span></button>`
    ).join("");
  }
  function renderGrid() {
    const lista = grupoAtivo === "todos" ? SEGMENTOS : SEGMENTOS.filter((s) => s.grupo === grupoAtivo);
    grid.innerHTML = lista.map((s, i) => `
      <button class="seg" type="button" data-id="${s.id}" style="animation-delay:${i * 30}ms">
        <span class="seg__ico">${svg(s.icone)}</span>
        <h3>${esc(s.nome)}</h3>
        <p>${esc(s.frase)}</p>
        <span class="seg__mais">Ver como funciona ${svg("seta", 16)}</span>
      </button>`).join("");
  }
  filtros.addEventListener("click", (e) => {
    const b = e.target.closest(".filtro"); if (!b) return;
    grupoAtivo = b.dataset.grupo; renderFiltros(); renderGrid();
    filtros.querySelector(`[data-grupo="${grupoAtivo}"]`).focus();
  });
  grid.addEventListener("click", (e) => {
    const b = e.target.closest(".seg"); if (b) abrirSegmento(b.dataset.id, b);
  });
  renderFiltros(); renderGrid();

  /* ---------- Gaveta de detalhe ---------- */
  const gaveta = $("#gaveta"), gavConteudo = $("#gavConteudo");
  let empilhado = false; // true quando abrimos a gaveta com pushState (o Voltar do navegador a fecha)

  function abrirSegmento(id, origem, { historico = true } = {}) {
    const s = SEGMENTOS.find((x) => x.id === id); if (!s) return;
    const linhas = s.dores.map((d, i) => `
      <div class="gav__linha">
        <div class="gav__dor">${esc(d)}</div>
        <span class="gav__seta">${svg("seta", 20)}</span>
        <div class="gav__sol">${esc(s.solucoes[i] || "")}</div>
      </div>`).join("");
    const msg = `Olá! Tenho uma empresa do segmento ${s.nome} e quero conhecer o ${CONFIG.produto}.`;
    gavConteudo.innerHTML = `
      <div class="gav__ico">${svg(s.icone, 28)}</div>
      <p class="selo">${esc(GRUPOS[s.grupo])}</p>
      <h2 id="gavTitulo">${esc(s.nome)}</h2>
      <p class="gav__frase">${esc(s.frase)}</p>
      <div class="gav__bloco">
        <h3>O problema → como o TeAtende resolve</h3>
        <div class="gav__par">${linhas}</div>
      </div>
      <div class="gav__bloco">
        <h3>Módulos envolvidos</h3>
        <div class="gav__mods">${s.modulos.map((m) => `<span>${esc(MODULOS[m] || m)}</span>`).join("")}</div>
      </div>
      <div class="gav__cta">
        <a class="btn btn--pri btn--lg" href="${linkZap(msg)}" target="_blank" rel="noopener">${svg("zap", 18)} Falar sobre ${esc(s.nome.toLowerCase())}</a>
        <button class="btn btn--sec btn--lg" type="button" data-agendar="${s.id}">Agendar demonstração</button>
        <a class="btn btn--sec btn--lg" href="/sistema-para-${s.slug}/">Ver página completa</a>
      </div>`;
    if (gaveta.open) { history.replaceState(null, "", `#segmento-${s.id}`); return; }
    if (historico) { history.pushState(null, "", `#segmento-${s.id}`); empilhado = true; }
    else history.replaceState(null, "", `#segmento-${s.id}`);
    // showModal: foco preso na gaveta, Esc fecha, resto da página fica inerte, foco volta a quem abriu
    gaveta.showModal();
  }
  // Qualquer fechamento (X, Esc, clique no fundo, Voltar) passa por aqui.
  gaveta.addEventListener("close", () => {
    if (empilhado) { empilhado = false; history.back(); }
    else if (location.hash.startsWith("#segmento-")) history.replaceState(null, "", location.pathname + location.search);
  });
  // Botão Voltar (ou gesto no celular) com a gaveta aberta: fecha a gaveta, não sai da página.
  addEventListener("popstate", () => { if (gaveta.open) { empilhado = false; gaveta.close(); } });
  gaveta.addEventListener("click", (e) => {
    // e.target === gaveta: clique no fundo (::backdrop) ou fora do painel
    if (e.target === gaveta || e.target.closest("[data-fechar]")) return gaveta.close();
    const ag = e.target.closest("[data-agendar]");
    if (ag) {
      // sem history.back() aqui: ele competiria com o scroll até o formulário
      empilhado = false;
      history.replaceState(null, "", location.pathname + location.search);
      gaveta.close();
      preencherSegmento(ag.dataset.agendar);
      $("#contato").scrollIntoView();
      setTimeout(() => $("#fNome").focus({ preventScroll: true }), 400);
    }
  });
  // Link direto: site/#segmento-padaria
  const m = location.hash.match(/^#segmento-(.+)$/);
  if (m) setTimeout(() => abrirSegmento(m[1], null, { historico: false }), 100);

  /* ---------- Busca por intenção ---------- */
  const campo = $("#campoBusca"), sug = $("#buscaSug");
  let resultados = [], sel = -1;

  function pontuar(q) {
    const termos = norm(q).split(/\s+/).filter((t) => t.length > 1);
    if (!termos.length) return [];
    return SEGMENTOS.map((s) => {
      const base = norm(`${s.nome} ${s.termos}`);
      const pal = base.split(/\s+/);
      let p = 0;
      termos.forEach((t) => {
        if (norm(s.nome).startsWith(t)) p += 5;
        if (pal.some((w) => w === t)) p += 4;
        else if (pal.some((w) => w.startsWith(t))) p += 3;
        else if (base.includes(t)) p += 1;
      });
      return { s, p };
    }).filter((x) => x.p > 0).sort((a, b) => b.p - a.p).slice(0, 5).map((x) => x.s);
  }
  function mostrarSug() {
    if (!resultados.length) {
      sug.innerHTML = campo.value.trim().length > 1
        ? `<li role="option" id="sug-0" data-outro="1" aria-selected="${sel === 0}"><span>Não achou? Fale com a gente sobre “${esc(campo.value.trim())}”</span><small>WhatsApp</small></li>`
        : "";
    } else {
      sug.innerHTML = resultados.map((s, i) =>
        `<li role="option" id="sug-${i}" data-id="${s.id}" aria-selected="${i === sel}"><span>${esc(s.nome)}</span><small>${esc(GRUPOS[s.grupo])}</small></li>`
      ).join("");
    }
    sug.hidden = !sug.innerHTML;
    campo.setAttribute("aria-expanded", String(!sug.hidden));
    if (sel >= 0 && !sug.hidden) campo.setAttribute("aria-activedescendant", `sug-${sel}`);
    else campo.removeAttribute("aria-activedescendant");
  }
  function escolher(li) {
    if (!li) return;
    sug.hidden = true;
    campo.setAttribute("aria-expanded", "false");
    if (li.dataset.outro) {
      window.open(linkZap(`Olá! Tenho uma empresa de ${campo.value.trim()} e quero saber se o ${CONFIG.produto} atende.`), "_blank", "noopener");
      return;
    }
    irPara(li.dataset.id);
  }
  function irPara(id) {
    grupoAtivo = "todos"; renderFiltros(); renderGrid();
    const card = grid.querySelector(`[data-id="${id}"]`);
    $("#segmentos").scrollIntoView();
    if (card) {
      card.classList.add("destaque");
      setTimeout(() => card.classList.remove("destaque"), 2200);
      setTimeout(() => abrirSegmento(id, card), 550);
    }
  }
  campo.addEventListener("input", () => { resultados = pontuar(campo.value); sel = -1; mostrarSug(); });
  campo.addEventListener("keydown", (e) => {
    const n = sug.querySelectorAll("li").length;
    if (e.key === "ArrowDown" && n) { e.preventDefault(); sel = (sel + 1) % n; mostrarSug(); }
    else if (e.key === "ArrowUp" && n) { e.preventDefault(); sel = (sel - 1 + n) % n; mostrarSug(); }
    else if (e.key === "Escape") { sug.hidden = true; campo.setAttribute("aria-expanded", "false"); }
  });
  campo.addEventListener("blur", () => setTimeout(() => { sug.hidden = true; campo.setAttribute("aria-expanded", "false"); }, 150));
  sug.addEventListener("mousedown", (e) => { e.preventDefault(); escolher(e.target.closest("li")); });
  $("#formBusca").addEventListener("submit", (e) => {
    e.preventDefault();
    const lis = sug.querySelectorAll("li");
    if (sel >= 0 && lis[sel]) return escolher(lis[sel]);
    resultados = pontuar(campo.value);
    if (resultados[0]) irPara(resultados[0].id);
    else if (campo.value.trim()) { mostrarSug(); }
    else $("#segmentos").scrollIntoView();
  });
  $("#chipsRapidos").innerHTML = ["transporte", "padaria", "oficina", "construtora", "agropecuaria"]
    .map((id) => SEGMENTOS.find((s) => s.id === id)).filter(Boolean)
    .map((s) => `<button class="chip" type="button" data-id="${s.id}">${esc(s.nome.split(" ")[0])}</button>`).join("");
  $("#chipsRapidos").addEventListener("click", (e) => { const c = e.target.closest(".chip"); if (c) irPara(c.dataset.id); });

  /* ---------- Contato ---------- */
  const fSeg = $("#fSegmento");
  fSeg.innerHTML += SEGMENTOS.map((s) => `<option value="${s.id}">${esc(s.nome)}</option>`).join("") + `<option value="outro">Outro</option>`;
  function preencherSegmento(id) { fSeg.value = id; }
  const segUrl = new URLSearchParams(location.search).get("segmento");
  if (segUrl && SEGMENTOS.some((x) => x.id === segUrl)) preencherSegmento(segUrl);

  const fTel = $("#fTel");
  fTel.addEventListener("input", () => {
    const d = fTel.value.replace(/\D/g, "").slice(0, 11);
    fTel.value = d.length > 10 ? d.replace(/(\d{2})(\d{5})(\d{0,4})/, "($1) $2-$3")
      : d.length > 6 ? d.replace(/(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3")
      : d.length > 2 ? d.replace(/(\d{2})(\d+)/, "($1) $2") : d;
  });

  // Erro anunciado por leitor de tela (aria-invalid + mensagem ligada por aria-describedby), não só pela cor.
  function marcarErro(el, erro) {
    el.setAttribute("aria-invalid", String(erro));
    const msg = $(`#erro-${el.id}`);
    if (msg) msg.hidden = !erro;
  }
  $("#formContato").addEventListener("input", (e) => {
    if (e.target.getAttribute("aria-invalid") === "true") marcarErro(e.target, false);
  });

  $("#formContato").addEventListener("submit", (e) => {
    e.preventDefault();
    const f = e.target, aviso = $("#formAviso");
    let ok = true;
    f.querySelectorAll("[required]").forEach((el) => {
      const valido = el.id === "fTel" ? el.value.replace(/\D/g, "").length >= 10 : el.value.trim() !== "";
      marcarErro(el, !valido);
      if (!valido && ok) { el.focus(); ok = false; }
    });
    if (!ok) { aviso.textContent = "Corrija os campos indicados."; return; }
    aviso.textContent = "";
    const seg = SEGMENTOS.find((s) => s.id === fSeg.value);
    const txt = [
      `Olá! Quero agendar uma demonstração do ${CONFIG.produto}.`,
      `Nome: ${f.nome.value.trim()}`,
      `Empresa: ${f.empresa.value.trim()}`,
      `Segmento: ${seg ? seg.nome : "Outro"}`,
      `Telefone: ${f.telefone.value.trim()}`,
      f.mensagem.value.trim() ? `Situação atual: ${f.mensagem.value.trim()}` : "",
    ].filter(Boolean).join("\n");
    window.open(linkZap(txt), "_blank", "noopener");
    aviso.textContent = "Abrimos o WhatsApp com sua mensagem pronta. É só tocar em enviar.";
  });

  /* ---------- Revelação ao rolar ---------- */
  const alvos = document.querySelectorAll(".secao__cab, .bento__item, .etapa, .valores li, .form");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((ents) => ents.forEach((en) => {
      if (en.isIntersecting) { en.target.classList.add("visivel"); io.unobserve(en.target); }
    }), { threshold: 0.12 });
    alvos.forEach((el) => { el.classList.add("revela"); io.observe(el); });
  }

})();
