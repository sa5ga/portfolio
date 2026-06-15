(function initTextReveal() {
  const SELECTORS = [
    ".about__intro",
    ".about__content p",
    ".case-study__section-head .case-study__heading",
    ".case-study__lead",
    ".case-study__credit-text",
    ".case-study__attribution",
    ".case-study__meta-col p",
    ".case-study__meta-col li",
  ];

  const elements = document.querySelectorAll(SELECTORS.join(", "));
  if (!elements.length) return;

  const prefersReduced = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (prefersReduced) return;

  if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);

    elements.forEach((element) => {
      gsap.fromTo(
        element,
        { opacity: 0, y: 28 },
        {
          opacity: 1,
          y: 0,
          duration: 0.85,
          ease: "power3.out",
          scrollTrigger: {
            trigger: element,
            start: "top 88%",
            once: true,
          },
        }
      );
    });

    return;
  }

  elements.forEach((element) => element.classList.add("text-reveal"));

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-inview");
        observer.unobserve(entry.target);
      });
    },
    { rootMargin: "0px 0px -12% 0px", threshold: 0.1 }
  );

  elements.forEach((element) => observer.observe(element));
})();
