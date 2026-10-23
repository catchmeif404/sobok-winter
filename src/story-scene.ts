import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// "How a bowl is made", scrubbed by scroll: pour and freeze the milk (01), shave it into snow (02), top it (03).
// The timeline runs 0..3 so each step owns one unit; step highlighting reads the same progress.

const START_TEMP = 4;
const END_TEMP = -15;
const STEP_COUNT = 3;

export const createStoryScene = (section: HTMLElement, pin: HTMLElement): void => {
  const q = gsap.utils.selector(section);
  const steps = q<HTMLElement>('.step');
  const meter = q<HTMLElement>('.story-meter span')[0];
  const temp = q<SVGTextElement>('.temp')[0];
  const drizzle = q<SVGPathElement>('.drizzle')[0];
  const drizzleLength = drizzle?.getTotalLength() ?? 0;
  const thermo = { value: START_TEMP };

  gsap.set(q('.stage-b, .stage-c, .dish-label'), { autoAlpha: 0 });
  gsap.set(q('.stream'), { scaleY: 0, transformOrigin: '50% 0%' });
  gsap.set(q('.milk'), { scaleY: 0, transformOrigin: '50% 100%' });
  gsap.set(q('.tray-frost'), { autoAlpha: 0 });
  gsap.set(q('.mercury'), { scaleY: 0.75, transformOrigin: '50% 100%' });
  gsap.set(q('.mound'), { scaleY: 0, transformOrigin: '50% 100%' });
  gsap.set(q('.flakes circle'), { autoAlpha: 0 });
  gsap.set(q('.powder circle'), { scale: 0, transformOrigin: '50% 50%' });
  gsap.set(q('.berry'), { y: -260, autoAlpha: 0 });
  if (drizzle !== undefined) gsap.set(drizzle, { strokeDasharray: drizzleLength, strokeDashoffset: drizzleLength });

  const timeline = gsap.timeline({ defaults: { ease: 'none' }, paused: true });
  // 01 — pour and freeze.
  timeline
    .to(q('.carton'), { rotation: 112, svgOrigin: '255 160', duration: 0.3, ease: 'power2.inOut' }, 0)
    .to(q('.stream'), { scaleY: 1, duration: 0.1 }, 0.26)
    .to(q('.milk'), { scaleY: 1, duration: 0.5, ease: 'power1.out' }, 0.32)
    .to(q('.stream'), { scaleY: 0, transformOrigin: '50% 100%', duration: 0.1 }, 0.8)
    .to(q('.carton'), { rotation: 0, svgOrigin: '255 160', autoAlpha: 0, duration: 0.15 }, 0.85)
    .to(thermo, {
      value: END_TEMP, duration: 0.45,
      onUpdate: () => { if (temp !== undefined) temp.textContent = `${Math.round(thermo.value)}℃`; },
    }, 0.55)
    .to(q('.mercury'), { scaleY: 0.12, duration: 0.45 }, 0.55)
    .to(q('.tray-frost'), { autoAlpha: 1, duration: 0.25 }, 0.75)
    .to(q('.milk'), { fill: '#e4eff9', duration: 0.25 }, 0.75);

  // 02 — shave into snow.
  timeline
    .to(q('.stage-a, .thermo'), { autoAlpha: 0, y: 30, duration: 0.15 }, 1.0)
    .to(q('.stage-b'), { autoAlpha: 1, duration: 0.15 }, 1.05)
    .from(q('.machine'), { y: -60, duration: 0.2, ease: 'power2.out' }, 1.05)
    .to(q('.block'), { y: 48, scaleY: 0.35, transformOrigin: '50% 100%', duration: 0.6 }, 1.2)
    .to(q('.blade'), { rotation: 1440, svgOrigin: '300 160', duration: 0.75 }, 1.2)
    .fromTo(q('.flakes circle'), { y: 0, autoAlpha: 1 }, {
      y: () => 190 + Math.random() * 40, autoAlpha: 0, duration: 0.12,
      stagger: { each: 0.018, repeat: 2 },
    }, 1.25)
    .to(q('.mound'), { scaleY: 1, duration: 0.65, ease: 'power1.out' }, 1.32);

  // 03 — top it and serve.
  timeline
    .to(q('.machine, .flakes'), { autoAlpha: 0, y: -40, duration: 0.15 }, 2.0)
    .to(q('.stage-c'), { autoAlpha: 1, duration: 0.05 }, 2.08);
  if (drizzle !== undefined) timeline.to(drizzle, { strokeDashoffset: 0, duration: 0.35 }, 2.1);
  timeline
    .to(q('.powder circle'), { scale: 1, duration: 0.08, stagger: 0.006, ease: 'back.out(3)' }, 2.4)
    .to(q('.berry'), { y: 0, autoAlpha: 1, duration: 0.22, stagger: 0.06, ease: 'bounce.out' }, 2.6)
    .to(q('.dish-label'), { autoAlpha: 1, y: 0, duration: 0.12 }, 2.86)
    .set({}, {}, 3);

  const render = (progress: number): void => {
    timeline.progress(progress);
    const active = Math.min(STEP_COUNT - 1, Math.floor(progress * STEP_COUNT));
    steps.forEach((step, index) => step.classList.toggle('is-active', index === active));
    if (meter !== undefined) meter.style.transform = `scaleY(${progress})`;
  };
  render(0);
  ScrollTrigger.create({
    trigger: section,
    start: 'top top',
    end: '+=260%',
    pin,
    scrub: 0.6,
    onUpdate: ({ progress }) => render(progress),
  });
};
