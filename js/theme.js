(() => {
  const root = document.documentElement;
  const button = document.getElementById("theme-toggle");
  const key = "genjutsu-theme-v2";

  let saved = null;
  try { saved = localStorage.getItem(key); } catch (_) {}
  const initial = saved === "light" ? "light" : "dark";
  root.setAttribute("data-theme", initial);
  updateLabel(initial);

  function updateLabel(theme) {
    if (button) button.setAttribute("aria-label", theme === "dark" ? "Switch to light theme" : "Switch to dark theme");
  }
  button?.addEventListener("click", () => {
    const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    updateLabel(next);
    try { localStorage.setItem(key, next); } catch (_) {}
  });
})();
