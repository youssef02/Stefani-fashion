"use client";

import { motion } from "framer-motion";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pointer-events-none">
      {/* Content overlay - left aligned to leave right side clickable for 3D */}
      <div className="relative z-10 text-left px-4 sm:px-6 md:px-16 max-w-2xl pointer-events-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="mb-3 md:mb-4"
        >
          <span className="font-[family-name:var(--font-montserrat)] text-rose-gold-light tracking-[0.2em] md:tracking-[0.4em] uppercase text-[10px] sm:text-xs md:text-sm">
            A Digital Fashion Experience
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.8 }}
          className="font-[family-name:var(--font-playfair)] text-4xl sm:text-6xl md:text-8xl lg:text-9xl font-bold mb-4 md:mb-6"
        >
          <span className="animate-shimmer">Stefany</span>
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="mb-6 md:mb-8"
        >
          <p className="font-[family-name:var(--font-cormorant)] text-xl sm:text-2xl md:text-3xl text-champagne italic">
            &ldquo;La moda passa, lo stile resta&rdquo;
          </p>
          <p className="font-[family-name:var(--font-montserrat)] text-rose-gold-light text-xs sm:text-sm mt-2 tracking-wider">
            &mdash; Coco Chanel
          </p>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.6 }}
          className="font-[family-name:var(--font-cormorant)] text-base sm:text-lg md:text-xl text-rose-gold-light/80 max-w-2xl leading-relaxed"
        >
          Where Italian elegance meets digital artistry.
          <br />A world of beauty, crafted just for you.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 2 }}
          className="mt-8 md:mt-12"
        >
          <a
            href="#collection"
            className="inline-block px-6 py-3 md:px-10 md:py-4 border border-rose-gold/50 text-rose-gold font-[family-name:var(--font-montserrat)] tracking-[0.2em] md:tracking-[0.3em] uppercase text-[10px] md:text-xs hover:bg-rose-gold hover:text-deep-plum transition-all duration-500 rounded-none"
          >
            Explore the Collection
          </a>
        </motion.div>

        {/* Scroll indicator - hidden on mobile */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 2.5 }}
          className="hidden sm:block absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-px h-16 bg-gradient-to-b from-rose-gold to-transparent mx-auto"
          />
        </motion.div>
      </div>
    </section>
  );
}
