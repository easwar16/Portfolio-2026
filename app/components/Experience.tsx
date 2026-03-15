"use client";

import { useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function getDuration(startYear: number, startMonth: number, endYear?: number, endMonth?: number): string {
  const end = endYear && endMonth ? new Date(endYear, endMonth - 1) : new Date();
  const start = new Date(startYear, startMonth - 1);
  let years = end.getFullYear() - start.getFullYear();
  let months = end.getMonth() - start.getMonth();
  if (months < 0) {
    years--;
    months += 12;
  }
  const parts: string[] = [];
  if (years > 0) parts.push(`${years} yr${years > 1 ? "s" : ""}`);
  if (months > 0) parts.push(`${months} mo${months > 1 ? "s" : ""}`);
  return parts.join(" ") || "< 1 mo";
}

function getTotalExperience(): string {
  // Fusion Practices: Sep 2023 – Present
  // Zoho: Sep 2022 – Apr 2023
  const now = new Date();
  const roles = [
    { start: new Date(2023, 8), end: now },
    { start: new Date(2022, 8), end: new Date(2023, 3) },
  ];
  let totalMonths = 0;
  for (const role of roles) {
    totalMonths += (role.end.getFullYear() - role.start.getFullYear()) * 12 + (role.end.getMonth() - role.start.getMonth());
  }
  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;
  const parts: string[] = [];
  if (years > 0) parts.push(`${years} yr${years > 1 ? "s" : ""}`);
  if (months > 0) parts.push(`${months} mo${months > 1 ? "s" : ""}`);
  return parts.join(" ") || "< 1 mo";
}

export default function Experience() {
  const fusionDuration = getDuration(2023, 9);
  const totalExperience = getTotalExperience();
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    const check = () => setMobile(window.innerWidth <= 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    // Kill previous triggers before re-binding
    ScrollTrigger.getAll().forEach((t) => {
      if (t.vars.trigger && typeof t.vars.trigger === "string" &&
        (t.vars.trigger.startsWith(".exp") || t.vars.trigger === "#experience")) {
        t.kill();
      }
    });

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
          trigger: "#experience",
          start: "top 75%",
          toggleActions: "play none none none",
        },
      }
    );

    gsap.fromTo(
      ".exp-wire",
      { scaleY: 0 },
      {
        scaleY: 1,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".exp-wire",
          start: "top 80%",
          toggleActions: "play none none none",
        },
      }
    );

    return () => ScrollTrigger.getAll().forEach((t) => t.kill());
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mobile]);

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

      {mobile ? (
        /* ── Mobile layout: Current → Wire → Past → Side cards ── */
        <>
          <div className="exp-card" style={{ backgroundColor: "var(--card-dark)", borderRadius: "14px", padding: "32px", color: "#fff", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px" }}>
                <span style={{ fontSize: "11px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", padding: "5px 14px", borderRadius: "20px", backgroundColor: "#fff", color: "#111" }}>Current</span>
                <span style={{ fontSize: "13px", color: "var(--text-secondary)", fontFamily: "var(--font-clash)" }}>01</span>
              </div>
              <h3 style={{ fontFamily: "var(--font-clash)", fontSize: "clamp(1.8rem, 5vw, 2.8rem)", fontWeight: 700, margin: 0, marginBottom: "8px", lineHeight: 1.05 }}>Software Developer</h3>
              <p style={{ fontFamily: "var(--font-clash)", fontSize: "16px", fontWeight: 500, color: "var(--text-muted)", margin: 0 }}>Fusion Practices (Oracle Partner) &middot; Full-time</p>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginTop: "24px" }}>
              {["Sep 2023 – Present", fusionDuration, "Hybrid", "Chennai, India"].map((tag) => (
                <span key={tag} style={{ fontSize: "11px", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.06em", padding: "6px 14px", borderRadius: "6px", backgroundColor: "rgba(255,255,255,0.07)", color: "#fff" }}>{tag}</span>
              ))}
            </div>
          </div>

          <div className="exp-wire-wrap" style={{ padding: "0 0 0 24px", height: "40px", position: "relative", marginTop: "-1px" }}>
            <div className="exp-wire" style={{ position: "absolute", left: "24px", top: 0, bottom: 0, width: "2px", backgroundColor: "var(--border-dark)", transformOrigin: "top" }} />
            <div className="exp-dot" style={{ position: "absolute", left: "19px", bottom: "-5px", width: "12px", height: "12px", borderRadius: "50%", backgroundColor: "var(--text-secondary)", border: "2px solid var(--bg)", zIndex: 4 }} />
          </div>

          <div className="exp-card exp-past-card" style={{ backgroundColor: "var(--card-dark)", borderRadius: "14px", padding: "28px 32px", color: "#fff", display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "12px" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
                <h3 style={{ fontFamily: "var(--font-clash)", fontSize: "20px", fontWeight: 700, margin: 0, lineHeight: 1.1 }}>Software Developer</h3>
              </div>
              <p style={{ fontSize: "14px", color: "#777", margin: 0 }}><span style={{ color: "#fff", fontWeight: 600 }}>Zoho</span> &middot; Sep 2022 &ndash; Apr 2023 &middot; 8 mos &middot; On-site</p>
            </div>
            <span style={{ fontSize: "13px", color: "var(--text-secondary)", fontFamily: "var(--font-clash)" }}>02</span>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginTop: "12px" }}>
            <div style={{ backgroundColor: "var(--card-dark)", borderRadius: "14px", padding: "28px", color: "#fff", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
              <span style={{ fontFamily: "var(--font-clash)", fontSize: "clamp(2.5rem, 8vw, 4rem)", fontWeight: 700, lineHeight: 1, color: "#fff" }}>{totalExperience.split(" ")[0]}+</span>
              <span style={{ fontSize: "13px", color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.1em", marginTop: "8px" }}>Years</span>
            </div>
            <div style={{ backgroundColor: "var(--card-dark)", borderRadius: "14px", padding: "28px", color: "#fff", display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
              <span style={{ fontFamily: "var(--font-clash)", fontSize: "15px", fontWeight: 600, color: "#ccc" }}>Chennai, India</span>
              <span style={{ fontSize: "12px", color: "var(--text-secondary)", marginTop: "4px" }}>Working globally</span>
            </div>
          </div>
        </>
      ) : (
        /* ── Desktop layout: Grid + Wire + Past role ── */
        <>
          <div className="exp-grid" style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gridTemplateRows: "1fr 1fr", gap: "12px", minHeight: "320px" }}>
            <div className="exp-card" style={{ gridRow: "1 / 3", backgroundColor: "var(--card-dark)", borderRadius: "14px", padding: "32px", color: "#fff", display: "flex", flexDirection: "column", justifyContent: "space-between", opacity: 0 }}>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px" }}>
                  <span style={{ fontSize: "11px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", padding: "5px 14px", borderRadius: "20px", backgroundColor: "#fff", color: "#111" }}>Current</span>
                  <span style={{ fontSize: "13px", color: "var(--text-secondary)", fontFamily: "var(--font-clash)" }}>01</span>
                </div>
                <h3 style={{ fontFamily: "var(--font-clash)", fontSize: "clamp(1.8rem, 3vw, 2.8rem)", fontWeight: 700, margin: 0, marginBottom: "8px", lineHeight: 1.05 }}>Software Developer</h3>
                <p style={{ fontFamily: "var(--font-clash)", fontSize: "16px", fontWeight: 500, color: "var(--text-muted)", margin: 0 }}>Fusion Practices (Oracle Partner) &middot; Full-time</p>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginTop: "24px" }}>
                {["Sep 2023 – Present", fusionDuration, "Hybrid", "Chennai, India"].map((tag) => (
                  <span key={tag} style={{ fontSize: "11px", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.06em", padding: "6px 14px", borderRadius: "6px", backgroundColor: "rgba(255,255,255,0.07)", color: "#fff" }}>{tag}</span>
                ))}
              </div>
            </div>
            <div className="exp-card" style={{ backgroundColor: "var(--card-dark)", borderRadius: "14px", padding: "28px", color: "#fff", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", opacity: 0 }}>
              <span style={{ fontFamily: "var(--font-clash)", fontSize: "clamp(2.5rem, 5vw, 4rem)", fontWeight: 700, lineHeight: 1, color: "#fff" }}>{totalExperience.split(" ")[0]}+</span>
              <span style={{ fontSize: "13px", color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.1em", marginTop: "8px" }}>Years</span>
            </div>
            <div className="exp-card" style={{ backgroundColor: "var(--card-dark)", borderRadius: "14px", padding: "28px", color: "#fff", display: "flex", flexDirection: "column", justifyContent: "flex-end", opacity: 0 }}>
              <span style={{ fontFamily: "var(--font-clash)", fontSize: "15px", fontWeight: 600, color: "#ccc" }}>Chennai, India</span>
              <span style={{ fontSize: "12px", color: "var(--text-secondary)", marginTop: "4px" }}>Working globally</span>
            </div>
          </div>

          <div className="exp-wire-wrap" style={{ padding: "0 0 0 60px", height: "40px", position: "relative", marginTop: "-1px" }}>
            <div className="exp-wire" style={{ position: "absolute", left: "60px", top: 0, bottom: 0, width: "2px", backgroundColor: "var(--border-dark)", transformOrigin: "top" }} />
            <div className="exp-dot" style={{ position: "absolute", left: "55px", bottom: "-5px", width: "12px", height: "12px", borderRadius: "50%", backgroundColor: "var(--text-secondary)", border: "2px solid var(--bg)", zIndex: 4 }} />
          </div>

          <div className="exp-card exp-past-card" style={{ backgroundColor: "var(--card-dark)", borderRadius: "14px", padding: "28px 32px", color: "#fff", display: "flex", justifyContent: "space-between", alignItems: "center", opacity: 0, maxWidth: "calc(66.666% - 6px)" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
                <h3 style={{ fontFamily: "var(--font-clash)", fontSize: "20px", fontWeight: 700, margin: 0, lineHeight: 1.1 }}>Software Developer</h3>
              </div>
              <p style={{ fontSize: "14px", color: "#777", margin: 0 }}><span style={{ color: "#fff", fontWeight: 600 }}>Zoho</span> &middot; Sep 2022 &ndash; Apr 2023 &middot; 8 mos &middot; On-site</p>
            </div>
            <span style={{ fontSize: "13px", color: "var(--text-secondary)", fontFamily: "var(--font-clash)" }}>02</span>
          </div>
        </>
      )}
    </section>
  );
}
