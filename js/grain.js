(function initGrain() {
  const container = document.querySelector(".grain");
  if (!container) return;

  const canvas = document.createElement("canvas");
  container.appendChild(canvas);

  const ctx = canvas.getContext("2d", { alpha: true });
  if (!ctx) return;

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  const scale = 1.5;
  const brown = { r: 58, g: 36, b: 22 };
  let canvasW = 0;
  let canvasH = 0;
  let imageData;
  let data;
  let frameId = 0;
  let lastTick = 0;
  const interval = prefersReducedMotion ? 0 : 1000 / 10;

  function resize() {
    canvasW = Math.max(1, Math.ceil(window.innerWidth / scale));
    canvasH = Math.max(1, Math.ceil(window.innerHeight / scale));
    canvas.width = canvasW;
    canvas.height = canvasH;
    imageData = ctx.createImageData(canvasW, canvasH);
    data = imageData.data;
  }

  function draw(now) {
    frameId = requestAnimationFrame(draw);

    if (interval && now - lastTick < interval) return;
    lastTick = now;

    for (let i = 0; i < data.length; i += 4) {
      const shade = 0.85 + Math.random() * 0.3;
      data[i] = (brown.r * shade) | 0;
      data[i + 1] = (brown.g * shade) | 0;
      data[i + 2] = (brown.b * shade) | 0;
      data[i + 3] = 8 + ((Math.random() * 14) | 0);
    }

    ctx.putImageData(imageData, 0, 0);
  }

  resize();
  window.addEventListener("resize", resize, { passive: true });

  if (prefersReducedMotion) {
    draw(0);
  } else {
    frameId = requestAnimationFrame(draw);
  }

  window.addEventListener(
    "pagehide",
    () => cancelAnimationFrame(frameId),
    { once: true }
  );
})();
