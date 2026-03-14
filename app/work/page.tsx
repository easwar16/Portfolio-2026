"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import BottomBar from "../components/BottomBar";

gsap.registerPlugin(ScrollTrigger);

interface Project {
  title: string;
  type: string;
  year: string;
  tags: string[];
  image: string;
  color: string;
  icon?: string;
}

const ALL_PROJECTS: Project[] = [
  {
    title: "Golden Flop",
    type: "PRODUCT",
    year: "2026",
    tags: ["NEXT.JS", "SOLANA", "MULTIPLAYER", "REAL-TIME", "MATCHMAKING", "WEBGL"],
    image: "/gfp_banner_portfolio.png",
    color: "#d4c5b0",
    icon: "/gfp_icon.png",
  },
  {
    title: "Project Two",
    type: "PRODUCT",
    year: "2025",
    tags: ["BRAND DESIGN", "STRATEGY", "UX", "UI", "WEB DESIGN", "PRODUCT DESIGN"],
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800&h=600&fit=crop",
    color: "#c8a84e",
  },
  {
    title: "Horizon Dashboard",
    type: "WEB APP",
    year: "2025",
    tags: ["REACT", "TYPESCRIPT", "TAILWIND CSS", "CHARTING", "DASHBOARD", "SAAS"],
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop",
    color: "#6366f1",
  },
  {
    title: "Nomad Travel",
    type: "MOBILE APP",
    year: "2025",
    tags: ["REACT NATIVE", "UI DESIGN", "MAPS", "TRAVEL", "BOOKING"],
    image: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&h=600&fit=crop",
    color: "#22c55e",
  },
  {
    title: "Pulse Fitness",
    type: "BRAND",
    year: "2024",
    tags: ["BRAND IDENTITY", "LOGO", "MOTION DESIGN", "FIGMA", "ILLUSTRATION"],
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&h=600&fit=crop",
    color: "#ef4444",
  },
  {
    title: "Lunar Studio",
    type: "PORTFOLIO",
    year: "2024",
    tags: ["NEXT.JS", "THREE.JS", "GSAP", "CREATIVE DEV", "WEBGL"],
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=600&fit=crop",
    color: "#8b5cf6",
  },
];

const EMAIL = "easwarharikaran1610@gmail.com";

