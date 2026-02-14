"use client";

import { motion, useScroll, useTransform } from "framer-motion";

export default function NavigationBar() {
  const { scrollY } = useScroll();
  const bgOpacity = useTransform(scrollY, [0, 100], [0, 0.95]);
  const borderOpacity = useTransform(scrollY, [0, 100], [0, 0.1]);

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-50 px-6 py-4"
      style={{
        backgroundColor: useTransform(bgOpacity, (v) => `rgba(26, 26, 26, ${v})`),
        borderBottom: useTransform(borderOpacity, (v) => `1px solid rgba(183, 110, 121, ${v})`),
      }}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="font-[family-name:var(--font-playfair)] text-champagne text-xl tracking-wider">
            S<span className="text-rose-gold">.</span>
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="flex items-center gap-8"
        >
          {["Collection", "Trends", "For You"].map((item, i) => (
            <a
              key={item}
              href={`#${item === "Collection" ? "collection" : item === "Trends" ? "trends" : "love"}`}
              className="font-[family-name:var(--font-montserrat)] text-champagne/60 text-xs tracking-[0.2em] uppercase hover:text-rose-gold transition-colors duration-300"
            >
              {item}
            </a>
          ))}
        </motion.div>
      </div>
    </motion.nav>
  );
}
