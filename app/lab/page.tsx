"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import gsap from "gsap";

const StackGame = dynamic(() => import("../components/StackGame"), {
  ssr: false,
});

const EXPERIMENTS = [
  {
    title: "Stack",
    description: "A 3D stacking game built with Three.js & Cannon.js physics",
    component: "stack",
  },
];

export default function LabPage() {
  const router = useRouter();
  const pageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Hide site header
    const header = document.querySelector<HTMLElement>(".site-header");
    if (header) header.style.display = "none";
    document.body.style.paddingTop = "0px";

    if (!pageRef.current) return;

    gsap.fromTo(
      pageRef.current,
      { y: 60, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" }
    );

    gsap.fromTo(
      ".lab-card",
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

    return () => {
      if (header) header.style.display = "";
      document.body.style.paddingTop = "";
    };
  }, []);

  const handleBack = () => {
    router.back();
  };

  return (
    <>
      <div ref={pageRef} style={{ opacity: 0 }}>
        {/* Back button */}
        <div style={{ padding: "12px 40px 8px" }}>
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

        {/* Content */}
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
              LAB
            </h2>
            <span
              style={{
                fontFamily: "var(--font-clash)",
                fontSize: "14px",
                fontWeight: 500,
                color: "#888",
                textTransform: "uppercase",
                letterSpacing: "0.04em",
              }}
            >
              Experiments & Side Projects
            </span>
          </div>

          {/* Experiments */}
          <div
            className="lab-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: "16px",
            }}
          >
            {EXPERIMENTS.map((exp) => (
              <div
                key={exp.title}
                className="lab-card"
                style={{
                  backgroundColor: "#171717",
                  borderRadius: "14px",
                  padding: "14px",
                  opacity: 0,
                }}
              >
                {/* Game container */}
                <div
                  style={{
                    width: "100%",
                    aspectRatio: "16 / 10",
                    borderRadius: "10px",
                    border: "3px solid #333333",
                    overflow: "hidden",
                    position: "relative",
                  }}
                >
                  {exp.component === "stack" && <StackGame />}
                </div>

                {/* Info */}
                <div
                  style={{
                    marginTop: "14px",
                    padding: "0 4px",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-clash)",
                      fontSize: "13px",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.02em",
                      color: "#ffffff",
                    }}
                  >
                    {exp.title}
                  </span>
                  <p
                    style={{
                      margin: "6px 0 0",
                      fontSize: "10px",
                      fontWeight: 400,
                      color: "#999999",
                      textTransform: "uppercase",
                      letterSpacing: "0.04em",
                    }}
                  >
                    {exp.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </>
  );
}
