import gsap from 'gsap';

export function splashIntro(refs: {
  ring: Element | null;
  dot: Element | null;
  title: Element | null;
  subtitle: Element | null;
}) {
  const tl = gsap.timeline();
  if (refs.ring) {
    tl.fromTo(refs.ring, { scale: 0.4, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.8, ease: 'power3.out' });
  }
  if (refs.dot) {
    tl.fromTo(refs.dot, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(2)' }, '-=0.3');
  }
  if (refs.title) {
    tl.fromTo(refs.title, { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' }, '-=0.1');
  }
  if (refs.subtitle) {
    tl.fromTo(refs.subtitle, { y: 10, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' }, '-=0.3');
  }
  return tl;
}

export function splashExit(container: Element | null, onComplete: () => void) {
  if (!container) {
    onComplete();
    return;
  }
  gsap.to(container, {
    scale: 1.08,
    opacity: 0,
    duration: 0.6,
    ease: 'power2.in',
    onComplete,
  });
}

export function slideInPanel(element: Element | null, fromY = 24) {
  if (!element) return;
  gsap.fromTo(
    element,
    { y: fromY, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.5, ease: 'power3.out' }
  );
}

export function staggerListItems(items: Element[]) {
  if (items.length === 0) return;
  gsap.fromTo(
    items,
    { y: 12, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.35, ease: 'power2.out', stagger: 0.06 }
  );
}

export function drawRouteLine(pathElement: SVGPathElement | null) {
  if (!pathElement) return;
  const length = pathElement.getTotalLength();
  gsap.set(pathElement, { strokeDasharray: length, strokeDashoffset: length });
  gsap.to(pathElement, {
    strokeDashoffset: 0,
    duration: 1.4,
    ease: 'power2.inOut',
  });
}

export function mapParallax(container: HTMLElement | null, layer: HTMLElement | null) {
  if (!container || !layer) return () => {};
  const safeContainer = container;
  const safeLayer = layer;

  function handleMove(event: MouseEvent) {
    const bounds = safeContainer.getBoundingClientRect();
    const relativeX = (event.clientX - bounds.left) / bounds.width - 0.5;
    const relativeY = (event.clientY - bounds.top) / bounds.height - 0.5;
    gsap.to(safeLayer, {
      x: relativeX * 18,
      y: relativeY * 18,
      duration: 0.6,
      ease: 'power2.out',
    });
  }

  safeContainer.addEventListener('mousemove', handleMove);
  return () => safeContainer.removeEventListener('mousemove', handleMove);
}

export function morphText(
  element: HTMLElement | null,
  phrases: string[],
  intervalMs = 1800
): () => void {
  if (!element || phrases.length === 0) return () => {};
  const safeElement = element;
  let index = 0;
  safeElement.textContent = phrases[0];
  gsap.set(safeElement, { opacity: 1, filter: 'blur(0px)' });

  function showNextPhrase() {
    index = (index + 1) % phrases.length;
    gsap.to(safeElement, {
      opacity: 0,
      filter: 'blur(6px)',
      y: -6,
      duration: 0.3,
      ease: 'power2.in',
      onComplete: () => {
        safeElement.textContent = phrases[index];
        gsap.fromTo(
          safeElement,
          { opacity: 0, filter: 'blur(6px)', y: 6 },
          { opacity: 1, filter: 'blur(0px)', y: 0, duration: 0.35, ease: 'power2.out' }
        );
      },
    });
  }

  const timerId = window.setInterval(showNextPhrase, intervalMs);
  return () => {
    window.clearInterval(timerId);
    gsap.killTweensOf(safeElement);
  };
}

export function confettiBurst(container: HTMLElement | null) {
  if (!container) return;
  const colors = ['#2DD4FF', '#8B6CFF', '#FFB454', '#E9EEF7'];
  const pieces: HTMLDivElement[] = [];

  for (let i = 0; i < 24; i += 1) {
    const piece = document.createElement('div');
    piece.style.position = 'absolute';
    piece.style.left = '50%';
    piece.style.top = '50%';
    piece.style.width = '8px';
    piece.style.height = '8px';
    piece.style.borderRadius = '2px';
    piece.style.background = colors[i % colors.length];
    piece.style.pointerEvents = 'none';
    container.appendChild(piece);
    pieces.push(piece);
  }

  pieces.forEach((piece) => {
    const angle = Math.random() * Math.PI * 2;
    const distance = 80 + Math.random() * 120;
    gsap.to(piece, {
      x: Math.cos(angle) * distance,
      y: Math.sin(angle) * distance - 40,
      rotation: Math.random() * 360,
      opacity: 0,
      duration: 1 + Math.random() * 0.6,
      ease: 'power2.out',
      onComplete: () => piece.remove(),
    });
  });
}