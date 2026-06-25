/* AppNest — bookmark / "save for later" system + toast.
   Persists to localStorage so saves survive reloads and sync across pages. */
(function () {
  const KEY = "appnest-bookmarks";

  const read = () => {
    try { return JSON.parse(localStorage.getItem(KEY)) || []; }
    catch (e) { return []; }
  };
  const write = (arr) => localStorage.setItem(KEY, JSON.stringify(arr));
  const has = (id) => read().some((x) => x.id === id);

  /* ---- toast ---- */
  function toast(msg) {
    let host = document.querySelector("[data-toast-host]");
    if (!host) {
      host = document.createElement("div");
      host.setAttribute("data-toast-host", "");
      host.className = "toast-host";
      document.body.appendChild(host);
    }
    const t = document.createElement("div");
    t.className = "toast";
    t.textContent = msg;
    host.appendChild(t);
    requestAnimationFrame(() => t.classList.add("is-in"));
    setTimeout(() => {
      t.classList.remove("is-in");
      setTimeout(() => t.remove(), 320);
    }, 2400);
  }

  /* ---- bookmark icon markup ---- */
  function iconMarkup() {
    return (
      '<svg class="bm-outline w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 4h12a1 1 0 0 1 1 1v15l-7-4-7 4V5a1 1 0 0 1 1-1Z"/></svg>' +
      '<svg class="bm-filled w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M6 3h12a1 1 0 0 1 1 1v16l-7-4-7 4V4a1 1 0 0 1 1-1Z"/></svg>'
    );
  }

  /* ---- UI sync ---- */
  function updateCounts() {
    const n = read().length;
    document.querySelectorAll("[data-bookmark-count]").forEach((el) => {
      el.textContent = n;
      el.classList.toggle("hidden", n === 0);
    });
  }
  function syncButtons(scope) {
    (scope || document).querySelectorAll("[data-bookmark]").forEach((btn) => {
      const on = has(btn.dataset.id);
      btn.setAttribute("aria-pressed", on ? "true" : "false");
      const label = btn.querySelector("[data-bookmark-label]");
      if (label) label.textContent = on ? "Saved" : "Save";
    });
  }

  function toggle(btn) {
    const id = btn.dataset.id;
    if (!id) return;
    let list = read();
    if (list.some((x) => x.id === id)) {
      list = list.filter((x) => x.id !== id);
      write(list);
      toast("Removed from saved");
    } else {
      list.push({
        id,
        title: btn.dataset.title || "",
        category: btn.dataset.category || "",
        meta: btn.dataset.meta || "",
        href: btn.dataset.href || "#",
      });
      write(list);
      toast("★ Saved for later");
    }
    syncButtons();
    updateCounts();
    return has(id);
  }

  function bind(btn) {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      const stillSaved = toggle(btn);
      // on the saved page, drop the card when un-saved
      const host = document.querySelector("[data-saved-list]");
      if (host && !stillSaved) renderSaved(host);
    });
  }

  /* ---- saved page renderer ---- */
  function renderSaved(host) {
    const list = read();
    const empty = document.querySelector("[data-saved-empty]");
    const countEl = document.querySelector("[data-saved-total]");
    if (countEl) countEl.textContent = list.length;
    host.innerHTML = "";
    if (!list.length) {
      if (empty) empty.classList.remove("hidden");
      return;
    }
    if (empty) empty.classList.add("hidden");
    list.forEach((item) => {
      const el = document.createElement("article");
      el.style.opacity = "0";
      el.className =
        "saved-card group rounded-xl2 border border-border bg-surface p-5 flex items-start justify-between gap-4 hover:border-primary/50 transition-colors";
      el.innerHTML =
        '<a href="' + item.href + '" class="min-w-0">' +
          '<p class="eyebrow text-muted mb-2">' + (item.category || "") +
            (item.meta ? " · " + item.meta : "") + "</p>" +
          '<h3 class="font-bold leading-snug group-hover:text-primary transition-colors">' +
            item.title + "</h3>" +
        "</a>" +
        '<button data-bookmark data-id="' + item.id +
          '" aria-pressed="true" aria-label="Remove from saved" class="bookmark-btn shrink-0">' +
          iconMarkup() + "</button>";
      host.appendChild(el);
    });
    host.querySelectorAll("[data-bookmark]").forEach(bind);

    const cards = host.querySelectorAll(".saved-card");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (window.anime && !reduce) {
      anime({ targets: cards, opacity: [0, 1], translateY: [14, 0],
        delay: anime.stagger(45), easing: "easeOutCubic", duration: 520 });
    } else {
      cards.forEach((c) => (c.style.opacity = 1));
    }
  }

  /* fill icons + bind any not-yet-bound buttons in scope, then sync.
     Safe to call repeatedly (e.g. after rendering cards dynamically). */
  function mount(scope) {
    (scope || document).querySelectorAll("[data-bookmark]").forEach((btn) => {
      if (btn.dataset.bound) return;
      if (!btn.querySelector(".bm-outline")) btn.innerHTML = iconMarkup() +
        (btn.dataset.withLabel !== undefined
          ? '<span data-bookmark-label class="ml-1.5">Save</span>' : "");
      bind(btn);
      btn.dataset.bound = "1";
    });
    syncButtons(scope);
    updateCounts();
  }

  document.addEventListener("DOMContentLoaded", () => {
    mount(document);
    const host = document.querySelector("[data-saved-list]");
    if (host) renderSaved(host);
  });

  window.AppNestBookmarks = { read, toast, mount };
})();
