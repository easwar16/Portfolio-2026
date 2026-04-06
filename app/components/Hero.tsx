"use client";

import { useEffect, useCallback, useRef } from "react";
import gsap from "gsap";
import BottomBar from "./BottomBar";

/* ── Split text into letter spans ── */
function SplitText({ text, className }: { text: string; className?: string }) {
  return (
    <span className={className}>
      {text.split("").map((char, i) =>
        char === " " ? (
          <span
            key={i}
            className="hero-letter"
            style={{ display: "inline-block", width: "0.3em" }}
          >
            &nbsp;
          </span>
        ) : (
          <span
            key={i}
            className="hero-letter"
            style={{
              display: "inline-block",
              willChange: "transform",
              transition: "none",
            }}
          >
            {char}
          </span>
        )
      )}
    </span>
  );
}

const ROTATING_WORDS = ["DO THINGS", "PERFORM", "REACT", "FEEL ALIVE"];

export default function Hero({ preloaderDone }: { preloaderDone: boolean }) {
  const sectionRef = useRef<HTMLElement>(null);
  const rafId = useRef<number>(0);
  const mousePos = useRef({ x: -9999, y: -9999 });
  const wordIndexRef = useRef(0);
  const wordRef = useRef<HTMLSpanElement>(null);
  const rotationInterval = useRef<ReturnType<typeof setInterval> | null>(null);
  const cachedRects = useRef<{ cx: number; cy: number }[]>([]);
  const rectsDirty = useRef(true);

  const startAnimations = useCallback(() => {
    const tl = gsap.timeline({ defaults: { ease: "power2.out" } });

    // Use fromTo so GSAP controls both start and end — no conflict with CSS
    tl.fromTo(".hero-label", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6 });

    tl.fromTo(
      ".hero-line",
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8, stagger: 0.12, ease: "power2.out" },
      "-=0.3"
    );

    tl.fromTo(
      ".hero-micro",
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5 },
      "-=0.4"
    );

    tl.fromTo(
      ".hero-bottom-bar",
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6 },
      "-=0.3"
    );

    tl.fromTo(
      ".scroll-hint",
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5, stagger: 0.1 },
      "-=0.3"
    );
  }, []);

  // Initial hidden state is handled by CSS (globals.css) to prevent FOUC

  // Start animations when preloader is done
  useEffect(() => {
    if (preloaderDone) {
      const timer = setTimeout(startAnimations, 200);
      return () => clearTimeout(timer);
    }
  }, [preloaderDone, startAnimations]);

  // ── Rotating words animation ──
  useEffect(() => {
    if (!preloaderDone) return;

    const startDelay = setTimeout(() => {
      rotationInterval.current = setInterval(() => {
        if (!wordRef.current) return;

        gsap.to(wordRef.current, {
          yPercent: -100,
          opacity: 0,
          duration: 0.4,
          ease: "power2.in",
          force3d: true,
          onComplete: () => {
            wordIndexRef.current =
              (wordIndexRef.current + 1) % ROTATING_WORDS.length;

            if (!wordRef.current) return;

            const nextWord = ROTATING_WORDS[wordIndexRef.current];
            wordRef.current.textContent = nextWord;
            rectsDirty.current = true;

            // fromTo eliminates the blank frame between set + to
            gsap.fromTo(
              wordRef.current,
              { yPercent: 100, opacity: 0 },
              { yPercent: 0, opacity: 1, duration: 0.4, ease: "power2.out", force3d: true }
            );
          },
        });
      }, 2500);
    }, 2000);

    return () => {
      clearTimeout(startDelay);
      if (rotationInterval.current) clearInterval(rotationInterval.current);
    };
  }, [preloaderDone]);

  // ── Flowing text distortion effect ──
  useEffect(() => {
    if (!preloaderDone) return;

    const section = sectionRef.current;
    if (!section) return;

    const RADIUS = 200;
    const LERP_IN = 0.1;
    const LERP_OUT = 0.06;

    // Only query static lines (not the rotating word) to avoid stale refs
    const staticLetters = section.querySelectorAll<HTMLElement>(
      ".hero-line-static .hero-letter"
    );
    const letterData = new Array(staticLetters.length).fill(null).map(() => ({
      translateY: 0,
      rotateZ: 0,
      scale: 1,
      skewX: 0,
    }));

    const updateRects = () => {
      cachedRects.current = Array.from(staticLetters).map((letter) => {
        const rect = letter.getBoundingClientRect();
        return { cx: rect.left + rect.width / 2, cy: rect.top + rect.height / 2 };
      });
      rectsDirty.current = false;
    };

    // Cache positions initially
    updateRects();

    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseLeave = () => {
      mousePos.current = { x: -9999, y: -9999 };
    };

    const handleResize = () => {
      rectsDirty.current = true;
    };

    const handleScroll = () => {
      rectsDirty.current = true;
    };

    const animate = () => {
      if (rectsDirty.current) updateRects();

      const mx = mousePos.current.x;
      const my = mousePos.current.y;

      staticLetters.forEach((letter, i) => {
        const { cx, cy } = cachedRects.current[i];

        const dx = mx - cx;
        const dy = my - cy;
        const dist = Math.sqrt(dx * dx + dy * dy);

        const d = letterData[i];

        if (dist < RADIUS) {
          const proximity = 1 - dist / RADIUS;
          const wave = proximity * proximity * proximity;

          const dirY = dy > 0 ? 1 : -1;
          const targetTranslateY = dirY * wave * -18;
          const targetRotateZ = (dx / RADIUS) * wave * 8;
          const targetScale = 1 + wave * 0.12;
          const targetSkewX = (dx / RADIUS) * wave * 6;

          d.translateY += (targetTranslateY - d.translateY) * LERP_IN;
          d.rotateZ += (targetRotateZ - d.rotateZ) * LERP_IN;
          d.scale += (targetScale - d.scale) * LERP_IN;
          d.skewX += (targetSkewX - d.skewX) * LERP_IN;
        } else {
          d.translateY += (0 - d.translateY) * LERP_OUT;
          d.rotateZ += (0 - d.rotateZ) * LERP_OUT;
          d.scale += (1 - d.scale) * LERP_OUT;
          d.skewX += (0 - d.skewX) * LERP_OUT;
        }

        const hasTransform =
          Math.abs(d.translateY) > 0.05 ||
          Math.abs(d.rotateZ) > 0.05 ||
          Math.abs(d.scale - 1) > 0.001 ||
          Math.abs(d.skewX) > 0.05;

        if (hasTransform) {
          letter.style.transform = `translateY(${d.translateY.toFixed(2)}px) rotate(${d.rotateZ.toFixed(2)}deg) scale(${d.scale.toFixed(4)}) skewX(${d.skewX.toFixed(2)}deg)`;
        } else if (letter.style.transform) {
          letter.style.transform = "";
        }
      });

      rafId.current = requestAnimationFrame(animate);
    };

    section.addEventListener("mousemove", handleMouseMove);
    section.addEventListener("mouseleave", handleMouseLeave);
    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", handleScroll, { passive: true });
    rafId.current = requestAnimationFrame(animate);

    return () => {
      section.removeEventListener("mousemove", handleMouseMove);
      section.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(rafId.current);
    };
  }, [preloaderDone]);

  return (
    <section
      ref={sectionRef}
      className="relative flex flex-col"
      style={{ minHeight: "calc(100vh - 68px)", overflow: "hidden" }}
    >

      {/* ── Hero content ── */}
      <div
        className="hero-content flex flex-1 flex-col items-center justify-center px-6 md:px-10 lg:px-12"
        style={{ position: "relative", zIndex: 1 }}
      >
        {/* Label */}
        <span className="hero-label mb-8 text-[12px] font-normal tracking-[0.2em] uppercase text-[var(--text-secondary)] md:mb-10 md:text-[13px]">
          Design Engineer · 3+ Yrs
        </span>

        {/* Headline */}
        <h1
          className="relative text-center font-semibold uppercase leading-[0.88] tracking-[-0.04em] text-[var(--text)]"
          style={{
            fontFamily: "var(--font-clash)",
            fontSize: "clamp(3.2rem, 11vw, 14rem)",
          }}
        >
          <span className="block overflow-hidden hero-line-static">
            <SplitText text="I MAKE" className="hero-line block" />
          </span>
          <span className="block overflow-hidden hero-line-static">
            <SplitText text="THE WEB" className="hero-line block" />
          </span>
          <span className="block overflow-hidden" style={{ position: "relative" }}>
            <span
              ref={wordRef}
              className="hero-line block"
              style={{ display: "inline-block", willChange: "transform, opacity" }}
            >
              {ROTATING_WORDS[0]}
            </span>
          </span>
        </h1>

        {/* Micro text */}
        <p
          className="hero-micro mt-8 text-[12px] font-light italic tracking-[0.15em] text-[var(--text-secondary)] md:mt-10 md:text-[13px]"
          style={{ fontFamily: "var(--font-satoshi)" }}
        >
          design-first · build-second
        </p>
      </div>

      {/* ── Scroll hints ── */}
      <span
        className="scroll-hint scroll-hint-text scroll-hint-left"
        style={{
          position: "absolute",
          bottom: "32px",
          left: "40px",
          zIndex: 40,
          fontSize: "13px",
          fontWeight: 600,
          color: "var(--text)",
          pointerEvents: "none",
        }}
      >
        ↓ Scroll for
      </span>
      <span
        className="scroll-hint scroll-hint-text scroll-hint-right"
        style={{
          position: "absolute",
          bottom: "32px",
          right: "40px",
          zIndex: 40,
          fontSize: "13px",
          fontWeight: 600,
          color: "var(--text)",
          pointerEvents: "none",
        }}
      >
        the good st*ff ↓
      </span>

      <BottomBar />

      {/* ── Bottom divider ── */}
      <div
        className="hero-divider"
        style={{
          position: "absolute",
          bottom: 0,
          left: "40px",
          right: "40px",
          height: "1px",
          backgroundColor: "var(--border-light)",
        }}
      />
    </section>
  );
}
