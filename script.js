(() => {
  "use strict";

  document.documentElement.classList.remove("no-js");

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  /* -----------------------------
     Theme Toggle (persist)
  ----------------------------- */
  const themeToggle = $("#themeToggle");
  const savedTheme = localStorage.getItem("kn_theme");
  if (savedTheme) document.documentElement.setAttribute("data-theme", savedTheme);

  const updateThemeIcon = () => {
    const theme = document.documentElement.getAttribute("data-theme") || "dark";
    if (!themeToggle) return;
    const icon = themeToggle.querySelector("[aria-hidden='true']");
    if (icon) icon.textContent = theme === "light" ? "☀" : "☾";
  };
  updateThemeIcon();

  themeToggle?.addEventListener("click", () => {
    const current = document.documentElement.getAttribute("data-theme") || "dark";
    const next = current === "light" ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("kn_theme", next);
    updateThemeIcon();
  });

  /* -----------------------------
     Mobile Nav
  ----------------------------- */
  const navToggle = $("#navToggle");
  const navMenu = $("#navMenu");

  const setNavOpen = (open) => {
    if (!navToggle || !navMenu) return;
    navToggle.setAttribute("aria-expanded", String(open));
    navMenu.classList.toggle("is-open", open);
  };

  navToggle?.addEventListener("click", () => {
    const open = navToggle.getAttribute("aria-expanded") === "true";
    setNavOpen(!open);
  });

  document.addEventListener("click", (e) => {
    if (!navMenu || !navToggle) return;
    const open = navToggle.getAttribute("aria-expanded") === "true";
    if (!open) return;

    const target = e.target;
    const clickedInside = navMenu.contains(target) || navToggle.contains(target);
    if (!clickedInside) setNavOpen(false);
  });

  $$(".nav__link").forEach((a) => a.addEventListener("click", () => setNavOpen(false)));

  /* -----------------------------
     Smooth Scroll w/ Header Offset
  ----------------------------- */
  const headerH = () => {
    const h = getComputedStyle(document.documentElement).getPropertyValue("--header-h").trim();
    const n = Number.parseFloat(h);
    return Number.isFinite(n) ? n : 76;
  };

  const smoothScrollTo = (id) => {
    const target = document.getElementById(id);
    if (!target) return;

    const y = window.scrollY + target.getBoundingClientRect().top - (headerH() + 12);
    window.scrollTo({ top: y, behavior: "smooth" });
  };

  $$('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const href = a.getAttribute("href");
      if (!href || href === "#") return;

      const id = href.slice(1);
      const target = document.getElementById(id);
      if (!target) return;

      e.preventDefault();
      smoothScrollTo(id);
      history.pushState(null, "", `#${id}`);
    });
  });

  window.addEventListener("load", () => {
    const hash = location.hash?.slice(1);
    if (hash) setTimeout(() => smoothScrollTo(hash), 50);
  });

  /* -----------------------------
     Scroll Progress
  ----------------------------- */
  const progressBar = $("#scrollProgressBar");
  const updateProgress = () => {
    if (!progressBar) return;
    const doc = document.documentElement;
    const scrollTop = doc.scrollTop || document.body.scrollTop;
    const scrollHeight = doc.scrollHeight - doc.clientHeight;
    const pct = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
    progressBar.style.width = `${pct}%`;
  };
  window.addEventListener("scroll", updateProgress, { passive: true });
  updateProgress();

  /* -----------------------------
     Scrollspy (active nav)
  ----------------------------- */
  const sectionIds = ["about", "skills", "projects", "documents", "videos", "gallery", "contact"];
  const navLinks = new Map();

  $$(".nav__link").forEach((a) => {
    const href = a.getAttribute("href");
    if (!href?.startsWith("#")) return;
    navLinks.set(href.slice(1), a);
  });

  const setActiveLink = (id) => {
    navLinks.forEach((a) => a.classList.remove("is-active"));
    const link = navLinks.get(id);
    if (link) link.classList.add("is-active");
  };

  const spyObserver = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((e) => e.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (visible?.target?.id) setActiveLink(visible.target.id);
    },
    {
      root: null,
      threshold: [0.12, 0.2, 0.35, 0.5],
      rootMargin: `-${Math.round(headerH())}px 0px -55% 0px`,
    }
  );

  sectionIds.forEach((id) => {
    const el = document.getElementById(id);
    if (el) spyObserver.observe(el);
  });

  /* -----------------------------
     Project Modal (details)
  ----------------------------- */
  const projectModal = $("#projectModal");
  const projectModalClose = $("#projectModalClose");
  const projectModalContent = $("#projectModalContent");

  const projectData = {
    vibewave: {
      title: "VibeWave",
      body: `
        <p>
          VibeWave is built for live events. Fans can request songs, vote, leave reviews, and join an event session.
          DJs manage events and keep engagement organized while performing.
        </p>
        <p>
          I focused on clean flows, fast UI feedback, and backend rules that can scale when usage grows.
        </p>
        <div class="meta">
          <span class="meta__item">Kotlin</span>
          <span class="meta__item">Firebase Auth</span>
          <span class="meta__item">Firestore</span>
          <span class="meta__item">Realtime UX</span>
          <span class="meta__item">Event flows</span>
        </div>
      `
    },
    events: {
      title: "Events / Entertainment Website",
      body: `
        <p>
          A services website built with clarity in mind — strong CTA, clean layout, and a structure that can grow into
          a full booking system later.
        </p>
        <p>
          The goal is simple: a visitor should understand what the business offers and how to book within seconds.
        </p>
        <div class="meta">
          <span class="meta__item">HTML/CSS/JS</span>
          <span class="meta__item">Responsive layout</span>
          <span class="meta__item">Service pages</span>
          <span class="meta__item">Booking/contact flow</span>
        </div>
      `
    },
    lawiesounds: {
      title: "LawieSoundsWebsite",
      body: `
        <p>
          A music brand website we built together. The focus was presentation: clean sections, sharp visuals, and a clear
          path for someone to explore the brand and reach out.
        </p>
        <p>
          It’s mobile-first, lightweight, and designed so visitors don’t get lost.
        </p>
        <div class="meta">
          <span class="meta__item">Mobile-first</span>
          <span class="meta__item">Brand UI</span>
          <span class="meta__item">Gallery</span>
          <span class="meta__item">Contact CTA</span>
          <span class="meta__item">Performance</span>
        </div>
      `
    }
  };

  const openProjectModal = (key) => {
    if (!projectModal || !projectModalContent) return;
    const d = projectData[key];
    if (!d) return;

    projectModalContent.innerHTML = `<h3>${d.title}</h3>${d.body}`;
    projectModal.showModal();
    setTimeout(() => projectModalClose?.focus(), 0);
  };

  const closeProjectModal = () => projectModal?.close();

  $$(".project").forEach((card) => {
    const key = card.getAttribute("data-project");
    const btn = $(".project__more", card);
    btn?.addEventListener("click", () => openProjectModal(key));
  });

  projectModalClose?.addEventListener("click", closeProjectModal);
  projectModal?.addEventListener("click", (e) => {
    const inner = $(".modal__inner", projectModal);
    if (inner && !inner.contains(e.target)) closeProjectModal();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && projectModal?.open) closeProjectModal();
  });

  /* -----------------------------
     Gallery (dynamic + filters)
  ----------------------------- */
  const galleryItems = [
    { src: "assets/images/Image6.jpeg", title: "DJ Set Moment", tag: "DJ / Events", category: "DJ" },
    { src: "assets/images/Image7.jpeg", title: "Live Performance", tag: "DJ / Events", category: "DJ" },
    { src: "assets/images/Image8.jpeg", title: "Stage Energy", tag: "DJ / Events", category: "DJ" },
    { src: "assets/images/Image9.JPG",  title: "Crowd Connection", tag: "DJ / Events", category: "DJ" },
    { src: "assets/images/Image10.JPG", title: "Brand Presence", tag: "DJ / Events", category: "DJ" },

    { src: "assets/images/Image1.jpg", title: "Professional Portrait", tag: "Career", category: "Professional" },
    { src: "assets/images/Image2.jpg", title: "Work Mode", tag: "Career", category: "Professional" },
    { src: "assets/images/Image3.jpg", title: "Project Work", tag: "Career", category: "Professional" },

    { src: "assets/images/Image4.jpg", title: "Culture Highlight", tag: "Community", category: "Culture" },
    { src: "assets/images/Image5.jpg", title: "Community Story", tag: "Community", category: "Culture" },
  ];

  const galleryGrid = $("#galleryGrid");
  const galleryFilters = $("#galleryFilters");
  const galleryCount = $("#galleryCount");
  const shuffleBtn = $("#shuffleGallery");

  const categories = ["All", ...Array.from(new Set(galleryItems.map((x) => x.category)))];

  let currentFilter = "All";
  let currentIndex = 0;

  const safeImgFallback = (imgEl) => {
    imgEl.src =
      "data:image/svg+xml;charset=UTF-8," +
      encodeURIComponent(`
        <svg xmlns='http://www.w3.org/2000/svg' width='1200' height='800'>
          <defs>
            <linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>
              <stop offset='0' stop-color='#4f8cff' stop-opacity='0.25'/>
              <stop offset='1' stop-color='#facc15' stop-opacity='0.18'/>
            </linearGradient>
          </defs>
          <rect width='100%' height='100%' fill='url(#g)'/>
          <text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle'
            font-family='Arial' font-size='34' fill='rgba(255,255,255,0.85)'>Image not found</text>
        </svg>
      `);
  };

  const escapeHtml = (str) => {
    return String(str)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  };

  const renderFilters = () => {
    if (!galleryFilters) return;

    galleryFilters.innerHTML = categories
      .map((c) => {
        const selected = c === currentFilter ? "true" : "false";
        return `<button class="seg-btn" role="tab" aria-selected="${selected}" data-filter="${c}" type="button">${c}</button>`;
      })
      .join("");

    $$(".seg-btn", galleryFilters).forEach((btn) => {
      btn.addEventListener("click", () => {
        currentFilter = btn.getAttribute("data-filter") || "All";
        renderFilters();
        renderGallery();
      });
    });
  };

  let imgObserver = null;

  const lazyLoadImages = () => {
    const imgs = $$("img[data-src]", galleryGrid);
    if (imgObserver) imgObserver.disconnect();

    if (!("IntersectionObserver" in window)) {
      imgs.forEach((img) => {
        img.src = img.dataset.src;
        img.removeAttribute("data-src");
        img.addEventListener("error", () => safeImgFallback(img), { once: true });
      });
      return;
    }

    imgObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          const img = e.target;
          img.src = img.dataset.src;
          img.removeAttribute("data-src");
          img.addEventListener("error", () => safeImgFallback(img), { once: true });
          imgObserver.unobserve(img);
        });
      },
      { root: null, threshold: 0.12, rootMargin: "200px" }
    );

    imgs.forEach((img) => imgObserver.observe(img));
  };

  /* Lightbox */
  const lightbox = $("#lightbox");
  const lightboxImg = $("#lightboxImg");
  const lightboxTitle = $("#lightboxTitle");
  const lightboxMeta = $("#lightboxMeta");
  const lightboxClose = $("#lightboxClose");
  const lightboxPrev = $("#lightboxPrev");
  const lightboxNext = $("#lightboxNext");

  let activeList = [];

  const openLightbox = (list, index) => {
    if (!lightbox || !lightboxImg) return;
    activeList = list;
    currentIndex = index;

    const item = activeList[currentIndex];
    if (!item) return;

    lightboxImg.alt = item.title;
    lightboxImg.src = item.src;
    lightboxImg.onerror = () => safeImgFallback(lightboxImg);

    if (lightboxTitle) lightboxTitle.textContent = item.title;
    if (lightboxMeta) lightboxMeta.textContent = `${item.tag} • ${item.category}`;

    lightbox.showModal();
    setTimeout(() => lightboxClose?.focus(), 0);
  };

  const closeLightbox = () => lightbox?.close();

  const navLightbox = (dir) => {
    if (!activeList.length) return;
    currentIndex = (currentIndex + dir + activeList.length) % activeList.length;
    const item = activeList[currentIndex];
    if (!item) return;

    lightboxImg.alt = item.title;
    lightboxImg.src = item.src;
    if (lightboxTitle) lightboxTitle.textContent = item.title;
    if (lightboxMeta) lightboxMeta.textContent = `${item.tag} • ${item.category}`;
  };

  const bindGalleryClicks = (filteredList) => {
    activeList = filteredList;

    $$(".g-item", galleryGrid).forEach((card) => {
      const idx = Number(card.getAttribute("data-index")) || 0;
      const open = () => openLightbox(filteredList, idx);

      card.addEventListener("click", open);
      card.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          open();
        }
      });
    });
  };

  lightboxClose?.addEventListener("click", closeLightbox);
  lightboxPrev?.addEventListener("click", () => navLightbox(-1));
  lightboxNext?.addEventListener("click", () => navLightbox(1));

  lightbox?.addEventListener("click", (e) => {
    const inner = $(".modal__inner", lightbox);
    if (inner && !inner.contains(e.target)) closeLightbox();
  });

  document.addEventListener("keydown", (e) => {
    if (!lightbox?.open) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft") navLightbox(-1);
    if (e.key === "ArrowRight") navLightbox(1);
  });

  const renderGallery = () => {
    if (!galleryGrid) return;

    const items = galleryItems.filter((x) => currentFilter === "All" || x.category === currentFilter);
    if (galleryCount) galleryCount.textContent = `${items.length} item${items.length === 1 ? "" : "s"}`;

    galleryGrid.innerHTML = items
      .map((item, idx) => `
        <article class="g-item" role="button" tabindex="0" data-index="${idx}" aria-label="Open image: ${escapeHtml(item.title)}">
          <img class="g-item__img" data-src="${item.src}" alt="${escapeHtml(item.title)}" loading="lazy" />
          <div class="g-item__shade">
            <p class="g-item__title">${escapeHtml(item.title)}</p>
            <div class="g-item__meta">${escapeHtml(item.tag)} • ${escapeHtml(item.category)}</div>
          </div>
        </article>
      `)
      .join("");

    lazyLoadImages();
    bindGalleryClicks(items);
  };

  const shuffle = (arr) => {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };

  shuffleBtn?.addEventListener("click", () => {
    shuffle(galleryItems);
    renderGallery();
  });

  /* -----------------------------
     Contact Form -> mailto
  ----------------------------- */
  const contactForm = $("#contactForm");
  contactForm?.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = contactForm.elements.namedItem("name")?.value?.trim() || "";
    const email = contactForm.elements.namedItem("email")?.value?.trim() || "";
    const message = contactForm.elements.namedItem("message")?.value?.trim() || "";

    const fields = ["name", "email", "message"];
    let ok = true;

    fields.forEach((f) => {
      const el = contactForm.elements.namedItem(f);
      if (!el) return;
      const valid = el.checkValidity();
      el.setAttribute("aria-invalid", valid ? "false" : "true");
      if (!valid) ok = false;
    });

    if (!ok) return;

    const subject = encodeURIComponent(`Portfolio inquiry — Kelvin Ndegwa (${name})`);
    const body = encodeURIComponent(
      `Hello Kelvin,\n\n${message}\n\n---\nFrom: ${name}\nEmail: ${email}\n`
    );

    window.location.href = `mailto:ndegwak6@gmail.com?subject=${subject}&body=${body}`;
  });

  /* Footer year */
  const footerYear = $("#footerYear");
  if (footerYear) footerYear.textContent = `© ${new Date().getFullYear()} Kelvin Ndegwa • Mahatma_the_DJ`;

  /* Init */
  renderFilters();
  renderGallery();
})();