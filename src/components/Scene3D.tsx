"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, Sparkles, useGLTF } from "@react-three/drei";
import { useRef, useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import * as THREE from "three";

// ─── Theme palettes ───
const THEMES = {
  rose: {
    name: "Gold",
    description: "Timeless rose-gold elegance inspired by Milan's sunset over the Duomo. Soft blush tones meet gilded accents for a look that whispers sophistication.",
    palette: [
      { color: "#c9a96e", edge: "#f5d78e", wire: "#c9a96e" },
      { color: "#e8a0b4", edge: "#ff6b9d", wire: "#f9a8c9" },
      { color: "#b76e79", edge: "#ff8fa3", wire: "#e8a0b4" },
      { color: "#d4a0a0", edge: "#ffb3c1", wire: "#f0c0c0" },
      { color: "#c2956b", edge: "#e8c170", wire: "#d4a87c" },
    ],
    accent: "#b76e79",
    sparkle1: "#c9a96e",
    sparkle2: "#b76e79",
    sparkle3: "#f9a8c9",
  },
  blue: {
    name: "Blu Reale",
    description: "Royal blue sophistication drawn from the Amalfi Coast at twilight. Deep sapphire paired with icy silver creates an aura of modern regality.",
    palette: [
      { color: "#4a7fb5", edge: "#7ec8e3", wire: "#5b9bd5" },
      { color: "#2c5f8a", edge: "#5ba3d9", wire: "#4a90c4" },
      { color: "#6baed6", edge: "#9ecae1", wire: "#7ec8e3" },
      { color: "#3a7cc1", edge: "#68b8e8", wire: "#5ba3d9" },
      { color: "#8cbcdb", edge: "#b0d4e8", wire: "#9ecae1" },
    ],
    accent: "#4a7fb5",
    sparkle1: "#7ec8e3",
    sparkle2: "#4a7fb5",
    sparkle3: "#9ecae1",
  },
  green: {
    name: "Verde Natura",
    description: "Enchanted emerald tones from the Tuscan countryside. Rich forest greens blended with golden sage evoke the spirit of la dolce vita in nature.",
    palette: [
      { color: "#5a8f6e", edge: "#8cc9a1", wire: "#6bab80" },
      { color: "#3d7a5a", edge: "#66b48a", wire: "#509c6e" },
      { color: "#7ab891", edge: "#a8d8b9", wire: "#8cc9a1" },
      { color: "#4a9468", edge: "#72c095", wire: "#5faa7c" },
      { color: "#92c9a5", edge: "#b8ddc4", wire: "#a2d3b2" },
    ],
    accent: "#5a8f6e",
    sparkle1: "#8cc9a1",
    sparkle2: "#5a8f6e",
    sparkle3: "#a8d8b9",
  },
} as const;

type ThemeKey = keyof typeof THEMES;

const BASE = process.env.NEXT_PUBLIC_BASE_PATH || "";

const MODEL_PATHS: Record<ThemeKey, string> = {
  rose: `${BASE}/models/mannequin.glb`,
  blue: `${BASE}/models/mannequin1.glb`,
  green: `${BASE}/models/mannequin2.glb`,
};

// ─── Shaders ───
const constructVertexShader = /* glsl */ `
  uniform float uProgress;
  uniform float uTime;
  uniform float uDone;
  uniform float uMinY;
  uniform float uMaxY;
  varying vec3 vPosition;
  varying vec3 vNormal;
  varying float vBuildEdge;
  varying float vVisible;

  void main() {
    vec4 worldPos = modelMatrix * vec4(position, 1.0);
    vPosition = worldPos.xyz;
    vNormal = normalize(normalMatrix * normal);

    if (uDone > 0.5) {
      vVisible = 1.0;
      vBuildEdge = 0.0;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      return;
    }

    float yNorm = clamp((worldPos.y - uMinY) / (uMaxY - uMinY), 0.0, 1.0);
    float reveal = smoothstep(yNorm - 0.02, yNorm + 0.02, uProgress);
    vVisible = reveal;

    float edgeDist = abs(yNorm - uProgress);
    vBuildEdge = smoothstep(0.1, 0.0, edgeDist);

    vec3 displaced = position;
    if (yNorm > uProgress + 0.05) {
      float explode = (yNorm - uProgress) * 2.0;
      displaced += normal * explode * 0.3;
      displaced.y += sin(uTime * 3.0 + position.x * 5.0) * explode * 0.1;
      displaced.x += cos(uTime * 2.0 + position.z * 4.0) * explode * 0.15;
    }

    gl_Position = projectionMatrix * modelViewMatrix * vec4(displaced, 1.0);
  }
`;

const constructFragmentShader = /* glsl */ `
  uniform float uProgress;
  uniform float uTime;
  uniform float uDone;
  uniform vec3 uColor;
  uniform vec3 uEdgeColor;
  uniform vec3 uWireColor;
  varying vec3 vPosition;
  varying vec3 vNormal;
  varying float vBuildEdge;
  varying float vVisible;

  float rand(vec2 co) {
    return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453);
  }

  void main() {
    if (uDone < 0.5 && vVisible < 0.01) discard;

    vec3 lightDir = normalize(vec3(1.0, 1.0, 1.0));
    float NdotL = dot(vNormal, lightDir);
    float toon = NdotL > 0.6 ? 1.0 : NdotL > 0.2 ? 0.75 : 0.5;
    vec3 baseShading = uColor * toon;

    if (uDone > 0.5) {
      gl_FragColor = vec4(baseShading, 1.0);
      return;
    }

    vec3 edgeGlow = uEdgeColor * vBuildEdge * (1.5 + sin(uTime * 8.0) * 0.5);

    float sparkle = 0.0;
    if (vBuildEdge > 0.3) {
      float s = rand(vPosition.xz * 50.0 + uTime * 2.0);
      sparkle = step(0.92, s) * vBuildEdge * 2.0;
    }

    float wire = 0.0;
    if (vVisible < 0.95 && vVisible > 0.01) {
      vec3 grid = abs(fract(vPosition * 8.0) - 0.5);
      float minGrid = min(min(grid.x, grid.y), grid.z);
      wire = 1.0 - smoothstep(0.0, 0.05, minGrid);
      wire *= (1.0 - vVisible) * 0.8;
    }

    vec3 wireColor = uWireColor * wire;

    float alpha = vVisible;
    if (vVisible < 0.95) {
      alpha = mix(0.15, 1.0, vVisible);
    }

    vec3 finalColor = baseShading + edgeGlow + wireColor + vec3(sparkle * 0.8, sparkle * 0.6, sparkle);
    gl_FragColor = vec4(finalColor, alpha);
  }
`;

// ─── Mannequin component ───
function FashionMannequin({
  modelPath,
  position,
  theme,
  showcase,
  isMobile,
  onClick,
}: {
  modelPath: string;
  position: [number, number, number];
  theme: ThemeKey;
  showcase: boolean;
  isMobile: boolean;
  onClick: () => void;
}) {
  const ref = useRef<THREE.Group>(null);
  const { scene } = useGLTF(modelPath);
  const materialsRef = useRef<THREE.ShaderMaterial[]>([]);
  const startTimeRef = useRef(-1);
  const themeData = THEMES[theme];

  const palette = useMemo(
    () =>
      themeData.palette.map((p) => ({
        color: new THREE.Color(p.color),
        edge: new THREE.Color(p.edge),
        wire: new THREE.Color(p.wire),
      })),
    [themeData]
  );

  useEffect(() => {
    const box = new THREE.Box3().setFromObject(scene);
    const minY = box.min.y;
    const maxY = box.max.y;

    const meshes: THREE.Mesh[] = [];
    scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        meshes.push(child);
      }
    });

    const shaderMats: THREE.ShaderMaterial[] = [];

    meshes.forEach((mesh, i) => {
      const colors = palette[i % palette.length];
      const mat = new THREE.ShaderMaterial({
        vertexShader: constructVertexShader,
        fragmentShader: constructFragmentShader,
        uniforms: {
          uProgress: { value: 0.0 },
          uTime: { value: 0.0 },
          uMinY: { value: minY },
          uMaxY: { value: maxY },
          uDone: { value: 0.0 },
          uColor: { value: colors.color },
          uEdgeColor: { value: colors.edge },
          uWireColor: { value: colors.wire },
        },
        transparent: true,
        side: THREE.DoubleSide,
      });
      mesh.material = mat;
      shaderMats.push(mat);
    });

    materialsRef.current = shaderMats;
    // Reset animation start time to re-trigger build
    startTimeRef.current = -1;
  }, [scene, palette]);

  useFrame((state) => {
    const elapsed = state.clock.elapsedTime;

    // Initialize start time on first frame or after reset
    if (startTimeRef.current < 0) {
      startTimeRef.current = elapsed;
    }

    const localTime = elapsed - startTimeRef.current;
    const buildDuration = 4.0;
    const done = localTime >= buildDuration;
    const progress = done
      ? 1.0
      : (() => {
          const t = localTime / buildDuration;
          return t * t * (3 - 2 * t);
        })();

    materialsRef.current.forEach((mat) => {
      mat.uniforms.uProgress.value = progress;
      mat.uniforms.uTime.value = localTime;
      mat.uniforms.uDone.value = done ? 1.0 : 0.0;
    });

    if (ref.current) {
      if (showcase) {
        // Full continuous rotation in showcase mode
        ref.current.rotation.y += 0.008;
      } else {
        ref.current.rotation.y = Math.sin(elapsed * 0.4) * 0.3;
      }
    }
  });

  // Animate position smoothly via lerp
  const targetPos = useRef(new THREE.Vector3(...position));
  const groupRef = useRef<THREE.Group>(null);
  const initialized = useRef(false);

  // Update target whenever position prop changes
  targetPos.current.set(...position);

  useFrame(() => {
    if (groupRef.current) {
      // Set initial position on first frame only
      if (!initialized.current) {
        groupRef.current.position.set(...position);
        initialized.current = true;
      }
      groupRef.current.position.lerp(targetPos.current, 0.04);
    }
  });

  return (
    <group ref={groupRef}>
      <Float speed={showcase ? 0.8 : 1.5} rotationIntensity={showcase ? 0.1 : 0.3} floatIntensity={showcase ? 0.3 : 0.5}>
        <group
          ref={ref}
          scale={showcase ? (isMobile ? 1.2 : 1.5) : (isMobile ? 1.4 : 2)}
          onClick={(e) => {
            e.stopPropagation();
            onClick();
          }}
          onPointerOver={() => (document.body.style.cursor = "pointer")}
          onPointerOut={() => (document.body.style.cursor = "default")}
        >
          <primitive object={scene} />
        </group>
      </Float>
    </group>
  );
}

