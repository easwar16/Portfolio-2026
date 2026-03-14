"use client";

import { useRef, useEffect } from "react";
import * as THREE from "three";

const MAX_MANDALAS = 40;
const CURSOR_SPAWN_THROTTLE = 150; // ms — slower cursor spawning
const AMBIENT_SPAWN_INTERVAL = 800; // ms — random ambient spawns
const MANDALA_LIFETIME = 2.5; // seconds — longer life for ambient feel
const NUM_PATTERNS = 6;

function buildGeometry(points: number[]): THREE.BufferGeometry {
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(points, 3));
  return g;
}

/* ── Pattern 1: Classic mandala — rings + spokes + petals ── */
function createClassicMandala(): THREE.BufferGeometry {
  const p: number[] = [];
  const segs = 12;
  const step = (Math.PI * 2) / segs;
  for (let r = 1; r <= 4; r++) {
    const rad = r * 0.15;
    for (let s = 0; s < segs; s++) {
      const a1 = s * step, a2 = (s + 1) * step;
      p.push(Math.cos(a1)*rad, Math.sin(a1)*rad, 0, Math.cos(a2)*rad, Math.sin(a2)*rad, 0);
      if (r < 4) {
        const or = (r+1)*0.15;
        p.push(Math.cos(a1)*rad, Math.sin(a1)*rad, 0, Math.cos(a1)*or, Math.sin(a1)*or, 0);
      }
      if (r > 1 && s % 2 === 0) {
        const ir = (r-1)*0.15, ma = a1 + step*0.5;
        p.push(Math.cos(a1)*rad, Math.sin(a1)*rad, 0, Math.cos(ma)*ir, Math.sin(ma)*ir, 0);
        p.push(Math.cos(ma)*ir, Math.sin(ma)*ir, 0, Math.cos(a2)*rad, Math.sin(a2)*rad, 0);
      }
    }
    if (r === 2) {
      for (let s = 0; s < segs; s += 2) {
        const a1 = s*step, a2 = ((s+segs/2)%segs)*step;
        p.push(Math.cos(a1)*rad, Math.sin(a1)*rad, 0, Math.cos(a2)*rad, Math.sin(a2)*rad, 0);
      }
    }
  }
  return buildGeometry(p);
}

/* ── Pattern 2: Flower of Life — overlapping circles ── */
function createFlowerOfLife(): THREE.BufferGeometry {
  const p: number[] = [];
  const circSegs = 24;
  const drawCircle = (cx: number, cy: number, r: number) => {
    for (let i = 0; i < circSegs; i++) {
      const a1 = (i / circSegs) * Math.PI * 2;
      const a2 = ((i + 1) / circSegs) * Math.PI * 2;
      p.push(cx + Math.cos(a1)*r, cy + Math.sin(a1)*r, 0, cx + Math.cos(a2)*r, cy + Math.sin(a2)*r, 0);
    }
  };
  const r = 0.18;
  drawCircle(0, 0, r);
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2;
    drawCircle(Math.cos(a) * r, Math.sin(a) * r, r);
  }
  drawCircle(0, 0, r * 2);
  return buildGeometry(p);
}

/* ── Pattern 3: Sri Yantra — nested triangles ── */
function createSriYantra(): THREE.BufferGeometry {
  const p: number[] = [];
  const drawTriangle = (r: number, flip: boolean) => {
    const offset = flip ? Math.PI : 0;
    for (let i = 0; i < 3; i++) {
      const a1 = offset + (i / 3) * Math.PI * 2 - Math.PI / 2;
      const a2 = offset + ((i + 1) / 3) * Math.PI * 2 - Math.PI / 2;
      p.push(Math.cos(a1)*r, Math.sin(a1)*r, 0, Math.cos(a2)*r, Math.sin(a2)*r, 0);
    }
  };
  for (let i = 0; i < 4; i++) {
    const r = 0.15 + i * 0.12;
    drawTriangle(r, false);
    drawTriangle(r * 0.85, true);
  }
  // Outer circle
  const circSegs = 32;
  const outerR = 0.6;
  for (let i = 0; i < circSegs; i++) {
    const a1 = (i / circSegs) * Math.PI * 2;
    const a2 = ((i + 1) / circSegs) * Math.PI * 2;
    p.push(Math.cos(a1)*outerR, Math.sin(a1)*outerR, 0, Math.cos(a2)*outerR, Math.sin(a2)*outerR, 0);
  }
  return buildGeometry(p);
}

