(function initNavTheme() {
  const header = document.querySelector(".site-header");
  if (!header) return;

  let ticking = false;

  function parseRgb(color) {
    const match = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
    if (!match) return null;

    return {
      r: Number(match[1]),
      g: Number(match[2]),
      b: Number(match[3]),
      a: match[4] === undefined ? 1 : Number(match[4]),
    };
  }

  function getLuminance(r, g, b) {
    const channels = [r, g, b].map((value) => {
      const channel = value / 255;
      return channel <= 0.03928
        ? channel / 12.92
        : ((channel + 0.055) / 1.055) ** 2.4;
    });

    return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
  }

  function getThemeFromNode(node) {
    let current = node;

    while (current && current !== document.documentElement) {
      const declared = current.dataset?.navTheme;
      if (declared === "light" || declared === "dark") return declared;

      const background = parseRgb(getComputedStyle(current).backgroundColor);
      if (background && background.a > 0.45) {
        return getLuminance(background.r, background.g, background.b) < 0.35
          ? "dark"
          : "light";
      }

      current = current.parentElement;
    }

    return "light";
  }

  function getThemeAtHeader() {
    const sampleX = window.innerWidth / 2;
    const sampleY = Math.max(1, Math.min(header.offsetHeight - 1, window.innerHeight - 1));
    const stack = document.elementsFromPoint(sampleX, sampleY);
    const target = stack.find((element) => !header.contains(element));

    return target ? getThemeFromNode(target) : "light";
  }

  function applyTheme() {
    const theme = getThemeAtHeader();
    header.classList.toggle("site-header--on-dark", theme === "dark");
    header.classList.toggle("site-header--on-light", theme === "light");
  }

  function scheduleUpdate() {
    if (ticking) return;
    ticking = true;

    requestAnimationFrame(() => {
      applyTheme();
      ticking = false;
    });
  }

  applyTheme();

  window.addEventListener("scroll", scheduleUpdate, { passive: true });
  window.addEventListener("resize", scheduleUpdate, { passive: true });
  window.addEventListener("load", scheduleUpdate, { once: true });

  if (window.lenis) {
    window.lenis.on("scroll", scheduleUpdate);
  } else {
    const lenisPoll = window.setInterval(() => {
      if (!window.lenis) return;
      window.clearInterval(lenisPoll);
      window.lenis.on("scroll", scheduleUpdate);
    }, 50);
    window.setTimeout(() => window.clearInterval(lenisPoll), 5000);
  }
})();
