"use client";

import { useEffect, useRef } from "react";

// Simplex noise helpers
const F3 = 1 / 3;
const G3 = 1 / 6;
const grad3 = [
  [1,1,0],[-1,1,0],[1,-1,0],[-1,-1,0],
  [1,0,1],[-1,0,1],[1,0,-1],[-1,0,-1],
  [0,1,1],[0,-1,1],[0,1,-1],[0,-1,-1],
];

function buildPerm(): number[] {
  const p: number[] = [];
  for (let i = 0; i < 256; i++) p[i] = i;
  for (let i = 255; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [p[i], p[j]] = [p[j], p[i]];
  }
  const perm: number[] = new Array(512);
  for (let i = 0; i < 512; i++) perm[i] = p[i & 255];
  return perm;
}

function simplex3(perm: number[], x: number, y: number, z: number): number {
  const s = (x + y + z) * F3;
  const i = Math.floor(x + s);
  const j = Math.floor(y + s);
  const k = Math.floor(z + s);
  const t = (i + j + k) * G3;
  const X0 = i - t, Y0 = j - t, Z0 = k - t;
  const x0 = x - X0, y0 = y - Y0, z0 = z - Z0;

  let i1: number, j1: number, k1: number, i2: number, j2: number, k2: number;
  if (x0 >= y0) {
    if (y0 >= z0) { i1=1;j1=0;k1=0;i2=1;j2=1;k2=0; }
    else if (x0 >= z0) { i1=1;j1=0;k1=0;i2=1;j2=0;k2=1; }
    else { i1=0;j1=0;k1=1;i2=1;j2=0;k2=1; }
  } else {
    if (y0 < z0) { i1=0;j1=0;k1=1;i2=0;j2=1;k2=1; }
    else if (x0 < z0) { i1=0;j1=1;k1=0;i2=0;j2=1;k2=1; }
    else { i1=0;j1=1;k1=0;i2=1;j2=1;k2=0; }
  }

  const x1 = x0 - i1 + G3, y1 = y0 - j1 + G3, z1 = z0 - k1 + G3;
  const x2 = x0 - i2 + 2*G3, y2 = y0 - j2 + 2*G3, z2 = z0 - k2 + 2*G3;
  const x3 = x0 - 1 + 3*G3, y3 = y0 - 1 + 3*G3, z3 = z0 - 1 + 3*G3;

  const ii = i & 255, jj = j & 255, kk = k & 255;

  const contrib = (tx: number, ty: number, tz: number, gi: number): number => {
    let v = 0.6 - tx*tx - ty*ty - tz*tz;
    if (v < 0) return 0;
    v *= v;
    const g = grad3[gi % 12];
    return v * v * (g[0]*tx + g[1]*ty + g[2]*tz);
  };

  const n0 = contrib(x0, y0, z0, perm[ii + perm[jj + perm[kk]]]);
  const n1 = contrib(x1, y1, z1, perm[ii+i1 + perm[jj+j1 + perm[kk+k1]]]);
  const n2 = contrib(x2, y2, z2, perm[ii+i2 + perm[jj+j2 + perm[kk+k2]]]);
  const n3 = contrib(x3, y3, z3, perm[ii+1 + perm[jj+1 + perm[kk+1]]]);

  return 32 * (n0 + n1 + n2 + n3);
}

export default function FluidHover() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouse = useRef({ x: -9999, y: -9999, inside: false });
  const rafId = useRef(0);
  const opacity = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement;
    if (!parent) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const perm = buildPerm();
    const SCALE = 6;
    let w = 0, h = 0;

    const resize = () => {
      const rect = parent.getBoundingClientRect();
      w = Math.ceil(rect.width / SCALE);
      h = Math.ceil(rect.height / SCALE);
      canvas.width = w;
      canvas.height = h;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(parent);

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.current.x = (e.clientX - rect.left) / SCALE;
      mouse.current.y = (e.clientY - rect.top) / SCALE;
      mouse.current.inside = true;
    };

    const handleMouseLeave = () => {
      mouse.current.inside = false;
    };

    parent.addEventListener("mousemove", handleMouseMove);
    parent.addEventListener("mouseleave", handleMouseLeave);

    const animate = (time: number) => {
      const t = time * 0.0004;

      // Fade opacity in/out
      const target = mouse.current.inside ? 1 : 0;
      opacity.current += (target - opacity.current) * 0.06;

      if (opacity.current < 0.01) {
        ctx.clearRect(0, 0, w, h);
        rafId.current = requestAnimationFrame(animate);
        return;
      }

      const mx = mouse.current.x;
      const my = mouse.current.y;
      const RADIUS = 18; // radius in scaled pixels (~108px real)
      const img = ctx.createImageData(w, h);
      const data = img.data;

      // Only render pixels near the mouse for performance
      const startX = Math.max(0, Math.floor(mx - RADIUS));
      const endX = Math.min(w, Math.ceil(mx + RADIUS));
      const startY = Math.max(0, Math.floor(my - RADIUS));
      const endY = Math.min(h, Math.ceil(my + RADIUS));

      for (let y = startY; y < endY; y++) {
        for (let x = startX; x < endX; x++) {
          const dx = x - mx;
          const dy = y - my;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist > RADIUS) continue;

          const falloff = 1 - dist / RADIUS;
          const smooth = falloff * falloff * (3 - 2 * falloff); // smoothstep

          const nx = x * 0.06;
          const ny = y * 0.06;

          const n1 = simplex3(perm, nx + t, ny + t * 0.7, t * 0.5);
          const warpX = simplex3(perm, nx + n1 * 0.5, ny, t * 0.8);
          const warpY = simplex3(perm, nx + 3.1, ny + n1 * 0.5, t * 0.6);
          const n2 = simplex3(perm, nx * 2 + warpX, ny * 2 + warpY, t * 0.4);

          const val = 0.5 + (n1 + n2 * 0.5) * 0.5;
          const c = Math.floor(Math.max(0, Math.min(1, val)) * 200 + 55);
          const alpha = Math.floor(smooth * opacity.current * 180);

          const idx = (y * w + x) * 4;
          data[idx] = c;
          data[idx + 1] = c;
          data[idx + 2] = c;
          data[idx + 3] = alpha;
        }
      }

      ctx.clearRect(0, 0, w, h);
      ctx.putImageData(img, 0, 0);
      rafId.current = requestAnimationFrame(animate);
    };

    rafId.current = requestAnimationFrame(animate);

    return () => {
      parent.removeEventListener("mousemove", handleMouseMove);
      parent.removeEventListener("mouseleave", handleMouseLeave);
      cancelAnimationFrame(rafId.current);
      ro.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        borderRadius: "inherit",
        pointerEvents: "none",
        zIndex: 1,
        imageRendering: "auto",
      }}
    />
  );
}
