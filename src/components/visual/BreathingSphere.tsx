import React, { Suspense, useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import { usePrefersReducedMotion } from '@/hooks/use-prefers-reduced-motion';
const vertexShader = `
  varying vec3 v_normal;
  void main() {
    v_normal = normal;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;
const fragmentShader = `
  varying vec3 v_normal;
  uniform float u_time;
  uniform vec3 u_color1;
  uniform vec3 u_color2;
  void main() {
    vec3 normal = normalize(v_normal);
    float fresnel = pow(1.0 - abs(dot(normal, vec3(0, 0, 1.0))), 2.0);
    vec3 color = mix(u_color1, u_color2, fresnel + sin(u_time * 2.0 + normal.x * 5.0) * 0.1);
    gl_FragColor = vec4(color, 1.0);
  }
`;
function Sphere() {
  const meshRef = useRef<THREE.Mesh>(null!);
  const prefersReducedMotion = usePrefersReducedMotion();
  const uniforms = useMemo(
    () => ({
      u_time: { value: 0.0 },
      u_color1: { value: new THREE.Color('hsl(190, 100%, 50%)') },
      u_color2: { value: new THREE.Color('hsl(268, 100%, 68%)') },
    }),
    []
  );
  useFrame((state) => {
    const { clock } = state;
    if (prefersReducedMotion) {
      (meshRef.current.material as THREE.ShaderMaterial).uniforms.u_time.value = clock.getElapsedTime() * 0.2;
      meshRef.current.scale.set(1, 1, 1);
    } else {
      (meshRef.current.material as THREE.ShaderMaterial).uniforms.u_time.value = clock.getElapsedTime();
      const t = clock.getElapsedTime();
      meshRef.current.scale.setScalar(1 + Math.sin(t * 1.5) * 0.05);
    }
  });
  return (
    <mesh ref={meshRef}>
      <icosahedronGeometry args={[1, 32]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
      />
    </mesh>
  );
}
function FallbackSphere() {
  return (
    <div className="w-full h-full rounded-full bg-gradient-prism animate-pulse" />
  );
}
export function BreathingSphere() {
  return (
    <div className="w-full h-full aspect-square">
      <Suspense fallback={<FallbackSphere />}>
        <Canvas>
          <PerspectiveCamera makeDefault position={[0, 0, 2.5]} />
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} />
          <Sphere />
        </Canvas>
      </Suspense>
    </div>
  );
}