/* ── Pattern 4: Hexagonal web ── */
function createHexWeb(): THREE.BufferGeometry {
  const p: number[] = [];
  const layers = 3;
  for (let layer = 1; layer <= layers; layer++) {
    const r = layer * 0.18;
    for (let i = 0; i < 6; i++) {
      const a1 = (i / 6) * Math.PI * 2;
      const a2 = ((i + 1) / 6) * Math.PI * 2;
      // Hex ring
      p.push(Math.cos(a1)*r, Math.sin(a1)*r, 0, Math.cos(a2)*r, Math.sin(a2)*r, 0);
      // Spokes to center
      if (layer === 1) {
        p.push(0, 0, 0, Math.cos(a1)*r, Math.sin(a1)*r, 0);
      }
      // Radial connections between layers
      if (layer < layers) {
        const or = (layer+1)*0.18;
        p.push(Math.cos(a1)*r, Math.sin(a1)*r, 0, Math.cos(a1)*or, Math.sin(a1)*or, 0);
        // Cross connections
        const midA = a1 + Math.PI / 6;
        p.push(Math.cos(a1)*r, Math.sin(a1)*r, 0, Math.cos(midA)*or, Math.sin(midA)*or, 0);
      }
    }
  }
  return buildGeometry(p);
}

/* ── Pattern 5: Spiral mandala ── */
function createSpiralMandala(): THREE.BufferGeometry {
  const p: number[] = [];
  const turns = 3;
  const totalPoints = 80;
  // Spiral
  for (let i = 0; i < totalPoints; i++) {
    const t1 = i / totalPoints;
    const t2 = (i + 1) / totalPoints;
    const a1 = t1 * turns * Math.PI * 2;
    const a2 = t2 * turns * Math.PI * 2;
    const r1 = t1 * 0.55;
    const r2 = t2 * 0.55;
    p.push(Math.cos(a1)*r1, Math.sin(a1)*r1, 0, Math.cos(a2)*r2, Math.sin(a2)*r2, 0);
  }
  // Radial dots at each quarter turn
  for (let i = 0; i < turns * 4; i++) {
    const a = (i / (turns * 4)) * turns * Math.PI * 2;
    const r = (i / (turns * 4)) * 0.55;
    const dotR = 0.015;
    for (let j = 0; j < 4; j++) {
      const da1 = (j / 4) * Math.PI * 2;
      const da2 = ((j + 1) / 4) * Math.PI * 2;
      p.push(
        Math.cos(a)*r + Math.cos(da1)*dotR, Math.sin(a)*r + Math.sin(da1)*dotR, 0,
        Math.cos(a)*r + Math.cos(da2)*dotR, Math.sin(a)*r + Math.sin(da2)*dotR, 0
      );
    }
  }
  return buildGeometry(p);
}

/* ── Pattern 6: Metatron's Cube ── */
function createMetatronsCube(): THREE.BufferGeometry {
  const p: number[] = [];
  const circSegs = 20;
  const drawCircle = (cx: number, cy: number, r: number) => {
    for (let i = 0; i < circSegs; i++) {
      const a1 = (i / circSegs) * Math.PI * 2;
      const a2 = ((i + 1) / circSegs) * Math.PI * 2;
      p.push(cx + Math.cos(a1)*r, cy + Math.sin(a1)*r, 0, cx + Math.cos(a2)*r, cy + Math.sin(a2)*r, 0);
    }
  };
  // 13 circles: center + inner 6 + outer 6
  const r = 0.14;
  const pts: [number, number][] = [[0, 0]];
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2;
    pts.push([Math.cos(a) * r, Math.sin(a) * r]);
  }
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2;
    pts.push([Math.cos(a) * r * 2, Math.sin(a) * r * 2]);
  }
  // Draw all circles
  for (const [cx, cy] of pts) {
    drawCircle(cx, cy, r * 0.5);
  }
  // Connect all points to each other
  for (let i = 0; i < pts.length; i++) {
    for (let j = i + 1; j < pts.length; j++) {
      p.push(pts[i][0], pts[i][1], 0, pts[j][0], pts[j][1], 0);
    }
  }
  return buildGeometry(p);
}

/* ── Pattern factory ── */
function createRandomMandala(index: number): THREE.BufferGeometry {
  switch (index % NUM_PATTERNS) {
    case 0: return createClassicMandala();
    case 1: return createFlowerOfLife();
    case 2: return createSriYantra();
    case 3: return createHexWeb();
    case 4: return createSpiralMandala();
    case 5: return createMetatronsCube();
    default: return createClassicMandala();
  }
}

interface MandalaInstance {
  mesh: THREE.LineSegments;
  birthTime: number;
  startRotation: number;
  baseOpacity: number;
}

