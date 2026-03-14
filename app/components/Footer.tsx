"use client";

import { useState } from "react";

const EMAIL = "easwarharikaran1610@gmail.com";

export default function Footer() {
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = async () => {
    await navigator.clipboard.writeText(EMAIL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <footer
      style={{
        padding: "100px 24px 24px",
        position: "relative",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column" as const,
        justifyContent: "flex-end",
      }}
    >
      {/* ── Bento grid ── */}
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
        {/* Work — large card spanning 2 cols, 2 rows with image */}
        <a
          href="#work"
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
            transition: "background-color 0.2s ease",
            overflow: "hidden",
            position: "relative",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#222"; }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "#171717"; }}
        >
          <span
            style={{
              fontFamily: "var(--font-clash)",
              fontSize: "14px",
              fontWeight: 500,
              color: "rgba(255,255,255,0.4)",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              zIndex: 2,
            }}
          >
            Selected Projects
          </span>
          <span style={{ fontFamily: "var(--font-clash)", fontSize: "28px", fontWeight: 700, zIndex: 2 }}>
            Work
          </span>
        </a>

        {/* Lab */}
        <a
          href="#lab"
          style={{
            borderRadius: "16px",
            backgroundColor: "#e5e5e5",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "28px 32px",
            textDecoration: "none",
            color: "var(--text)",
            transition: "background-color 0.2s ease",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#d9d9d9"; }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "#e5e5e5"; }}
        >
          <div>
            <span style={{ fontFamily: "var(--font-clash)", fontSize: "22px", fontWeight: 600 }}>
              Lab
            </span>
            <p style={{ fontSize: "12px", color: "#888", margin: "4px 0 0" }}>
              Experiments &amp; side projects
            </p>
          </div>
        </a>

        {/* Contact */}
        <button
          onClick={handleCopyEmail}
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
            transition: "background-color 0.2s ease",
            textAlign: "left",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#222"; }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "#111"; }}
        >
          <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
            Get in touch
          </span>
          <div>
            <span style={{ fontFamily: "var(--font-clash)", fontSize: "22px", fontWeight: 600 }}>
              {copied ? "Copied!" : "Contact"}
            </span>
            <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.35)", margin: "4px 0 0" }}>
              Click to copy email
            </p>
          </div>
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
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "28px 32px",
            textDecoration: "none",
            color: "var(--text)",
            transition: "background-color 0.2s ease",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#d9d9d9"; }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "#e5e5e5"; }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
          </svg>
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
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "28px 32px",
            textDecoration: "none",
            color: "var(--text)",
            transition: "background-color 0.2s ease",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#d9d9d9"; }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "#e5e5e5"; }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
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
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "28px 32px",
            textDecoration: "none",
            color: "var(--text)",
            transition: "background-color 0.2s ease",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#d9d9d9"; }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "#e5e5e5"; }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
          </svg>
          <span style={{ fontFamily: "var(--font-clash)", fontSize: "22px", fontWeight: 600 }}>
            LinkedIn
          </span>
        </a>

        {/* ── Large name watermark ── */}
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
    </footer>
  );
}
