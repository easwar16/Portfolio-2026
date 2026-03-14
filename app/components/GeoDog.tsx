"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";

const BODY_COLOR = "#f0a860";   // warm orange/golden
const BELLY_COLOR = "#f5d6a8";  // lighter belly
const EAR_COLOR = "#c47a3a";    // darker brown ears
const NOSE_COLOR = "#222";      // dark nose
const EYE_COLOR = "#111";       // black eyes
const TAIL_COLOR = "#c47a3a";   // brown tail
const TONGUE_COLOR = "#e85d75"; // pink tongue
const COLLAR_COLOR = "#4a90d9"; // blue collar

function Dog() {
  const groupRef = useRef<THREE.Group>(null!);
  const headRef = useRef<THREE.Group>(null!);
  const tailRef = useRef<THREE.Mesh>(null!);
  const mouse = useRef({ x: 0, y: 0 });
  const isNear = useRef(false);
  const { viewport } = useThree();

  useFrame(({ pointer, clock }) => {
    mouse.current.x = pointer.x;
    mouse.current.y = pointer.y;

    const dist = Math.sqrt(pointer.x * pointer.x + pointer.y * pointer.y);
    isNear.current = dist < 0.8;

    if (headRef.current) {
      const targetRotY = mouse.current.x * 0.5;
      const targetRotX = -mouse.current.y * 0.3;

      headRef.current.rotation.y = THREE.MathUtils.lerp(
        headRef.current.rotation.y,
        targetRotY,
        0.05
      );
      headRef.current.rotation.x = THREE.MathUtils.lerp(
        headRef.current.rotation.x,
        targetRotX,
        0.05
      );

      const tiltTarget = isNear.current ? 0.2 : 0;
      headRef.current.rotation.z = THREE.MathUtils.lerp(
        headRef.current.rotation.z,
        tiltTarget,
        0.04
      );
    }

    if (tailRef.current) {
      const speed = isNear.current ? 8 : 3;
      const amplitude = isNear.current ? 0.5 : 0.3;
      tailRef.current.rotation.z =
        Math.sin(clock.getElapsedTime() * speed) * amplitude;
    }
  });

  const scale = Math.min(viewport.width / 8, 1.2);

  return (
    <Float speed={1.2} rotationIntensity={0.1} floatIntensity={0.3}>
      <group ref={groupRef} scale={scale} position={[0, -0.2, 0]}>
        {/* ── Body ── */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[1.2, 0.8, 0.8]} />
          <meshStandardMaterial color={BODY_COLOR} roughness={0.8} flatShading />
        </mesh>

        {/* ── Belly ── */}
        <mesh position={[0, -0.25, 0]}>
          <boxGeometry args={[0.9, 0.35, 0.7]} />
          <meshStandardMaterial color={BELLY_COLOR} roughness={0.8} flatShading />
        </mesh>

        {/* ── Chest ── */}
        <mesh position={[0.5, 0.1, 0]}>
          <boxGeometry args={[0.4, 0.7, 0.7]} />
          <meshStandardMaterial color={BODY_COLOR} roughness={0.8} flatShading />
        </mesh>

        {/* ── Collar ── */}
        <mesh position={[0.55, -0.1, 0]}>
          <boxGeometry args={[0.15, 0.12, 0.75]} />
          <meshStandardMaterial color={COLLAR_COLOR} roughness={0.5} flatShading />
        </mesh>

        {/* ── Head group ── */}
        <group ref={headRef} position={[0.9, 0.5, 0]}>
          {/* Head */}
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[0.65, 0.6, 0.6]} />
            <meshStandardMaterial color={BODY_COLOR} roughness={0.8} flatShading />
          </mesh>

          {/* Snout */}
          <mesh position={[0.35, -0.08, 0]}>
            <boxGeometry args={[0.35, 0.3, 0.35]} />
            <meshStandardMaterial color={BELLY_COLOR} roughness={0.8} flatShading />
          </mesh>

          {/* Nose */}
          <mesh position={[0.53, -0.02, 0]}>
            <boxGeometry args={[0.08, 0.1, 0.12]} />
            <meshStandardMaterial color={NOSE_COLOR} roughness={0.6} />
          </mesh>

          {/* Tongue */}
          <mesh position={[0.42, -0.18, 0]}>
            <boxGeometry args={[0.12, 0.06, 0.1]} />
            <meshStandardMaterial color={TONGUE_COLOR} roughness={0.7} />
          </mesh>

          {/* Left eye */}
          <mesh position={[0.2, 0.08, 0.22]}>
            <sphereGeometry args={[0.06, 8, 8]} />
            <meshStandardMaterial color={EYE_COLOR} roughness={0.3} />
          </mesh>

          {/* Right eye */}
          <mesh position={[0.2, 0.08, -0.22]}>
            <sphereGeometry args={[0.06, 8, 8]} />
            <meshStandardMaterial color={EYE_COLOR} roughness={0.3} />
          </mesh>

          {/* Eye highlights */}
          <mesh position={[0.23, 0.1, 0.22]}>
            <sphereGeometry args={[0.02, 6, 6]} />
            <meshStandardMaterial color="#fff" roughness={0.2} />
          </mesh>
          <mesh position={[0.23, 0.1, -0.22]}>
            <sphereGeometry args={[0.02, 6, 6]} />
            <meshStandardMaterial color="#fff" roughness={0.2} />
          </mesh>

          {/* Left ear */}
          <mesh position={[-0.05, 0.35, 0.25]} rotation={[0, 0, 0.3]}>
            <boxGeometry args={[0.2, 0.35, 0.12]} />
            <meshStandardMaterial color={EAR_COLOR} roughness={0.8} flatShading />
          </mesh>

          {/* Right ear */}
          <mesh position={[-0.05, 0.35, -0.25]} rotation={[0, 0, 0.3]}>
            <boxGeometry args={[0.2, 0.35, 0.12]} />
            <meshStandardMaterial color={EAR_COLOR} roughness={0.8} flatShading />
          </mesh>
        </group>

        {/* ── Legs ── */}
        <mesh position={[0.4, -0.6, 0.28]}>
          <boxGeometry args={[0.2, 0.5, 0.2]} />
          <meshStandardMaterial color={BODY_COLOR} roughness={0.8} flatShading />
        </mesh>
        <mesh position={[0.4, -0.6, -0.28]}>
          <boxGeometry args={[0.2, 0.5, 0.2]} />
          <meshStandardMaterial color={BODY_COLOR} roughness={0.8} flatShading />
        </mesh>
        <mesh position={[-0.4, -0.6, 0.28]}>
          <boxGeometry args={[0.22, 0.5, 0.22]} />
          <meshStandardMaterial color={BODY_COLOR} roughness={0.8} flatShading />
        </mesh>
        <mesh position={[-0.4, -0.6, -0.28]}>
          <boxGeometry args={[0.22, 0.5, 0.22]} />
          <meshStandardMaterial color={BODY_COLOR} roughness={0.8} flatShading />
        </mesh>

        {/* ── Paws ── */}
        {[
          [0.4, -0.82, 0.28],
          [0.4, -0.82, -0.28],
          [-0.4, -0.82, 0.28],
          [-0.4, -0.82, -0.28],
        ].map((pos, i) => (
          <mesh key={i} position={pos as [number, number, number]}>
            <boxGeometry args={[0.22, 0.08, 0.22]} />
            <meshStandardMaterial color={BELLY_COLOR} roughness={0.8} flatShading />
          </mesh>
        ))}

        {/* ── Tail ── */}
        <mesh
          ref={tailRef}
          position={[-0.7, 0.35, 0]}
          rotation={[0, 0, 0.8]}
        >
          <cylinderGeometry args={[0.06, 0.04, 0.5, 6]} />
          <meshStandardMaterial color={TAIL_COLOR} roughness={0.8} flatShading />
        </mesh>
      </group>
    </Float>
  );
}

export default function GeoDog() {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        pointerEvents: "auto",
      }}
    >
      <Canvas
        camera={{ position: [3, 1.5, 3], fov: 35 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.7} />
        <directionalLight position={[5, 8, 5]} intensity={1} color="#ffffff" />
        <directionalLight position={[-3, 2, -2]} intensity={0.3} color="#e8e8e8" />
        <Dog />
      </Canvas>
    </div>
  );
}
