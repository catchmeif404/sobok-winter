// Procedural snowflakes: one arm is generated from a seed, then mirrored and repeated six times, so every seed gives
// a different but physically plausible (six-fold, bilaterally symmetric) crystal. `growth` (0..1) draws the crystal
// partway, which the scroll story uses to "grow" a flake.

export interface Branch {
  /** Where along the arm the branch starts, 0 (centre) .. 1 (tip). */
  at: number;
  length: number;
  /** Angle away from the arm, radians. Real dendrites sit near 60°. */
  angle: number;
  width: number;
  /** Small hexagonal plate at the branch tip. */
  plate: number;
}

export interface FlakeShape {
  seed: number;
  armWidth: number;
  core: number;
  ring: number;
  tipPlate: number;
  branches: Branch[];
}

// mulberry32: tiny deterministic PRNG so a serial number always reproduces the same flake.
export const random = (seed: number): (() => number) => {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
};

export const createFlake = (seed: number): FlakeShape => {
  const next = random(seed);
  const count = 3 + Math.floor(next() * 4);
  const branches: Branch[] = [];
  for (let index = 0; index < count; index += 1) {
    const at = 0.22 + (index / count) * 0.68 + next() * 0.06;
    branches.push({
      at,
      length: (0.12 + next() * 0.3) * (1.15 - at * 0.7),
      angle: Math.PI / 3 + (next() - 0.5) * 0.18,
      width: 0.012 + next() * 0.018,
      plate: next() < 0.35 ? 0.025 + next() * 0.03 : 0,
    });
  }
  return {
    seed,
    armWidth: 0.018 + next() * 0.02,
    core: 0.05 + next() * 0.07,
    ring: next() < 0.6 ? 0.1 + next() * 0.12 : 0,
    tipPlate: next() < 0.5 ? 0.03 + next() * 0.05 : 0,
    branches,
  };
};

const hexagon = (context: CanvasRenderingContext2D, x: number, y: number, radius: number): void => {
  context.beginPath();
  for (let side = 0; side < 6; side += 1) {
    const angle = (Math.PI / 3) * side + Math.PI / 6;
    const px = x + Math.cos(angle) * radius;
    const py = y + Math.sin(angle) * radius;
    if (side === 0) context.moveTo(px, py);
    else context.lineTo(px, py);
  }
  context.closePath();
};

const segment = (context: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number, width: number): void => {
  context.lineWidth = width;
  context.beginPath();
  context.moveTo(x1, y1);
  context.lineTo(x2, y2);
  context.stroke();
};

const clamp01 = (value: number): number => Math.min(1, Math.max(0, value));

export interface DrawOptions {
  growth?: number;
  color?: string;
  glow?: string;
}

/** Draws the flake centred in a square canvas of `size` px. */
export const drawFlake = (context: CanvasRenderingContext2D, shape: FlakeShape, size: number, options: DrawOptions = {}): void => {
  const growth = clamp01(options.growth ?? 1);
  const radius = size * 0.46;
  const centre = size / 2;
  context.save();
  context.clearRect(0, 0, size, size);
  context.translate(centre, centre);
  context.strokeStyle = options.color ?? '#ffffff';
  context.fillStyle = options.color ?? '#ffffff';
  context.lineCap = 'round';
  context.shadowColor = options.glow ?? 'rgba(186, 220, 255, 0.9)';
  context.shadowBlur = size * 0.02;

  const coreGrowth = clamp01(growth / 0.15);
  hexagon(context, 0, 0, shape.core * radius * coreGrowth);
  context.globalAlpha = 0.55;
  context.fill();
  context.globalAlpha = 1;
  context.lineWidth = size * 0.004;
  context.stroke();
  if (shape.ring > 0 && growth > 0.2) {
    hexagon(context, 0, 0, shape.ring * radius * clamp01((growth - 0.2) / 0.2));
    context.stroke();
  }

  const armLength = radius * clamp01((growth - 0.08) / 0.75);
  for (let arm = 0; arm < 6; arm += 1) {
    context.save();
    context.rotate((Math.PI / 3) * arm);
    segment(context, 0, 0, 0, -armLength, shape.armWidth * radius);
    for (const branch of shape.branches) {
      const reveal = clamp01((growth - branch.at * 0.75) / 0.25);
      if (reveal <= 0) continue;
      const y = -branch.at * radius;
      if (-y > armLength) continue;
      const length = branch.length * radius * reveal;
      for (const side of [-1, 1]) {
        const x2 = Math.sin(branch.angle) * length * side;
        const y2 = y - Math.cos(branch.angle) * length;
        segment(context, 0, y, x2, y2, branch.width * radius);
        if (branch.plate > 0 && reveal >= 1) {
          hexagon(context, x2, y2, branch.plate * radius);
          context.stroke();
        }
      }
    }
    if (shape.tipPlate > 0 && growth >= 0.95) {
      hexagon(context, 0, -armLength, shape.tipPlate * radius);
      context.stroke();
    }
    context.restore();
  }
  context.restore();
};
