import * as THREE from 'three';
import gsap from 'gsap';
import { createFlake, drawFlake } from './snowflake';

// Snow is simulated entirely in the vertex shader (falling, swaying, wrapping, cursor push), so tens of thousands of
// flakes cost one draw call and no per-frame CPU work.
const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uHeight;
  uniform float uWind;
  uniform vec2 uPointer;
  uniform float uPixelRatio;
  attribute float aSpeed;
  attribute float aSize;
  attribute float aPhase;
  varying float vAlpha;

  void main() {
    vec3 p = position;
    float fall = mod(p.y - uTime * aSpeed + uHeight * 0.5, uHeight) - uHeight * 0.5;
    p.y = fall;
    p.x += sin(uTime * 0.6 + aPhase) * 0.35 + uWind * (fall + uHeight * 0.5) * 0.08;
    p.z += cos(uTime * 0.4 + aPhase) * 0.2;

    // Flakes near the pointer are pushed away, strongest for the layer closest to the camera.
    vec2 away = p.xy - uPointer;
    float distance = length(away);
    float push = smoothstep(2.4, 0.0, distance) * (0.6 + p.z * 0.08);
    p.xy += normalize(away + 0.0001) * push * 1.4;

    vec4 view = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * view;
    gl_PointSize = aSize * uPixelRatio * (18.0 / -view.z);
    vAlpha = smoothstep(-22.0, -6.0, view.z) * 0.9;
  }
`;

const fragmentShader = /* glsl */ `
  varying float vAlpha;
  void main() {
    vec2 c = gl_PointCoord - 0.5;
    float d = length(c);
    float soft = smoothstep(0.5, 0.0, d);
    gl_FragColor = vec4(vec3(0.94, 0.97, 1.0), soft * soft * vAlpha);
  }
