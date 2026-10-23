import { random } from './snowflake';

// A canvas of procedurally drawn frost sits on top of the warm shop scene. Dragging erases it with a soft brush
// (destination-out); the frost slowly creeps back so the window invites another wipe.

const REFROST_ALPHA = 0.006;
const BRUSH = 0.075;

const paintFrost = (context: CanvasRenderingContext2D, width: number, height: number): void => {
  const next = random(20261023);
  const base = context.createLinearGradient(0, 0, width, height);
  base.addColorStop(0, 'rgba(226, 238, 248, 0.94)');
  base.addColorStop(0.5, 'rgba(206, 224, 240, 0.9)');
  base.addColorStop(1, 'rgba(232, 242, 250, 0.95)');
  context.fillStyle = base;
  context.fillRect(0, 0, width, height);

  // Fine grain.
  for (let index = 0; index < (width * height) / 90; index += 1) {
    context.fillStyle = `rgba(255, 255, 255, ${0.15 + next() * 0.35})`;
    context.fillRect(next() * width, next() * height, 1 + next() * 1.6, 1 + next() * 1.6);
  }

  // Fern-like ice growing in from the edges, the way real window frost starts at the frame.
  context.strokeStyle = 'rgba(255, 255, 255, 0.55)';
  context.lineCap = 'round';
  const fern = (x: number, y: number, angle: number, length: number, depth: number): void => {
    if (depth === 0 || length < 4) return;
    const x2 = x + Math.cos(angle) * length;
    const y2 = y + Math.sin(angle) * length;
    context.lineWidth = Math.max(0.6, depth * 0.45);
    context.beginPath();
    context.moveTo(x, y);
    context.lineTo(x2, y2);
    context.stroke();
    const spread = 0.55 + next() * 0.35;
    fern(x2, y2, angle + (next() - 0.5) * 0.3, length * 0.82, depth - 1);
    if (next() < 0.8) fern(x2, y2, angle - spread, length * 0.5, depth - 2);
    if (next() < 0.8) fern(x2, y2, angle + spread, length * 0.5, depth - 2);
  };
  const seeds = Math.round((width + height) / 60);
  for (let index = 0; index < seeds; index += 1) {
    const edge = Math.floor(next() * 4);
    const along = next();
    const [x, y, angle] = edge === 0 ? [along * width, 0, Math.PI / 2]
      : edge === 1 ? [width, along * height, Math.PI]
        : edge === 2 ? [along * width, height, -Math.PI / 2]
          : [0, along * height, 0];
    fern(x, y, angle + (next() - 0.5) * 0.9, 22 + next() * 30, 7);
  }
};

export const createFrostWindow = (canvas: HTMLCanvasElement, onFirstWipe: () => void): (() => void) => {
  const context = canvas.getContext('2d');
  if (context === null) throw new Error('2D canvas is unavailable.');
  const frost = document.createElement('canvas');
  const frostContext = frost.getContext('2d');
  if (frostContext === null) throw new Error('2D canvas is unavailable.');
  let width = 0;
  let height = 0;
  let wiped = false;

  const resize = (): void => {
    const ratio = Math.min(window.devicePixelRatio, 2);
    width = Math.round(canvas.clientWidth * ratio);
    height = Math.round(canvas.clientHeight * ratio);
    if (width === 0 || height === 0) return;
    canvas.width = width;
    canvas.height = height;
    frost.width = width;
    frost.height = height;
    paintFrost(frostContext, width, height);
    context.globalCompositeOperation = 'source-over';
    context.drawImage(frost, 0, 0);
  };
  const observer = new ResizeObserver(resize);
  observer.observe(canvas);

  let drawing = false;
  let last: [number, number] | undefined;
  const wipe = (event: PointerEvent): void => {
    const rect = canvas.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * width;
    const y = ((event.clientY - rect.top) / rect.height) * height;
    const radius = Math.max(width, height) * BRUSH;
    context.globalCompositeOperation = 'destination-out';
    const steps = last === undefined ? 1 : Math.ceil(Math.hypot(x - last[0], y - last[1]) / (radius * 0.25));
    for (let step = 1; step <= steps; step += 1) {
      const px = last === undefined ? x : last[0] + ((x - last[0]) * step) / steps;
      const py = last === undefined ? y : last[1] + ((y - last[1]) * step) / steps;
      const brush = context.createRadialGradient(px, py, 0, px, py, radius);
      brush.addColorStop(0, 'rgba(0, 0, 0, 0.9)');
      brush.addColorStop(0.6, 'rgba(0, 0, 0, 0.5)');
      brush.addColorStop(1, 'rgba(0, 0, 0, 0)');
      context.fillStyle = brush;
      context.beginPath();
      context.arc(px, py, radius, 0, Math.PI * 2);
      context.fill();
    }
    last = [x, y];
    if (!wiped) {
      wiped = true;
      onFirstWipe();
    }
  };
  const down = (event: PointerEvent): void => {
    drawing = true;
    last = undefined;
    canvas.setPointerCapture(event.pointerId);
    wipe(event);
  };
  const move = (event: PointerEvent): void => {
    // Mouse users can wipe by just hovering; touch needs a drag so the page still scrolls elsewhere.
    if (drawing || event.pointerType === 'mouse') wipe(event);
  };
  const up = (): void => {
    drawing = false;
    last = undefined;
  };
  canvas.addEventListener('pointerdown', down);
  canvas.addEventListener('pointermove', move);
  canvas.addEventListener('pointerup', up);
  canvas.addEventListener('pointerleave', up);

  let frame = 0;
  const refrost = (): void => {
    if (frost.width === 0 || frost.height === 0) {
      frame = requestAnimationFrame(refrost);
      return;
    }
    context.globalCompositeOperation = 'source-over';
    context.globalAlpha = REFROST_ALPHA;
    context.drawImage(frost, 0, 0);
    context.globalAlpha = 1;
    frame = requestAnimationFrame(refrost);
  };
  frame = requestAnimationFrame(refrost);

  return () => {
    cancelAnimationFrame(frame);
    observer.disconnect();
  };
};
