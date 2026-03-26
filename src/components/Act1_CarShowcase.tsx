import React, { useRef, useState, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { 
  Float, 
  MeshDistortMaterial, 
  MeshWobbleMaterial,
  useScroll,
  Line,
  Points,
  PointMaterial
} from "@react-three/drei";
import * as THREE from "three";
import { THEME } from "./Theme";

type Mode = "solid" | "wireframe" | "perception";

export function Act1_CarShowcase() {
  const groupRef = useRef<THREE.Group>(null);
  const [mode, setMode] = useState<Mode>("solid");
  const [rotation, setRotation] = useState([0, 0, 0]);
  const scroll = useScroll();
  const { mouse } = useThree();
  const longPressTimer = useRef<NodeJS.Timeout | null>(null);

  const handlePointerDown = () => {
    longPressTimer.current = setTimeout(() => {
      setMode((prev) => {
        if (prev === "solid") return "wireframe";
        if (prev === "wireframe") return "perception";
        return "solid";
      });
    }, 800);
  };

  const handlePointerUp = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
    }
  };

  useFrame((state, delta) => {
    if (groupRef.current) {
      const offset = scroll.offset; // 0 to 1
      // Zoom logic: from long (0) to medium (0.15) to detail (0.33)
      const zoom = THREE.MathUtils.smoothstep(offset, 0, 0.33);
      groupRef.current.position.z = zoom * 5;
      groupRef.current.scale.setScalar(1 + zoom * 0.5);

      // Mouse drag rotation
      const { pointer, gl } = state;
      // Note: In R3F, pointer is a Vector2. To get buttons/movement, we can use the gl.domElement or events.
      // For simplicity, let's use a more robust way to handle drag if needed, 
      // but for now, we'll stick to a simpler parallax or use the events from the group.
      
      // Auto rotation and mouse parallax
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, rotation[1] + mouse.x * 0.2, 0.1);
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, rotation[0] - mouse.y * 0.1, 0.1);
    }
  });

  return (
    <group 
      ref={groupRef} 
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
    >
      <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.2}>
        {/* Main Body */}
        <mesh castShadow>
          <boxGeometry args={[2.2, 0.4, 4.8]} />
          <meshStandardMaterial 
            color={mode === "perception" ? THEME.primary : THEME.secondary} 
            wireframe={mode === "wireframe"}
            transparent 
            opacity={mode === "solid" ? 0.8 : 0.2}
            emissive={mode === "perception" ? THEME.primary : "#000"}
            emissiveIntensity={mode === "perception" ? 2 : 0}
          />
        </mesh>
        
        {/* Cabin */}
        <mesh position={[0, 0.4, -0.1]}>
          <boxGeometry args={[1.7, 0.5, 2.4]} />
          <meshStandardMaterial 
            color={THEME.primary} 
            wireframe={mode === "wireframe"}
            transparent 
            opacity={mode === "solid" ? 0.6 : 0.1}
          />
        </mesh>

        {/* Wheels */}
        {[[-1, -0.2, 1.5], [1, -0.2, 1.5], [-1, -0.2, -1.5], [1, -0.2, -1.5]].map((pos, i) => (
          <mesh key={i} position={pos as [number, number, number]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.4, 0.4, 0.3, 32]} />
            <meshStandardMaterial color="#111" wireframe={mode === "wireframe"} />
          </mesh>
        ))}

        {/* Perception Mode Visuals */}
        {mode === "perception" && (
          <group>
            <Line
              points={[[0, 0.6, 0], [0, 2, 0], [2, 2, 2]]}
              color={THEME.primary}
              lineWidth={1}
              transparent
              opacity={0.5}
            />
            <ScanningLine axis="z" range={[-2.4, 2.4]} />
          </group>
        )}
      </Float>
      
      {/* Mode Label */}
      <group position={[0, -1.5, 0]}>
        <mesh>
          <planeGeometry args={[2, 0.4]} />
          <meshBasicMaterial color="#000" transparent opacity={0.5} />
        </mesh>
      </group>
    </group>
  );
}

function ScanningLine({ axis, range }: { axis: 'x' | 'y' | 'z', range: [number, number] }) {
  const lineRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (lineRef.current) {
      const t = (state.clock.elapsedTime % 2) / 2;
      const pos = range[0] + (range[1] - range[0]) * t;
      if (axis === 'z') lineRef.current.position.z = pos;
      if (axis === 'y') lineRef.current.position.y = pos;
      if (axis === 'x') lineRef.current.position.x = pos;
    }
  });

  return (
    <mesh ref={lineRef}>
      <boxGeometry args={axis === 'z' ? [2.5, 0.01, 0.01] : [0.01, 2.5, 0.01]} />
      <meshStandardMaterial color={THEME.primary} emissive={THEME.primary} emissiveIntensity={20} transparent opacity={0.8} />
    </mesh>
  );
}
