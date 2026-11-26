// Comportamento comum a todas as páginas: alternância de tema, menu mobile e ano do rodapé.
const $ = (s, el = document) => el.querySelector(s);

/* ---------- Tema ---------- */
$("#btnTema")?.addEventListener("click", () => {
  const root = document.documentElement;
  const escuroAtual = root.dataset.theme
    ? root.dataset.theme === "dark"
    : matchMedia("(prefers-color-scheme: dark)").matches;
  root.dataset.theme = escuroAtual ? "light" : "dark";
  try { localStorage.setItem("tema", root.dataset.theme); } catch (e) {}
});

/* ---------- Menu mobile e topo ---------- */
const menu = $("#menu"), btnMenu = $("#btnMenu");
const mobile = matchMedia("(max-width: 760px)");
// No mobile o menu fechado fica fora da tela: `inert` o tira da ordem de foco e do leitor de tela.
function menuAberto(aberto) {
  menu.classList.toggle("aberto", aberto);
  btnMenu.setAttribute("aria-expanded", aberto);
  btnMenu.setAttribute("aria-label", aberto ? "Fechar menu" : "Abrir menu");
  menu.inert = mobile.matches && !aberto;
}
btnMenu.addEventListener("click", () => menuAberto(!menu.classList.contains("aberto")));
menu.addEventListener("click", (e) => { if (e.target.closest("a")) menuAberto(false); });
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && menu.classList.contains("aberto")) { menuAberto(false); btnMenu.focus(); }
});
mobile.addEventListener("change", () => menuAberto(false));
menuAberto(false);

const topo = $("#topo");
addEventListener("scroll", () => topo.classList.toggle("rolado", scrollY > 8), { passive: true });

$("#ano").textContent = new Date().getFullYear();