// Preload all models
useGLTF.preload(`${BASE}/models/mannequin.glb`);
useGLTF.preload(`${BASE}/models/mannequin1.glb`);
useGLTF.preload(`${BASE}/models/mannequin2.glb`);

function ParticleField({ theme }: { theme: ThemeKey }) {
  const t = THEMES[theme];
  return (
    <>
      <Sparkles count={100} scale={15} size={3} speed={0.4} color={t.sparkle1} opacity={0.6} />
      <Sparkles count={50} scale={12} size={2} speed={0.3} color={t.sparkle2} opacity={0.4} />
      <Sparkles count={30} scale={10} size={4} speed={0.2} color={t.sparkle3} opacity={0.3} />
    </>
  );
}

function ClearBackground() {
  const { gl } = useThree();
  gl.setClearColor(0x000000, 0);
  return null;
}

// ─── Mobile detection hook ───
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  return isMobile;
}

// ─── Main export ───
export default function Scene3D({
  showcase,
  onToggleShowcase,
  activeTheme,
  onThemeChange,
}: {
  showcase: boolean;
  onToggleShowcase: () => void;
  activeTheme: ThemeKey;
  onThemeChange: (theme: ThemeKey) => void;
}) {
  const themeData = THEMES[activeTheme];
  const isMobile = useIsMobile();
  const mannequinPos: [number, number, number] = showcase
    ? [0, -0.5, 0]
    : isMobile
    ? [1.5, -0.5, 0]
    : [4, -0.5, 0];

  return (
    <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 2 }}>
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent", pointerEvents: "auto" }}
      >
        <ClearBackground />

        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={1.2} color="#fff5e6" />
        <directionalLight position={[-5, 3, -5]} intensity={0.6} color="#f9a8c9" />
        <directionalLight position={[0, 2, 8]} intensity={0.4} color="#fff0f5" />
        <pointLight position={[4, 1, 3]} intensity={0.8} color={themeData.accent} />
        <spotLight position={[4, 5, 3]} angle={0.4} penumbra={0.8} intensity={1.2} color="#ffffff" />
        <hemisphereLight color="#fff5e6" groundColor="#2d1b3d" intensity={0.4} />

        <FashionMannequin
          modelPath={MODEL_PATHS[activeTheme]}
          position={mannequinPos}
          theme={activeTheme}
          showcase={showcase}
          isMobile={isMobile}
          onClick={onToggleShowcase}
        />

        <ParticleField theme={activeTheme} />
      </Canvas>

      {/* Showcase UI overlay */}
      <AnimatePresence>
        {showcase && (
          <>
            {/* Theme selector buttons */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="absolute bottom-20 md:bottom-24 left-1/2 -translate-x-1/2 flex flex-col md:flex-row gap-2 md:gap-4 pointer-events-auto"
              style={{ zIndex: 10 }}
            >
              {(Object.keys(THEMES) as ThemeKey[]).map((key) => (
                <button
                  key={key}
                  onClick={() => onThemeChange(key)}
                  className="group relative px-4 py-2 md:px-6 md:py-3 transition-all duration-300"
                  style={{
                    border: `1px solid ${activeTheme === key ? THEMES[key].accent : "rgba(255,255,255,0.2)"}`,
                    background: activeTheme === key ? `${THEMES[key].accent}20` : "rgba(0,0,0,0.3)",
                    backdropFilter: "blur(10px)",
                  }}
                >
                  <div className="flex items-center gap-2 md:gap-3">
                    <div
                      className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full"
                      style={{
                        background: THEMES[key].accent,
                        boxShadow: activeTheme === key ? `0 0 12px ${THEMES[key].accent}` : "none",
                      }}
                    />
                    <span
                      className="text-[10px] md:text-xs tracking-[0.15em] md:tracking-[0.2em] uppercase whitespace-nowrap"
                      style={{
                        fontFamily: "Montserrat, sans-serif",
                        color: activeTheme === key ? THEMES[key].accent : "rgba(255,255,255,0.6)",
                      }}
                    >
                      {THEMES[key].name}
                    </span>
                  </div>
                </button>
              ))}
            </motion.div>

            {/* Style description box - hidden on mobile */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="hidden md:block absolute left-8 top-1/2 -translate-y-1/2 max-w-xs pointer-events-auto"
              style={{ zIndex: 10 }}
            >
              <div
                className="p-6 rounded-sm"
                style={{
                  background: "rgba(0,0,0,0.4)",
                  backdropFilter: "blur(12px)",
                  border: `1px solid ${themeData.accent}30`,
                }}
              >
                <div
                  className="w-8 h-px mb-4"
                  style={{ background: themeData.accent }}
                />
                <h3
                  className="text-lg font-bold mb-2 tracking-wide"
                  style={{
                    fontFamily: "Playfair Display, serif",
                    color: themeData.accent,
                  }}
                >
                  {themeData.name}
                </h3>
                <p
                  className="text-sm leading-relaxed"
                  style={{
                    fontFamily: "Cormorant Garamond, serif",
                    color: "rgba(255,255,255,0.7)",
                  }}
                >
                  {themeData.description}
                </p>
                <div
                  className="flex gap-2 mt-4"
                >
                  {themeData.palette.map((p, i) => (
                    <div
                      key={i}
                      className="w-5 h-5 rounded-full border border-white/10"
                      style={{ background: p.color }}
                    />
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Close / Back button */}
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={onToggleShowcase}
              className="absolute bottom-4 md:bottom-8 right-4 md:right-8 px-4 py-2 text-[10px] md:text-xs tracking-[0.15em] md:tracking-[0.2em] uppercase transition-all duration-300 hover:bg-white/10 pointer-events-auto"
              style={{
                zIndex: 10,
                fontFamily: "Montserrat, sans-serif",
                color: "rgba(255,255,255,0.6)",
                border: "1px solid rgba(255,255,255,0.2)",
                backdropFilter: "blur(10px)",
              }}
            >
              Back
            </motion.button>

            {/* Hint text - hidden on mobile */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.8 }}
              className="hidden md:block absolute bottom-8 left-1/2 -translate-x-1/2 text-[10px] tracking-[0.3em] uppercase"
              style={{
                zIndex: 10,
                fontFamily: "Montserrat, sans-serif",
                color: "rgba(255,255,255,0.3)",
              }}
            >
              Select a style to explore
            </motion.p>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
