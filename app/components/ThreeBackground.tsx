"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, MeshDistortMaterial } from "@react-three/drei";
import {
  EffectComposer,
  Bloom,
} from "@react-three/postprocessing";
import * as THREE from "three";

/* ── Mouse tracker ── */
function useMousePosition() {
  const mouse = useRef({ x: 0, y: 0 });

  if (typeof window !== "undefined") {
    if (!(window as unknown as Record<string, boolean>).__mouseListenerAdded) {
      window.addEventListener("mousemove", (e) => {
        mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
        mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
      });
      (window as unknown as Record<string, boolean>).__mouseListenerAdded = true;
    }
  }

  return mouse;
}

/* ── Scroll tracker ── */
function useScrollOffset() {
  const scroll = useRef(0);

  if (typeof window !== "undefined") {
    if (!(window as unknown as Record<string, boolean>).__scrollListenerAdded) {
      window.addEventListener("scroll", () => {
        scroll.current = window.scrollY;
      });
      (window as unknown as Record<string, boolean>).__scrollListenerAdded = true;
    }
  }

  return scroll;
}

/* ── Single floating shape ── */
function FloatingShape({
  position,
  geometry,
  scale,
  rotationSpeed,
  floatIntensity,
  color,
}: {
  position: [number, number, number];
  geometry: "torus" | "sphere" | "icosahedron" | "octahedron" | "torusKnot";
  scale: number;
  rotationSpeed: number;
  floatIntensity: number;
  color: string;
}) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const mouse = useMousePosition();
  const scroll = useScrollOffset();
  const initialPos = useMemo(() => new THREE.Vector3(...position), [position]);

  useFrame((_, delta) => {
    if (!meshRef.current) return;

    // Slow rotation
    meshRef.current.rotation.x += delta * rotationSpeed * 0.3;
    meshRef.current.rotation.y += delta * rotationSpeed * 0.2;

    // Mouse parallax — shapes move away from cursor
    const targetX = initialPos.x - mouse.current.x * 0.4;
    const targetY = initialPos.y - mouse.current.y * 0.3;

    // Scroll — shapes drift upward
    const scrollOffset = scroll.current * 0.002;

    meshRef.current.position.x = THREE.MathUtils.lerp(
      meshRef.current.position.x,
      targetX,
      0.02
    );
    meshRef.current.position.y = THREE.MathUtils.lerp(
      meshRef.current.position.y,
      targetY - scrollOffset,
      0.02
    );
  });

  const geomElement = useMemo(() => {
    switch (geometry) {
      case "torus":
        return <torusGeometry args={[1, 0.4, 32, 64]} />;
      case "sphere":
        return <sphereGeometry args={[1, 64, 64]} />;
      case "icosahedron":
        return <icosahedronGeometry args={[1, 1]} />;
      case "octahedron":
        return <octahedronGeometry args={[1, 0]} />;
      case "torusKnot":
        return <torusKnotGeometry args={[0.8, 0.3, 128, 32]} />;
    }
  }, [geometry]);

  return (
    <Float
      speed={1.5}
      rotationIntensity={0.3}
      floatIntensity={floatIntensity}
      floatingRange={[-0.2, 0.2]}
    >
      <mesh ref={meshRef} position={position} scale={scale}>
        {geomElement}
        <MeshDistortMaterial
          color={color}
          roughness={0.3}
          metalness={0.1}
          distort={0.15}
          speed={1.5}
          transparent
          opacity={0.6}
        />
      </mesh>
    </Float>
  );
}

/* ── Scene ── */
function Scene() {
  const { viewport } = useThree();
  const spread = Math.min(viewport.width * 0.5, 6);

  const shapes = useMemo(
    () => [
      {
        position: [-spread * 0.7, 1.5, -2] as [number, number, number],
        geometry: "torus" as const,
        scale: 0.6,
        rotationSpeed: 0.4,
        floatIntensity: 0.5,
        color: "#e0e0e0",
      },
      {
        position: [spread * 0.8, -0.5, -3] as [number, number, number],
        geometry: "sphere" as const,
        scale: 0.8,
        rotationSpeed: 0.3,
        floatIntensity: 0.4,
        color: "#d0d0d0",
      },
      {
        position: [-spread * 0.3, -1.8, -1.5] as [number, number, number],
        geometry: "icosahedron" as const,
        scale: 0.5,
        rotationSpeed: 0.5,
        floatIntensity: 0.6,
        color: "#c8c8c8",
      },
      {
        position: [spread * 0.4, 2, -2.5] as [number, number, number],
        geometry: "torusKnot" as const,
        scale: 0.45,
        rotationSpeed: 0.25,
        floatIntensity: 0.35,
        color: "#dcdcdc",
      },
      {
        position: [0, -0.2, -4] as [number, number, number],
        geometry: "octahedron" as const,
        scale: 0.7,
        rotationSpeed: 0.35,
        floatIntensity: 0.45,
        color: "#d5d5d5",
      },
    ],
    [spread]
  );

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} color="#ffffff" />
      <directionalLight
        position={[-3, -2, 4]}
        intensity={0.3}
        color="#f0f0f0"
      />

      {/* Shapes */}
      {shapes.map((shape, i) => (
        <FloatingShape key={i} {...shape} />
      ))}

      {/* Post-processing */}
      <EffectComposer>
        <Bloom
          luminanceThreshold={0.6}
          luminanceSmoothing={0.9}
          intensity={0.4}
          mipmapBlur
        />
      </EffectComposer>
    </>
  );
}

/* ── Exported canvas wrapper ── */
export default function ThreeBackground() {
  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 0,
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 6], fov: 50 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        style={{ pointerEvents: "auto" }}
      >
        <Scene />
      </Canvas>
    </div>
  );
}
