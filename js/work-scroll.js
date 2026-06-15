(function initWorkScroll() {
  const section = document.querySelector(".work");
  const projects = [...document.querySelectorAll(".work .project")];
  const titlePanels = [...document.querySelectorAll(".work__title-panel")];
  const titleAnchor = document.querySelector(".work__meta-sticky");

  if (!section || !projects.length || typeof gsap === "undefined") return;

  const prefersReduced = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  const lastIndex = projects.length - 1;
  let activeIndex = -1;

  function getTitleCenter() {
    if (!titleAnchor) return window.innerHeight * 0.5;
    const rect = titleAnchor.getBoundingClientRect();
    return rect.top + rect.height / 2;
  }

  function getActiveIndex() {
    const anchor = getTitleCenter();
    const sectionRect = section.getBoundingClientRect();

    if (sectionRect.bottom < anchor || sectionRect.top > window.innerHeight) {
      return activeIndex >= 0 ? activeIndex : 0;
    }

    if (sectionRect.bottom <= anchor + window.innerHeight * 0.12) {
      return lastIndex;
    }

    let index = 0;
    let minDistance = Infinity;

    projects.forEach((project, i) => {
      const media = project.querySelector(".project__media");
      if (!media) return;

      const rect = media.getBoundingClientRect();
      const center = rect.top + rect.height / 2;
      const distance = Math.abs(center - anchor);

      if (distance < minDistance) {
        minDistance = distance;
        index = i;
      }
    });

    return index;
  }

  function setActiveTitle(index) {
    if (index === activeIndex) return;
    activeIndex = index;

    titlePanels.forEach((panel, i) => {
      const isActive = i === index;
      panel.classList.toggle("is-active", isActive);
      panel.setAttribute("aria-hidden", isActive ? "false" : "true");
    });
  }

  function updateActiveTitle() {
    setActiveTitle(getActiveIndex());
  }

  if (prefersReduced || typeof ScrollTrigger === "undefined") {
    updateActiveTitle();
    window.addEventListener("scroll", updateActiveTitle, { passive: true });
    window.addEventListener("resize", updateActiveTitle);
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  projects.forEach((project) => {
    const media = project.querySelector(".project__media img");
    if (!media) return;

    gsap.fromTo(
      media,
      { yPercent: 12 },
      {
        yPercent: -12,
        ease: "none",
        scrollTrigger: {
          trigger: project,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      }
    );
  });

  ScrollTrigger.create({
    trigger: section,
    start: "top bottom",
    end: "bottom top",
    onUpdate: updateActiveTitle,
  });

  updateActiveTitle();
  ScrollTrigger.addEventListener("refresh", updateActiveTitle);
})();
