"use client";

import { useEffect } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const PROJECTS = [
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
];

export default function Work() {
  useEffect(() => {
    const cards = document.querySelectorAll(".work-card");
    gsap.fromTo(
      cards,
      { opacity: 0, y: 24 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.15,
        ease: "power2.out",
        scrollTrigger: {
          trigger: "#work",
          start: "top 75%",
          toggleActions: "play none none none",
        },
      }
    );

    return () => ScrollTrigger.getAll().forEach((t) => t.kill());
  }, []);

  return (
    <section
      id="work"
      style={{
        padding: "120px 24px 80px",
        position: "relative",
      }}
    >
      {/* ── Section header ── */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          marginBottom: "24px",
        }}
      >
        <h2
          style={{
            fontFamily: "var(--font-clash)",
            fontSize: "clamp(3.5rem, 12vw, 14rem)",
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
            fontSize: "clamp(3.5rem, 12vw, 14rem)",
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

      {/* ── Project grid ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: "16px",
        }}
      >
        {PROJECTS.map((project) => (
          <a
            key={project.title}
            className="work-card"
            href="#"
            style={{
              textDecoration: "none",
              color: "#ffffff",
              display: "block",
              backgroundColor: "#171717",
              borderRadius: "14px",
              padding: "14px 14px 16px",
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

      {/* ── See all link ── */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: "48px",
          position: "relative",
          zIndex: 51,
        }}
      >
        <Link
          href="/work"
          style={{
            fontFamily: "var(--font-clash)",
            fontSize: "16px",
            fontWeight: 500,
            color: "var(--text)",
            textDecoration: "none",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            transition: "opacity 0.2s ease",
            padding: "12px 24px",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.6"; }}
          onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; }}
        >
          See all →
        </Link>
      </div>
    </section>
  );
}
