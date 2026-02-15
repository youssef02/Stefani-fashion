"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

export default function FooterSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <footer className="bg-deep-plum py-12 md:py-20 px-4 md:px-6 relative overflow-hidden" ref={ref}>
      {/* Top border */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-rose-gold/30 to-transparent" />

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <h2 className="font-[family-name:var(--font-playfair)] text-3xl md:text-4xl lg:text-5xl text-champagne mb-4">
            Stefany
          </h2>
          <div className="w-12 h-px bg-rose-gold mx-auto mb-6" />
          <p className="font-[family-name:var(--font-cormorant)] text-rose-gold-light/60 text-lg italic">
            A digital fashion experience, made with love
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-8 md:mt-12 flex flex-wrap items-center justify-center gap-3 md:gap-8 text-rose-gold/30"
        >
          <span className="font-[family-name:var(--font-montserrat)] text-[10px] md:text-xs tracking-[0.15em] md:tracking-[0.2em]">MILANO</span>
          <span className="hidden sm:inline">✦</span>
          <span className="font-[family-name:var(--font-montserrat)] text-[10px] md:text-xs tracking-[0.15em] md:tracking-[0.2em]">ROMA</span>
          <span className="hidden sm:inline">✦</span>
          <span className="font-[family-name:var(--font-montserrat)] text-[10px] md:text-xs tracking-[0.15em] md:tracking-[0.2em]">FIRENZE</span>
          <span className="hidden sm:inline">✦</span>
          <span className="font-[family-name:var(--font-montserrat)] text-[10px] md:text-xs tracking-[0.15em] md:tracking-[0.2em]">VENEZIA</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-8 md:mt-12"
        >
          <p className="font-[family-name:var(--font-montserrat)] text-rose-gold/20 text-xs tracking-wider">
            Crafted with ♥ on Valentine&apos;s Day 2026
          </p>
        </motion.div>
      </div>

      {/* Background decoration */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[300px] h-[300px] md:w-[600px] md:h-[600px] rounded-full bg-rose-gold/[0.02] blur-3xl pointer-events-none" />
    </footer>
  );
}
