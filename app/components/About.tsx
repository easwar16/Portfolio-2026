"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const HIGHLIGHT_WORDS = new Set([
  "design", "engineering,", "end-to-end", "systems",
  "interfaces", "infrastructure,", "motion,", "scalability,",
  "detail,", "digital", "products", "forward-thinking", "brands",
]);

const BIO_TEXT =
  "Passionate about merging design and engineering, I build end-to-end systems — from the interfaces people touch to the infrastructure that powers them. With a focus on motion, scalability, and detail, I help bring digital products to life for forward-thinking brands around the world.";

const ABOUT_LABELS = ["MYSELF", "EASWAR"];

export default function About() {
  const textRef = useRef<HTMLParagraphElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const labelIndexRef = useRef(0);

  useEffect(() => {
    if (!textRef.current) return;

    const words = textRef.current.querySelectorAll<HTMLElement>(".about-word");
    if (words.length === 0) return;

    const isMobile = window.innerWidth <= 768;

    if (isMobile) {
      words.forEach((word) => {
        gsap.set(word, { x: 0, opacity: 1 });
      });
      gsap.set(textRef.current, { y: 0 });
      gsap.set(".about-image", { y: 0 });
    } else {
      // Single timeline with one ScrollTrigger for all words
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: "#about",
          start: "top 80%",
          end: "top 30%",
          scrub: 0.5,
        },
      });

      words.forEach((word) => {
        const randomX = (Math.random() - 0.5) * 300;
        gsap.set(word, { x: randomX, opacity: 0, force3d: true });
        tl.to(word, { x: 0, opacity: 1, ease: "power2.out", force3d: true }, 0);
      });

      // Text slides from top to bottom
      gsap.fromTo(
        textRef.current,
        { y: -200 },
        {
          y: 0,
          ease: "none",
          force3d: true,
          scrollTrigger: {
            trigger: "#about",
            start: "top 80%",
            end: "top 10%",
            scrub: 0.3,
          },
        }
      );

      // Image slides down
      gsap.fromTo(
        ".about-image",
        { y: -200 },
        {
          y: 0,
          ease: "none",
          force3d: true,
          scrollTrigger: {
            trigger: "#about",
            start: "top 80%",
            end: "top 10%",
            scrub: 0.3,
          },
        }
      );
    }

    return () => ScrollTrigger.getAll().forEach((t) => t.kill());
  }, []);

  // Rotating label — no React re-renders, direct DOM update
  useEffect(() => {
    const interval = setInterval(() => {
      if (!labelRef.current) return;

      gsap.to(labelRef.current, {
        yPercent: -100,
        opacity: 0,
        duration: 0.3,
        ease: "power2.in",
        force3d: true,
        onComplete: () => {
          labelIndexRef.current =
            (labelIndexRef.current + 1) % ABOUT_LABELS.length;

          if (!labelRef.current) return;
          labelRef.current.textContent = ABOUT_LABELS[labelIndexRef.current];

          gsap.fromTo(
            labelRef.current,
            { yPercent: 100, opacity: 0 },
            { yPercent: 0, opacity: 1, duration: 0.3, ease: "power2.out", force3d: true }
          );
        },
      });
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  return (
    <section
      id="about"
      className="about-section"
      style={{
        position: "relative",
        overflow: "hidden",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        gap: "60px",
        padding: "120px 10vw",
      }}
    >
      {/* ── Text side ── */}
      <div className="about-text" style={{ flex: "1 1 0%", minWidth: 0, zIndex: 2 }}>
        {/* Label */}
        <p
          style={{
            fontFamily: "var(--font-clash)",
            fontSize: "13px",
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.15em",
            color: "var(--text)",
            marginBottom: "32px",
            overflow: "hidden",
            height: "1.3em",
          }}
        >
          <span
            ref={labelRef}
            style={{ display: "inline-block", willChange: "transform, opacity" }}
          >
            {ABOUT_LABELS[0]}
          </span>
        </p>

        {/* Bio text — split into words */}
        <p
          ref={textRef}
          style={{
            fontFamily: "var(--font-clash)",
            fontSize: "clamp(1.2rem, 2.8vw, 2.8rem)",
            fontWeight: 500,
            lineHeight: 1.45,
            color: "var(--text)",
            letterSpacing: "-0.02em",
            margin: 0,
          }}
        >
          {BIO_TEXT.split(" ").map((word, i) => {
            const isHighlight = HIGHLIGHT_WORDS.has(word);
            return (
              <span
                key={i}
                className="about-word"
                style={{
                  display: "inline-block",
                  marginRight: "0.25em",
                  willChange: "transform",
                  color: isHighlight ? "var(--text)" : "#888",
                  textDecoration: isHighlight ? "underline" : "none",
                  textDecorationThickness: "2px",
                  textUnderlineOffset: "4px",
                }}
              >
                {word}
              </span>
            );
          })}
        </p>
      </div>

      {/* ── Image side ── */}
      <div
        className="about-image"
        style={{
          width: "28%",
          maxWidth: "340px",
          flexShrink: 0,
          borderRadius: "14px",
          overflow: "hidden",
          aspectRatio: "3 / 4",
          alignSelf: "center",
          zIndex: 1,
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="about-img-parallax"
          src="/easwar-pixel.jpg"
          alt="Easwar"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
          }}
        />
      </div>
    </section>
  );
}
