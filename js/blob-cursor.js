/* Vanilla JS port of the BlobCursor React component (React Bits)
   Requires GSAP to be loaded before this script. */

(function BlobCursor({
  blobType             = 'circle',
  fillColor            = '#FC7A1E',
  trailCount           = 2,
  sizes                = [19, 60],
  innerSizes           = [63, 20],
  innerColor           = 'rgba(255,255,255,0.8)',
  opacities            = [0.6, 0.6],
  shadowColor          = 'rgba(0,0,0,0.75)',
  shadowBlur           = 5,
  shadowOffsetX        = -20,
  shadowOffsetY        = 8,
  filterId             = 'blob',
  filterStdDeviation   = 30,
  filterColorMatrix    = '1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 35 -10',
  useFilter            = true,
  fastDuration         = 0.25,
  slowDuration         = 0.01,
  fastEase             = 'power3.out',
  slowEase             = 'power1.out',
  zIndex               = 100,
} = {}) {
  /* Only activate on devices with a fine pointer (mouse) */
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

  /* Container — fixed, full viewport, no pointer events */
  const container = document.createElement('div');
  container.className = 'blob-container';
  container.style.zIndex = zIndex;

  /* Optional SVG gooey filter */
  if (useFilter) {
    const ns  = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(ns, 'svg');
    svg.setAttribute('aria-hidden', 'true');
    svg.style.cssText = 'position:absolute;width:0;height:0;';

    const defs   = document.createElementNS(ns, 'defs');
    const filter = document.createElementNS(ns, 'filter');
    filter.id    = filterId;

    const blur = document.createElementNS(ns, 'feGaussianBlur');
    blur.setAttribute('in', 'SourceGraphic');
    blur.setAttribute('result', 'blur');
    blur.setAttribute('stdDeviation', filterStdDeviation);

    const cm = document.createElementNS(ns, 'feColorMatrix');
    cm.setAttribute('in', 'blur');
    cm.setAttribute('values', filterColorMatrix);

    filter.appendChild(blur);
    filter.appendChild(cm);
    defs.appendChild(filter);
    svg.appendChild(defs);
    container.appendChild(svg);
  }

  /* Main blob layer */
  const main = document.createElement('div');
  main.className = 'blob-main';
  if (useFilter) main.style.filter = `url(#${filterId})`;

  /* Build each blob */
  const blobs = [];
  for (let i = 0; i < trailCount; i++) {
    const borderRadius = blobType === 'circle' ? '50%' : '0%';

    const blob     = document.createElement('div');
    blob.className = 'blob';
    Object.assign(blob.style, {
      width:           `${sizes[i]}px`,
      height:          `${sizes[i]}px`,
      borderRadius,
      backgroundColor: fillColor,
      opacity:         opacities[i],
      boxShadow:       `${shadowOffsetX}px ${shadowOffsetY}px ${shadowBlur}px 0 ${shadowColor}`,
    });

    const dot     = document.createElement('div');
    dot.className = 'inner-dot';
    Object.assign(dot.style, {
      width:           `${innerSizes[i]}px`,
      height:          `${innerSizes[i]}px`,
      top:             `${(sizes[i] - innerSizes[i]) / 2}px`,
      left:            `${(sizes[i] - innerSizes[i]) / 2}px`,
      backgroundColor: innerColor,
      borderRadius,
    });

    blob.appendChild(dot);
    main.appendChild(blob);
    blobs.push(blob);
  }

  container.appendChild(main);
  document.body.appendChild(container);

  /* Mouse / touch tracking */
  function handleMove(e) {
    const x = 'clientX' in e ? e.clientX : e.touches[0].clientX;
    const y = 'clientY' in e ? e.clientY : e.touches[0].clientY;

    blobs.forEach((el, i) => {
      const isLead = i === 0;
      gsap.to(el, {
        x,
        y,
        duration: isLead ? fastDuration : slowDuration,
        ease:     isLead ? fastEase     : slowEase,
      });
    });
  }

  window.addEventListener('mousemove', handleMove, { passive: true });
  window.addEventListener('touchmove', handleMove,  { passive: true });
})();
