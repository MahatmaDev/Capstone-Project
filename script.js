(() => {
  "use strict";

  document.documentElement.classList.remove("no-js");

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

  /* =====================================================
     Theme Toggle (persist)
  ===================================================== */
  const themeToggle = $("#themeToggle");
  const savedTheme = localStorage.getItem("kn_theme");

  if (savedTheme) {
    document.documentElement.setAttribute("data-theme", savedTheme);
  }

  const updateThemeIcon = () => {
    if (!themeToggle) return;

    const theme = document.documentElement.getAttribute("data-theme") || "dark";
    const icon = themeToggle.querySelector("[aria-hidden='true']");
    const text = $(".chip__text", themeToggle);

    if (icon) {
      icon.textContent = theme === "light" ? "☀" : "☾";
    }

    if (text) {
      text.textContent = theme === "light" ? "Light" : "Dark";
    }

    themeToggle.setAttribute(
      "aria-label",
      theme === "light" ? "Switch to dark theme" : "Switch to light theme"
    );
  };

  updateThemeIcon();

  themeToggle?.addEventListener("click", () => {
    const currentTheme = document.documentElement.getAttribute("data-theme") || "dark";
    const nextTheme = currentTheme === "light" ? "dark" : "light";

    document.documentElement.setAttribute("data-theme", nextTheme);
    localStorage.setItem("kn_theme", nextTheme);
    updateThemeIcon();
  });

  /* =====================================================
     Mobile Navigation
  ===================================================== */
  const navToggle = $("#navToggle");
  const navMenu = $("#navMenu");

  const setNavOpen = (open) => {
    if (!navToggle || !navMenu) return;

    navToggle.setAttribute("aria-expanded", String(open));
    navMenu.classList.toggle("is-open", open);
    document.body.classList.toggle("nav-open", open);
  };

  navToggle?.addEventListener("click", () => {
    const isOpen = navToggle.getAttribute("aria-expanded") === "true";
    setNavOpen(!isOpen);
  });

  document.addEventListener("click", (event) => {
    if (!navToggle || !navMenu) return;

    const isOpen = navToggle.getAttribute("aria-expanded") === "true";
    if (!isOpen) return;

    const target = event.target;
    const clickedInside = navMenu.contains(target) || navToggle.contains(target);
    if (!clickedInside) {
      setNavOpen(false);
    }
  });

  $$(".nav__link").forEach((link) => {
    link.addEventListener("click", () => setNavOpen(false));
  });

  /* =====================================================
     Smooth Scroll with Header Offset
  ===================================================== */
  const getHeaderHeight = () => {
    const raw = getComputedStyle(document.documentElement)
      .getPropertyValue("--header-h")
      .trim();
    const parsed = Number.parseFloat(raw);
    return Number.isFinite(parsed) ? parsed : 76;
  };

  const smoothScrollTo = (id) => {
    const target = document.getElementById(id);
    if (!target) return;

    const offsetTop =
      window.scrollY + target.getBoundingClientRect().top - (getHeaderHeight() + 12);

    window.scrollTo({
      top: offsetTop,
      behavior: "smooth",
    });
  };

  $$('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (event) => {
      const href = anchor.getAttribute("href");
      if (!href || href === "#") return;

      const id = href.slice(1);
      const target = document.getElementById(id);
      if (!target) return;

      event.preventDefault();
      smoothScrollTo(id);
      history.pushState(null, "", `#${id}`);
    });
  });

  window.addEventListener("load", () => {
    const hash = window.location.hash?.slice(1);
    if (!hash) return;

    setTimeout(() => {
      smoothScrollTo(hash);
    }, 60);
  });

  /* =====================================================
     Scroll Progress
  ===================================================== */
  const progressBar = $("#scrollProgressBar");

  const updateScrollProgress = () => {
    if (!progressBar) return;

    const doc = document.documentElement;
    const scrollTop = doc.scrollTop || document.body.scrollTop;
    const scrollHeight = doc.scrollHeight - doc.clientHeight;
    const percentage = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;

    progressBar.style.width = `${percentage}%`;
  };

  window.addEventListener("scroll", updateScrollProgress, { passive: true });
  updateScrollProgress();

  /* =====================================================
     Scrollspy
  ===================================================== */
  const sectionIds = [
    "about",
    "skills",
    "projects",
    "documents",
    "videos",
    "gallery",
    "contact",
  ];

  const navLinks = new Map();

  $$(".nav__link").forEach((link) => {
    const href = link.getAttribute("href");
    if (!href?.startsWith("#")) return;
    navLinks.set(href.slice(1), link);
  });

  const setActiveLink = (id) => {
    navLinks.forEach((link) => link.classList.remove("is-active"));
    const activeLink = navLinks.get(id);
    if (activeLink) activeLink.classList.add("is-active");
  };

  const spyObserver = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (visible?.target?.id) {
        setActiveLink(visible.target.id);
      }
    },
    {
      root: null,
      threshold: [0.12, 0.2, 0.35, 0.5],
      rootMargin: `-${Math.round(getHeaderHeight())}px 0px -55% 0px`,
    }
  );

  sectionIds.forEach((id) => {
    const section = document.getElementById(id);
    if (section) spyObserver.observe(section);
  });

  /* =====================================================
     Project Modal
  ===================================================== */
  const projectModal = $("#projectModal");
  const projectModalClose = $("#projectModalClose");
  const projectModalContent = $("#projectModalContent");

  const projectDetails = {
    vibewave: {
      eyebrow: "Flagship Android Project",
      title: "VibeWave",
      lead:
        "VibeWave is an Android-based DJ management and audience engagement system built to improve live event interaction. The platform focuses on structured song requests, live audience participation, reviews, and event workflows that feel more organized, interactive, and professional.",
      overview:
        "This project was built around a real problem space in the entertainment industry: unstructured fan requests, poor event coordination, and lack of a central interaction system for DJs and audiences. My focus was on building a practical product with strong user flow and meaningful mobile interaction.",
      role:
        "I handled product thinking, feature planning, Android implementation, UI flow decisions, and integration of real-time functionality using Firebase-based workflows.",
      stack: ["Kotlin", "Firebase Auth", "Firestore", "Realtime Logic", "MVVM"],
      highlights: [
        "Designed an event-centered mobile experience around real user interaction",
        "Worked on real-time request and participation workflows",
        "Focused on user flow, interface clarity, and scalable feature structure",
        "Explored integrations related to mobile payments and event logic",
      ],
      next:
        "The long-term direction includes stronger analytics, more refined booking flows, richer moderation features, and deeper audience-to-DJ interaction tools.",
    },

    events: {
      eyebrow: "Service Platform",
      title: "Entertainment Services Website",
      lead:
        "A modern website created for entertainment and event services, designed to communicate professionalism, visual quality, and a clear path to bookings and client inquiries.",
      overview:
        "This project focused on creating a service website that feels modern, trustworthy, and conversion-friendly. The goal was not just to display services, but to present them in a way that supports business growth and future expansion into a more interactive booking system.",
      role:
        "I worked on structure, UI direction, layout hierarchy, responsiveness, and creating a scalable frontend foundation for future features.",
      stack: ["HTML", "CSS", "JavaScript", "Responsive Design", "Service UX"],
      highlights: [
        "Built a stronger service presentation with a clearer visual hierarchy",
        "Improved responsiveness and usability across screen sizes",
        "Designed the structure to support future booking and inquiry flows",
        "Focused on balancing aesthetics with practical user navigation",
      ],
      next:
        "Future improvements can include a full booking system, admin-side content management, and deeper lead-capture functionality.",
    },

    lawiesounds: {
      eyebrow: "Brand Experience Project",
      title: "LawieSoundsWebsite",
      lead:
        "A polished brand website created to improve digital presence, communicate identity more clearly, and offer a better visitor experience for both fans and potential clients.",
      overview:
        "This project was centered around clean digital presentation. The aim was to create a website that feels easy to navigate, visually intentional, and aligned with a music-focused personal brand.",
      role:
        "I focused on frontend implementation, layout decisions, mobile behavior, and presenting brand content in a way that feels simple but effective.",
      stack: ["HTML", "CSS", "JavaScript", "Mobile-first UI", "Brand Presentation"],
      highlights: [
        "Created a cleaner and more credible visual web presence",
        "Prioritized simplicity and clarity in navigation",
        "Designed for mobile-first engagement and quick browsing",
        "Balanced visual personality with client-facing professionalism",
      ],
      next:
        "The next step could include richer content modules, embedded media, analytics, and deeper conversion paths for inquiries or collaborations.",
    },
  };

  const escapeHtml = (value) => {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  };

  const renderProjectModal = (project) => {
    return `
      <div class="modal-project">
        <span class="modal-project__eyebrow">${escapeHtml(project.eyebrow)}</span>
        <h3 class="modal-project__title">${escapeHtml(project.title)}</h3>
        <p class="modal-project__lead">${escapeHtml(project.lead)}</p>

        <div class="chips">
          ${project.stack
            .map((item) => `<span class="chip">${escapeHtml(item)}</span>`)
            .join("")}
        </div>

        <div class="modal-project__grid">
          <div class="modal-block">
            <h4>Project Overview</h4>
            <p>${escapeHtml(project.overview)}</p>
          </div>

          <div class="modal-block">
            <h4>My Role</h4>
            <p>${escapeHtml(project.role)}</p>
          </div>

          <div class="modal-block">
            <h4>Key Engineering Highlights</h4>
            <ul>
              ${project.highlights
                .map((item) => `<li>${escapeHtml(item)}</li>`)
                .join("")}
            </ul>
          </div>

          <div class="modal-block">
            <h4>Growth Direction</h4>
            <p>${escapeHtml(project.next)}</p>
          </div>
        </div>
      </div>
    `;
  };

  const openProjectModal = (projectKey) => {
    if (!projectModal || !projectModalContent) return;

    const project = projectDetails[projectKey];
    if (!project) return;

    projectModalContent.innerHTML = renderProjectModal(project);
    projectModal.showModal();

    setTimeout(() => {
      projectModalClose?.focus();
    }, 0);
  };

  const closeProjectModal = () => {
    projectModal?.close();
  };

  $$(".project").forEach((card) => {
    const button = $(".project__more", card);
    const projectKey = card.getAttribute("data-project");

    button?.addEventListener("click", () => {
      openProjectModal(projectKey);
    });
  });

  projectModalClose?.addEventListener("click", closeProjectModal);

  projectModal?.addEventListener("click", (event) => {
    const inner = $(".modal__inner", projectModal);
    if (inner && !inner.contains(event.target)) {
      closeProjectModal();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && projectModal?.open) {
      closeProjectModal();
    }
  });

  /* =====================================================
     Gallery Data
  ===================================================== */
  const galleryItems = [
    {
      src: "assets/images/Image6.jpeg",
      title: "DJ Set Moment",
      tag: "DJ / Events",
      category: "DJ",
    },
    {
      src: "assets/images/Image7.jpeg",
      title: "Techie",
      tag: "School",
      category: "Studying",
    },
    {
      src: "assets/images/Image9.JPG",
      title: "Brand Presence",
      tag: "DJ / Events",
      category: "DJ",
    },
    
    {
      src: "assets/images/Image3.jpg",
      title: "Project Work",
      tag: "Career",
      category: "Professional",
    },
  ];

  const galleryGrid = $("#galleryGrid");
  const galleryFilters = $("#galleryFilters");
  const galleryCount = $("#galleryCount");
  const shuffleGalleryButton = $("#shuffleGallery");

  const categories = [
    "All",
    ...Array.from(new Set(galleryItems.map((item) => item.category))),
  ];

  let currentFilter = "All";
  let currentLightboxIndex = 0;
  let currentLightboxItems = [];

  const createFallbackImage = (img) => {
    img.src =
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
          <text
            x='50%'
            y='50%'
            dominant-baseline='middle'
            text-anchor='middle'
            font-family='Arial'
            font-size='34'
            fill='rgba(255,255,255,0.85)'
          >
            Image not found
          </text>
        </svg>
      `);
  };

  let imageObserver = null;

  const lazyLoadGalleryImages = () => {
    if (!galleryGrid) return;

    const images = $$("img[data-src]", galleryGrid);

    if (imageObserver) {
      imageObserver.disconnect();
    }

    if (!("IntersectionObserver" in window)) {
      images.forEach((img) => {
        img.src = img.dataset.src;
        img.removeAttribute("data-src");
        img.addEventListener("error", () => createFallbackImage(img), { once: true });
      });
      return;
    }

    imageObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          const img = entry.target;
          img.src = img.dataset.src;
          img.removeAttribute("data-src");
          img.addEventListener("error", () => createFallbackImage(img), { once: true });

          imageObserver.unobserve(img);
        });
      },
      {
        root: null,
        threshold: 0.12,
        rootMargin: "200px",
      }
    );

    images.forEach((img) => imageObserver.observe(img));
  };

  const renderGalleryFilters = () => {
    if (!galleryFilters) return;

    galleryFilters.innerHTML = categories
      .map((category) => {
        const selected = category === currentFilter ? "true" : "false";
        return `
          <button
            class="seg-btn"
            role="tab"
            aria-selected="${selected}"
            data-filter="${escapeHtml(category)}"
            type="button"
          >
            ${escapeHtml(category)}
          </button>
        `;
      })
      .join("");

    $$(".seg-btn", galleryFilters).forEach((button) => {
      button.addEventListener("click", () => {
        currentFilter = button.getAttribute("data-filter") || "All";
        renderGalleryFilters();
        renderGallery();
      });
    });
  };

  /* =====================================================
     Lightbox
  ===================================================== */
  const lightbox = $("#lightbox");
  const lightboxImg = $("#lightboxImg");
  const lightboxTitle = $("#lightboxTitle");
  const lightboxMeta = $("#lightboxMeta");
  const lightboxClose = $("#lightboxClose");
  const lightboxPrev = $("#lightboxPrev");
  const lightboxNext = $("#lightboxNext");

  const updateLightbox = () => {
    if (!currentLightboxItems.length || !lightboxImg) return;

    const item = currentLightboxItems[currentLightboxIndex];
    if (!item) return;

    lightboxImg.src = item.src;
    lightboxImg.alt = item.title;
    lightboxImg.onerror = () => createFallbackImage(lightboxImg);

    if (lightboxTitle) {
      lightboxTitle.textContent = item.title;
    }

    if (lightboxMeta) {
      lightboxMeta.textContent = `${item.tag} • ${item.category}`;
    }
  };

  const openLightbox = (items, index) => {
    if (!lightbox) return;

    currentLightboxItems = items;
    currentLightboxIndex = index;
    updateLightbox();
    lightbox.showModal();

    setTimeout(() => {
      lightboxClose?.focus();
    }, 0);
  };

  const closeLightbox = () => {
    lightbox?.close();
  };

  const moveLightbox = (direction) => {
    if (!currentLightboxItems.length) return;

    currentLightboxIndex =
      (currentLightboxIndex + direction + currentLightboxItems.length) %
      currentLightboxItems.length;

    updateLightbox();
  };

  lightboxClose?.addEventListener("click", closeLightbox);
  lightboxPrev?.addEventListener("click", () => moveLightbox(-1));
  lightboxNext?.addEventListener("click", () => moveLightbox(1));

  lightbox?.addEventListener("click", (event) => {
    const inner = $(".modal__inner", lightbox);
    if (inner && !inner.contains(event.target)) {
      closeLightbox();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (!lightbox?.open) return;

    if (event.key === "Escape") closeLightbox();
    if (event.key === "ArrowLeft") moveLightbox(-1);
    if (event.key === "ArrowRight") moveLightbox(1);
  });

  const bindGalleryEvents = (filteredItems) => {
    $$(".g-item", galleryGrid).forEach((itemCard) => {
      const index = Number(itemCard.getAttribute("data-index")) || 0;

      const open = () => openLightbox(filteredItems, index);

      itemCard.addEventListener("click", open);
      itemCard.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          open();
        }
      });
    });
  };

  const renderGallery = () => {
    if (!galleryGrid) return;

    const filteredItems = galleryItems.filter(
      (item) => currentFilter === "All" || item.category === currentFilter
    );

    if (galleryCount) {
      galleryCount.textContent = `${filteredItems.length} item${
        filteredItems.length === 1 ? "" : "s"
      }`;
    }

    galleryGrid.innerHTML = filteredItems
      .map(
        (item, index) => `
          <article
            class="g-item"
            role="button"
            tabindex="0"
            data-index="${index}"
            aria-label="Open image: ${escapeHtml(item.title)}"
          >
            <img
              class="g-item__img"
              data-src="${escapeHtml(item.src)}"
              alt="${escapeHtml(item.title)}"
              loading="lazy"
            />
            <div class="g-item__shade">
              <p class="g-item__title">${escapeHtml(item.title)}</p>
              <div class="g-item__meta">
                ${escapeHtml(item.tag)} • ${escapeHtml(item.category)}
              </div>
            </div>
          </article>
        `
      )
      .join("");

    lazyLoadGalleryImages();
    bindGalleryEvents(filteredItems);
  };

  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  shuffleGalleryButton?.addEventListener("click", () => {
    shuffleArray(galleryItems);
    renderGallery();
  });

  /* =====================================================
     Contact Form -> mailto
  ===================================================== */
  const contactForm = $("#contactForm");

  contactForm?.addEventListener("submit", (event) => {
    event.preventDefault();

    const nameField = contactForm.elements.namedItem("name");
    const emailField = contactForm.elements.namedItem("email");
    const messageField = contactForm.elements.namedItem("message");

    const name = nameField?.value?.trim() || "";
    const email = emailField?.value?.trim() || "";
    const message = messageField?.value?.trim() || "";

    const fields = [nameField, emailField, messageField];
    let formIsValid = true;

    fields.forEach((field) => {
      if (!field) return;

      const isValid = field.checkValidity();
      field.setAttribute("aria-invalid", isValid ? "false" : "true");
      if (!isValid) formIsValid = false;
    });

    if (!formIsValid) return;

    const subject = encodeURIComponent(`Portfolio inquiry — Kelvin Ndegwa (${name})`);
    const body = encodeURIComponent(
      `Hello Kelvin,\n\n${message}\n\n---\nFrom: ${name}\nEmail: ${email}\n`
    );

    window.location.href = `mailto:ndegwak6@gmail.com?subject=${subject}&body=${body}`;
  });

  /* =====================================================
     Footer Year
  ===================================================== */
  const footerYear = $("#footerYear");
  if (footerYear) {
    footerYear.textContent = `© ${new Date().getFullYear()} Kelvin Ndegwa • Software Developer`;
  }

  /* =====================================================
     Init
  ===================================================== */
  renderGalleryFilters();
  renderGallery();
})();