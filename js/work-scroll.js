(function initWorkScroll() {
  const section = document.querySelector(".work");
  const track = document.querySelector(".work__track");
  const projects = [...document.querySelectorAll(".work .project")];
  const titlePanels = [...document.querySelectorAll(".work__title-panel")];
  const titleBlock = document.querySelector(".work__titles");

  if (!section || !projects.length || typeof gsap === "undefined") return;

  const prefersReduced = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  const lastIndex = projects.length - 1;
  let activeIndex = -1;

  function getHeaderHeight() {
    const header = document.querySelector(".site-header");
    return header ? header.offsetHeight : 70;
  }

  function getTitleCenter() {
    if (titleBlock) {
      const rect = titleBlock.getBoundingClientRect();
      return rect.top + rect.height / 2;
    }

    const headerH = getHeaderHeight();
    return headerH + (window.innerHeight - headerH) / 2;
  }

  function syncTrackPadding() {
    if (!track || !projects[0]) return;

    if (window.matchMedia("(max-width: 992px)").matches) {
      track.style.paddingTop = "0px";
      return;
    }

    track.style.paddingTop = "0px";

    const headerH = getHeaderHeight();
    const targetViewportY = headerH + (window.innerHeight - headerH) / 2;
    const sectionTop = section.getBoundingClientRect().top + window.scrollY;
    const trackTop = track.getBoundingClientRect().top + window.scrollY;
    const layoutOffset = trackTop - sectionTop;
    const project = projects[0];
    const projectTop = project.getBoundingClientRect().top + window.scrollY;
    const mediaCenterInTrack =
      projectTop - trackTop + project.offsetHeight / 2;
    const padding = targetViewportY - headerH - layoutOffset - mediaCenterInTrack;

    track.style.paddingTop = `${Math.max(0, padding)}px`;
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

  function refreshWorkScroll() {
    syncTrackPadding();
    updateActiveTitle();
    if (typeof ScrollTrigger !== "undefined") ScrollTrigger.refresh();
  }

  syncTrackPadding();
  updateActiveTitle();

  window.addEventListener("resize", refreshWorkScroll);
  window.addEventListener("load", refreshWorkScroll, { once: true });

  if (projects[0]?.querySelector("img")) {
    projects[0].querySelector("img").addEventListener("load", refreshWorkScroll, {
      once: true,
    });
  }

  if (prefersReduced || typeof ScrollTrigger === "undefined") {
    window.addEventListener("scroll", updateActiveTitle, { passive: true });
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

  ScrollTrigger.addEventListener("refresh", updateActiveTitle);
})();
