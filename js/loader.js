/* Page loader — designisfunny.co-style progress reveal */

const LOADER_ENABLED = false;

(function initPageLoader() {
  const loader = document.getElementById('page-loader');
  if (!loader) return;

  if (!LOADER_ENABLED) {
    document.documentElement.classList.remove('is-loading');
    loader.remove();
    return;
  }
  const steps = [...loader.querySelectorAll('.page-loader__percent')];
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const minDuration = prefersReduced ? 400 : 2200;
  const startTime = performance.now();

  function setActiveStep(index) {
    steps.forEach((step, i) => {
      step.classList.toggle('is-active', i === index);
    });
  }

  function revealChars(stepEl) {
    const chars = stepEl.querySelectorAll('.page-loader__char');

    if (prefersReduced || typeof gsap === 'undefined') {
      chars.forEach((char) => {
        char.style.opacity = '1';
        char.style.transform = 'none';
      });
      return null;
    }

    return gsap.fromTo(
      chars,
      { opacity: 0, y: '0.15em' },
      {
        opacity: 1,
        y: 0,
        duration: 0.35,
        stagger: 0.06,
        ease: 'power3.out',
      }
    );
  }

  function finish() {
    document.documentElement.classList.remove('is-loading');
    loader.setAttribute('aria-hidden', 'true');

    if (prefersReduced || typeof gsap === 'undefined') {
      loader.remove();
      return;
    }

    loader.classList.add('is-exiting');

    gsap.to(loader, {
      yPercent: -100,
      duration: 0.9,
      ease: 'power3.inOut',
      onComplete: () => loader.remove(),
    });
  }

  function runSequence() {
    if (prefersReduced) {
      setActiveStep(steps.length - 1);
      revealChars(steps[steps.length - 1]);
      window.setTimeout(finish, minDuration);
      return;
    }

    const tl = gsap.timeline({
      onComplete: () => window.setTimeout(finish, 350),
    });

    steps.forEach((step, index) => {
      tl.call(() => setActiveStep(index));
      tl.add(revealChars(step));
      tl.to({}, { duration: index === steps.length - 1 ? 0.45 : 0.35 });
    });
  }

  function startWhenReady() {
    const elapsed = performance.now() - startTime;
    const delay = Math.max(0, minDuration - elapsed);
    window.setTimeout(runSequence, delay);
  }

  if (document.readyState === 'complete') {
    startWhenReady();
  } else {
    window.addEventListener('load', startWhenReady, { once: true });
  }
})();
