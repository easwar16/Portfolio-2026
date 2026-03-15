"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const PROJECTS = [
  {
    title: "Golden Flop",
    type: "PRODUCT",
    year: "2026",
    tags: ["A real-time multiplayer poker game with practice mode, built for fast, casual gameplay and seamless matchmaking."],
    image: "/gfp_banner_portfolio.jpg",
    color: "#d4c5b0",
    icon: "/gfp_icon_small.png",
    github: "https://github.com/easwar16/golden-flop",
  },
  {
    title: "Drawflow",
    type: "PROJECT",
    year: "2026",
    tags: ["DrawFlow is a simple, fast whiteboard for turning ideas into visuals. Sketch diagrams, map out flows, and brainstorm freely with a clean, distraction-free canvas."],
    image: "/drawflopBanner.jpg",
    color: "#c8a84e",
    icon: "/penIcon.svg",
    github: "https://github.com/easwar16/drawflow",
  },
];

const VIDEO_PROJECTS: Record<string, string> = {
  "Golden Flop": "/videos/goldenflopportfolio.webm",
  "Drawflow": "/drawflow.webm",
};

export default function Work() {
  const videoRefs = useRef<Record<string, HTMLVideoElement | null>>({});
  const blurRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const videoWrapRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const triggered = useRef<Record<string, boolean>>({});
  const [mobile, setMobile] = useState(false);
  const [inView, setInView] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const check = () => setMobile(window.innerWidth <= 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Lazy load videos when section comes into view
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" }
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  const handleProjectHover = useCallback((title: string) => {
    if (triggered.current[title]) return;
    triggered.current[title] = true;

    const video = videoRefs.current[title];
    const blur = blurRefs.current[title];
    const videoWrap = videoWrapRefs.current[title];
    if (!video || !blur || !videoWrap) return;

    gsap.to(blur, { opacity: 1, duration: 0.4, ease: "power2.out" });
    gsap.to(videoWrap, { opacity: 1, scale: 1, duration: 0.5, ease: "power3.out", delay: 0.15 });
    video.play();
  }, []);

  // Auto-trigger videos on mobile
  useEffect(() => {
    if (!mobile) return;
    const timer = setTimeout(() => {
      Object.keys(VIDEO_PROJECTS).forEach((title) => handleProjectHover(title));
    }, 500);
    return () => clearTimeout(timer);
  }, [mobile, handleProjectHover]);

  useEffect(() => {
    const isMobile = window.innerWidth <= 768;
    const cards = document.querySelectorAll(".work-card");

    if (isMobile) {
      // On mobile: just show cards immediately
      gsap.set(cards, { opacity: 1, y: 0 });
    } else {
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
    }

    return () => ScrollTrigger.getAll().forEach((t) => t.kill());
  }, []);

  return (
    <section
      ref={sectionRef}
      id="work"
      style={{
        padding: mobile ? "60px 16px 60px" : "120px 24px 80px",
        overflow: "hidden",
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
        className="work-grid"
        style={{
          display: "grid",
          gridTemplateColumns: mobile ? "1fr" : "repeat(2, 1fr)",
          gap: "16px",
        }}
      >
        {PROJECTS.map((project) => (
          <div
            key={project.title}
            className="work-card"
            style={{
              color: "#ffffff",
              display: "block",
              backgroundColor: "#171717",
              borderRadius: "14px",
              padding: "14px 14px 16px",
              overflow: "hidden",
              maxWidth: "100%",
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
                position: "relative",
              }}
              onMouseEnter={VIDEO_PROJECTS[project.title] ? () => handleProjectHover(project.title) : undefined}
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
              {inView && VIDEO_PROJECTS[project.title] && (
                <>
                  {/* Blur overlay — hidden until hover */}
                  <div
                    ref={(el) => { blurRefs.current[project.title] = el; }}
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      backdropFilter: "blur(6px)",
                      WebkitBackdropFilter: "blur(6px)",
                      background: "rgba(0, 0, 0, 0.05)",
                      borderRadius: "inherit",
                      opacity: 0,
                    }}
                  />
                  {/* Video — scales up from center */}
                  <div
                    ref={(el) => { videoWrapRefs.current[project.title] = el; }}
                    style={{
                      position: "absolute",
                      top: "10%",
                      left: "10%",
                      width: "80%",
                      height: "80%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      opacity: 0,
                      transform: "scale(0.3)",
                    }}
                  >
                    <video
                      ref={(el) => { videoRefs.current[project.title] = el; }}
                      src={VIDEO_PROJECTS[project.title]}
                      preload="none"
                      muted
                      playsInline
                      loop
                      style={{
                        maxWidth: "100%",
                        maxHeight: "100%",
                        objectFit: "contain",
                        display: "block",
                        borderRadius: "14px",
                      }}
                    />
                  </div>
                </>
              )}
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
                      backgroundColor: "#fff",
                      padding: "3px",
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
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  style={{
                    color: "#999999",
                    display: "flex",
                    alignItems: "center",
                    transition: "color 0.2s ease",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = "#ffffff"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = "#999999"; }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                  </svg>
                </a>
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
                whiteSpace: "normal",
              }}
            >
              {project.tags.join(", ")}
            </p>
          </div>
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
        <a
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
        </a>
      </div>
    </section>
  );
}
