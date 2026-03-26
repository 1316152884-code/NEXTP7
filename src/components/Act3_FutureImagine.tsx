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
  Html,
  Torus
} from "@react-three/drei";
import * as THREE from "three";
import { THEME } from "./Theme";

export function Act3_FutureImagine() {
  const groupRef = useRef<THREE.Group>(null);
  const flyingCarRef = useRef<THREE.Group>(null);
  const robotRef = useRef<THREE.Group>(null);
  const scroll = useScroll();
  const { mouse } = useThree();
  const [isFlying, setIsFlying] = useState(false);

  const propellersRef = useRef<THREE.Group[]>([]);

  useFrame((state, delta) => {
    const offset = scroll.offset; // 0 to 1
    
    // Flying car form switching
    if (offset > 0.85) {
      setIsFlying(true);
    } else {
      setIsFlying(false);
    }

    if (flyingCarRef.current) {
      // Flying car hover
      flyingCarRef.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.2 + 2;
      // Propeller rotation
      flyingCarRef.current.rotation.y += 0.01;
      
      // Rotate each propeller
      if (isFlying) {
        propellersRef.current.forEach((p) => {
          if (p) p.rotation.y += 0.5;
        });
      }
    }

    if (robotRef.current) {
      // Robot slight follow
      robotRef.current.position.x = THREE.MathUtils.lerp(robotRef.current.position.x, mouse.x * 2 - 4, 0.05);
      robotRef.current.position.z = THREE.MathUtils.lerp(robotRef.current.position.z, mouse.y * 2 - 2, 0.05);
      robotRef.current.lookAt(0, 0, 0);
    }
  });

  return (
    <group ref={groupRef}>
      {/* Dome Space */}
      <mesh scale={[1, 1, 1]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[20, 0.1, 16, 100]} />
        <meshStandardMaterial color={THEME.line} transparent opacity={0.2} />
      </mesh>
      
      {/* Flying Car */}
      <group ref={flyingCarRef} position={[0, 2, 0]}>
        <Float speed={3} rotationIntensity={0.5} floatIntensity={0.5}>
          <mesh>
            <boxGeometry args={[1.5, 0.3, 3]} />
            <meshStandardMaterial color={THEME.primary} wireframe />
          </mesh>
          
          {/* Wings / Propellers */}
          <group position={[0, 0, 0]}>
            {[[-1, 0, 1], [1, 0, 1], [-1, 0, -1], [1, 0, -1]].map((pos, i) => (
              <group key={i} position={pos as [number, number, number]}>
                <mesh rotation={[Math.PI / 2, 0, 0]}>
                  <cylinderGeometry args={[0.5, 0.5, 0.05, 32]} />
                  <meshStandardMaterial color={THEME.secondary} transparent opacity={0.5} />
                </mesh>
                <mesh 
                  ref={(el) => { if (el) propellersRef.current[i] = el as any; }}
                  rotation={[0, 0, 0]}
                >
                  <boxGeometry args={[0.8, 0.02, 0.1]} />
                  <meshBasicMaterial color={THEME.primary} />
                </mesh>
              </group>
            ))}
          </group>
          
          <Text position={[0, 1, 0]} fontSize={0.2} color={THEME.primary}>
            飞行汽车: {isFlying ? "飞行模式" : "待机模式"}
          </Text>
        </Float>
      </group>

      {/* Robot */}
      <group ref={robotRef} position={[-4, 0, -2]}>
        <Float speed={2} rotationIntensity={0.2} floatIntensity={0.2}>
          <mesh position={[0, 1, 0]}>
            <sphereGeometry args={[0.4, 32, 32]} />
            <meshStandardMaterial color={THEME.primary} wireframe />
          </mesh>
          <mesh position={[0, 0.4, 0]}>
            <cylinderGeometry args={[0.2, 0.3, 0.8, 32]} />
            <meshStandardMaterial color={THEME.secondary} transparent opacity={0.5} />
          </mesh>
          
          {/* Local Highlight */}
          <pointLight position={[0, 1, 0]} intensity={2} color={THEME.primary} distance={3} />
          
          <Text position={[0, 1.6, 0]} fontSize={0.2} color={THEME.primary}>
            智能助手
          </Text>
        </Float>
      </group>

      {/* Ecosystem Synergy Task Flow */}
      <group position={[5, 2, -5]}>
        <Html transform distanceFactor={5}>
          <div className="bg-black/80 border border-cyan-400/50 p-6 rounded-sm text-cyan-400 font-mono text-[10px] w-64 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
              <span className="font-bold uppercase tracking-widest">生态协同任务流</span>
            </div>
            <div className="space-y-2 opacity-60">
              <div className="flex justify-between border-b border-white/10 pb-1">
                <span>1. 目标识别</span>
                <span>完成</span>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-1">
                <span>2. 路径规划</span>
                <span>进行中</span>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-1">
                <span>3. 协同调度</span>
                <span>等待</span>
              </div>
            </div>
            <div className="pt-2 text-[8px] text-white/30 leading-relaxed">
              XPENG 未来出行生态系统正在实时优化您的出行方案，整合飞行汽车与地面智能驾驶，实现无缝连接。
            </div>
          </div>
        </Html>
      </group>

      {/* Background Atmosphere */}
      <Points positions={new Float32Array(1000 * 3).map(() => (Math.random() - 0.5) * 40)} stride={3}>
        <PointMaterial transparent color={THEME.primary} size={0.05} sizeAttenuation={true} depthWrite={false} opacity={0.2} />
      </Points>
    </group>
  );
}
