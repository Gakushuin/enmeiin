(() => {
  document.documentElement.classList.add("js");

  const header = document.querySelector("[data-header]");
  const menuButton = document.getElementById("menuButton");
  const globalNav = document.getElementById("globalNav");
  const navLinks = globalNav ? [...globalNav.querySelectorAll('a[href^="#"]')] : [];
  const toTopButton = document.querySelector(".to-top");
  const year = document.getElementById("year");

  const closeMenu = () => {
    if (!menuButton || !globalNav) return;
    globalNav.classList.remove("open");
    menuButton.setAttribute("aria-expanded", "false");
    document.body.classList.remove("menu-open");
  };

  const setHeaderState = () => {
    if (!header) return;
    header.classList.toggle("scrolled", window.scrollY > 16);
  };

  const setToTopState = () => {
    if (!toTopButton) return;
    toTopButton.classList.toggle("visible", window.scrollY > 640);
  };

  if (year) year.textContent = new Date().getFullYear();

  if (menuButton && globalNav) {
    menuButton.addEventListener("click", () => {
      const isOpen = globalNav.classList.toggle("open");
      menuButton.setAttribute("aria-expanded", String(isOpen));
      document.body.classList.toggle("menu-open", isOpen);
    });

    navLinks.forEach((link) => link.addEventListener("click", closeMenu));
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeMenu();
    });
  }

  if (toTopButton) {
    toTopButton.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  const revealTargets = [...document.querySelectorAll(".reveal")];
  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    revealTargets.forEach((target) => revealObserver.observe(target));
  } else {
    revealTargets.forEach((target) => target.classList.add("visible"));
  }

  const sections = navLinks
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  if ("IntersectionObserver" in window && sections.length) {
    const currentObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const id = `#${entry.target.id}`;
          navLinks.forEach((link) => {
            link.classList.toggle("is-current", link.getAttribute("href") === id);
          });
        });
      },
      { threshold: 0.48, rootMargin: "-20% 0px -45% 0px" }
    );
    sections.forEach((section) => currentObserver.observe(section));
  }

  setHeaderState();
  setToTopState();
  window.addEventListener("scroll", () => {
    setHeaderState();
    setToTopState();
  }, { passive: true });
})();
