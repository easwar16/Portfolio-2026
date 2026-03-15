"use client";

import { useEffect, useState } from "react";
import ThemeToggle from "./ThemeToggle";

const EMAIL = "easwarharikaran1610@gmail.com";

export default function Header() {
  const [mobile, setMobile] = useState(false);
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    const check = () => setMobile(window.innerWidth <= 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return (
    <header
      className="site-header"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        width: "100%",
        backgroundColor: "transparent",
        borderBottom: "none",
      }}
    >
      <div
        className="header-inner"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: mobile ? "flex-end" : "space-between",
          padding: mobile ? "12px 16px" : "16px 40px",
        }}
      >
        {/* Info columns */}
        {!mobile && (
        <div
          className="header-info"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "80px",
          }}
        >
          <div>
            <p
              style={{
                fontSize: "14px",
                fontWeight: 500,
                color: "var(--text)",
                lineHeight: 1.3,
                margin: 0,
              }}
            >
              India Based
            </p>
            <p
              style={{
                fontSize: "13px",
                fontWeight: 400,
                color: "var(--text-secondary)",
                lineHeight: 1.3,
                margin: 0,
                marginTop: "2px",
              }}
            >
              Working globally
            </p>
          </div>

          <div>
            <p
              style={{
                fontSize: "14px",
                fontWeight: 500,
                color: "var(--text)",
                lineHeight: 1.3,
                margin: 0,
              }}
            >
              Building at
            </p>
            <p
              style={{
                fontSize: "13px",
                fontWeight: 400,
                color: "var(--text-secondary)",
                lineHeight: 1.3,
                margin: 0,
                marginTop: "2px",
              }}
            >
              Fusion Practices
            </p>
          </div>

          <div>
            <p
              style={{
                fontSize: "14px",
                fontWeight: 500,
                color: "var(--text)",
                lineHeight: 1.3,
                margin: 0,
              }}
            >
              Freelance availability
            </p>
            <p
              style={{
                fontSize: "13px",
                fontWeight: 400,
                color: "var(--text-secondary)",
                lineHeight: 1.3,
                margin: 0,
                marginTop: "2px",
              }}
            >
              March 2026
            </p>
          </div>
        </div>
        )}

        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <ThemeToggle />
        <button
          onClick={async () => {
            await navigator.clipboard.writeText(EMAIL);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
          }}
          className="header-cta"
          style={{
            backgroundColor: copied ? "var(--success)" : "var(--text)",
            color: "var(--bg)",
            padding: "10px 24px",
            borderRadius: "9999px",
            fontSize: "14px",
            fontWeight: 500,
            whiteSpace: "nowrap",
            border: "none",
            cursor: "pointer",
            transition: "background-color 0.3s ease",
          }}
        >
          {copied ? "Email copied!" : "Get in touch"}
        </button>
        </div>
      </div>
    </header>
  );
}