export default function MandalaBackground({
  sectionRef,
}: {
  sectionRef: React.RefObject<HTMLElement | null>;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mandalasRef = useRef<MandalaInstance[]>([]);
  const lastCursorSpawnRef = useRef(0);
  const lastAmbientSpawnRef = useRef(0);
  const rafRef = useRef(0);
  const aspectRef = useRef(1);
  const mouseWorldRef = useRef({ x: -9999, y: -9999 });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();

    const w = container.clientWidth;
    const h = container.clientHeight;
    aspectRef.current = w / h;

    const camera = new THREE.OrthographicCamera(
      -aspectRef.current, aspectRef.current, 1, -1, 0.1, 10
    );
    camera.position.z = 1;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    let spawnCounter = 0;

    const spawnMandala = (x: number, y: number, opacity: number = 0.45) => {
      const patternIndex = Math.floor(Math.random() * NUM_PATTERNS);
      const geometry = createRandomMandala(patternIndex);
      spawnCounter++;

      const material = new THREE.LineBasicMaterial({
        color: 0x555555,
        transparent: true,
        opacity: 0,
        depthTest: false,
      });

      const mesh = new THREE.LineSegments(geometry, material);
      mesh.position.set(x, y, 0);
      mesh.scale.setScalar(0.1);
      mesh.rotation.z = Math.random() * Math.PI * 2;

      scene.add(mesh);

      mandalasRef.current.push({
        mesh,
        birthTime: performance.now() / 1000,
        startRotation: mesh.rotation.z,
        baseOpacity: opacity,
      });

      while (mandalasRef.current.length > MAX_MANDALAS) {
        const oldest = mandalasRef.current.shift()!;
        scene.remove(oldest.mesh);
        oldest.mesh.geometry.dispose();
        (oldest.mesh.material as THREE.Material).dispose();
      }
    };

    // Cursor tracking + spawn
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      const wx = nx * aspectRef.current;
      const wy = ny;

      // Track mouse position for interactions only (no spawning)
      mouseWorldRef.current = { x: wx, y: wy };
    };

    const handleMouseLeave = () => {
      mouseWorldRef.current = { x: -9999, y: -9999 };
    };

    // Animation loop
    const animate = () => {
      const now = performance.now() / 1000;

      // Ambient spawns at random positions
      const nowMs = performance.now();
      if (nowMs - lastAmbientSpawnRef.current > AMBIENT_SPAWN_INTERVAL) {
        lastAmbientSpawnRef.current = nowMs;
        const rx = (Math.random() * 2 - 1) * aspectRef.current;
        const ry = Math.random() * 2 - 1;
        spawnMandala(rx, ry, 0.2 + Math.random() * 0.15);
      }

      // Update mandalas
      const mx = mouseWorldRef.current.x;
      const my = mouseWorldRef.current.y;
      const INTERACT_RADIUS = 0.6;

      const alive: MandalaInstance[] = [];
      for (const m of mandalasRef.current) {
        const age = now - m.birthTime;

        if (age > MANDALA_LIFETIME) {
          scene.remove(m.mesh);
          m.mesh.geometry.dispose();
          (m.mesh.material as THREE.Material).dispose();
          continue;
        }

        const progress = age / MANDALA_LIFETIME;

        // Base expand
        let expandScale = 0.1 + progress * 0.9;

        // Base rotation
        let rotSpeed = 0.2;

        // Base opacity
        let opacity: number;
        if (progress < 0.15) {
          opacity = m.baseOpacity * (progress / 0.15);
        } else {
          const fadeProgress = (progress - 0.15) / 0.85;
          opacity = m.baseOpacity * (1 - fadeProgress * fadeProgress);
        }

        // ── Cursor interaction ──
        const dx = mx - m.mesh.position.x;
        const dy = my - m.mesh.position.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < INTERACT_RADIUS) {
          const proximity = 1 - dist / INTERACT_RADIUS;
          const ease = proximity * proximity;

          // Scale up when cursor is near
          expandScale *= 1 + ease * 0.5;

          // Spin faster
          rotSpeed += ease * 2;

          // Brighten
          opacity = Math.min(opacity + ease * 0.3, 0.7);

          // Push away from cursor
          const pushStrength = ease * 0.015;
          const angle = Math.atan2(
            m.mesh.position.y - my,
            m.mesh.position.x - mx
          );
          m.mesh.position.x += Math.cos(angle) * pushStrength;
          m.mesh.position.y += Math.sin(angle) * pushStrength;
        }

        m.mesh.scale.setScalar(expandScale);
        m.mesh.rotation.z = m.startRotation + age * rotSpeed;
        (m.mesh.material as THREE.LineBasicMaterial).opacity = opacity;

        alive.push(m);
      }
      mandalasRef.current = alive;

      renderer.render(scene, camera);
      rafRef.current = requestAnimationFrame(animate);
    };

    const handleResize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      aspectRef.current = w / h;

      camera.left = -aspectRef.current;
      camera.right = aspectRef.current;
      camera.updateProjectionMatrix();

      renderer.setSize(w, h);
    };

    const eventTarget = sectionRef?.current || container;
    eventTarget.addEventListener("mousemove", handleMouseMove as EventListener);
    eventTarget.addEventListener("mouseleave", handleMouseLeave as EventListener);
    window.addEventListener("resize", handleResize);
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      eventTarget.removeEventListener("mousemove", handleMouseMove as EventListener);
      eventTarget.removeEventListener("mouseleave", handleMouseLeave as EventListener);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(rafRef.current);

      for (const m of mandalasRef.current) {
        scene.remove(m.mesh);
        m.mesh.geometry.dispose();
        (m.mesh.material as THREE.Material).dispose();
      }
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [sectionRef]);

  return (
    <div
      ref={containerRef}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
        pointerEvents: "none",
      }}
    />
  );
}
