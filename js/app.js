(() => {
  "use strict";

  /* ---------- Ícones (SVG em traço) ---------- */
  const ICONES = {
    truck: '<path d="M3 6h11v10H3zM14 9h4l3 3v4h-7"/><circle cx="7" cy="17.5" r="1.8"/><circle cx="17" cy="17.5" r="1.8"/>',
    store: '<path d="M4 9 5.5 4h13L20 9M4 9v11h16V9M4 9h16M9 20v-6h6v6"/>',
    boot: '<path d="M7 3h6v8l6 3a2 2 0 0 1 1 1.7V19H4v-4l3-2V3ZM4 16h16"/>',
    wrench: '<path d="M14.7 6.3a4 4 0 0 0-5.4 5.2L3 17.8 6.2 21l6.3-6.3a4 4 0 0 0 5.2-5.4l-2.6 2.6-2.4-.5-.5-2.4 2.5-2.7Z"/>',
    tractor: '<circle cx="7" cy="16" r="4"/><circle cx="18" cy="17.5" r="2.5"/><path d="M5 12V6h6l2 6h6v3M9 6v6M15.5 17.5H11"/>',
    building: '<path d="M4 21V5l8-2v18M12 8h8v13M8 8v.01M8 12v.01M8 16v.01M16 12v.01M16 16v.01M2 21h20"/>',
    bottle: '<path d="M10 2h4v4l2 3v12a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1V9l2-3V2ZM8 13h8"/>',
    leaf: '<path d="M5 19c0-8 5-14 15-15-1 10-7 15-15 15ZM5 19l8-8"/>',
    bolt: '<path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z"/>',
    gear: '<circle cx="12" cy="12" r="3"/><path d="M12 2v3m0 14v3m10-10h-3M5 12H2m17.07-7.07-2.12 2.12M7.05 16.95l-2.12 2.12m14.14 0-2.12-2.12M7.05 7.05 4.93 4.93"/>',
    users: '<circle cx="9" cy="8" r="3.5"/><path d="M2 20a7 7 0 0 1 14 0M16 4.5a3.5 3.5 0 0 1 0 7M22 20a7 7 0 0 0-4-6.3"/>',
    recycle: '<path d="M7 19H4.8a1.8 1.8 0 0 1-1.6-2.7L5.4 12M11 19h8.2a1.8 1.8 0 0 0 1.6-2.7L18.6 12M9 5.2l1.5-2.4a1.8 1.8 0 0 1 3 0L16 7M8 15l3 4-3 4M3 9l2.4 3 3.6-1.5M19 5l-3 2 .5 3.8"/>',
    mountain: '<path d="m3 20 6-11 4 6 2-3 6 8H3ZM9 9l2 3"/>',
    gem: '<path d="M6 3h12l4 6-10 12L2 9l4-6ZM2 9h20M12 21 8 9l4-6 4 6-4 12"/>',
    bread: '<path d="M4 11a4 4 0 0 1 3-6.6C8.5 3.5 10.2 3 12 3s3.5.5 5 1.4A4 4 0 0 1 20 11v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-8ZM9 9l-1 3m5-3-1 3m5-3-1 3"/>',
    music: '<path d="M9 18V5l11-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="17" cy="16" r="3"/>',
    scale: '<path d="M12 3v18M5 21h14M5 7h14M5 7l-3 7a3 3 0 0 0 6 0L5 7Zm14 0-3 7a3 3 0 0 0 6 0l-3-7Z"/>',
    seta: '<path d="M5 12h14m-6-6 6 6-6 6"/>',
    zap: '<path d="M21 11.5a8.4 8.4 0 0 1-12.4 7.4L3 21l2.1-5.4A8.5 8.5 0 1 1 21 11.5Z"/>',
    mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
    phone: '<path d="M5 3h4l2 5-2.5 1.5a11 11 0 0 0 6 6L16 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 5a2 2 0 0 1 2-2Z"/>',
    pin: '<path d="M12 22s7-6.2 7-12a7 7 0 0 0-14 0c0 5.8 7 12 7 12Z"/><circle cx="12" cy="10" r="2.5"/>',
  };
  const svg = (n, t = 24) => `<svg viewBox="0 0 24 24" width="${t}" height="${t}" aria-hidden="true">${ICONES[n] || ""}</svg>`;

  const $ = (s, el = document) => el.querySelector(s);
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const norm = (s) => String(s).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
  const linkZap = (msg) => `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(msg)}`;

  /* ---------- Tema ---------- */
  $("#btnTema").addEventListener("click", () => {
    const root = document.documentElement;
    const escuroAtual = root.dataset.theme
      ? root.dataset.theme === "dark"
      : matchMedia("(prefers-color-scheme: dark)").matches;
    root.dataset.theme = escuroAtual ? "light" : "dark";
    try { localStorage.setItem("tema", root.dataset.theme); } catch (e) {}
  });

  /* ---------- Menu mobile e topo ---------- */
  const menu = $("#menu"), btnMenu = $("#btnMenu");
  btnMenu.addEventListener("click", () => {
    const aberto = menu.classList.toggle("aberto");
    btnMenu.setAttribute("aria-expanded", aberto);
  });
  menu.addEventListener("click", (e) => {
    if (e.target.closest("a")) { menu.classList.remove("aberto"); btnMenu.setAttribute("aria-expanded", "false"); }
  });
  const topo = $("#topo");
  addEventListener("scroll", () => topo.classList.toggle("rolado", scrollY > 8), { passive: true });

  /* ---------- Segmentos ---------- */
  const grid = $("#segGrid"), filtros = $("#filtros");
  let grupoAtivo = "todos";
  $("#qtdSegmentos").textContent = SEGMENTOS.length;

  function renderFiltros() {
    const cont = SEGMENTOS.reduce((a, s) => ((a[s.grupo] = (a[s.grupo] || 0) + 1), a), {});
    const itens = [["todos", "Todos", SEGMENTOS.length], ...Object.entries(GRUPOS).filter(([k]) => cont[k]).map(([k, v]) => [k, v, cont[k]])];
    filtros.innerHTML = itens.map(([k, v, n]) =>
      `<button class="filtro" role="tab" type="button" data-grupo="${k}" aria-selected="${k === grupoAtivo}">${esc(v)}<span>${n}</span></button>`
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
  });
  grid.addEventListener("click", (e) => {
    const b = e.target.closest(".seg"); if (b) abrirSegmento(b.dataset.id, b);
  });
  renderFiltros(); renderGrid();

  /* ---------- Gaveta de detalhe ---------- */
  const gaveta = $("#gaveta"), gavConteudo = $("#gavConteudo");
  let focoAnterior = null;

  function abrirSegmento(id, origem) {
    const s = SEGMENTOS.find((x) => x.id === id); if (!s) return;
    focoAnterior = origem || document.activeElement;
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
        <h4>O problema → como o TeAtende resolve</h4>
        <div class="gav__par">${linhas}</div>
      </div>
      <div class="gav__bloco">
        <h4>Módulos envolvidos</h4>
        <div class="gav__mods">${s.modulos.map((m) => `<span>${esc(MODULOS[m] || m)}</span>`).join("")}</div>
      </div>
      <div class="gav__cta">
        <a class="btn btn--pri btn--lg" href="${linkZap(msg)}" target="_blank" rel="noopener">${svg("zap", 18)} Falar sobre ${esc(s.nome.toLowerCase())}</a>
        <button class="btn btn--sec btn--lg" type="button" data-agendar="${s.id}">Agendar demonstração</button>
      </div>`;
    gaveta.hidden = false;
    document.body.style.overflow = "hidden";
    $(".gaveta__x").focus();
    history.replaceState(null, "", `#segmento-${s.id}`);
  }
  function fecharGaveta() {
    if (gaveta.hidden) return;
    gaveta.hidden = true;
    document.body.style.overflow = "";
    history.replaceState(null, "", location.pathname + location.search);
    if (focoAnterior && focoAnterior.focus) focoAnterior.focus();
  }
  gaveta.addEventListener("click", (e) => {
    if (e.target.closest("[data-fechar]")) return fecharGaveta();
    const ag = e.target.closest("[data-agendar]");
    if (ag) { fecharGaveta(); preencherSegmento(ag.dataset.agendar); $("#contato").scrollIntoView(); setTimeout(() => $("#fNome").focus({ preventScroll: true }), 400); }
  });
  document.addEventListener("keydown", (e) => {
    if (gaveta.hidden) return;
    if (e.key === "Escape") return fecharGaveta();
    if (e.key === "Tab") { // prende o foco dentro da gaveta
      const f = gaveta.querySelectorAll("a[href],button:not([disabled])");
      const p = f[0], u = f[f.length - 1];
      if (e.shiftKey && document.activeElement === p) { e.preventDefault(); u.focus(); }
      else if (!e.shiftKey && document.activeElement === u) { e.preventDefault(); p.focus(); }
    }
  });
  // Link direto: site/#segmento-padaria
  const m = location.hash.match(/^#segmento-(.+)$/);
  if (m) setTimeout(() => abrirSegmento(m[1]), 100);

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
        ? `<li role="option" data-outro="1"><span>Não achou? Fale com a gente sobre “${esc(campo.value.trim())}”</span><small>WhatsApp</small></li>`
        : "";
    } else {
      sug.innerHTML = resultados.map((s, i) =>
        `<li role="option" id="sug-${i}" data-id="${s.id}" aria-selected="${i === sel}"><span>${esc(s.nome)}</span><small>${esc(GRUPOS[s.grupo])}</small></li>`
      ).join("");
    }
    sug.hidden = !sug.innerHTML;
  }
  function escolher(li) {
    if (!li) return;
    sug.hidden = true;
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
    else if (e.key === "Escape") { sug.hidden = true; }
  });
  campo.addEventListener("blur", () => setTimeout(() => (sug.hidden = true), 150));
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

  /* ---------- Implantação (etapas) ---------- */
  const etapas = $("#etapas");
  etapas.addEventListener("click", (e) => {
    const b = e.target.closest(".etapa__btn"); if (!b) return;
    etapas.querySelectorAll(".etapa").forEach((li) => {
      const at = li.contains(b);
      li.classList.toggle("ativa", at);
      li.querySelector(".etapa__btn").setAttribute("aria-expanded", at);
    });
  });

  /* ---------- Contato ---------- */
  const fSeg = $("#fSegmento");
  fSeg.innerHTML += SEGMENTOS.map((s) => `<option value="${s.id}">${esc(s.nome)}</option>`).join("") + `<option value="outro">Outro</option>`;
  function preencherSegmento(id) { fSeg.value = id; }

  $("#contatoDados").innerHTML = `
    <li>${svg("zap", 20)}<a href="${linkZap(`Olá! Quero conhecer o ${CONFIG.produto}.`)}" target="_blank" rel="noopener">${esc(CONFIG.whatsappExibir)} <span class="fino">· WhatsApp</span></a></li>
    <li>${svg("mail", 20)}<a href="mailto:${esc(CONFIG.email)}">${esc(CONFIG.email)}</a></li>
    ${CONFIG.telefone ? `<li>${svg("phone", 20)}<a href="tel:+55${CONFIG.telefone.replace(/\D/g, "")}">${esc(CONFIG.telefone)}</a></li>` : ""}
    <li>${svg("pin", 20)}<a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${CONFIG.endereco}, ${CONFIG.cidade}, ${CONFIG.cep}`)}" target="_blank" rel="noopener">${esc(CONFIG.endereco)}<br><span class="fino">${esc(CONFIG.cidade)} · CEP ${esc(CONFIG.cep)}</span></a></li>`;
  $("#rodapeLegal").innerHTML = `
    <span>${esc(CONFIG.razaoSocial)}</span>
    <span>CNPJ ${esc(CONFIG.cnpj)}</span>
    <span>${esc(CONFIG.endereco)} · ${esc(CONFIG.cidade)} · CEP ${esc(CONFIG.cep)}</span>`;
  $("#zapFlutuante").href = linkZap(`Olá! Quero conhecer o ${CONFIG.produto}.`);

  const fTel = $("#fTel");
  fTel.addEventListener("input", () => {
    const d = fTel.value.replace(/\D/g, "").slice(0, 11);
    fTel.value = d.length > 10 ? d.replace(/(\d{2})(\d{5})(\d{0,4})/, "($1) $2-$3")
      : d.length > 6 ? d.replace(/(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3")
      : d.length > 2 ? d.replace(/(\d{2})(\d+)/, "($1) $2") : d;
  });

  $("#formContato").addEventListener("submit", (e) => {
    e.preventDefault();
    const f = e.target, aviso = $("#formAviso");
    let ok = true;
    f.querySelectorAll("[required]").forEach((el) => {
      const valido = el.id === "fTel" ? el.value.replace(/\D/g, "").length >= 10 : el.value.trim() !== "";
      el.closest(".campo").classList.toggle("erro", !valido);
      if (!valido && ok) { el.focus(); ok = false; }
    });
    if (!ok) { aviso.textContent = "Preencha os campos destacados."; return; }
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

  $("#ano").textContent = new Date().getFullYear();
})();
