"use client";

import { useRef, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { MeshDistortMaterial } from "@react-three/drei";

/* ── Blob geometry ── */
function Blob({ mouseRef }) {
  const meshRef = useRef(null);
  const targetPos = useRef({ x: 0, y: 0 });
  const currentPos = useRef({ x: 0, y: 0 });

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    if (mouseRef?.current) {
      targetPos.current.x = mouseRef.current.x * 0.3;
      targetPos.current.y = mouseRef.current.y * 0.3;
    }

    const lerp = 0.05;
    currentPos.current.x +=
      (targetPos.current.x - currentPos.current.x) * lerp;
    currentPos.current.y +=
      (targetPos.current.y - currentPos.current.y) * lerp;

    meshRef.current.position.x = currentPos.current.x;
    meshRef.current.position.y = currentPos.current.y;

    const pulse = 1 + Math.sin(Date.now() * 0.001) * 0.02;
    meshRef.current.scale.setScalar(pulse);
    meshRef.current.rotation.y += delta * 0.08;
    meshRef.current.rotation.x += delta * 0.04;
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[1.6, 64, 64]} />
      <MeshDistortMaterial
        color="#6366f1"
        emissive="#4f46e5"
        emissiveIntensity={0.15}
        roughness={0.55}
        metalness={0}
        flatShading={false}
        distort={0.25}
        speed={1.8}
      />
    </mesh>
  );
}

/* ── Scene wrapper ── */
function Scene() {
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e) => {
      mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 5, 5]} intensity={0.6} />
      <pointLight position={[-5, -2, 3]} intensity={0.5} color="#a855f7" />
      <Blob mouseRef={mouseRef} />
    </>
  );
}

/* ── Exported component with graceful degradation ── */
export default function BlobScene() {
  const [skip, setSkip] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const check = () => setSkip(mq.matches);
    check();
    mq.addEventListener("change", check);
    return () => mq.removeEventListener("change", check);
  }, []);

  if (skip) return null;

  return (
    <Canvas
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
      camera={{ position: [0, 0, 4.5], fov: 45 }}
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
      }}
    >
      <Scene />
    </Canvas>
  );
}
