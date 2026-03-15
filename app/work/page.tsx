"use client";

import { useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface Project {
  title: string;
  type: string;
  year: string;
  tags: string[];
  image: string;
  color: string;
  icon?: string;
  github: string;
}

const ALL_PROJECTS: Project[] = [
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


export default function WorkPageRoute() {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const blurRef = useRef<HTMLDivElement>(null);
  const videoWrapRef = useRef<HTMLDivElement>(null);
  const hasTriggered = useRef(false);

  const dfVideoRef = useRef<HTMLVideoElement>(null);
  const dfBlurRef = useRef<HTMLDivElement>(null);
  const dfVideoWrapRef = useRef<HTMLDivElement>(null);
  const dfHasTriggered = useRef(false);

  const handleVideoHover = useCallback((
    videoEl: HTMLVideoElement | null,
    blurEl: HTMLDivElement | null,
    wrapEl: HTMLDivElement | null,
    triggeredRef: React.MutableRefObject<boolean>,
  ) => {
    if (triggeredRef.current) return;
    triggeredRef.current = true;
    if (!videoEl || !blurEl || !wrapEl) return;

    gsap.to(blurEl, { opacity: 1, duration: 0.4, ease: "power2.out" });
    gsap.to(wrapEl, { opacity: 1, scale: 1, duration: 0.5, ease: "power3.out", delay: 0.15 });
    videoEl.play();
  }, []);

  const handleGFPHover = useCallback(() => {
    handleVideoHover(videoRef.current, blurRef.current, videoWrapRef.current, hasTriggered);
  }, [handleVideoHover]);

  const handleDFHover = useCallback(() => {
    handleVideoHover(dfVideoRef.current, dfBlurRef.current, dfVideoWrapRef.current, dfHasTriggered);
  }, [handleVideoHover]);

  const horizontalRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Hide header on mount
  useEffect(() => {
    const header = document.querySelector<HTMLElement>(".site-header");
    if (header) header.style.display = "none";
    document.body.style.paddingTop = "0px";
    return () => {
      if (header) header.style.display = "";
      document.body.style.paddingTop = "";
    };
  }, []);

  /* ── Entrance animation ── */
  useEffect(() => {
    gsap.fromTo(
      ".workpage-card",
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 0.5,
        stagger: 0.08,
        ease: "power2.out",
        delay: 0.3,
      }
    );
  }, []);

  /* ── Horizontal parallax scroll ── */
  useEffect(() => {
    const track = horizontalRef.current;
    const section = sectionRef.current;
    if (!track || !section) return;

    // Wait for images to load so dimensions are correct
    const images = track.querySelectorAll("img");
    const imagePromises = Array.from(images).map(
      (img) =>
        img.complete
          ? Promise.resolve()
          : new Promise<void>((resolve) => {
              img.onload = () => resolve();
              img.onerror = () => resolve();
            })
    );

    let ctx: gsap.Context;

    Promise.all(imagePromises).then(() => {
      ctx = gsap.context(() => {
        const getScroll = () => {
          const lastCard = track.lastElementChild as HTMLElement;
          if (!lastCard) return Math.max(0, track.scrollWidth - section.offsetWidth);
          const lastCardCenter = lastCard.offsetLeft + lastCard.offsetWidth / 2;
          const viewportCenter = section.offsetWidth / 2;
          return Math.max(0, lastCardCenter - viewportCenter);
        };

        gsap.to(track, {
          x: () => -getScroll(),
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: () => `+=${getScroll()}`,
            pin: true,
            scrub: 1,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

      }, section);
    });

    return () => ctx?.revert();
  }, []);


  const handleBack = () => {
    ScrollTrigger.getAll().forEach((st) => st.kill());
    router.back();
  };

  return (
    <>
      {/* ── Horizontal parallax section ── */}
      <div
        ref={sectionRef}
        style={{
          overflow: "hidden",
          position: "relative",
          height: "100vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
          {/* Back button */}
          <div style={{ padding: "12px 40px 8px", flexShrink: 0 }}>
            <button
              onClick={handleBack}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "var(--text)",
                padding: "8px 0",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                fontFamily: "var(--font-clash)",
                fontSize: "14px",
                fontWeight: 500,
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="19" y1="12" x2="5" y2="12" />
                <polyline points="12 19 5 12 12 5" />
              </svg>
              Back
            </button>
          </div>

          {/* Section title — fixed position, doesn't scroll */}
          <h2
            style={{
              position: "absolute",
              top: "12px",
              right: "40px",
              fontFamily: "var(--font-clash)",
              fontSize: "clamp(2rem, 5vw, 4rem)",
              fontWeight: 700,
              letterSpacing: "-0.02em",
              color: "#000",
              textTransform: "uppercase",
              margin: 0,
              zIndex: 5,
            }}
          >
            WORK
          </h2>

          {/* Horizontal track */}
          <div
            ref={horizontalRef}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "24px",
              padding: "0 40px",
              flex: 1,
              minHeight: 0,
              willChange: "transform",
            }}
          >
            {ALL_PROJECTS.map((project) => (
              <div
                key={project.title}
                className="workpage-card"
                style={{
                  flexShrink: 0,
                  alignSelf: "center",
                  borderRadius: "10px",
                  overflow: "hidden",
                  position: "relative",
                  height: "70vh",
                }}
                onMouseEnter={project.title === "Golden Flop" ? handleGFPHover : project.title === "Drawflow" ? handleDFHover : undefined}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={project.image}
                  alt={project.title}
                  style={{
                    height: "100%",
                    width: "auto",
                    objectFit: "cover",
                    display: "block",
                  }}
                />
                {project.title === "Golden Flop" && (
                  <>
                    <div
                      ref={blurRef}
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
                    <div
                      ref={videoWrapRef}
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
                        ref={videoRef}
                        src="/videos/goldenflopportfolio.webm"
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
                {project.title === "Drawflow" && (
                  <>
                    <div
                      ref={dfBlurRef}
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
                    <div
                      ref={dfVideoWrapRef}
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
                        ref={dfVideoRef}
                        src="/drawflow.webm"
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
            ))}
          </div>

          {/* Scroll indicator */}
          <div
            style={{
              padding: "12px 40px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              color: "var(--text-secondary)",
              fontSize: "11px",
              fontFamily: "var(--font-clash)",
              fontWeight: 500,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              opacity: 0.4,
              flexShrink: 0,
            }}
          >
            <span>Scroll to explore</span>
            <span>→</span>
          </div>
        </div>

    </>
  );
}
