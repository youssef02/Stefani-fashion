"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function SplashScreen({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<"loading" | "reveal">("loading");

  useEffect(() => {
    // Preload key assets
    const base = process.env.NEXT_PUBLIC_BASE_PATH || "";
    const assets = [
      `${base}/images/hero-bg.jpg`,
      `${base}/images/hero-bg-blue.jpg`,
      `${base}/images/hero-bg-green.jpg`,
      `${base}/images/milano-sera.jpg`,
      `${base}/images/roma-eterna.jpg`,
      `${base}/images/firenze-digitale.jpg`,
      `${base}/images/venezia-sogno.jpg`,
      `${base}/models/mannequin.glb`,
      `${base}/models/mannequin1.glb`,
      `${base}/models/mannequin2.glb`,
    ];

    let loaded = 0;
    const total = assets.length;

    const promises = assets.map(
      (src) =>
        new Promise<void>((resolve) => {
          if (src.endsWith(".glb")) {
            fetch(src)
              .then(() => {
                loaded++;
                setProgress(Math.round((loaded / total) * 100));
                resolve();
              })
              .catch(() => {
                loaded++;
                setProgress(Math.round((loaded / total) * 100));
                resolve();
              });
          } else {
            const img = new Image();
            img.onload = () => {
              loaded++;
              setProgress(Math.round((loaded / total) * 100));
              resolve();
            };
            img.onerror = () => {
              loaded++;
              setProgress(Math.round((loaded / total) * 100));
              resolve();
            };
            img.src = src;
          }
        })
    );

    Promise.all(promises).then(() => {
      setProgress(100);
      setTimeout(() => {
        setPhase("reveal");
        setTimeout(onComplete, 1200);
      }, 600);
    });
  }, [onComplete]);

  return (
    <AnimatePresence>
      {phase === "loading" && (
        <motion.div
          key="splash"
          exit={{ opacity: 0 }}
          transition={{ duration: 1, ease: "easeInOut" }}
          className="fixed inset-0 z-[9999] flex items-center justify-center"
          style={{ background: "linear-gradient(135deg, #2d1b33 0%, #1a1a1a 50%, #2d1b33 100%)" }}
        >
          {/* Floating particles */}
          {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 rounded-full bg-gold/40"
              initial={{
                x: (i * 137) % 300 - 150,
                y: 200,
                opacity: 0,
              }}
              animate={{
                y: -200,
                opacity: [0, 0.8, 0],
              }}
              transition={{
                duration: 3 + (i % 3),
                repeat: Infinity,
                delay: i * 0.4,
                ease: "easeOut",
              }}
            />
          ))}

          <div className="text-center relative">
            {/* Elegant S monogram */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
              className="relative mb-8"
            >
              <div className="w-24 h-24 mx-auto relative">
                <motion.div
                  className="absolute inset-0 rounded-full border border-gold/30"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                />
                <motion.div
                  className="absolute inset-2 rounded-full border border-rose-gold/20"
                  animate={{ rotate: -360 }}
                  transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                />
                <span
                  className="absolute inset-0 flex items-center justify-center text-5xl font-bold"
                  style={{
                    fontFamily: "Playfair Display, serif",
                    background: "linear-gradient(135deg, #c9a96e, #b76e79, #c9a96e)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  S
                </span>
              </div>
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="text-2xl tracking-[0.3em] uppercase mb-2"
              style={{
                fontFamily: "Montserrat, sans-serif",
                color: "#c9a96e",
                fontWeight: 300,
              }}
            >
              Stefany
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="text-xs tracking-[0.5em] uppercase mb-12"
              style={{
                fontFamily: "Montserrat, sans-serif",
                color: "#b76e79",
              }}
            >
              Fashion Experience
            </motion.p>

            {/* Progress bar */}
            <motion.div
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="w-48 mx-auto"
            >
              <div className="h-[1px] bg-white/10 relative overflow-hidden">
                <motion.div
                  className="absolute inset-y-0 left-0"
                  style={{
                    background: "linear-gradient(90deg, #c9a96e, #b76e79)",
                    width: `${progress}%`,
                  }}
                  transition={{ duration: 0.3 }}
                />
              </div>
              <div className="flex justify-between mt-3">
                <span
                  className="text-[10px] tracking-[0.2em] uppercase"
                  style={{
                    fontFamily: "Montserrat, sans-serif",
                    color: "rgba(201, 169, 110, 0.5)",
                  }}
                >
                  Loading
                </span>
                <span
                  className="text-[10px] tabular-nums"
                  style={{
                    fontFamily: "Montserrat, sans-serif",
                    color: "rgba(183, 110, 121, 0.5)",
                  }}
                >
                  {progress}%
                </span>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}

      {phase === "reveal" && (
        <motion.div
          key="reveal"
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          className="fixed inset-0 z-[9999] pointer-events-none"
          style={{ background: "linear-gradient(135deg, #2d1b33 0%, #1a1a1a 50%, #2d1b33 100%)" }}
        />
      )}
    </AnimatePresence>
  );
}