`;

const FLAKE_TEXTURE = 1024;

export interface HeroScene {
  /** Builds a new unique flake; resolves with its serial number. */
  nextFlake: () => number;
  destroy: () => void;
}

export const createHeroScene = (canvas: HTMLCanvasElement, initialSeed: number, onFlake: (serial: number) => void): HeroScene => {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  const pixelRatio = Math.min(window.devicePixelRatio, 2);
  renderer.setPixelRatio(pixelRatio);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
  camera.position.set(0, 0, 14);

  const lowPower = window.matchMedia('(max-width: 720px)').matches || navigator.hardwareConcurrency <= 4;
  const count = lowPower ? 2600 : 7000;
  const height = 22;
  const positions = new Float32Array(count * 3);
  const speeds = new Float32Array(count);
  const sizes = new Float32Array(count);
  const phases = new Float32Array(count);
  for (let index = 0; index < count; index += 1) {
    positions[index * 3] = (Math.random() - 0.5) * 34;
    positions[index * 3 + 1] = (Math.random() - 0.5) * height;
    positions[index * 3 + 2] = (Math.random() - 0.5) * 18;
    speeds[index] = 0.5 + Math.random() * 1.1;
    sizes[index] = 1.4 + Math.random() * 3.6;
    phases[index] = Math.random() * Math.PI * 2;
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('aSpeed', new THREE.BufferAttribute(speeds, 1));
  geometry.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));
  geometry.setAttribute('aPhase', new THREE.BufferAttribute(phases, 1));
  const uniforms = {
    uTime: { value: 0 },
    uHeight: { value: height },
    uWind: { value: 0 },
    uPointer: { value: new THREE.Vector2(99, 99) },
    uPixelRatio: { value: pixelRatio },
  };
  const snow = new THREE.Points(geometry, new THREE.ShaderMaterial({
    vertexShader, fragmentShader, uniforms, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
  }));
  scene.add(snow);

  // The hero flake: drawn procedurally to a canvas, shown on a plane with a soft halo copy behind it.
  const flakeCanvas = document.createElement('canvas');
  flakeCanvas.width = FLAKE_TEXTURE;
  flakeCanvas.height = FLAKE_TEXTURE;
  const flakeContext = flakeCanvas.getContext('2d');
  if (flakeContext === null) throw new Error('2D canvas is unavailable.');
  const flakeTexture = new THREE.CanvasTexture(flakeCanvas);
  flakeTexture.colorSpace = THREE.SRGBColorSpace;
  flakeTexture.anisotropy = renderer.capabilities.getMaxAnisotropy();
  const flakeGroup = new THREE.Group();
  const flakeMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(6.4, 6.4),
    new THREE.MeshBasicMaterial({ map: flakeTexture, transparent: true, depthWrite: false }),
  );
  const halo = new THREE.Mesh(
    new THREE.PlaneGeometry(6.6, 6.6),
    new THREE.MeshBasicMaterial({ map: flakeTexture, transparent: true, opacity: 0.35, depthWrite: false, blending: THREE.AdditiveBlending }),
  );
  halo.position.z = -0.05;
  flakeGroup.add(halo, flakeMesh);
  flakeGroup.position.set(0, 0.2, 2);
  scene.add(flakeGroup);

  let serial = initialSeed;
  const paint = (seed: number): void => {
    drawFlake(flakeContext, createFlake(seed), FLAKE_TEXTURE);
    flakeTexture.needsUpdate = true;
  };
  paint(serial);
  onFlake(serial);

  const nextFlake = (): number => {
    serial += 1;
    gsap.timeline()
      .to(flakeGroup.scale, { x: 0.001, y: 0.001, duration: 0.35, ease: 'back.in(2)' })
      .add(() => { paint(serial); onFlake(serial); })
      .to(flakeGroup.scale, { x: 1, y: 1, duration: 0.9, ease: 'elastic.out(1, 0.5)' });
    gsap.fromTo(flakeGroup.rotation, { z: flakeGroup.rotation.z }, { z: flakeGroup.rotation.z + Math.PI * 2 / 3, duration: 1.3, ease: 'power3.out' });
    return serial;
  };

  // Pointer → world position on the z=0 plane, plus a smoothed horizontal wind from pointer velocity.
  const pointer = new THREE.Vector2(99, 99);
  const tilt = { x: 0, y: 0 };
  let wind = 0;
  let lastX = 0;
  const raycaster = new THREE.Raycaster();
  const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
  const hit = new THREE.Vector3();
  const onPointer = (event: PointerEvent): void => {
    const rect = canvas.getBoundingClientRect();
    const ndc = new THREE.Vector2(((event.clientX - rect.left) / rect.width) * 2 - 1, -((event.clientY - rect.top) / rect.height) * 2 + 1);
    raycaster.setFromCamera(ndc, camera);
    if (raycaster.ray.intersectPlane(plane, hit) !== null) pointer.set(hit.x, hit.y);
    tilt.x = ndc.y * 0.35;
    tilt.y = ndc.x * 0.45;
    wind += (event.clientX - lastX) * 0.004;
    lastX = event.clientX;
  };
  const onLeave = (): void => { pointer.set(99, 99); };
  window.addEventListener('pointermove', onPointer, { passive: true });
  canvas.addEventListener('pointerleave', onLeave);

  const resize = (): void => {
    const { clientWidth, clientHeight } = canvas;
    renderer.setSize(clientWidth, clientHeight, false);
    camera.aspect = clientWidth / Math.max(1, clientHeight);
    // Keep the flake comfortably inside narrow portrait screens.
    camera.position.z = camera.aspect < 0.8 ? 19 : 14;
    camera.updateProjectionMatrix();
  };
  const observer = new ResizeObserver(resize);
  observer.observe(canvas);
  resize();

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const clock = new THREE.Clock();
  let visible = true;
  const visibility = new IntersectionObserver(([entry]) => { visible = entry?.isIntersecting ?? true; });
  visibility.observe(canvas);
  renderer.setAnimationLoop(() => {
    if (!visible) return;
    const delta = Math.min(clock.getDelta(), 0.05);
    const speed = reduced ? 0.25 : 1;
    uniforms.uTime.value += delta * speed;
    wind *= 0.94;
    uniforms.uWind.value += (THREE.MathUtils.clamp(wind, -3, 3) - uniforms.uWind.value) * 0.05;
    uniforms.uPointer.value.lerp(pointer, 0.12);
    flakeGroup.rotation.x += (tilt.x - flakeGroup.rotation.x) * 0.05;
    flakeGroup.rotation.y += (tilt.y - flakeGroup.rotation.y) * 0.05;
    flakeGroup.rotation.z += delta * 0.08 * speed;
    flakeGroup.position.y = 0.2 + Math.sin(uniforms.uTime.value * 0.7) * 0.15;
    renderer.render(scene, camera);
  });

  return {
    nextFlake,
    destroy: () => {
      renderer.setAnimationLoop(null);
      observer.disconnect();
      visibility.disconnect();
      window.removeEventListener('pointermove', onPointer);
      renderer.dispose();
    },
  };
};
