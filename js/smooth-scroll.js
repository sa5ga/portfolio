(function initSmoothScroll() {
  const prefersReduced = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (prefersReduced || typeof Lenis === "undefined") return;

  const lenis = new Lenis({
    lerp: 0.085,
    smoothWheel: true,
    wheelMultiplier: 0.85,
    touchMultiplier: 1.4,
  });

  window.lenis = lenis;

  if (typeof ScrollTrigger !== "undefined") {
    lenis.on("scroll", ScrollTrigger.update);
  }

  if (typeof gsap !== "undefined") {
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
  } else {
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
  }

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    const href = anchor.getAttribute("href");
    if (!href || href === "#") return;

    const target = document.querySelector(href);
    if (!target) return;

    anchor.addEventListener("click", (event) => {
      event.preventDefault();
      const header = document.querySelector(".site-header");
      const offset = header ? -header.offsetHeight : 0;
      lenis.scrollTo(target, { offset, duration: 1.4 });
    });
  });

  window.addEventListener(
    "load",
    () => {
      if (typeof ScrollTrigger !== "undefined") ScrollTrigger.refresh();
    },
    { once: true }
  );
})();
