"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const SECONDARY_TOOLS = [
  {
    name: "GSAP",
    icon: "https://cdn.worldvectorlogo.com/logos/gsap-greensock.svg",
  },
  {
    name: "Framer Motion",
    icon: "https://cdn.worldvectorlogo.com/logos/framer-motion.svg",
  },
  {
    name: "Tailwind CSS",
    icon: "https://cdn.worldvectorlogo.com/logos/tailwind-css-2.svg",
  },
  {
    name: "Three.js",
    icon: "https://cdn.worldvectorlogo.com/logos/threejs-1.svg",
  },
  {
    name: "Supabase",
    icon: "https://cdn.simpleicons.org/supabase/000000",
  },
  {
    name: "Vercel",
    icon: "https://cdn.simpleicons.org/vercel/000000",
  },
  {
    name: "Figma",
    icon: "https://cdn.worldvectorlogo.com/logos/figma-icon.svg",
  },
];

/* ── Split a word into letter spans ── */
function SplitLetters({
  text,
  className,
}: {
  text: string;
  className: string;
}) {
  return (
    <>
      {text.split("").map((char, i) =>
        char === " " ? (
          <span
            key={i}
            style={{ display: "inline-block", width: "0.3em" }}
          >
            &nbsp;
          </span>
        ) : (
          <span
            key={i}
            className={className}
            style={{
              display: "inline-block",
              willChange: "transform",
            }}
          >
            {char}
          </span>
        )
      )}
    </>
  );
}

