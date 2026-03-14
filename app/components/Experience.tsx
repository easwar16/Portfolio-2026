"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function getDuration(startYear: number, startMonth: number): string {
  const now = new Date();
  let years = now.getFullYear() - startYear;
  let months = now.getMonth() + 1 - startMonth;
  if (months < 0) {
    years--;
    months += 12;
  }
  const parts: string[] = [];
  if (years > 0) parts.push(`${years} yr${years > 1 ? "s" : ""}`);
  if (months > 0) parts.push(`${months} mo${months > 1 ? "s" : ""}`);
  return parts.join(" ") || "< 1 mo";
}

export default function Experience() {
  const fusionDuration = getDuration(2023, 9);

  useEffect(() => {
    gsap.fromTo(
      ".exp-header",
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "power2.out",
        scrollTrigger: {
          trigger: "#experience",
          start: "top 75%",
          toggleActions: "play none none none",
        },
      }
    );

    gsap.fromTo(
      ".exp-card",
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.5,
        stagger: 0.12,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".exp-grid",
          start: "top 75%",
          toggleActions: "play none none none",
        },
      }
    );

    // Connector wire grows
    gsap.fromTo(
      ".exp-wire",
      { scaleY: 0 },
      {
        scaleY: 1,
        duration: 0.6,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".exp-grid",
          start: "top 60%",
          toggleActions: "play none none none",
        },
      }
    );

    return () => ScrollTrigger.getAll().forEach((t) => t.kill());
  }, []);

  return (
    <section
      id="experience"
      style={{
        padding: "60px 24px 80px",
        position: "relative",
      }}
    >
      {/* ── Header ── */}
      <div
        className="exp-header"
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
          EXPERIENCE
        </h2>
      </div>

      {/* ── Bento Grid ── */}
      <div
        className="exp-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr",
          gap: "12px",
          position: "relative",
        }}
      >
        {/* ── Current role — large card ── */}
        <div
          className="exp-card"
          style={{
            backgroundColor: "#171717",
            borderRadius: "14px",
            padding: "32px",
            color: "#fff",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            minHeight: "240px",
            opacity: 0,
          }}
        >
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px" }}>
              <span
                style={{
                  fontSize: "11px",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  padding: "5px 14px",
                  borderRadius: "20px",
                  backgroundColor: "#fff",
                  color: "#111",
                }}
              >
                Current
              </span>
              <span style={{ fontSize: "13px", color: "#555", fontFamily: "var(--font-clash)" }}>
                01
              </span>
            </div>

            <h3
              style={{
                fontFamily: "var(--font-clash)",
                fontSize: "clamp(1.8rem, 3vw, 2.8rem)",
                fontWeight: 700,
                margin: 0,
                marginBottom: "8px",
                lineHeight: 1.05,
              }}
            >
              Software Developer
            </h3>
            <p
              style={{
                fontFamily: "var(--font-clash)",
                fontSize: "16px",
                fontWeight: 500,
                color: "#999",
                margin: 0,
              }}
            >
              Fusion Practices &middot; Full-time
            </p>
          </div>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "10px",
              marginTop: "24px",
            }}
          >
            {["Sep 2023 – Present", fusionDuration, "Hybrid", "Chennai, India"].map((tag) => (
              <span
                key={tag}
                style={{
                  fontSize: "11px",
                  fontWeight: 500,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  padding: "6px 14px",
                  borderRadius: "6px",
                  backgroundColor: "rgba(255,255,255,0.07)",
                  color: "#fff",
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* ── Right column: Duration + Location stacked ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {/* Duration */}
          <div
            className="exp-card"
            style={{
              flex: 1,
              backgroundColor: "#171717",
              borderRadius: "14px",
              padding: "28px",
              color: "#fff",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              opacity: 0,
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-clash)",
                fontSize: "clamp(2.5rem, 5vw, 4rem)",
                fontWeight: 700,
                lineHeight: 1,
                color: "#fff",
              }}
            >
              {fusionDuration.split(" ")[0]}+
            </span>
            <span
              style={{
                fontSize: "13px",
                color: "#666",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                marginTop: "8px",
              }}
            >
              Years
            </span>
          </div>

          {/* Location */}
          <div
            className="exp-card"
            style={{
              flex: 1,
              backgroundColor: "#171717",
              borderRadius: "14px",
              padding: "28px",
              color: "#fff",
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
              opacity: 0,
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-clash)",
                fontSize: "15px",
                fontWeight: 600,
                color: "#ccc",
              }}
            >
              Chennai, India
            </span>
            <span style={{ fontSize: "12px", color: "#666", marginTop: "4px" }}>
              Working globally
            </span>
          </div>
        </div>

        {/* ── Connector wire between cards ── */}
        <div
          className="exp-wire"
          style={{
            position: "absolute",
            left: "60px",
            top: "calc(100% - 12px)",
            width: "2px",
            height: "0",
            zIndex: 3,
          }}
        />
      </div>

      {/* ── Wire connector ── */}
      <div style={{ position: "relative", paddingLeft: "60px" }}>
        <div
          className="exp-wire"
          style={{
            position: "absolute",
            left: "60px",
            top: 0,
            width: "2px",
            height: "100%",
            backgroundColor: "#333",
            transformOrigin: "top",
          }}
        />
        {/* Dot top */}
        <div
          style={{
            position: "absolute",
            left: "55px",
            top: "-5px",
            width: "12px",
            height: "12px",
            borderRadius: "50%",
            backgroundColor: "#fff",
            zIndex: 4,
          }}
        />
        {/* Dot bottom */}
        <div
          style={{
            position: "absolute",
            left: "55px",
            bottom: "-5px",
            width: "12px",
            height: "12px",
            borderRadius: "50%",
            backgroundColor: "#555",
            zIndex: 4,
          }}
        />
      </div>

      {/* ── Zoho — past role card ── */}
      <div
        className="exp-card"
        style={{
          marginTop: "12px",
          backgroundColor: "#171717",
          borderRadius: "14px",
          padding: "28px 32px",
          color: "#fff",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          opacity: 0,
          maxWidth: "calc(66.666% - 6px)",
        }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
            <h3
              style={{
                fontFamily: "var(--font-clash)",
                fontSize: "20px",
                fontWeight: 700,
                margin: 0,
                lineHeight: 1.1,
              }}
            >
              Project Trainee
            </h3>
            <span
              style={{
                fontSize: "11px",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                padding: "4px 12px",
                borderRadius: "20px",
                backgroundColor: "rgba(255,255,255,0.08)",
                color: "#888",
              }}
            >
              Internship
            </span>
          </div>
          <p
            style={{
              fontSize: "14px",
              color: "#777",
              margin: 0,
            }}
          >
            Zoho &middot; Sep 2022 &ndash; Dec 2022 &middot; 4 mos &middot; On-site
          </p>
        </div>
        <span style={{ fontSize: "13px", color: "#555", fontFamily: "var(--font-clash)" }}>
          02
        </span>
      </div>
    </section>
  );
}
