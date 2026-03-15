"use client";

import { useEffect, useCallback, useRef, useState } from "react";
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
  const [wordIndex, setWordIndex] = useState(0);
  const wordRef = useRef<HTMLSpanElement>(null);
  const rotationInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  const startAnimations = useCallback(() => {
    const tl = gsap.timeline({ defaults: { ease: "power2.out" } });

    gsap.set(".hero-label", { opacity: 0, y: 20 });
    gsap.set(".hero-line", { opacity: 0, y: 30 });
    gsap.set(".hero-micro", { opacity: 0, y: 20 });
    gsap.set(".hero-bottom-bar", { opacity: 0, y: 20 });
    gsap.set(".scroll-hint", { opacity: 0, y: 20 });

    tl.to(".hero-label", { opacity: 1, y: 0, duration: 0.6 });

    tl.to(
      ".hero-line",
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.12,
        ease: "power2.out",
      },
      "-=0.3"
    );

    tl.to(
      ".hero-micro",
      { opacity: 1, y: 0, duration: 0.5 },
      "-=0.4"
    );

    tl.to(
      ".hero-bottom-bar",
      { opacity: 1, y: 0, duration: 0.6 },
      "-=0.3"
    );

    tl.to(
      ".scroll-hint",
      { opacity: 1, y: 0, duration: 0.5, stagger: 0.1 },
      "-=0.3"
    );
  }, []);

  // Set initial hidden state
  useEffect(() => {
    gsap.set(".hero-label", { opacity: 0, y: 20 });
    gsap.set(".hero-line", { opacity: 0, y: 30 });
    gsap.set(".hero-micro", { opacity: 0, y: 20 });
    gsap.set(".hero-bottom-bar", { opacity: 0, y: 20 });
    gsap.set(".scroll-hint", { opacity: 0, y: 20 });
  }, []);

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

    // Start rotation after hero entrance finishes
    const startDelay = setTimeout(() => {
      rotationInterval.current = setInterval(() => {
        if (!wordRef.current) return;

        // Animate current word out (slide up + fade)
        gsap.to(wordRef.current, {
          yPercent: -100,
          opacity: 0,
          duration: 0.4,
          ease: "power2.in",
          onComplete: () => {
            setWordIndex((prev) => (prev + 1) % ROTATING_WORDS.length);

            // Set new word below and animate in
            if (wordRef.current) {
              gsap.set(wordRef.current, { yPercent: 100, opacity: 0 });
              gsap.to(wordRef.current, {
                yPercent: 0,
                opacity: 1,
                duration: 0.4,
                ease: "power2.out",
              });
            }
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

    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseLeave = () => {
      mousePos.current = { x: -9999, y: -9999 };
    };

    const letters = section.querySelectorAll<HTMLElement>(".hero-letter");
    const letterData = new Array(letters.length).fill(null).map(() => ({
      translateY: 0,
      rotateZ: 0,
      scale: 1,
      skewX: 0,
    }));

    const animate = () => {
      const mx = mousePos.current.x;
      const my = mousePos.current.y;

      letters.forEach((letter, i) => {
        const rect = letter.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;

        const dx = mx - cx;
        const dy = my - cy;
        const dist = Math.sqrt(dx * dx + dy * dy);

        const d = letterData[i];

        if (dist < RADIUS) {
          const proximity = 1 - dist / RADIUS;
          // Smooth cubic falloff for natural wave
          const wave = proximity * proximity * proximity;

          // Letters flow toward cursor vertically
          const dirY = dy > 0 ? 1 : -1;
          const targetTranslateY = dirY * wave * -18;

          // Subtle rotation based on horizontal offset
          const targetRotateZ = (dx / RADIUS) * wave * 8;

          // Scale up near cursor
          const targetScale = 1 + wave * 0.12;

          // Skew creates the liquid stretch feel
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
    rafId.current = requestAnimationFrame(animate);

    return () => {
      section.removeEventListener("mousemove", handleMouseMove);
      section.removeEventListener("mouseleave", handleMouseLeave);
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
        <span className="hero-label mb-8 text-[12px] font-normal tracking-[0.2em] uppercase text-[#6b6b6b] md:mb-10 md:text-[13px]">
          Design Engineer · 2.5 Yrs
        </span>

        {/* Headline */}
        <h1
          className="relative text-center font-semibold uppercase leading-[0.88] tracking-[-0.04em] text-[#111]"
          style={{
            fontFamily: "var(--font-clash)",
            fontSize: "clamp(3.2rem, 11vw, 14rem)",
          }}
        >
          <span className="block overflow-hidden">
            <SplitText text="I MAKE" className="hero-line block" />
          </span>
          <span className="block overflow-hidden">
            <SplitText text="THE WEB" className="hero-line block" />
          </span>
          <span className="block overflow-hidden" style={{ position: "relative" }}>
            <span
              ref={wordRef}
              className="hero-line block"
              style={{ display: "inline-block" }}
            >
              <SplitText text={ROTATING_WORDS[wordIndex]} />
            </span>
          </span>
        </h1>

        {/* Micro text */}
        <p
          className="hero-micro mt-8 text-[12px] font-light italic tracking-[0.15em] text-[#6b6b6b] md:mt-10 md:text-[13px]"
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
          backgroundColor: "#e0e0e0",
        }}
      />
    </section>
  );
}
