(function initPageTransition() {
  const STORAGE_KEY = "folio-page-transition";
  const prefersReduced = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  const overlay =
    document.querySelector(".page-transition") ||
    (() => {
      const element = document.createElement("div");
      element.className = "page-transition";
      element.setAttribute("aria-hidden", "true");
      document.body.appendChild(element);
      return element;
    })();

  function isTransitionLink(link) {
    if (!link?.href) return false;
    if (link.target === "_blank" || link.hasAttribute("download")) return false;

    const href = link.getAttribute("href") || "";
    if (href.startsWith("#") || href.startsWith("mailto:")) return false;

    if (link.classList.contains("project__link")) return true;
    if (link.classList.contains("case-study__next")) return true;

    try {
      const url = new URL(link.href, window.location.href);
      if (url.origin !== window.location.origin) return false;
      return /\/projects\/[^/?#]+\.html$/i.test(url.pathname);
    } catch {
      return href.includes("projects/") && href.endsWith(".html");
    }
  }

  function playEnterTransition() {
    document.documentElement.classList.remove("is-page-transitioning");

    if (prefersReduced || typeof gsap === "undefined") {
      overlay.style.opacity = "0";
      return;
    }

    overlay.classList.add("is-active");
    gsap.fromTo(
      overlay,
      { opacity: 1 },
      {
        opacity: 0,
        duration: 0.55,
        ease: "power2.inOut",
        onComplete: () => overlay.classList.remove("is-active"),
      }
    );
  }

  if (sessionStorage.getItem(STORAGE_KEY)) {
    sessionStorage.removeItem(STORAGE_KEY);
    playEnterTransition();
  }

  document.addEventListener("click", (event) => {
    const link = event.target.closest("a");
    if (!isTransitionLink(link)) return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    if (event.button !== 0) return;

    event.preventDefault();
    sessionStorage.setItem(STORAGE_KEY, "1");
    window.lenis?.stop();

    const navigate = () => {
      window.location.href = link.href;
    };

    if (prefersReduced || typeof gsap === "undefined") {
      navigate();
      return;
    }

    overlay.classList.add("is-active");
    gsap.fromTo(
      overlay,
      { opacity: 0 },
      {
        opacity: 1,
        duration: 0.45,
        ease: "power2.inOut",
        onComplete: navigate,
      }
    );
  });

  window.addEventListener("pageshow", (event) => {
    if (!event.persisted) return;
    sessionStorage.removeItem(STORAGE_KEY);
    document.documentElement.classList.remove("is-page-transitioning");
    overlay.classList.remove("is-active");
    overlay.style.opacity = "0";
  });
})();
