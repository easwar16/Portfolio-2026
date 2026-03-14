"use client";

import { useRef, useState, useEffect } from "react";
import gsap from "gsap";

export default function AnimatedDog() {
  const dogRef = useRef<SVGSVGElement>(null);
  const tailRef = useRef<SVGGElement>(null);
  const tongueRef = useRef<SVGRectElement>(null);
  const leftEarRef = useRef<SVGPathElement>(null);
  const rightEarRef = useRef<SVGPathElement>(null);
  const bodyRef = useRef<SVGGElement>(null);
  const [isHappy, setIsHappy] = useState(false);

  // Idle tail wag
  useEffect(() => {
    if (!tailRef.current) return;

    const tween = gsap.to(tailRef.current, {
      rotation: 20,
      transformOrigin: "bottom center",
      duration: 0.4,
      yoyo: true,
      repeat: -1,
      ease: "sine.inOut",
    });

    return () => { tween.kill(); };
  }, []);

  // Single click — bark + jump
  const handleClick = () => {
    if (!bodyRef.current || !tongueRef.current) return;

    // Jump
    gsap.to(bodyRef.current, {
      y: -8,
      duration: 0.15,
      yoyo: true,
      repeat: 1,
      ease: "power2.out",
    });

    // Tongue out
    gsap.to(tongueRef.current, {
      scaleY: 1.8,
      transformOrigin: "top center",
      duration: 0.15,
      yoyo: true,
      repeat: 1,
      ease: "power2.out",
    });

    // Ears perk up
    if (leftEarRef.current && rightEarRef.current) {
      gsap.to([leftEarRef.current, rightEarRef.current], {
        y: -3,
        duration: 0.15,
        yoyo: true,
        repeat: 1,
        ease: "power2.out",
      });
    }
  };

  // Double click — excited spin + fast tail wag
  const handleDoubleClick = () => {
    if (!bodyRef.current || !tailRef.current) return;

    setIsHappy(true);

    // Spin
    gsap.to(bodyRef.current, {
      rotation: 360,
      transformOrigin: "center center",
      duration: 0.5,
      ease: "power2.inOut",
      onComplete: () => {
        gsap.set(bodyRef.current, { rotation: 0 });
      },
    });

    // Fast tail wag during spin
    gsap.to(tailRef.current, {
      rotation: 35,
      duration: 0.1,
      yoyo: true,
      repeat: 8,
      ease: "sine.inOut",
      onComplete: () => {
        setIsHappy(false);
      },
    });

    // Bounce
    gsap.to(bodyRef.current, {
      y: -12,
      duration: 0.2,
      yoyo: true,
      repeat: 1,
      ease: "power2.out",
    });
  };

  return (
    <svg
      ref={dogRef}
      viewBox="0 0 64 64"
      width="40"
      height="40"
      style={{ cursor: "pointer", overflow: "visible" }}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
    >
      <g ref={bodyRef}>
        {/* Body */}
        <ellipse cx="32" cy="40" rx="14" ry="10" fill="#f0a860" />

        {/* Belly */}
        <ellipse cx="32" cy="43" rx="10" ry="6" fill="#f5d6a8" />

        {/* Head */}
        <circle cx="32" cy="24" r="12" fill="#f0a860" />

        {/* Face patch */}
        <ellipse cx="32" cy="28" rx="8" ry="6" fill="#f5d6a8" />

        {/* Left ear */}
        <path
          ref={leftEarRef}
          d="M20 20 Q16 8 22 16 Z"
          fill="#c47a3a"
          stroke="#c47a3a"
          strokeWidth="3"
          strokeLinecap="round"
        />

        {/* Right ear */}
        <path
          ref={rightEarRef}
          d="M44 20 Q48 8 42 16 Z"
          fill="#c47a3a"
          stroke="#c47a3a"
          strokeWidth="3"
          strokeLinecap="round"
        />

        {/* Left eye */}
        <circle cx="27" cy="22" r="2.5" fill="#222" />
        <circle cx="27.8" cy="21.2" r="0.8" fill="#fff" />

        {/* Right eye */}
        <circle cx="37" cy="22" r="2.5" fill="#222" />
        <circle cx="37.8" cy="21.2" r="0.8" fill="#fff" />

        {/* Nose */}
        <ellipse cx="32" cy="27" rx="2.5" ry="2" fill="#333" />

        {/* Mouth */}
        <path
          d="M29 29 Q32 33 35 29"
          fill="none"
          stroke="#333"
          strokeWidth="1"
          strokeLinecap="round"
        />

        {/* Tongue */}
        <rect
          ref={tongueRef}
          x="30.5"
          y="30"
          width="3"
          height="4"
          rx="1.5"
          fill="#e85d75"
        />

        {/* Collar */}
        <rect x="22" y="33" width="20" height="3" rx="1.5" fill="#4a90d9" />
        <circle cx="32" cy="36" r="1.5" fill="#ffd700" />

        {/* Front left leg */}
        <rect x="24" y="47" width="4" height="8" rx="2" fill="#f0a860" />
        <rect x="23.5" y="53" width="5" height="3" rx="1.5" fill="#f5d6a8" />

        {/* Front right leg */}
        <rect x="36" y="47" width="4" height="8" rx="2" fill="#f0a860" />
        <rect x="35.5" y="53" width="5" height="3" rx="1.5" fill="#f5d6a8" />

        {/* Tail */}
        <g ref={tailRef}>
          <path
            d="M18 38 Q10 28 14 22"
            fill="none"
            stroke="#c47a3a"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
        </g>

        {/* Happy sparkles (visible on double-click) */}
        {isHappy && (
          <>
            <text x="48" y="14" fontSize="8" fill="#ffd700">✦</text>
            <text x="12" y="16" fontSize="6" fill="#ffd700">✦</text>
            <text x="50" y="30" fontSize="7" fill="#ffd700">✦</text>
          </>
        )}
      </g>
    </svg>
  );
}
