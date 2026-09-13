(() => {
  const sources = {
    hondo: [
      "./assets/photo-data/hondo-avif-01.txt",
      "./assets/photo-data/hondo-avif-02.txt"
    ],
    dainichi: [
      "./assets/photo-data/dainichi-avif-01.txt",
      "./assets/photo-data/dainichi-avif-02.txt"
    ]
  };

  const loadPhoto = async (key) => {
    const image = document.querySelector(`[data-photo="${key}"]`);
    if (!image) return;
    try {
      const chunks = await Promise.all(
        sources[key].map(async (path) => {
          const response = await fetch(path, { cache: "force-cache" });
          if (!response.ok) throw new Error(`Failed to load ${path}`);
          return (await response.text()).trim();
        })
      );
      image.src = `data:image/avif;base64,${chunks.join("")}`;
      image.classList.add("is-loaded");
    } catch (error) {
      console.error("Temple photo could not be loaded.", error);
      image.closest("figure")?.classList.add("photo-load-error");
    }
  };

  loadPhoto("hondo");
  loadPhoto("dainichi");
})();
