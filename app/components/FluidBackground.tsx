"use client";

import { useEffect, useRef } from "react";

// Simple 3D simplex noise implementation
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

export default function FluidBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafId = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement;
    if (!parent) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const perm = buildPerm();

    // Use lower resolution for performance, scale up
    const SCALE = 4;
    let w = 0;
    let h = 0;

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

    const imageData = () => ctx.createImageData(w, h);

    const animate = (time: number) => {
      const t = time * 0.0003; // slow animation speed
      const img = imageData();
      const data = img.data;

      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          const nx = x * 0.008;
          const ny = y * 0.008;

          // Layer multiple octaves of noise for fluid look
          const n1 = simplex3(perm, nx * 1.0, ny * 1.0, t * 0.7);
          const n2 = simplex3(perm, nx * 2.0 + 5.2, ny * 2.0 + 1.3, t * 0.5) * 0.5;
          const n3 = simplex3(perm, nx * 4.0 + n1 * 0.8, ny * 4.0 + n2 * 0.8, t * 0.3) * 0.25;

          // Domain warping — use noise to distort coordinates
          const warpX = simplex3(perm, nx + n1 * 0.4, ny + n2 * 0.4, t * 0.6);
          const warpY = simplex3(perm, nx + n2 * 0.4 + 3.1, ny + n1 * 0.4 + 7.5, t * 0.4);

          const finalNoise = simplex3(
            perm,
            nx * 1.5 + warpX * 1.2,
            ny * 1.5 + warpY * 1.2,
            t * 0.5
          ) + n2 + n3;

          // Map noise to greyscale — adapt to theme
          const isDark = document.documentElement.getAttribute("data-theme") === "dark";
          const val = isDark
            ? 0.04 + finalNoise * 0.06  // dark: range ~0.04 to 0.10 (near black)
            : 0.88 + finalNoise * 0.12; // light: range ~0.88 to 1.0 (near white)
          const c = Math.floor(Math.max(0, Math.min(1, val)) * 255);

          const idx = (y * w + x) * 4;
          data[idx] = c;
          data[idx + 1] = c;
          data[idx + 2] = c;
          data[idx + 3] = 255;
        }
      }

      ctx.putImageData(img, 0, 0);
      rafId.current = requestAnimationFrame(animate);
    };

    rafId.current = requestAnimationFrame(animate);

    return () => {
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
        zIndex: 0,
        imageRendering: "auto",
      }}
    />
  );
}
