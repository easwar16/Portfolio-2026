"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const SERVICES = [
  {
    number: "01",
    title: "Frontend Development",
    description:
      "Crafting fast, responsive, and pixel-perfect web applications. From landing pages to full-scale products, built with clean code and modern frameworks.",
    tags: [
      "NEXT.JS",
      "REACT",
      "TYPESCRIPT",
      "TAILWIND CSS",
      "PERFORMANCE",
      "RESPONSIVE DESIGN",
    ],
    image: "https://images.unsplash.com/photo-1607706189992-eae578626c86?w=560&h=440&fit=crop",
    imageColor: "#2a1f1a",
  },
  {
    number: "02",
    title: "Creative Development",
    description:
      "Bringing interfaces to life with smooth animations, scroll-driven interactions, and immersive effects that make products feel premium and memorable.",
    tags: [
      "GSAP",
      "FRAMER MOTION",
      "THREE.JS",
      "SCROLL ANIMATIONS",
      "MICRO-INTERACTIONS",
      "WEBGL",
    ],
    image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=560&h=440&fit=crop",
    imageColor: "#1a2a1f",
  },
  {
    number: "03",
    title: "UI / UX Design",
    description:
      "Designing intuitive interfaces and seamless user flows. From wireframes to high-fidelity prototypes, ensuring every interaction is purposeful and effortless.",
    tags: [
      "FIGMA",
      "PROTOTYPING",
      "DESIGN SYSTEMS",
      "USER RESEARCH",
      "VISUAL DESIGN",
      "INTERACTION DESIGN",
    ],
    image: "https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=560&h=440&fit=crop",
    imageColor: "#1a1f2a",
  },
];

export default function Services() {
  useEffect(() => {
    // Animate the header
    gsap.fromTo(
      ".services-header",
      { opacity: 0, y: 60 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".services-header",
          start: "top 85%",
          toggleActions: "play none none none",
        },
      }
    );

    // Animate each service row
    document.querySelectorAll(".service-row").forEach((row) => {
      const children = row.querySelectorAll(".service-animate");
      gsap.fromTo(
        children,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: row,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );
    });
  }, []);

  return (
    <section
      id="services"
      style={{
        margin: "0 12px",
        borderRadius: "20px",
        backgroundColor: "#1a1a1a",
        color: "#fff",
        padding: "80px 36px 48px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* ── Header ── */}
      <div
        className="services-header"
        style={{
          padding: "0 220px 0 220px",
          marginBottom: "0",
        }}
      >
        <p
          style={{
            fontSize: "14px",
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.2em",
            color: "rgba(255,255,255,0.4)",
            marginBottom: "24px",
          }}
        >
          SERVICES
        </p>
        <p
          style={{
            fontFamily: "var(--font-clash)",
            fontSize: "clamp(1.6rem, 3vw, 2.8rem)",
            fontWeight: 300,
            lineHeight: 1.2,
            letterSpacing: "-0.01em",
            margin: 0,
            color: "rgba(255,255,255,0.85)",
          }}
        >
          Available for <span style={{ color: "#fff", fontWeight: 400, textDecoration: "underline", textUnderlineOffset: "6px", textDecorationThickness: "1px", textDecorationColor: "rgba(255,255,255,0.4)" }}>freelance projects</span> and open to <span style={{ color: "#fff", fontWeight: 400, textDecoration: "underline", textUnderlineOffset: "6px", textDecorationThickness: "1px", textDecorationColor: "rgba(255,255,255,0.4)" }}>full-time roles.</span> I bring a <span style={{ color: "#fff", fontWeight: 400, textDecoration: "underline", textUnderlineOffset: "6px", textDecorationThickness: "1px", textDecorationColor: "rgba(255,255,255,0.4)" }}>design-first approach</span> to <span style={{ color: "#fff", fontWeight: 400, textDecoration: "underline", textUnderlineOffset: "6px", textDecorationThickness: "1px", textDecorationColor: "rgba(255,255,255,0.4)" }}>frontend development</span>, <span style={{ color: "#fff", fontWeight: 400, textDecoration: "underline", textUnderlineOffset: "6px", textDecorationThickness: "1px", textDecorationColor: "rgba(255,255,255,0.4)" }}>creative coding</span>, and <span style={{ color: "#fff", fontWeight: 400, textDecoration: "underline", textUnderlineOffset: "6px", textDecorationThickness: "1px", textDecorationColor: "rgba(255,255,255,0.4)" }}>UI design</span>, turning ideas into polished <span style={{ color: "#fff", fontWeight: 400, textDecoration: "underline", textUnderlineOffset: "6px", textDecorationThickness: "1px", textDecorationColor: "rgba(255,255,255,0.4)" }}>digital experiences</span>.
        </p>
      </div>

      {/* ── Service rows ── */}
      <div
        style={{
          backgroundColor: "#262626",
          borderRadius: "14px",
          padding: "0 32px",
          margin: "60px 12px 0",
        }}
      >
        {SERVICES.map((service, i) => (
          <div
            key={service.number}
            className="service-row"
            style={{
              display: "grid",
              gridTemplateColumns: "40px 1fr 1fr",
              gap: "40px",
              padding: "60px 0",
              borderTop: "1px solid rgba(255,255,255,0.12)",
              alignItems: "start",
              minHeight: "320px",
            }}
          >
            {/* Number */}
            <span
              className="service-animate"
              style={{
                fontSize: "14px",
                fontWeight: 400,
                color: "rgba(255,255,255,0.4)",
                paddingTop: "12px",
              }}
            >
              {service.number}
            </span>

            {/* Title */}
            <h3
              className="service-animate"
              style={{
                fontFamily: "var(--font-clash)",
                fontSize: "clamp(1.6rem, 3.5vw, 3.8rem)",
                fontWeight: 600,
                margin: 0,
                lineHeight: 1.05,
                letterSpacing: "-0.02em",
                paddingTop: "4px",
              }}
            >
              {service.title}
            </h3>

            {/* Description + Tags */}
            <div className="service-animate" style={{ paddingTop: "8px" }}>
              <p
                style={{
                  fontSize: "15px",
                  lineHeight: 1.6,
                  color: "#fff",
                  margin: 0,
                  marginBottom: "24px",
                  maxWidth: "360px",
                  fontWeight: 500,
                }}
              >
                {service.description}
              </p>

              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "10px",
                }}
              >
                {service.tags.map((tag) => (
                  <span
                    key={tag}
                    style={{
                      fontSize: "10px",
                      fontWeight: 500,
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                      padding: "6px 12px",
                      borderRadius: "5px",
                      backgroundColor: "rgba(255,255,255,0.08)",
                      color: "#fff",
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

          </div>
        ))}
      </div>
    </section>
  );
}
