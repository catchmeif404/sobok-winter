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
import { createStoryScene } from './story-scene';

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

// Story: how a bowl of bingsu is made, scrubbed by scroll.
createStoryScene($<HTMLElement>('.story'), $<HTMLElement>('.story-pin'));

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
