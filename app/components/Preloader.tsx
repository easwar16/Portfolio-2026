"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import gsap from "gsap";

export default function Preloader({
  onComplete,
}: {
  onComplete: () => void;
}) {
  const [visible, setVisible] = useState(true);
  const overlayRef = useRef<HTMLDivElement>(null);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  const startExit = useCallback(() => {
    const tl = gsap.timeline({
      onComplete: () => {
        document.body.style.overflow = "";
        setVisible(false);
        onCompleteRef.current();
      },
    });

    // Symbols scale down and fade
    tl.to(".preloader-symbol", {
      scale: 0.6,
      opacity: 0,
      duration: 0.5,
      stagger: 0.06,
      ease: "power3.in",
    });

    // Overlay slides up
    tl.to(
      overlayRef.current,
      {
        yPercent: -100,
        duration: 0.7,
        ease: "power4.inOut",
      },
      "-=0.2"
    );
  }, []);

  useEffect(() => {
    // If already shown this session, skip instantly — no animation, no flash
    if (sessionStorage.getItem("preloaderShown") === "true") {
      document.body.style.overflow = "";
      setVisible(false);
      onCompleteRef.current();
      return;
    }

    // First visit: show full preloader animation
    window.scrollTo(0, 0);
    document.body.style.overflow = "hidden";
    sessionStorage.setItem("preloaderShown", "true");

    // Entrance animation
    gsap.fromTo(
      ".preloader-symbol",
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.12,
        ease: "power3.out",
        delay: 0.1,
      }
    );

    // Exit after ~1.5s
    const timer = setTimeout(startExit, 1500);
    return () => clearTimeout(timer);
  }, [startExit]);

  if (!visible) return null;

  return (
    <div
      ref={overlayRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 9999,
        backgroundColor: "var(--bg)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: "48px",
      }}
    >
      {/* ── Symbols ── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "48px",
        }}
      >
        {/* Circle */}
        <span
          className="preloader-symbol"
          style={{
            fontSize: "32px",
            color: "var(--text)",
            fontWeight: 300,
            lineHeight: 1,
            animation: "symbolFloat 2s ease-in-out infinite",
            animationDelay: "0s",
          }}
        >
          ○
        </span>

        {/* Square */}
        <span
          className="preloader-symbol"
          style={{
            fontSize: "32px",
            color: "var(--text)",
            fontWeight: 300,
            lineHeight: 1,
            animation: "symbolFloat 2s ease-in-out infinite",
            animationDelay: "0.3s",
          }}
        >
          □
        </span>

        {/* Triangle */}
        <span
          className="preloader-symbol"
          style={{
            fontSize: "32px",
            color: "var(--text)",
            fontWeight: 300,
            lineHeight: 1,
            animation: "symbolFloat 2s ease-in-out infinite",
            animationDelay: "0.6s",
          }}
        >
          △
        </span>
      </div>

      {/* ── Progress bar ── */}
      <div
        style={{
          width: "60px",
          height: "1px",
          backgroundColor: "var(--border-light)",
          borderRadius: "1px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            backgroundColor: "var(--text-secondary)",
            animation: "loadingBar 1.5s ease-in-out forwards",
          }}
        />
      </div>
    </div>
  );
}