export default function WorkPageRoute() {
  const router = useRouter();
  const pageRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = async () => {
    await navigator.clipboard.writeText(EMAIL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  /* ── Entrance animation ── */
  useEffect(() => {
    if (!pageRef.current) return;

    gsap.fromTo(
      pageRef.current,
      { y: 60, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.6,
        ease: "power3.out",
      }
    );

    gsap.fromTo(
      ".workpage-card",
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 0.5,
        stagger: 0.08,
        ease: "power2.out",
        delay: 0.8,
      }
    );
  }, []);

  /* ── Hide BottomBar when footer is in view ── */
  useEffect(() => {
    const footerEl = document.querySelector(".work-footer");
    if (!footerEl) return;

    ScrollTrigger.create({
      trigger: footerEl,
      start: "top bottom-=100",
      end: "top bottom",
      onEnter: () => {
        const bar = document.querySelector(".hero-bottom-bar") as HTMLElement | null;
        if (bar) gsap.to(bar, { y: 150, opacity: 0, duration: 0.4, ease: "power3.in" });
      },
      onLeaveBack: () => {
        const bar = document.querySelector(".hero-bottom-bar") as HTMLElement | null;
        if (bar) gsap.to(bar, { y: 0, opacity: 1, duration: 0.4, ease: "power3.out" });
      },
    });

    return () => ScrollTrigger.getAll().forEach((t) => t.kill());
  }, []);

  const handleBack = () => {
    router.back();
  };

  return (
    <>
      <div ref={pageRef} style={{ opacity: 0 }}>
        {/* ── Header ── */}
        <div
          style={{
            position: "sticky",
            top: 0,
            zIndex: 10,
            backgroundColor: "var(--bg, #f5f5f0)",
            borderBottom: "1px solid rgba(0,0,0,0.06)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "16px 40px",
            }}
          >
            <h2
              style={{
                fontFamily: "var(--font-clash)",
                fontSize: "20px",
                fontWeight: 700,
                color: "var(--text)",
                margin: 0,
                textTransform: "uppercase",
                letterSpacing: "0.02em",
              }}
            >
              All Work
            </h2>
            <button
              onClick={handleBack}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "var(--text)",
                padding: "8px",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                fontFamily: "var(--font-clash)",
                fontSize: "14px",
                fontWeight: 500,
              }}
            >
              Close
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <line x1="6" y1="6" x2="18" y2="18" />
                <line x1="6" y1="18" x2="18" y2="6" />
              </svg>
            </button>
          </div>
        </div>

        {/* ── Content ── */}
        <div style={{ padding: "40px 24px 80px" }}>
          {/* Section title */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              marginBottom: "32px",
            }}
          >
            <h2
              style={{
                fontFamily: "var(--font-clash)",
                fontSize: "clamp(3rem, 10vw, 10rem)",
                fontWeight: 700,
                lineHeight: 0.85,
                letterSpacing: "-0.04em",
                color: "var(--text)",
                textTransform: "uppercase",
                margin: 0,
              }}
            >
              WORK
            </h2>
            <span
              style={{
                fontFamily: "var(--font-clash)",
                fontSize: "clamp(3rem, 10vw, 10rem)",
                fontWeight: 700,
                lineHeight: 0.85,
                letterSpacing: "-0.04em",
                color: "var(--text)",
                margin: 0,
              }}
            >
              &rsquo;26
            </span>
          </div>

          {/* Project grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: "16px",
            }}
          >
            {ALL_PROJECTS.map((project) => (
              <a
                key={project.title}
                className="workpage-card"
                href="#"
                style={{
                  textDecoration: "none",
                  color: "#ffffff",
                  display: "block",
                  backgroundColor: "#171717",
                  borderRadius: "14px",
                  padding: "14px 14px 16px",
                  opacity: 0,
                }}
              >
                {/* Image */}
                <div
                  style={{
                    width: "100%",
                    aspectRatio: "16 / 10",
                    borderRadius: "10px",
                    border: "3px solid #333333",
                    overflow: "hidden",
                    backgroundColor: project.color,
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={project.image}
                    alt={project.title}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      display: "block",
                    }}
                  />
                </div>

                {/* Info row */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginTop: "14px",
                    padding: "0 4px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    {project.icon ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={project.icon}
                        alt={project.title + " icon"}
                        style={{
                          width: "24px",
                          height: "24px",
                          borderRadius: "50%",
                          objectFit: "cover",
                          flexShrink: 0,
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          width: "24px",
                          height: "24px",
                          borderRadius: "50%",
                          backgroundColor: project.color,
                          flexShrink: 0,
                        }}
                      />
                    )}
                    <span
                      style={{
                        fontFamily: "var(--font-clash)",
                        fontSize: "13px",
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: "0.02em",
                        wordSpacing: "0.15em",
                      }}
                    >
                      {project.title}
                    </span>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "20px",
                      fontSize: "13px",
                      fontWeight: 500,
                      color: "#999999",
                      textTransform: "uppercase",
                      letterSpacing: "0.04em",
                    }}
                  >
                    <span>{project.type}</span>
                    <span>{project.year}</span>
                  </div>
                </div>

                {/* Tags */}
                <p
                  style={{
                    margin: "8px 0 0",
                    padding: "0 4px",
                    fontSize: "10px",
                    fontWeight: 400,
                    color: "#999999",
                    textTransform: "uppercase",
                    letterSpacing: "0.04em",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {project.tags.join(", ")}
                </p>
              </a>
            ))}
          </div>
        </div>

        {/* ── Bento Footer ── */}
        <div
          className="work-footer"
          style={{
            padding: "100px 24px 24px",
            position: "relative",
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column" as const,
            justifyContent: "flex-end",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gridTemplateRows: "200px 200px 200px",
              gap: "12px",
              width: "100%",
              position: "relative",
            }}
          >
            {/* Work — large card spanning 2 cols, 2 rows */}
            <a
              href="#"
              onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }}
              style={{
                gridColumn: "span 2",
                gridRow: "span 2",
                borderRadius: "16px",
                backgroundColor: "#e5e5e5",
                display: "flex",
                alignItems: "flex-end",
                padding: "28px 32px",
                textDecoration: "none",
                color: "var(--text)",
                transition: "background-color 0.2s ease",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#d9d9d9"; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "#e5e5e5"; }}
            >
              <span style={{ fontFamily: "var(--font-clash)", fontSize: "22px", fontWeight: 600 }}>
                Work
              </span>
            </a>

            {/* Lab */}
            <a
              href="/#lab"
              style={{
                borderRadius: "16px",
                backgroundColor: "#e5e5e5",
                display: "flex",
                alignItems: "flex-end",
                padding: "28px 32px",
                textDecoration: "none",
                color: "var(--text)",
                transition: "background-color 0.2s ease",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#d9d9d9"; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "#e5e5e5"; }}
            >
              <span style={{ fontFamily: "var(--font-clash)", fontSize: "22px", fontWeight: 600 }}>
                Lab
              </span>
            </a>

            {/* Contact */}
            <button
              onClick={handleCopyEmail}
              style={{
                borderRadius: "16px",
                backgroundColor: "#e5e5e5",
                display: "flex",
                alignItems: "flex-end",
                padding: "28px 32px",
                border: "none",
                cursor: "pointer",
                color: "var(--text)",
                transition: "background-color 0.2s ease",
                textAlign: "left",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#d9d9d9"; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "#e5e5e5"; }}
            >
              <span style={{ fontFamily: "var(--font-clash)", fontSize: "22px", fontWeight: 600 }}>
                {copied ? "Copied to clipboard!" : "Contact"}
              </span>
            </button>

            {/* Github */}
            <a
              href="https://github.com/easwar16"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                borderRadius: "16px",
                backgroundColor: "#e5e5e5",
                display: "flex",
                alignItems: "flex-end",
                padding: "28px 32px",
                textDecoration: "none",
                color: "var(--text)",
                transition: "background-color 0.2s ease",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#d9d9d9"; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "#e5e5e5"; }}
            >
              <span style={{ fontFamily: "var(--font-clash)", fontSize: "22px", fontWeight: 600 }}>
                Github
              </span>
            </a>

            {/* Twitter / X */}
            <a
              href="https://x.com/Easwar_H"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                borderRadius: "16px",
                backgroundColor: "#e5e5e5",
                display: "flex",
                alignItems: "flex-end",
                padding: "28px 32px",
                textDecoration: "none",
                color: "var(--text)",
                transition: "background-color 0.2s ease",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#d9d9d9"; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "#e5e5e5"; }}
            >
              <span style={{ fontFamily: "var(--font-clash)", fontSize: "22px", fontWeight: 600 }}>
                Twitter / X
              </span>
            </a>

            {/* LinkedIn */}
            <a
              href="https://www.linkedin.com/in/easwar-harikaran-07764321b/"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                borderRadius: "16px",
                backgroundColor: "#e5e5e5",
                display: "flex",
                alignItems: "flex-end",
                padding: "28px 32px",
                textDecoration: "none",
                color: "var(--text)",
                transition: "background-color 0.2s ease",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#d9d9d9"; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "#e5e5e5"; }}
            >
              <span style={{ fontFamily: "var(--font-clash)", fontSize: "22px", fontWeight: 600 }}>
                LinkedIn
              </span>
            </a>

            {/* Large name watermark */}
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                pointerEvents: "none",
                zIndex: 1,
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-clash)",
                  fontSize: "clamp(6rem, 15vw, 18rem)",
                  fontWeight: 700,
                  color: "var(--text)",
                  opacity: 0.08,
                  whiteSpace: "nowrap",
                  letterSpacing: "-0.04em",
                }}
              >
                Easwar
              </span>
            </div>
          </div>
        </div>
      </div>

      <BottomBar />
    </>
  );
}