export default function TechStack() {
  useEffect(() => {
    const letters = document.querySelectorAll<HTMLElement>(".tech-letter");

    letters.forEach((letter) => {
      const randX = (Math.random() - 0.5) * 200;
      const randY = (Math.random() - 0.5) * 150;
      const randRotate = (Math.random() - 0.5) * 90;

      gsap.set(letter, {
        x: randX,
        y: randY,
        rotation: randRotate,
        opacity: 0.3,
      });

      gsap.to(letter, {
        x: 0,
        y: 0,
        rotation: 0,
        opacity: 1,
        ease: "none",
        scrollTrigger: {
          trigger: "#tech",
          start: "top 90%",
          end: "top 30%",
          scrub: 1,
        },
      });
    });

    // Label fade in
    gsap.fromTo(
      ".tech-label",
      { opacity: 0, y: 12 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "power2.out",
        scrollTrigger: {
          trigger: "#tech",
          start: "top 50%",
          toggleActions: "play none none none",
        },
      }
    );

    // Tool cells stagger in
    gsap.fromTo(
      ".tool-cell",
      { opacity: 0, y: 10 },
      {
        opacity: 1,
        y: 0,
        duration: 0.5,
        stagger: 0.06,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".tools-grid",
          start: "top 80%",
          toggleActions: "play none none none",
        },
      }
    );

    return () => ScrollTrigger.getAll().forEach((t) => t.kill());
  }, []);

  return (
    <section
      id="tech"
      style={{
        padding: "120px 40px 0",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* ── Large headline ── */}
      <h2
        style={{
          fontFamily: "var(--font-clash)",
          fontSize: "clamp(4rem, 12vw, 14rem)",
          fontWeight: 700,
          lineHeight: 0.9,
          letterSpacing: "-0.04em",
          textAlign: "center",
          color: "var(--text)",
          textTransform: "uppercase",
          margin: 0,
          marginBottom: "80px",
        }}
      >
        <span style={{ display: "block" }}>
          <SplitLetters text="MODERN" className="tech-letter" />
        </span>
        <span style={{ display: "block" }}>
          <SplitLetters text="TECH STACK" className="tech-letter" />
        </span>
      </h2>

      {/* ── Label ── */}
      <p
        className="tech-label"
        style={{
          fontSize: "10px",
          fontWeight: 600,
          textTransform: "uppercase",
          letterSpacing: "0.2em",
          color: "var(--text-secondary)",
          marginBottom: "24px",
          paddingLeft: "4px",
        }}
      >
        PROFESSIONAL AT
      </p>

      {/* ── Unified tools grid with sliding pill ── */}
      <div
        className="tools-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(21, 1fr)",
          gridTemplateRows: "auto auto",
          borderTop: "1px solid #e0e0e0",
          borderBottom: "1px solid #e0e0e0",
          position: "relative",
        }}
        onMouseLeave={() => {
          const pill = document.querySelector<HTMLElement>(".tools-pill");
          if (pill) {
            gsap.to(pill, { opacity: 0, duration: 0.4, ease: "power2.inOut" });
          }
          document.querySelectorAll<HTMLElement>(".tool-label").forEach((el) => {
            gsap.to(el, { color: "var(--text)", duration: 0.3 });
          });
          document.querySelectorAll<HTMLElement>(".tool-icon").forEach((el) => {
            el.style.filter = "brightness(0)";
          });
        }}
      >
        {/* Sliding pill */}
        <div
          className="tools-pill"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: 0,
            height: 0,
            backgroundColor: "#111",
            borderRadius: "0px",
            opacity: 0,
            pointerEvents: "none",
            zIndex: 0,
            willChange: "transform, width, height, border-radius",
          }}
        />

        {/* ── Row 1: React | Next.js | TypeScript ── */}
        {[
          { label: "⚛", span: 7, isIcon: true },
          { label: "NEXT.JS", span: 7, isNextjs: true },
          { label: "TS", span: 7, isTS: true },
        ].map((item, i) => (
          <div
            key={i}
            className="tool-cell"
            style={{
              gridColumn: `span ${item.span}`,
              padding: "60px 0",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRight: i < 2 ? "1px solid #e0e0e0" : "none",
              borderBottom: "1px solid #e0e0e0",
              cursor: "pointer",
              position: "relative",
              zIndex: 1,
            }}
            onMouseEnter={(e) => {
              const pill = document.querySelector<HTMLElement>(".tools-pill");
              const grid = document.querySelector<HTMLElement>(".tools-grid");
              if (!pill || !grid) return;

              const cellRect = e.currentTarget.getBoundingClientRect();
              const gridRect = grid.getBoundingClientRect();

              gsap.to(pill, {
                left: cellRect.left - gridRect.left,
                top: cellRect.top - gridRect.top,
                width: cellRect.width,
                height: cellRect.height,
                borderRadius: "12px",
                opacity: 1,
                duration: 0.5,
                ease: "power3.out",
                overwrite: true,
              });

              document.querySelectorAll<HTMLElement>(".tool-label").forEach((el) => {
                gsap.to(el, { color: "var(--text)", duration: 0.2 });
              });
              const label = e.currentTarget.querySelector<HTMLElement>(".tool-label");
              if (label) gsap.to(label, { color: "#fff", duration: 0.3, delay: 0.05 });
            }}
          >
            {item.isIcon ? (
              <span className="tool-label" style={{ fontSize: "36px", color: "var(--text)" }}>
                {item.label}
              </span>
            ) : item.isNextjs ? (
              <span
                className="tool-label"
                style={{
                  fontFamily: "var(--font-clash)",
                  fontSize: "24px",
                  fontWeight: 600,
                  color: "var(--text)",
                  letterSpacing: "0.05em",
                }}
              >
                NEXT<span style={{ fontSize: "14px", verticalAlign: "sub" }}>.JS</span>
              </span>
            ) : (
              <div
                className="tool-label"
                style={{
                  width: "44px",
                  height: "44px",
                  backgroundColor: "#111",
                  borderRadius: "6px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-clash)",
                    fontSize: "18px",
                    fontWeight: 700,
                    color: "#fff",
                  }}
                >
                  TS
                </span>
              </div>
            )}
          </div>
        ))}

        {/* ── Row 2: Secondary tools (icons) ── */}
        {SECONDARY_TOOLS.map((tool, i) => (
          <div
            key={tool.name}
            className="tool-cell"
            style={{
              gridColumn: `span 3`,
              padding: "32px 16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRight:
                i < SECONDARY_TOOLS.length - 1 ? "1px solid #e0e0e0" : "none",
              cursor: "pointer",
              position: "relative",
              zIndex: 1,
            }}
            onMouseEnter={(e) => {
              const pill = document.querySelector<HTMLElement>(".tools-pill");
              const grid = document.querySelector<HTMLElement>(".tools-grid");
              if (!pill || !grid) return;

              const cellRect = e.currentTarget.getBoundingClientRect();
              const gridRect = grid.getBoundingClientRect();

              gsap.to(pill, {
                left: cellRect.left - gridRect.left,
                top: cellRect.top - gridRect.top,
                width: cellRect.width,
                height: cellRect.height,
                borderRadius: "8px",
                opacity: 1,
                duration: 0.5,
                ease: "power3.out",
                overwrite: true,
              });

              document.querySelectorAll<HTMLElement>(".tool-label").forEach((el) => {
                gsap.to(el, { color: "var(--text)", duration: 0.2 });
              });
              document.querySelectorAll<HTMLElement>(".tool-icon").forEach((el) => {
                el.style.filter = "brightness(0)";
              });
              const icon = e.currentTarget.querySelector<HTMLElement>(".tool-icon");
              if (icon) icon.style.filter = "brightness(0) invert(1)";
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className="tool-label tool-icon"
                src={tool.icon}
                alt={tool.name}
                title={tool.name}
                style={{
                  width: "22px",
                  height: "22px",
                  objectFit: "contain",
                  filter: "brightness(0)",
                  transition: "filter 0.3s ease",
                }}
              />
              <span
                className="tool-label"
                style={{
                  fontFamily: "var(--font-clash)",
                  fontSize: "13px",
                  fontWeight: 600,
                  color: "var(--text)",
                  letterSpacing: "0.02em",
                  whiteSpace: "nowrap",
                  transition: "color 0.3s ease",
                }}
              >
                {tool.name}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
