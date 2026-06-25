/* AppNest — theme toggle + light scroll animations (anime.js optional) */
(function () {
  const STORAGE_KEY = "appnest-theme";
  const root = document.documentElement;

  /* ---------- Theme ---------- */
  function applyTheme(theme) {
    if (theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
    document.querySelectorAll("[data-theme-label]").forEach((el) => {
      el.textContent = theme === "dark" ? "Dark" : "Light";
    });
  }

  const saved = localStorage.getItem(STORAGE_KEY);
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  let theme = saved || (prefersDark ? "dark" : "light");
  applyTheme(theme);

  function toggleTheme() {
    theme = root.classList.contains("dark") ? "light" : "dark";
    root.classList.add("theming");
    applyTheme(theme);
    localStorage.setItem(STORAGE_KEY, theme);
    window.setTimeout(() => root.classList.remove("theming"), 400);
  }

  /* ---------- Wire up after DOM ready ---------- */
  document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll("[data-theme-toggle]").forEach((btn) =>
      btn.addEventListener("click", toggleTheme)
    );

    /* mobile nav */
    const menuBtn = document.querySelector("[data-menu-toggle]");
    const menu = document.querySelector("[data-mobile-menu]");
    if (menuBtn && menu) {
      menuBtn.addEventListener("click", () => menu.classList.toggle("hidden"));
    }

    /* filter chips (visual active state only) */
    document.querySelectorAll("[data-filter-group]").forEach((group) => {
      group.querySelectorAll("[data-filter]").forEach((chip) => {
        chip.addEventListener("click", () => {
          group.querySelectorAll("[data-filter]").forEach((c) =>
            c.setAttribute("aria-pressed", "false"));
          chip.setAttribute("aria-pressed", "true");
        });
      });
    });

    /* scroll reveal */
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const targets = document.querySelectorAll(".reveal");
    if (reduce || !("IntersectionObserver" in window)) {
      targets.forEach((t) => t.classList.add("is-in"));
    } else {
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((e, i) => {
            if (e.isIntersecting) {
              const delay = Number(e.target.dataset.delay || 0);
              setTimeout(() => e.target.classList.add("is-in"), delay);
              io.unobserve(e.target);
            }
          });
        },
        { threshold: 0.12 }
      );
      targets.forEach((t) => io.observe(t));

      /* subtle anime.js entrance on the hero kicker dots, if present */
      if (window.anime) {
        const dots = document.querySelectorAll("[data-anime-dot]");
        if (dots.length) {
          anime({
            targets: dots,
            opacity: [0, 1],
            translateY: [-6, 0],
            delay: anime.stagger(70),
            easing: "easeOutCubic",
            duration: 600,
          });
        }
      }
    }
  });
})();
