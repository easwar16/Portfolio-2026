"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const NAV_ITEMS = [
  { label: "Home", href: "#" },
  { label: "Work", href: "#work" },
  { label: "Lab", href: "/lab" },
];

gsap.registerPlugin(ScrollTrigger);

export default function BottomBar() {
  const [isOpen, setIsOpen] = useState(false);
  const barRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLDivElement>(null);
  const marqueeRef = useRef<gsap.core.Tween | null>(null);

  /* ── Marquee animation ── */
  useEffect(() => {
    marqueeRef.current = gsap.to(".marquee-track", {
      xPercent: -50,
      duration: 15,
      ease: "none",
      repeat: -1,
    });
  }, []);

  /* ── Hide on footer ── */
  useEffect(() => {
    const footer = document.querySelector("footer");
    if (!footer || !barRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          gsap.to(barRef.current, {
            y: 150,
            opacity: 0,
            duration: 0.4,
            ease: "power3.in",
          });
        } else {
          gsap.to(barRef.current, {
            y: 0,
            opacity: 1,
            duration: 0.4,
            ease: "power3.out",
          });
        }
      },
      { threshold: 0.05 }
    );

    observer.observe(footer);
    return () => observer.disconnect();
  }, []);

  /* ── Expand / Collapse ── */
  useEffect(() => {
    if (!barRef.current || !navRef.current) return;

    if (isOpen) {
      // Expand
      gsap.to(barRef.current, {
        maxWidth: "580px",
        borderRadius: "24px",
        duration: 0.5,
        ease: "power3.inOut",
      });
      gsap.set(navRef.current, { display: "flex" });
      gsap.fromTo(
        navRef.current,
        { height: 0, opacity: 0 },
        { height: "auto", opacity: 1, duration: 0.5, ease: "power3.out" }
      );
      gsap.fromTo(
        ".nav-item",
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.4,
          stagger: 0.08,
          ease: "power3.out",
          delay: 0.15,
        }
      );
    } else {
      // Collapse
      gsap.to(navRef.current, {
        height: 0,
        opacity: 0,
        duration: 0.35,
        ease: "power3.in",
        onComplete: () => {
          if (navRef.current) gsap.set(navRef.current, { display: "none" });
        },
      });
    }
  }, [isOpen]);

  return (
    <div
      ref={barRef}
      className="hero-bottom-bar"
      style={{
        position: "fixed",
        bottom: "24px",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 110,
        width: "calc(100% - 48px)",
        maxWidth: "580px",
        backgroundColor: "#111",
        borderRadius: isOpen ? "24px" : "16px",
        boxShadow: "0 20px 50px rgba(0,0,0,0.3)",
        overflow: "hidden",
      }}
    >
      {/* ── Expanded nav items ── */}
      <div
        ref={navRef}
        style={{
          display: "none",
          flexDirection: "column",
          gap: "0px",
          padding: "20px 20px 0 20px",
          height: 0,
          overflow: "hidden",
        }}
      >
        {NAV_ITEMS.map((item) => (
          <a
            key={item.label}
            href={item.href}
            className="nav-item"
            onClick={() => setIsOpen(false)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "20px",
              padding: "16px 0",
              textDecoration: "none",
              color: "#fff",
            }}
          >
            {/* Thumbnail */}
            <div
              className="nav-thumb"
              style={{
                width: "72px",
                height: "72px",
                borderRadius: "14px",
                backgroundColor: "#f5f5f0",
                flexShrink: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
              }}
            >
              {item.label === "Home" ? (
                <div style={{ textAlign: "center", padding: "6px" }}>
                  <p style={{ fontFamily: "var(--font-clash)", fontSize: "4px", fontWeight: 500, color: "#888", margin: 0, letterSpacing: "0.1em", textTransform: "uppercase" }}>
                    Design Engineer
                  </p>
                  <p style={{ fontFamily: "var(--font-clash)", fontSize: "9px", fontWeight: 800, color: "#111", margin: "2px 0 0", lineHeight: 0.9, textTransform: "uppercase", letterSpacing: "-0.03em" }}>
                    I MAKE<br />THE WEB<br />DO THINGS
                  </p>
                </div>
              ) : item.label === "Work" ? (
                <div style={{ width: "100%", height: "100%", padding: "6px", display: "flex", flexDirection: "column", gap: "3px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                    <span style={{ fontFamily: "var(--font-clash)", fontSize: "10px", fontWeight: 800, color: "#111", lineHeight: 0.85, letterSpacing: "-0.03em", textTransform: "uppercase" }}>WORK</span>
                    <span style={{ fontFamily: "var(--font-clash)", fontSize: "10px", fontWeight: 800, color: "#111", lineHeight: 0.85, letterSpacing: "-0.03em" }}>&rsquo;26</span>
                  </div>
                  <div style={{ display: "flex", gap: "3px", flex: 1, minHeight: 0 }}>
                    <div style={{ flex: 1, borderRadius: "3px", overflow: "hidden" }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src="/gfp_banner_portfolio.jpg" alt="GFP" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                    </div>
                    <div style={{ flex: 1, borderRadius: "3px", overflow: "hidden" }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src="/drawflopBanner.jpg" alt="Drawflow" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                    </div>
                  </div>
                </div>
              ) : item.label === "Lab" ? (
                <div style={{ width: "100%", height: "100%", padding: "6px", display: "flex", flexDirection: "column", gap: "3px" }}>
                  <span style={{ fontFamily: "var(--font-clash)", fontSize: "10px", fontWeight: 800, color: "#111", lineHeight: 0.85, letterSpacing: "-0.03em", textTransform: "uppercase" }}>LAB</span>
                  <div style={{ flex: 1, minHeight: 0, borderRadius: "3px", backgroundColor: "#171717", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1px" }}>
                      <div style={{ width: "14px", height: "4px", backgroundColor: "#c8a84e", borderRadius: "1px" }} />
                      <div style={{ width: "16px", height: "4px", backgroundColor: "#b89a40", borderRadius: "1px" }} />
                      <div style={{ width: "18px", height: "4px", backgroundColor: "#a88c35", borderRadius: "1px" }} />
                      <div style={{ width: "16px", height: "4px", backgroundColor: "#c8a84e", borderRadius: "1px" }} />
                    </div>
                  </div>
                </div>
              ) : (
                <span
                  style={{
                    fontFamily: "var(--font-clash)",
                    fontSize: "11px",
                    fontWeight: 600,
                    color: "#111",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  {item.label}
                </span>
              )}
            </div>

            <span
              style={{
                fontFamily: "var(--font-clash)",
                fontSize: "22px",
                fontWeight: 600,
                color: "#fff",
              }}
            >
              {item.label}
            </span>
          </a>
        ))}

        {/* Divider */}
        <div
          style={{
            height: "1px",
            backgroundColor: "rgba(255,255,255,0.12)",
            marginTop: "8px",
          }}
        />
      </div>

      {/* ── Bottom info row (always visible) ── */}
      <div
        className="bottom-bar-inner"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "16px",
          padding: "14px 24px 14px 14px",
        }}
      >
        {/* Avatar */}
        <div
          className="bottom-bar-avatar"
          style={{
            width: "48px",
            height: "48px",
            borderRadius: "12px",
            overflow: "hidden",
            backgroundColor: "#fff",
            flexShrink: 0,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/easwar-pixel.jpg"
            alt="Easwar"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>

        {/* Text */}
        <div style={{ flex: 1, minWidth: 0, overflow: "hidden" }}>
          <p
            style={{
              fontFamily: "var(--font-clash)",
              fontSize: "16px",
              fontWeight: 600,
              color: "#fff",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              margin: 0,
              lineHeight: 1.3,
            }}
          >
            EASWAR
          </p>
          <div
            style={{
              overflow: "hidden",
              marginTop: "2px",
              maskImage:
                "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
              WebkitMaskImage:
                "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
            }}
          >
            <div
              className="marquee-track"
              style={{
                display: "inline-flex",
                whiteSpace: "nowrap",
              }}
            >
              {[0, 1].map((i) => (
                <span
                  key={i}
                  style={{
                    fontSize: "13px",
                    color: "#777",
                    margin: 0,
                    lineHeight: 1.3,
                    paddingRight: "40px",
                  }}
                >
                  DEVELOPER &nbsp;·&nbsp; NEXT.JS ENTHUSIAST &nbsp;·&nbsp;
                  CREATIVE DESIGN ENGINEER &nbsp;·&nbsp; UI/UX &nbsp;·&nbsp;
                  FRONTEND &nbsp;·&nbsp; ANIMATION
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Menu / Close button */}
        <button
          onClick={() => setIsOpen((prev) => !prev)}
          style={{
            flexShrink: 0,
            padding: "8px",
            background: "none",
            border: "none",
            color: "#fff",
            cursor: "pointer",
            transition: "transform 0.3s ease",
            transform: isOpen ? "rotate(0deg)" : "rotate(0deg)",
          }}
          aria-label={isOpen ? "Close menu" : "Open menu"}
        >
          {isOpen ? (
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <line x1="6" y1="6" x2="18" y2="18" />
              <line x1="6" y1="18" x2="18" y2="6" />
            </svg>
          ) : (
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <line x1="4" y1="7" x2="20" y2="7" />
              <line x1="4" y1="12" x2="20" y2="12" />
              <line x1="4" y1="17" x2="20" y2="17" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}
