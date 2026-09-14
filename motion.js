/* Optional presentation only: the complete site works without this file. */
(() => {
  "use strict";
  const header = document.querySelector(".header");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const navigation = Array.from(document.querySelectorAll(".header nav a[href^='#']"));
  const sections = navigation.map(link => ({
    link,
    section: document.getElementById(link.hash.slice(1))
  })).filter(item => item.section);
  let scheduled = false;
  let activeId = "";
  let revealObserver;
  const runningAnimations = new Set();

  function updateNavigation() {
    scheduled = false;
    const scrollTop = Math.max(0, window.scrollY);
    const range = document.documentElement.scrollHeight - window.innerHeight;
    if (header) {
      header.dataset.scrolled = String(scrollTop > 24);
      header.style.setProperty("--read-progress", String(range > 0 ? Math.min(1, scrollTop / range) : 0));
    }
    let nextId = "";
    const marker = Math.max(header && getComputedStyle(header).position === "sticky" ? header.offsetHeight + 32 : 0, window.innerHeight * .3);
    for (const item of sections) {
      if (item.section.getBoundingClientRect().top <= marker) nextId = item.section.id;
    }
    if (activeId !== nextId) {
      activeId = nextId;
      for (const item of sections) {
        if (item.section.id === activeId) item.link.setAttribute("aria-current", "location");
        else item.link.removeAttribute("aria-current");
      }
    }
  }

  function scheduleNavigation() {
    if (!scheduled) {
      scheduled = true;
      window.requestAnimationFrame(updateNavigation);
    }
  }

  function animateEntry(element, delay = 0) {
    if (reducedMotion.matches || !element.animate) return;
    const animation = element.animate(
      [
        { opacity: 0, transform: "translateY(18px)" },
        { opacity: 1, transform: "translateY(0)" }
      ],
      { duration: 850, delay, easing: "cubic-bezier(.22,1,.36,1)", fill: "backwards" }
    );
    runningAnimations.add(animation);
    animation.finished.then(
      () => runningAnimations.delete(animation),
      () => runningAnimations.delete(animation)
    );
  }

  function enableMotion() {
    if (reducedMotion.matches || !("IntersectionObserver" in window)) return;
    const targets = document.querySelectorAll(
      ".section-heading h2, .section-content > h3, .facts, .history-timeline, " +
      ".grounds-grid > figure, .hondo-copy, .hondo-photo, .visiting-hours, " +
      ".visit-row, .seasons > div, .faq-list details, .stations, .contact-heading, .contact-options > a"
    );
    revealObserver = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        revealObserver.unobserve(entry.target);
        animateEntry(entry.target);
      }
    }, { threshold: .08, rootMargin: "0px 0px -24px 0px" });
    targets.forEach(target => revealObserver.observe(target));
    // Preserve direct anchor navigation and restored scroll positions.
    if (!window.location.hash && window.scrollY < 40) {
      [".hero-intro > .eyebrow", ".hero-message", ".temple-title", ".hero-description", ".hero-actions"]
        .forEach((selector, index) => {
          const element = document.querySelector(selector);
          if (element) animateEntry(element, index * 65);
        });
    }
  }

  function stopMotion() {
    if (revealObserver) revealObserver.disconnect();
    for (const animation of runningAnimations) animation.cancel();
    runningAnimations.clear();
  }

  window.addEventListener("scroll", scheduleNavigation, { passive: true });
  window.addEventListener("resize", scheduleNavigation, { passive: true });
  window.addEventListener("pageshow", scheduleNavigation);
  document.addEventListener("load", scheduleNavigation, true);
  if (reducedMotion.addEventListener) {
    reducedMotion.addEventListener("change", event => {
      if (event.matches) stopMotion();
    });
  }
  updateNavigation();
  enableMotion();
})();
