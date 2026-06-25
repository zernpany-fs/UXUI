/* AppNest — Top apps per OS. Data + renderer for os.html (?os=macos|ios|ipados). */
(function () {
  const OS_DATA = {
    macos: {
      name: "macOS", glyph: "", os: "macOS",
      tagline: "The apps power users keep within a keystroke on the Mac.",
      apps: [
        { id: "raycast",     name: "Raycast",      dev: "Raycast Inc.",        cat: "Productivity", rating: 4.9, price: "Free",        blurb: "Launcher, window manager and AI commands in one bar.", href: "article.html" },
        { id: "obsidian",    name: "Obsidian",     dev: "Obsidian.md",          cat: "Productivity", rating: 4.7, price: "Free",        blurb: "A local-first knowledge base with a huge plugin scene." },
        { id: "cleanshot-x", name: "CleanShot X",  dev: "MakeTheWeb",           cat: "Utilities",    rating: 4.8, price: "$29",        blurb: "Screenshots and screen recording done properly." },
        { id: "things-3-mac",name: "Things 3",     dev: "Cultured Code",        cat: "Productivity", rating: 4.6, price: "$49.99",     blurb: "The most elegant task manager on the Mac." },
        { id: "bartender",   name: "Bartender 5",  dev: "Surtees Studios",      cat: "Utilities",    rating: 4.3, price: "$16",        blurb: "Tame and hide your menu-bar icons." },
        { id: "fantastical", name: "Fantastical",  dev: "Flexibits",            cat: "Productivity", rating: 4.5, price: "Free · IAP",  blurb: "Natural-language calendar; advanced features need a plan." },
        { id: "pixelmator-pro", name: "Pixelmator Pro", dev: "Pixelmator Team", cat: "Creative",     rating: 4.8, price: "$49.99",     blurb: "Pro image editing, fully native and fast." },
        { id: "istat-menus", name: "iStat Menus",  dev: "Bjango",               cat: "Utilities",    rating: 4.6, price: "$12",        blurb: "Deep system stats living in your menu bar." },
      ],
    },
    ios: {
      name: "iOS", glyph: "", os: "iOS",
      tagline: "The iPhone apps worth a spot on your home screen.",
      apps: [
        { id: "halide",      name: "Halide Mark II", dev: "Lux Optics",        cat: "Photography",  rating: 4.7, price: "$11.99/yr",  blurb: "A pro camera with manual controls and RAW capture." },
        { id: "things-3-ios",name: "Things 3",     dev: "Cultured Code",        cat: "Productivity", rating: 4.8, price: "$9.99",      blurb: "Award-winning task manager, now with widgets." },
        { id: "overcast",    name: "Overcast",     dev: "Marco Arment",         cat: "Media",        rating: 4.6, price: "Free",        blurb: "Smart-speed podcast player built by an indie dev." },
        { id: "bear",        name: "Bear",         dev: "Shiny Frog",           cat: "Productivity", rating: 4.5, price: "Free · IAP",  blurb: "Beautiful markdown notes; cross-device sync via Bear Pro." },
        { id: "flighty",     name: "Flighty",      dev: "Flighty Inc.",         cat: "Travel",       rating: 4.9, price: "Free · IAP",  blurb: "Live flight tracking; Pro unlocks predictive delays." },
        { id: "ivory-ios",   name: "Ivory",        dev: "Tapbots",              cat: "Social",       rating: 4.4, price: "Free · IAP",  blurb: "A polished Mastodon client from the Tweetbot team." },
        { id: "carrot",      name: "CARROT Weather", dev: "Grailr",             cat: "Weather",      rating: 4.7, price: "Free · IAP",  blurb: "Hyper-accurate forecasts with a sarcastic AI." },
        { id: "streaks",     name: "Streaks",      dev: "Crunchy Bagel",        cat: "Health",       rating: 4.6, price: "$4.99",      blurb: "The to-do list that helps you build habits." },
      ],
    },
    ipados: {
      name: "iPadOS", glyph: "", os: "iPadOS",
      tagline: "The apps that make the iPad a real creative machine.",
      apps: [
        { id: "procreate",   name: "Procreate",    dev: "Savage Interactive",   cat: "Creative",     rating: 4.8, price: "$12.99",     blurb: "The gold-standard illustration app for Apple Pencil." },
        { id: "goodnotes",   name: "GoodNotes 6",  dev: "Time Base Tech",       cat: "Productivity", rating: 4.5, price: "Free · IAP",  blurb: "Handwritten notes with an infinite canvas." },
        { id: "lumafusion",  name: "LumaFusion",   dev: "LumaTouch",            cat: "Creative",     rating: 4.8, price: "$29.99",     blurb: "Multi-track video editing that rivals desktop apps." },
        { id: "affinity",    name: "Affinity Designer 2", dev: "Serif",         cat: "Creative",     rating: 4.6, price: "$18.49",     blurb: "Pro vector design, no subscription required." },
        { id: "notability",  name: "Notability",   dev: "Ginger Labs",          cat: "Productivity", rating: 4.3, price: "Free · IAP",  blurb: "Note-taking with audio sync and PDF markup." },
        { id: "concepts",    name: "Concepts",     dev: "TopHatch",             cat: "Creative",     rating: 4.6, price: "Free · IAP",  blurb: "An infinite, flexible sketchbook for thinking." },
        { id: "craft",       name: "Craft",        dev: "Luki Labs",            cat: "Productivity", rating: 4.5, price: "Free · IAP",  blurb: "Structured docs that feel native to the iPad." },
        { id: "figma-ipad",  name: "Figma",        dev: "Figma Inc.",           cat: "Design",       rating: 4.2, price: "Free",        blurb: "Design and prototype on the big screen with Pencil." },
      ],
    },
  };

  const initials = (name) =>
    name.replace(/[^A-Za-z0-9 ]/g, "").split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase();

  /* tint each app icon by category so the list doesn't read as one wall of blue */
  const ACCENT = {
    Productivity: "--sky", Travel: "--sky", Social: "--sky", Weather: "--sky",
    Creative: "--strawberry", Design: "--strawberry", Media: "--strawberry", Health: "--strawberry",
    Utilities: "--charcoal", Developer: "--charcoal", Photography: "--charcoal",
  };

  function cardHTML(app, rank, os, key) {
    const r = String(rank).padStart(2, "0");
    const href = app.href || ("os.html?os=" + key);
    const aVar = ACCENT[app.cat] || "--sky";
    const iconStyle = "background-image:linear-gradient(135deg, rgb(var(" + aVar + ")), rgb(var(--ink)))";
    const isFree = app.price === "Free";
    return (
      '<article class="os-card group relative rounded-xl2 border border-border bg-surface overflow-hidden hover:border-primary/50 transition-colors flex flex-col" style="opacity:0">' +
        // cover — mirrors the news featured card (grid-backdrop + badge + bookmark)
        '<div class="relative aspect-[16/9] bg-surface2 grid-backdrop grid place-items-center border-b border-border">' +
          '<span class="grid place-items-center w-16 h-16 rounded-2xl text-white font-bold text-xl shadow-lg" style="' + iconStyle + '">' +
            initials(app.name) + "</span>" +
          '<span class="absolute top-3 left-3 inline-flex items-center h-7 px-2.5 rounded-full bg-bg/80 backdrop-blur eyebrow font-bold ' +
            (rank <= 3 ? "text-primary" : "text-muted") + '">#' + r + "</span>" +
          '<button data-bookmark data-id="' + app.id + '" data-title="' + app.name + '" data-category="' + os +
            '" data-meta="' + app.cat + '" data-href="' + href +
            '" aria-label="Save ' + app.name + '" class="bookmark-btn absolute top-3 right-3"></button>' +
        "</div>" +
        // body
        '<div class="p-5 flex flex-col flex-1">' +
          '<div class="flex items-center gap-2 eyebrow text-muted mb-2">' +
            '<span class="text-primary">' + app.cat + "</span><span>·</span>" +
            '<span class="' + (isFree ? "text-primary font-semibold" : "") + '">' + app.price + "</span>" +
          "</div>" +
          '<h3 class="font-bold text-lg leading-snug group-hover:text-primary transition-colors">' + app.name + "</h3>" +
          '<p class="text-sm text-muted mt-2 leading-relaxed line-clamp-2 flex-1">' + app.blurb + "</p>" +
          '<div class="mt-4 flex items-center gap-3 text-sm">' +
            '<span class="font-mono text-muted">★ ' + app.rating.toFixed(1) + "</span>" +
            '<span class="tick-rule flex-1"></span>' +
            '<a href="' + href + '" class="font-semibold text-primary hover:underline">Get →</a>' +
          "</div>" +
        "</div>" +
      "</article>"
    );
  }

  function render() {
    const key = (new URLSearchParams(location.search).get("os") || "macos").toLowerCase();
    const data = OS_DATA[key] || OS_DATA.macos;
    const $ = (s) => document.querySelector(s);

    document.title = "Top " + data.name + " apps — AppNest";
    $("[data-os-name]").textContent = data.name;
    $("[data-os-tagline]").textContent = data.tagline;
    $("[data-os-count]").textContent = data.apps.length;

    // active nav state
    document.querySelectorAll("[data-os-link]").forEach((a) => {
      const active = a.dataset.osLink === key;
      a.classList.toggle("text-text", active);
      a.classList.toggle("text-muted", !active);
    });

    // category chips
    const cats = ["All", ...Array.from(new Set(data.apps.map((a) => a.cat)))];
    const chipHost = $("[data-os-filters]");
    chipHost.innerHTML = cats
      .map((c, i) => '<button data-os-filter="' + c + '" aria-pressed="' + (i === 0) +
        '" class="filter-chip">' + c + "</button>")
      .join("");

    const listHost = $("[data-os-list]");
    function paint(cat) {
      const apps = cat === "All" ? data.apps : data.apps.filter((a) => a.cat === cat);
      listHost.innerHTML = apps.map((a) => cardHTML(a, data.apps.indexOf(a) + 1, data.os, key)).join("");
      window.AppNestBookmarks && window.AppNestBookmarks.mount(listHost);

      // signature anime.js stagger entrance (matches the news feed feel)
      const cards = listHost.querySelectorAll(".os-card");
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (window.anime && !reduce) {
        anime({ targets: cards, opacity: [0, 1], translateY: [14, 0],
          delay: anime.stagger(45), easing: "easeOutCubic", duration: 520 });
      } else {
        cards.forEach((c) => (c.style.opacity = 1));
      }
    }
    chipHost.querySelectorAll("[data-os-filter]").forEach((chip) => {
      chip.addEventListener("click", () => {
        chipHost.querySelectorAll("[data-os-filter]").forEach((c) => c.setAttribute("aria-pressed", "false"));
        chip.setAttribute("aria-pressed", "true");
        paint(chip.dataset.osFilter);
      });
    });
    paint("All");
  }

  document.addEventListener("DOMContentLoaded", render);
})();
