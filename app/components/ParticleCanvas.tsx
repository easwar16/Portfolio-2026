"use client";

import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
}

export default function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useRef<Particle[]>([]);
  const mouse = useRef({ x: -9999, y: -9999, prevX: -9999, prevY: -9999, inside: false });
  const isClicking = useRef(false);
  const rafId = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement;
    if (!parent) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      const rect = parent.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
    };
    resize();

    const ro = new ResizeObserver(resize);
    ro.observe(parent);

    const spawnParticles = (x: number, y: number, count: number, burst: boolean) => {
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = burst
          ? Math.random() * 4 + 1.5
          : Math.random() * 0.8 + 0.2;

        // Varied sizes: mix of tiny, small, medium, large
        const sizeRoll = Math.random();
        let size: number;
        if (sizeRoll < 0.3) size = Math.random() * 1 + 0.5;       // tiny
        else if (sizeRoll < 0.6) size = Math.random() * 2 + 1.5;   // small
        else if (sizeRoll < 0.85) size = Math.random() * 3 + 3;    // medium
        else size = Math.random() * 4 + 5;                          // large

        const lifespan = Math.random() * 0.4 + 0.8; // 0.8 - 1.2

        particles.current.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 0.3,
          life: lifespan,
          maxLife: lifespan,
          size,
        });
      }
    };

    // Spawn trail particles between previous and current mouse positions
    const spawnTrail = (x: number, y: number, prevX: number, prevY: number, count: number) => {
      const dx = x - prevX;
      const dy = y - prevY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const steps = Math.max(1, Math.floor(dist / 4));

      for (let s = 0; s < steps; s++) {
        const t = s / steps;
        const px = prevX + dx * t;
        const py = prevY + dy * t;
        const perStep = Math.ceil(count / steps);
        spawnParticles(px, py, perStep, false);
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      mouse.current.prevX = mouse.current.x;
      mouse.current.prevY = mouse.current.y;
      mouse.current.x = x;
      mouse.current.y = y;
      mouse.current.inside = true;

      const count = isClicking.current ? 12 : 4;

      if (mouse.current.prevX > -9000) {
        spawnTrail(x, y, mouse.current.prevX, mouse.current.prevY, count);
      } else {
        spawnParticles(x, y, count, false);
      }
    };

    const handleMouseLeave = () => {
      mouse.current.inside = false;
      mouse.current.prevX = -9999;
      mouse.current.prevY = -9999;
    };

    const handleMouseDown = () => {
      isClicking.current = true;
      if (mouse.current.inside) {
        spawnParticles(mouse.current.x, mouse.current.y, 40, true);
      }
    };

    const handleMouseUp = () => {
      isClicking.current = false;
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.current.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.01;
        p.vx *= 0.99;
        p.vy *= 0.99;
        p.life -= 0.008;
      });

      particles.current = particles.current.filter((p) => p.life > 0);

      particles.current.forEach((p) => {
        const alpha = Math.pow(p.life / p.maxLife, 0.5);
        const currentSize = p.size * (0.3 + 0.7 * alpha);

        ctx.beginPath();
        ctx.arc(p.x, p.y, currentSize, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.5})`;
        ctx.fill();
      });

      rafId.current = requestAnimationFrame(animate);
    };

    parent.addEventListener("mousemove", handleMouseMove);
    parent.addEventListener("mouseleave", handleMouseLeave);
    parent.addEventListener("mousedown", handleMouseDown);
    parent.addEventListener("mouseup", handleMouseUp);
    rafId.current = requestAnimationFrame(animate);

    return () => {
      parent.removeEventListener("mousemove", handleMouseMove);
      parent.removeEventListener("mouseleave", handleMouseLeave);
      parent.removeEventListener("mousedown", handleMouseDown);
      parent.removeEventListener("mouseup", handleMouseUp);
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
        pointerEvents: "none",
        zIndex: 5,
        borderRadius: "inherit",
      }}
    />
  );
}
