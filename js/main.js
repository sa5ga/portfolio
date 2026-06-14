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
