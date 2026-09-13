(() => {
  const sources = {
    hondo: "./assets/photos/hondo-interior.png",
    dainichi: "./assets/photos/dainichi-nyorai.png"
  };

  const loadPhoto = (key) => {
    const image = document.querySelector(`[data-photo="${key}"]`);
    if (!image) return;

    const markLoaded = () => image.classList.add("is-loaded");
    const markError = () => image.closest("figure")?.classList.add("photo-load-error");

    image.addEventListener("load", markLoaded, { once: true });
    image.addEventListener("error", markError, { once: true });
    image.src = sources[key];

    if (image.complete && image.naturalWidth > 0) markLoaded();
  };

  loadPhoto("hondo");
  loadPhoto("dainichi");
})();
