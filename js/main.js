// Duplicate marquee content for seamless infinite scroll
(function initMarquee() {
  const track = document.querySelector(".marquee__track");
  if (!track) return;

  const spans = [...track.children];
  spans.forEach((span) => {
    track.appendChild(span.cloneNode(true));
  });
})();

// Highlight active nav link on scroll
(function initNavHighlight() {
  const sections = document.querySelectorAll("section[id], footer[id]");
  const navLinks = document.querySelectorAll(".site-nav a");

  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const id = entry.target.id;
        navLinks.forEach((link) => {
          link.style.opacity = link.getAttribute("href") === `#${id}` ? "1" : "";
          link.style.fontWeight =
            link.getAttribute("href") === `#${id}` ? "600" : "500";
        });
      });
    },
    { rootMargin: "-40% 0px -50% 0px" }
  );

  sections.forEach((section) => observer.observe(section));
})();

// About panel — bottom sheet
(function initAboutPanel() {
  const trigger = document.querySelector(".about__more");
  const panel = document.getElementById("about-panel");
  if (!trigger || !panel) return;

  const sheet = panel.querySelector(".about-panel__sheet");
  const backdrop = panel.querySelector(".about-panel__backdrop");
  const closeBtn = panel.querySelector(".about-panel__close");
  const closeTargets = panel.querySelectorAll("[data-about-panel-close]");
  const prefersReduced = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  let isOpen = false;

  function setOpenState(open) {
    isOpen = open;
    trigger.setAttribute("aria-expanded", open ? "true" : "false");
    panel.classList.toggle("is-open", open);
    document.documentElement.classList.toggle("is-about-panel-open", open);

    if (open) {
      panel.hidden = false;
      closeBtn.focus();
      window.lenis?.stop();
    } else {
      panel.hidden = true;
      trigger.focus();
      window.lenis?.start();
      if (typeof ScrollTrigger !== "undefined") ScrollTrigger.refresh();
    }
  }

  function openPanel() {
    if (isOpen) return;

    setOpenState(true);

    if (prefersReduced || typeof gsap === "undefined") {
      gsap.set(backdrop, { opacity: 1 });
      gsap.set(sheet, { y: "0%" });
      return;
    }

    gsap.fromTo(
      backdrop,
      { opacity: 0 },
      { opacity: 1, duration: 0.4, ease: "power2.out" }
    );

    gsap.fromTo(
      sheet,
      { y: "100%" },
      { y: "0%", duration: 0.7, ease: "power3.out" }
    );
  }

  function closePanel() {
    if (!isOpen) return;

    if (prefersReduced || typeof gsap === "undefined") {
      setOpenState(false);
      gsap.set([backdrop, sheet], { clearProps: "all" });
      return;
    }

    gsap.to(backdrop, { opacity: 0, duration: 0.3, ease: "power2.in" });
    gsap.to(sheet, {
      y: "100%",
      duration: 0.5,
      ease: "power3.in",
      onComplete: () => {
        setOpenState(false);
        gsap.set([backdrop, sheet], { clearProps: "all" });
      },
    });
  }

  trigger.addEventListener("click", openPanel);

  closeTargets.forEach((el) => {
    el.addEventListener("click", closePanel);
  });

  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && isOpen) closePanel();
  });
})();
