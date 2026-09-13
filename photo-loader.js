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

  const refineHistoryCopy = () => {
    const history = document.querySelector("#history .section-content");
    if (!history) return;

    const paragraphs = [...history.children].filter((element) => element.tagName === "P");
    const copy = [
      "延命院の開創は、室町時代にさかのぼるとされています。",
      "寺の始まりについては、讃岐から武蔵へ赴いた僧が、矢ノ倉（現在の東京都中央区東日本橋付近）に一寺を開いたことが起源とされています。当初は「延寿院」と称していたとされ、江戸時代には二代将軍・徳川秀忠の命により「延命院」へ改称したと伝えられています。",
      "明暦三年（1657）の大火後、寺地を現在の元浅草へ移したとされます。現在は御府内八十八ヶ所霊場第五十一番札所となっています。"
    ];

    paragraphs.slice(0, 3).forEach((paragraph, index) => {
      paragraph.textContent = copy[index];
    });

    const timelineCopy = [
      "現在の東日本橋付近にあたる矢ノ倉で寺が開かれたことが、延命院の始まりとされています。",
      "旧称「延寿院」から「延命院」への改称は、徳川秀忠の命によるものと伝えられています。",
      "明暦三年（1657）の大火を経て、現在の元浅草へ寺地を移したとされています。"
    ];

    document.querySelectorAll("#history .history-timeline dd p").forEach((paragraph, index) => {
      if (timelineCopy[index]) paragraph.textContent = timelineCopy[index];
    });
  };

  loadPhoto("hondo");
  loadPhoto("dainichi");
  refineHistoryCopy();
})();
