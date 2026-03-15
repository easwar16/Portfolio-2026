"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import FluidGL from "./FluidGL";
import FluidBackground from "./FluidBackground";

const EMAIL = "easwarharikaran1610@gmail.com";

export default function Footer() {
  const [copied, setCopied] = useState(false);
  const [clipPath, setClipPath] = useState("none");
  const gridRef = useRef<HTMLDivElement>(null);
  const workRef = useRef<HTMLAnchorElement>(null);
  const contactRef = useRef<HTMLButtonElement>(null);

  const handleCopyEmail = async () => {
    await navigator.clipboard.writeText(EMAIL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const updateClipPath = useCallback(() => {
    const grid = gridRef.current;
    const work = workRef.current;
    const contact = contactRef.current;
    if (!grid || !work || !contact) return;

    const gr = grid.getBoundingClientRect();
    const wr = work.getBoundingClientRect();
    const cr = contact.getBoundingClientRect();

    // Convert to percentages relative to grid
    const wp = (v: number, total: number) => ((v / total) * 100).toFixed(2) + "%";

    // Work card polygon (with border-radius approximation)
    const wL = wp(wr.left - gr.left, gr.width);
    const wR = wp(wr.right - gr.left, gr.width);
    const wT = wp(wr.top - gr.top, gr.height);
    const wB = wp(wr.bottom - gr.top, gr.height);

    // Contact card polygon
    const cL = wp(cr.left - gr.left, gr.width);
    const cR = wp(cr.right - gr.left, gr.width);
    const cT = wp(cr.top - gr.top, gr.height);
    const cB = wp(cr.bottom - gr.top, gr.height);

    // Store card positions relative to grid for SVG clipPath
    setClipPath(JSON.stringify({
      gw: gr.width, gh: gr.height,
      wx: wr.left - gr.left, wy: wr.top - gr.top, ww: wr.width, wh: wr.height,
      cx: cr.left - gr.left, cy: cr.top - gr.top, cw: cr.width, ch: cr.height,
    }));
  }, []);

  useEffect(() => {
    updateClipPath();
    const ro = new ResizeObserver(updateClipPath);
    if (gridRef.current) ro.observe(gridRef.current);
    window.addEventListener("resize", updateClipPath);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", updateClipPath);
    };
  }, [updateClipPath]);

  return (
    <footer
      style={{
        padding: "100px 24px 24px",
        position: "relative",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column" as const,
        justifyContent: "flex-end",
        overflow: "hidden",
      }}
    >
      <FluidBackground />

      {/* ── Bento grid ── */}
      <div
        ref={gridRef}
        className="footer-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gridTemplateRows: "200px 200px 200px",
          gap: "12px",
          width: "100%",
          position: "relative",
          zIndex: 2,
        }}
      >
        {/* Single shared FluidGL clipped to both dark cards with rounded corners */}
        {(() => {
          let d = { gw: 1, gh: 1, wx: 0, wy: 0, ww: 0, wh: 0, cx: 0, cy: 0, cw: 0, ch: 0 };
          try { d = JSON.parse(clipPath); } catch { /* initial render */ }
          const clipId = "fluid-clip";
          return (
            <>
              <svg width="0" height="0" style={{ position: "absolute" }}>
                <defs>
                  <clipPath id={clipId} clipPathUnits="objectBoundingBox">
                    <rect
                      x={d.gw ? d.wx / d.gw : 0}
                      y={d.gh ? d.wy / d.gh : 0}
                      width={d.gw ? d.ww / d.gw : 0}
                      height={d.gh ? d.wh / d.gh : 0}
                      rx={d.gw ? 16 / d.gw : 0}
                      ry={d.gh ? 16 / d.gh : 0}
                    />
                    <rect
                      x={d.gw ? d.cx / d.gw : 0}
                      y={d.gh ? d.cy / d.gh : 0}
                      width={d.gw ? d.cw / d.gw : 0}
                      height={d.gh ? d.ch / d.gh : 0}
                      rx={d.gw ? 16 / d.gw : 0}
                      ry={d.gh ? 16 / d.gh : 0}
                    />
                  </clipPath>
                </defs>
              </svg>
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  zIndex: 4,
                  pointerEvents: "none",
                  clipPath: `url(#${clipId})`,
                  WebkitClipPath: `url(#${clipId})`,
                }}
              >
                <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
                  <FluidGL />
                </div>
              </div>
            </>
          );
        })()}

        {/* Work — large dark card */}
        <a
          ref={workRef}
          href="#work"
          className="footer-work-card footer-card footer-card-pad"
          style={{
            gridColumn: "span 2",
            gridRow: "span 2",
            borderRadius: "16px",
            backgroundColor: "#171717",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "28px 32px",
            textDecoration: "none",
            color: "#fff",
            overflow: "hidden",
            position: "relative",
          }}
        >
          <span style={{ fontFamily: "var(--font-clash)", fontSize: "14px", fontWeight: 500, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.1em", position: "relative", zIndex: 5 }}>
            Selected Projects
          </span>
          <span style={{ fontFamily: "var(--font-clash)", fontSize: "28px", fontWeight: 700, position: "relative", zIndex: 5 }}>
            Work
          </span>
        </a>

        {/* Lab — grey card */}
        <a
          href="/lab"
          className="footer-card footer-card-pad"
          style={{
            borderRadius: "16px",
            backgroundColor: "rgba(229,229,229,0.7)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "28px 32px",
            textDecoration: "none",
            color: "var(--text)",
            overflow: "hidden",
            position: "relative",
            transition: "background-color 0.2s ease",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "rgba(217,217,217,0.9)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "rgba(229,229,229,0.7)"; }}
        >
          <div style={{ position: "relative", zIndex: 2 }}>
            <span style={{ fontFamily: "var(--font-clash)", fontSize: "22px", fontWeight: 600 }}>
              Lab
            </span>
            <p style={{ fontSize: "12px", color: "#888", margin: "4px 0 0" }}>
              Experiments &amp; side projects
            </p>
          </div>
        </a>

        {/* Contact — dark card */}
        <button
          ref={contactRef}
          onClick={handleCopyEmail}
          className="footer-card footer-card-pad"
          style={{
            borderRadius: "16px",
            backgroundColor: "#111",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "28px 32px",
            border: "none",
            cursor: "pointer",
            color: "#fff",
            textAlign: "left",
            overflow: "hidden",
            position: "relative",
          }}
        >
          <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.1em", position: "relative", zIndex: 5 }}>
            Get in touch
          </span>
          <div style={{ position: "relative", zIndex: 5 }}>
            <span style={{ fontFamily: "var(--font-clash)", fontSize: "22px", fontWeight: 600, transition: "all 0.3s ease" }}>
              {copied ? "Copied to clipboard!" : "Contact"}
            </span>
            <p style={{ fontSize: "11px", color: copied ? "rgba(255,255,255,0.6)" : "rgba(255,255,255,0.35)", margin: "4px 0 0", transition: "color 0.3s ease" }}>
              {copied ? EMAIL : "Click to copy email"}
            </p>
          </div>
          {/* Copied flash overlay */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: "inherit",
              backgroundColor: "rgba(34, 197, 94, 0.15)",
              opacity: copied ? 1 : 0,
              transition: "opacity 0.3s ease",
              pointerEvents: "none",
              zIndex: 3,
            }}
          />
        </button>

        {/* Github — grey card */}
        <a
          href="https://github.com/easwar16"
          target="_blank"
          rel="noopener noreferrer"
          className="footer-card footer-card-pad"
          style={{
            borderRadius: "16px",
            backgroundColor: "rgba(229,229,229,0.7)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "28px 32px",
            textDecoration: "none",
            color: "var(--text)",
            overflow: "hidden",
            position: "relative",
            transition: "background-color 0.2s ease",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "rgba(217,217,217,0.9)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "rgba(229,229,229,0.7)"; }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" style={{ position: "relative", zIndex: 2 }}>
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
          </svg>
          <span style={{ fontFamily: "var(--font-clash)", fontSize: "22px", fontWeight: 600, position: "relative", zIndex: 2 }}>
            Github
          </span>
        </a>

        {/* Twitter / X — grey card */}
        <a
          href="https://x.com/Easwar_H"
          target="_blank"
          rel="noopener noreferrer"
          className="footer-card footer-card-pad"
          style={{
            borderRadius: "16px",
            backgroundColor: "rgba(229,229,229,0.7)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "28px 32px",
            textDecoration: "none",
            color: "var(--text)",
            overflow: "hidden",
            position: "relative",
            transition: "background-color 0.2s ease",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "rgba(217,217,217,0.9)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "rgba(229,229,229,0.7)"; }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" style={{ position: "relative", zIndex: 2 }}>
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
          <span style={{ fontFamily: "var(--font-clash)", fontSize: "22px", fontWeight: 600, position: "relative", zIndex: 2 }}>
            Twitter / X
          </span>
        </a>

        {/* LinkedIn — grey card */}
        <a
          href="https://www.linkedin.com/in/easwar-harikaran-07764321b/"
          target="_blank"
          rel="noopener noreferrer"
          className="footer-card footer-card-pad"
          style={{
            borderRadius: "16px",
            backgroundColor: "rgba(229,229,229,0.7)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "28px 32px",
            textDecoration: "none",
            color: "var(--text)",
            overflow: "hidden",
            position: "relative",
            transition: "background-color 0.2s ease",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "rgba(217,217,217,0.9)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "rgba(229,229,229,0.7)"; }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" style={{ position: "relative", zIndex: 2 }}>
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
          </svg>
          <span style={{ fontFamily: "var(--font-clash)", fontSize: "22px", fontWeight: 600, position: "relative", zIndex: 2 }}>
            LinkedIn
          </span>
        </a>

      </div>

      {/* ── Name text ── */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          textAlign: "center",
          marginTop: "32px",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-clash)",
            fontSize: "clamp(3.5rem, 15vw, 22rem)",
            fontWeight: 700,
            color: "var(--text)",
            opacity: 0.12,
            letterSpacing: "-0.04em",
            lineHeight: 0.85,
            textTransform: "uppercase",
          }}
        >
          Easwar
        </span>
      </div>
    </footer>
  );
}
