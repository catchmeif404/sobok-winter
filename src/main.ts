import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import './style.css';
import { createFrostWindow } from './frost-window';
import { createHeroScene } from './hero-scene';
import { Locale, initLocale, locale, setLocale } from './i18n';
import { createMenu } from './menu';
import { createSnowPile } from './snow-pile';
import { createFlake, drawFlake } from './snowflake';

gsap.registerPlugin(ScrollTrigger);

const $ = <T extends Element>(selector: string): T => {
  const element = document.querySelector<T>(selector);
  if (element === null) throw new Error(`Missing element ${selector}`);
  return element;
};

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
initLocale();

// Smooth scroll drives ScrollTrigger from the same clock so pinned scenes never jitter.
const lenis = new Lenis({ duration: 1.15, smoothWheel: !reduced });
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(0);
document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach((link) => {
  link.addEventListener('click', (event) => {
    const target = link.getAttribute('href') ?? '#top';
    event.preventDefault();
    lenis.scrollTo(target === '#top' ? 0 : target, { offset: -40 });
  });
});

// Language toggle.
$<HTMLButtonElement>('.lang').addEventListener('click', () => setLocale(locale() === Locale.Ko ? Locale.En : Locale.Ko));

const daySeed = Math.floor(Date.now() / 86_400_000) * 97 + Math.floor(Math.random() * 90);
const hero = createHeroScene($<HTMLCanvasElement>('.hero-canvas'), daySeed, () => undefined);
const hint = $<HTMLElement>('.hint');
$<HTMLButtonElement>('.flake-hit').addEventListener('click', () => {
  hero.nextFlake();
  gsap.to(hint, { opacity: 0, duration: 0.4 });
});
gsap.from('.hint', { opacity: 0, duration: 1, delay: 1.4 });

// Frosted window.
const windowHint = $<HTMLElement>('.window-hint');
createFrostWindow($<HTMLCanvasElement>('.frost'), () => gsap.to(windowHint, { opacity: 0, y: 10, duration: 0.5 }));

// Story: the pinned canvas grows one snowflake as you scroll; each step lights up in turn.
const storyCanvas = $<HTMLCanvasElement>('.story-canvas');
const storyContext = storyCanvas.getContext('2d');
if (storyContext === null) throw new Error('2D canvas is unavailable.');
const storyShape = createFlake(20261223);
const storySize = 900;
storyCanvas.width = storySize;
storyCanvas.height = storySize;
const steps = [...document.querySelectorAll<HTMLElement>('.step')];
const meter = $<HTMLElement>('.story-meter span');
const renderStory = (progress: number): void => {
  drawFlake(storyContext, storyShape, storySize, { growth: 0.04 + progress * 0.96, color: '#0e1a36', glow: 'rgba(120, 170, 230, 0.6)' });
  const active = Math.min(steps.length - 1, Math.floor(progress * steps.length));
  steps.forEach((step, index) => step.classList.toggle('is-active', index === active));
  meter.style.transform = `scaleY(${progress})`;
};
renderStory(0);
ScrollTrigger.create({
  trigger: '.story',
  start: 'top top',
  end: '+=220%',
  pin: '.story-pin',
  scrub: 0.6,
  onUpdate: ({ progress }) => renderStory(progress),
});
gsap.to(storyCanvas, { rotate: 60, ease: 'none', scrollTrigger: { trigger: '.story', start: 'top top', end: '+=220%', scrub: 1 } });

// Section reveals.
document.querySelectorAll<HTMLElement>('.reveal').forEach((element) => {
  gsap.from(element, {
    y: 60, opacity: 0, duration: 1.1, ease: 'expo.out',
    scrollTrigger: { trigger: element, start: 'top 85%' },
  });
});

createMenu($<HTMLElement>('.menu-tabs'), $<HTMLElement>('.menu-list'));

createSnowPile($<HTMLCanvasElement>('.pile'));

// The header hides on scroll down and returns on scroll up.
const topbar = $<HTMLElement>('.topbar');
let lastScroll = 0;
lenis.on('scroll', ({ scroll }: { scroll: number }) => {
  topbar.classList.toggle('is-hidden', scroll > lastScroll && scroll > 200);
  topbar.classList.toggle('is-solid', scroll > 40);
  lastScroll = scroll;
});
