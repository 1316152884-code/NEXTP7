import React, { Suspense, useRef, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { 
  useScroll, 
  PerspectiveCamera,
  Environment,
  Points,
  PointMaterial
} from "@react-three/drei";
import * as THREE from "three";
import { THEME } from "./Theme";
import { Act1_CarShowcase } from "./Act1_CarShowcase";
import { Act2_SmartDriving } from "./Act2_SmartDriving";
import { Act3_FutureImagine } from "./Act3_FutureImagine";

function Background() {
  const points = useMemo(() => {
    const p = new Float32Array(3000 * 3);
    for (let i = 0; i < 3000; i++) {
      p[i * 3] = (Math.random() - 0.5) * 60;
      p[i * 3 + 1] = (Math.random() - 0.5) * 60;
      p[i * 3 + 2] = (Math.random() - 0.5) * 60;
    }
    return p;
  }, []);

  return (
    <group>
      <Points positions={points} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color={THEME.primary}
          size={0.03}
          sizeAttenuation={true}
          depthWrite={false}
          opacity={0.15}
        />
      </Points>
      <gridHelper args={[120, 60, THEME.line, THEME.grid]} position={[0, -6, 0]} />
      <fog attach="fog" args={[THEME.bg, 5, 45]} />
    </group>
  );
}

function CameraRig() {
  const scroll = useScroll();
  const { camera, mouse } = useThree();
  
  useFrame((state, delta) => {
    const offset = scroll.offset; // 0 to 1
    
    let targetPos = new THREE.Vector3();
    let targetLookAt = new THREE.Vector3();

    if (offset < 0.33) {
      const t = offset / 0.33;
      const easedT = 1 - Math.pow(1 - t, 3); 
      // Act 1: Zoom from far to close
      targetPos.lerpVectors(new THREE.Vector3(0, 1.5, 10), new THREE.Vector3(0, 1, 5), easedT);
      targetLookAt.lerpVectors(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, 0), easedT);
    } else if (offset < 0.66) {
      const t = (offset - 0.33) / 0.33;
      const easedT = 1 - Math.pow(1 - t, 3);
      // Act 2: Move to city road
      targetPos.lerpVectors(new THREE.Vector3(0, 1, 5), new THREE.Vector3(5, 3, -10), easedT);
      targetLookAt.lerpVectors(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, -15), easedT);
    } else {
      const t = (offset - 0.66) / 0.34;
      const easedT = 1 - Math.pow(1 - t, 3);
      // Act 3: Move to future dome
      targetPos.lerpVectors(new THREE.Vector3(5, 3, -10), new THREE.Vector3(0, 6, -25), easedT);
      targetLookAt.lerpVectors(new THREE.Vector3(0, 0, -15), new THREE.Vector3(0, 0, -20), easedT);
    }

    // Mouse Parallax
    const parallaxX = mouse.x * 0.5;
    const parallaxY = mouse.y * 0.5;
    
    camera.position.lerp(new THREE.Vector3(targetPos.x + parallaxX, targetPos.y + parallaxY, targetPos.z), 0.1);
    camera.lookAt(targetLookAt);
  });

  return null;
}

export function Experience() {
  return (
    <>
      <CameraRig />
      <Background />
      
      {/* Act 1: Car Showcase */}
      <group position={[0, 0, 0]}>
        <Act1_CarShowcase />
      </group>

      {/* Act 2: Smart Driving */}
      <group position={[0, 0, -15]}>
        <Act2_SmartDriving />
      </group>

      {/* Act 3: Future Imagine */}
      <group position={[0, 0, -30]}>
        <Act3_FutureImagine />
      </group>

      <ambientLight intensity={0.2} />
      <pointLight position={[10, 10, 10]} intensity={1.5} color={THEME.primary} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color={THEME.secondary} />
      <spotLight position={[-10, 20, 10]} angle={0.15} penumbra={1} intensity={2} color={THEME.secondary} />
    </>
  );
}
