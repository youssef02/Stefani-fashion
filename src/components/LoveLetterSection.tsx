"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";

function TypewriterText({ text, delay = 0, speed = 40 }: { text: string; delay?: number; speed?: number }) {
  const [displayed, setDisplayed] = useState("");
  const [started, setStarted] = useState(false);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;
    const timer = setTimeout(() => setStarted(true), delay);
    return () => clearTimeout(timer);
  }, [isInView, delay]);

  useEffect(() => {
    if (!started) return;
    if (displayed.length < text.length) {
      const timer = setTimeout(() => {
        setDisplayed(text.slice(0, displayed.length + 1));
      }, speed);
      return () => clearTimeout(timer);
    }
  }, [started, displayed, text, speed]);

  return (
    <span ref={ref}>
      {displayed}
      {started && displayed.length < text.length && (
        <span className="animate-pulse text-rose-gold">|</span>
      )}
    </span>
  );
}

function FloatingPetal({ delay, left }: { delay: number; left: string }) {
  return (
    <motion.div
      className="absolute text-rose-gold/20 text-2xl pointer-events-none select-none"
      style={{ left, top: "-20px" }}
      animate={{
        y: ["0vh", "100vh"],
        x: [0, (delay % 3) * 30 - 40],
        rotate: [0, 360],
        opacity: [0, 1, 1, 0],
      }}
      transition={{
        duration: 8 + (delay % 4),
        delay,
        repeat: Infinity,
        ease: "linear",
      }}
    >
      ✿
    </motion.div>
  );
}

export default function LoveLetterSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  // Fixed positions to avoid SSR/client hydration mismatch
  const petalPositions = [8, 22, 37, 51, 14, 66, 79, 43, 91, 5, 58, 73];
  const petals = petalPositions.map((pos, i) => ({
    delay: i * 1.5,
    left: `${pos}%`,
  }));

  return (
    <section className="relative py-32 px-6 bg-gradient-to-b from-ivory via-soft-pink to-ivory overflow-hidden">
      {/* Floating petals */}
      {petals.map((petal, i) => (
        <FloatingPetal key={i} {...petal} />
      ))}

      <div className="max-w-3xl mx-auto relative" ref={ref}>
        {/* Decorative frame */}
        <div className="absolute -inset-8 border border-rose-gold/10 rounded-sm pointer-events-none" />
        <div className="absolute -inset-4 border border-rose-gold/5 rounded-sm pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1 }}
          className="text-center mb-12"
        >
          <span className="font-[family-name:var(--font-montserrat)] text-rose-gold tracking-[0.4em] uppercase text-xs">
            From My Heart
          </span>
          <h2 className="font-[family-name:var(--font-playfair)] text-5xl md:text-6xl text-noir mt-4">
            Per Te, Stefany
          </h2>
          <div className="flex items-center justify-center gap-4 mt-6">
            <div className="w-16 h-px bg-rose-gold/30" />
            <span className="text-rose-gold animate-heartbeat text-2xl">♥</span>
            <div className="w-16 h-px bg-rose-gold/30" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.3 }}
          className="bg-white/60 backdrop-blur-sm p-10 md:p-14 rounded-sm border border-rose-gold/10 shadow-xl shadow-rose-gold/5"
        >
          <div className="font-[family-name:var(--font-cormorant)] text-noir/80 text-xl md:text-2xl leading-relaxed space-y-6 italic">
            <p>
              <TypewriterText
                text="Dear Stefany,"
                delay={500}
                speed={60}
              />
            </p>
            <p>
              <TypewriterText
                text="Like the finest Italian silk, you bring an effortless elegance to everything you touch. This digital fashion world was designed just for you — because you deserve a universe as beautiful as you are."
                delay={2000}
                speed={35}
              />
            </p>
            <p>
              <TypewriterText
                text="In a world of fast fashion, you are timeless couture. In a city of millions, you are the one who stands out. Not because you try to — but because beauty like yours is impossible to miss."
                delay={12000}
                speed={35}
              />
            </p>
            <p>
              <TypewriterText
                text="Every collection in this gallery is named after an Italian city, because Italy knows beauty — and so do I, every time I see you."
                delay={20000}
                speed={35}
              />
            </p>
            <p className="text-right not-italic">
              <TypewriterText
                text="Con tutto il cuore ♥"
                delay={26000}
                speed={80}
              />
            </p>
          </div>
        </motion.div>

        {/* Bottom decoration */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 1, delay: 1 }}
          className="text-center mt-12"
        >
          <p className="font-[family-name:var(--font-montserrat)] text-rose-gold/40 text-xs tracking-[0.3em] uppercase">
            Happy Valentine&apos;s Day 2026
          </p>
          <div className="flex justify-center gap-1 mt-4">
            {[...Array(5)].map((_, i) => (
              <motion.span
                key={i}
                className="text-rose-gold/30 text-sm"
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 2, delay: i * 0.3, repeat: Infinity }}
              >
                ✦
              </motion.span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
