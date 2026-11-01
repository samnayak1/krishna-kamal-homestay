/* =========================================================
   Krishna Kamala Heritage — interactions
   ---------------------------------------------------------
   ========================================================= */

document.documentElement.classList.add("js");

const SITE = {
  phone: "91646 23286",
};

(function () {
  "use strict";

  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- header state ---------- */

  const header = $("#site-header");

  function updateHeader() {
    if (!header) return;
    const scrolled = window.scrollY > 24;
    if (scrolled !== header.classList.contains("is-scrolled")) {
      header.classList.toggle("is-scrolled", scrolled);
    }
  }

  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });

  /* ---------- mobile navigation ---------- */

  const navToggle = $(".nav-toggle");
  const siteNav = $("#site-nav");
  const body = document.body;
  let navOpen = false;

  function setNav(open, restoreFocus = false) {
    navOpen = open;
    body.classList.toggle("nav-open", open);
    if (navToggle) {
      navToggle.setAttribute("aria-expanded", String(open));
      navToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    }
    if (open && siteNav) {
      const firstLink = $("a", siteNav);
      window.setTimeout(() => firstLink && firstLink.focus({ preventScroll: true }), 120);
    }
    if (!open && restoreFocus && navToggle) {
      navToggle.focus({ preventScroll: true });
    }
  }

  if (navToggle && siteNav) {
    navToggle.addEventListener("click", () => setNav(!navOpen));

    $$("a", siteNav).forEach((link) => {
      link.addEventListener("click", () => {
        if (navOpen) setNav(false);
      });
    });

    document.addEventListener("keydown", (event) => {
      if (!navOpen) return;

      if (event.key === "Escape") {
        setNav(false, true);
        return;
      }

      if (event.key === "Tab") {
        const focusables = [navToggle, ...$$("a", siteNav)];
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 980 && navOpen) setNav(false);
    });
  }

  /* ---------- active nav link ---------- */

  const navLinks = siteNav ? $$("a[href^='#']", siteNav) : [];
  const navSections = navLinks
    .map((link) => {
      const id = link.getAttribute("href");
      return id && id.length > 1 ? $(id) : null;
    })
    .filter(Boolean);

  function setActiveLink(id) {
    navLinks.forEach((link) => {
      const active = link.getAttribute("href") === `#${id}`;
      link.classList.toggle("is-active", active);
      if (active) link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
    });
  }

  if ("IntersectionObserver" in window && navSections.length) {
    const activeObserver = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setActiveLink(visible[0].target.id);
      },
      { rootMargin: "-35% 0px -55% 0px", threshold: [0, 0.15, 0.4, 0.7] }
    );
    navSections.forEach((section) => activeObserver.observe(section));
  }

  /* ---------- scroll reveals ---------- */

  const revealItems = $$("[data-reveal]");

  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  } else {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );
    revealItems.forEach((item) => revealObserver.observe(item));
  }

  /* ---------- copy phone ---------- */

  const copyButton = $("[data-copy-phone]");

  async function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return;
    }
    const helper = document.createElement("textarea");
    helper.value = text;
    helper.setAttribute("readonly", "");
    helper.style.position = "fixed";
    helper.style.opacity = "0";
    document.body.appendChild(helper);
    helper.select();
    const copied = document.execCommand("copy");
    helper.remove();
    if (!copied) throw new Error("Copy failed");
  }

  if (copyButton) {
    const label = $("span", copyButton);
    const iconUse = $("use", copyButton);
    const originalLabel = label ? label.textContent : "Copy";
    const originalIcon = iconUse ? iconUse.getAttribute("href") : null;

    copyButton.addEventListener("click", async () => {
      try {
        await copyText(SITE.phone);
        copyButton.classList.add("is-copied");
        if (label) label.textContent = "Copied";
        if (iconUse) iconUse.setAttribute("href", "#icon-check");
        window.setTimeout(() => {
          copyButton.classList.remove("is-copied");
          if (label) label.textContent = originalLabel;
          if (iconUse && originalIcon) iconUse.setAttribute("href", originalIcon);
        }, 2200);
      } catch {
        if (label) label.textContent = "Press ⌘C";
        window.setTimeout(() => {
          if (label) label.textContent = originalLabel;
        }, 2200);
      }
    });
  }

  /* ---------- lightbox ---------- */

  const lightbox = $("#lightbox");
  const lightboxImage = $("#lightbox-image");
  const lightboxCaption = $("#lightbox-caption");
  const galleryItems = $$(".gallery-item");
  let lightboxIndex = 0;
  let lastTrigger = null;

  function showSlide(index) {
    if (!lightboxItems.length) return;
    lightboxIndex = (index + lightboxItems.length) % lightboxItems.length;
    const item = lightboxItems[lightboxIndex];
    if (lightboxImage) {
      lightboxImage.src = item.full;
      lightboxImage.alt = item.caption || "";
    }
    if (lightboxCaption) lightboxCaption.textContent = item.caption || "";
  }

  const lightboxItems = galleryItems.map((item) => ({
    full: item.dataset.full,
    caption: item.dataset.caption,
  }));

  if (lightbox && lightboxImage && galleryItems.length) {
    galleryItems.forEach((item, index) => {
      item.addEventListener("click", () => {
        lastTrigger = item;
        showSlide(index);
        if (typeof lightbox.showModal === "function") {
          lightbox.showModal();
        } else {
          lightbox.setAttribute("open", "");
        }
        document.body.style.overflow = "hidden";
      });
    });

    function closeLightbox() {
      if (typeof lightbox.close === "function") lightbox.close();
      else lightbox.removeAttribute("open");
      document.body.style.overflow = "";
      if (lastTrigger) lastTrigger.focus({ preventScroll: true });
    }

    const closeButton = $(".lightbox-close", lightbox);
    const prevButton = $(".lightbox-prev", lightbox);
    const nextButton = $(".lightbox-next", lightbox);

    if (closeButton) closeButton.addEventListener("click", closeLightbox);
    if (prevButton) prevButton.addEventListener("click", () => showSlide(lightboxIndex - 1));
    if (nextButton) nextButton.addEventListener("click", () => showSlide(lightboxIndex + 1));

    lightbox.addEventListener("click", (event) => {
      if (event.target === lightbox || event.target.classList.contains("lightbox-inner")) {
        closeLightbox();
      }
    });

    lightbox.addEventListener("keydown", (event) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        showSlide(lightboxIndex - 1);
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        showSlide(lightboxIndex + 1);
      }
    });

    lightbox.addEventListener("close", () => {
      document.body.style.overflow = "";
      if (lastTrigger && document.activeElement !== lastTrigger) {
        lastTrigger.focus({ preventScroll: true });
      }
    });
  }

  /* ---------- footer year ---------- */

  const year = $("#year");
  if (year) year.textContent = String(new Date().getFullYear());
})();
