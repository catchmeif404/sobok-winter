// Footer snow: flakes fall onto a height map that slowly builds a drift, smoothing so the pile looks like settled
// snow rather than columns. Clicking knocks a puff of snow back into the air.

interface Flake {
  x: number;
  y: number;
  vy: number;
  sway: number;
  size: number;
}

const COLUMN = 4;
const MAX_PILE = 0.42;

export const createSnowPile = (canvas: HTMLCanvasElement): (() => void) => {
  const context = canvas.getContext('2d');
  if (context === null) throw new Error('2D canvas is unavailable.');
  let width = 0;
  let height = 0;
  let ratio = 1;
  let pile: Float32Array = new Float32Array(0);
  const flakes: Flake[] = [];

  const spawn = (y = -10): Flake => ({
    x: Math.random() * width,
    y,
    vy: (0.6 + Math.random() * 1.2) * ratio,
    sway: Math.random() * Math.PI * 2,
    size: (1.2 + Math.random() * 2.4) * ratio,
  });

  const resize = (): void => {
    ratio = Math.min(window.devicePixelRatio, 2);
    width = Math.round(canvas.clientWidth * ratio);
    height = Math.round(canvas.clientHeight * ratio);
    canvas.width = width;
    canvas.height = height;
    const columns = Math.ceil(width / (COLUMN * ratio)) + 1;
    const previous = pile;
    pile = new Float32Array(columns);
    // Start with a soft drift already on the ground so the footer never looks bare.
    const seeded = (index: number): number => height * (0.07 + 0.025 * Math.sin(index * 0.05) + 0.015 * Math.sin(index * 0.13 + 1.7));
    for (let index = 0; index < columns; index += 1) {
      pile[index] = previous.length > 0 ? previous[Math.floor((index / columns) * previous.length)] ?? 0 : seeded(index);
    }
    flakes.length = 0;
    const count = Math.round(width / (6 * ratio));
    for (let index = 0; index < count; index += 1) flakes.push(spawn(Math.random() * height));
  };
  const observer = new ResizeObserver(resize);
  observer.observe(canvas);

  const columnAt = (x: number): number => Math.min(pile.length - 1, Math.max(0, Math.floor(x / (COLUMN * ratio))));

  const settle = (column: number, amount: number): void => {
    const limit = height * MAX_PILE;
    for (let offset = -3; offset <= 3; offset += 1) {
      const index = column + offset;
      if (index < 0 || index >= pile.length) continue;
      const weight = 1 - Math.abs(offset) / 4;
      pile[index] = Math.min(limit, (pile[index] ?? 0) + amount * weight);
    }
  };

  const onClick = (event: PointerEvent): void => {
    const rect = canvas.getBoundingClientRect();
    const x = (event.clientX - rect.left) * ratio;
    const column = columnAt(x);
    for (let offset = -10; offset <= 10; offset += 1) {
      const index = column + offset;
      if (index >= 0 && index < pile.length) pile[index] = Math.max(0, (pile[index] ?? 0) * (Math.abs(offset) / 10));
    }
    for (let index = 0; index < 40; index += 1) {
      const flake = spawn(height - (pile[column] ?? 0));
      flake.x = x + (Math.random() - 0.5) * 60 * ratio;
      flake.vy = -(2 + Math.random() * 4) * ratio;
      flakes.push(flake);
    }
  };
  canvas.addEventListener('pointerdown', onClick);

  let frame = 0;
  let visible = false;
  const visibility = new IntersectionObserver(([entry]) => { visible = entry?.isIntersecting ?? false; });
  visibility.observe(canvas);

  const tick = (): void => {
    frame = requestAnimationFrame(tick);
    if (!visible) return;
    context.clearRect(0, 0, width, height);
    context.fillStyle = '#ffffff';
    for (let index = flakes.length - 1; index >= 0; index -= 1) {
      const flake = flakes[index];
      if (flake === undefined) continue;
      flake.sway += 0.02;
      flake.x += Math.sin(flake.sway) * 0.4 * ratio;
      flake.vy = Math.min(flake.vy + 0.08 * ratio, 2.2 * ratio);
      flake.y += flake.vy;
      const column = columnAt(flake.x);
      if (flake.vy > 0 && flake.y >= height - (pile[column] ?? 0)) {
        settle(column, flake.size * 1.1);
        if (flakes.length > Math.round(width / (6 * ratio))) flakes.splice(index, 1);
        else Object.assign(flake, spawn());
        continue;
      }
      context.globalAlpha = 0.85;
      context.beginPath();
      context.arc(flake.x, flake.y, flake.size, 0, Math.PI * 2);
      context.fill();
    }
    // Relax the drift so steep steps slide down into soft slopes.
    for (let index = 1; index < pile.length - 1; index += 1) {
      const here = pile[index] ?? 0;
      const average = ((pile[index - 1] ?? 0) + (pile[index + 1] ?? 0)) / 2;
      pile[index] = here + (average - here) * 0.08;
    }
    context.globalAlpha = 1;
    const gradient = context.createLinearGradient(0, height * (1 - MAX_PILE), 0, height);
    gradient.addColorStop(0, '#ffffff');
    gradient.addColorStop(1, '#dbe8f5');
    context.fillStyle = gradient;
    context.beginPath();
    context.moveTo(0, height);
    for (let index = 0; index < pile.length; index += 1) context.lineTo(index * COLUMN * ratio, height - (pile[index] ?? 0));
    context.lineTo(width, height);
    context.closePath();
    context.fill();
  };
  frame = requestAnimationFrame(tick);

  return () => {
    cancelAnimationFrame(frame);
    observer.disconnect();
    visibility.disconnect();
  };
};
