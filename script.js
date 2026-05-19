const menuButton = document.getElementById("menuButton");
const globalNav = document.getElementById("globalNav");

if (menuButton && globalNav) {
  menuButton.addEventListener("click", () => {
    const isOpen = globalNav.classList.toggle("open");
    menuButton.setAttribute("aria-expanded", String(isOpen));
  });

  globalNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      globalNav.classList.remove("open");
      menuButton.setAttribute("aria-expanded", "false");
    });
  });
}
