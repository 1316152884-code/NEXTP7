import React, { useRef, useState, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { 
  Float, 
  MeshDistortMaterial, 
  MeshWobbleMaterial,
  useScroll,
  Line,
  Points,
  PointMaterial,
  Text,
  Html
} from "@react-three/drei";
import * as THREE from "three";
import { THEME } from "./Theme";

export function Act2_SmartDriving() {
  const groupRef = useRef<THREE.Group>(null);
  const roadRef = useRef<THREE.Group>(null);
  const scroll = useScroll();
  const { mouse } = useThree();
  const [viewAngle, setViewAngle] = useState(0);

  // Road lines
  const roadLines = useMemo(() => {
    const lines = [];
    for (let i = 0; i < 20; i++) {
      lines.push(i * 2);
    }
    return lines;
  }, []);

  useFrame((state, delta) => {
    if (roadRef.current) {
      // Move road to simulate driving
      roadRef.current.position.z = (state.clock.elapsedTime * 2) % 2;
    }
    
    if (groupRef.current) {
      // Drag to switch observation direction
      // Using mouse.x for observation angle
      setViewAngle(THREE.MathUtils.lerp(viewAngle, mouse.x * Math.PI * 0.5, 0.1));
      groupRef.current.rotation.y = viewAngle;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Road */}
      <group position={[0, -1, 0]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[10, 100]} />
          <meshStandardMaterial color="#050505" transparent opacity={0.8} />
        </mesh>
        
        {/* Glowing Path Line */}
        <group ref={roadRef}>
          {roadLines.map((z) => (
            <mesh key={z} position={[0, 0.01, -z]}>
              <boxGeometry args={[0.1, 0.01, 1]} />
              <meshStandardMaterial color={THEME.primary} emissive={THEME.primary} emissiveIntensity={5} />
            </mesh>
          ))}
        </group>
        
        {/* Side Grid */}
        <gridHelper args={[100, 50, THEME.line, THEME.grid]} position={[0, -0.01, 0]} />
      </group>

      {/* Car Placeholder */}
      <group position={[0, -0.6, 0]}>
        <mesh>
          <boxGeometry args={[1.5, 0.3, 3]} />
          <meshStandardMaterial color={THEME.secondary} transparent opacity={0.3} wireframe />
        </mesh>
        
        {/* Recognition Boxes */}
        <group position={[3, 0.5, -10]}>
          <mesh>
            <boxGeometry args={[2, 2, 4]} />
            <meshStandardMaterial color="#ff0000" wireframe transparent opacity={0.5} />
          </mesh>
          <Text position={[0, 1.5, 0]} fontSize={0.2} color="#ff0000">
            识别对象: 车辆 01
          </Text>
        </group>

        <group position={[-4, 0.5, -15]}>
          <mesh>
            <boxGeometry args={[1, 2, 1]} />
            <meshStandardMaterial color="#00ff00" wireframe transparent opacity={0.5} />
          </mesh>
          <Text position={[0, 1.5, 0]} fontSize={0.2} color="#00ff00">
            识别对象: 行人 02
          </Text>
        </group>

        {/* Predicted Trajectories */}
        <Line
          points={[[0, 0, 0], [0, 0, -5], [2, 0, -10], [0, 0, -15]]}
          color={THEME.primary}
          lineWidth={2}
          transparent
          opacity={0.8}
        />
        
        {/* HUD Info */}
        <Html position={[1.5, 1, 0]} transform distanceFactor={5}>
          <div className="bg-black/80 border border-cyan-400/50 p-4 rounded-sm text-cyan-400 font-mono text-[10px] w-48">
            <div className="flex justify-between mb-2">
              <span>速度:</span>
              <span>60 KM/H</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>感知状态:</span>
              <span className="animate-pulse">正常</span>
            </div>
            <div className="w-full h-1 bg-white/10 mt-2">
              <div className="w-2/3 h-full bg-cyan-400" />
            </div>
          </div>
        </Html>
      </group>

      {/* Complex Path Selection Visualization */}
      <group position={[0, 0, -20]}>
        <Line
          points={[[0, 0, 0], [2, 0, -5], [4, 0, -10]]}
          color="#ff00ff"
          lineWidth={1}
          transparent
          opacity={0.3}
        />
        <Line
          points={[[0, 0, 0], [-2, 0, -5], [-4, 0, -10]]}
          color="#00ffff"
          lineWidth={3}
          transparent
          opacity={1}
        />
        <Text position={[0, 2, 0]} fontSize={0.3} color={THEME.primary}>
          最优路径选择中...
        </Text>
      </group>
    </group>
  );
}
