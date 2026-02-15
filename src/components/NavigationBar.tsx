"use client";

import { useState } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";

export default function NavigationBar() {
  const { scrollY } = useScroll();
  const bgOpacity = useTransform(scrollY, [0, 100], [0, 0.95]);
  const borderOpacity = useTransform(scrollY, [0, 100], [0, 0.1]);
  const [menuOpen, setMenuOpen] = useState(false);

  const links = [
    { label: "Collection", href: "#collection" },
    { label: "Trends", href: "#trends" },
    { label: "For You", href: "#love" },
  ];

  return (
    <>
      <motion.nav
        className="fixed top-0 left-0 right-0 z-50 px-4 md:px-6 py-3 md:py-4"
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
            <span className="font-[family-name:var(--font-playfair)] text-champagne text-lg md:text-xl tracking-wider">
              S<span className="text-rose-gold">.</span>
            </span>
          </motion.div>

          {/* Desktop nav */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="hidden md:flex items-center gap-8"
          >
            {links.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="font-[family-name:var(--font-montserrat)] text-champagne/60 text-xs tracking-[0.2em] uppercase hover:text-rose-gold transition-colors duration-300"
              >
                {item.label}
              </a>
            ))}
          </motion.div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden flex flex-col gap-1.5 p-2"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <motion.span
              className="block w-5 h-[1.5px] bg-champagne/70"
              animate={menuOpen ? { rotate: 45, y: 5.5 } : { rotate: 0, y: 0 }}
              transition={{ duration: 0.3 }}
            />
            <motion.span
              className="block w-5 h-[1.5px] bg-champagne/70"
              animate={menuOpen ? { opacity: 0 } : { opacity: 1 }}
              transition={{ duration: 0.2 }}
            />
            <motion.span
              className="block w-5 h-[1.5px] bg-champagne/70"
              animate={menuOpen ? { rotate: -45, y: -5.5 } : { rotate: 0, y: 0 }}
              transition={{ duration: 0.3 }}
            />
          </button>
        </div>
      </motion.nav>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-dark/95 backdrop-blur-md flex flex-col items-center justify-center gap-8 md:hidden"
          >
            {links.map((item, i) => (
              <motion.a
                key={item.label}
                href={item.href}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ delay: i * 0.1 }}
                onClick={() => setMenuOpen(false)}
                className="font-[family-name:var(--font-montserrat)] text-champagne/80 text-sm tracking-[0.3em] uppercase hover:text-rose-gold transition-colors"
              >
                {item.label}
              </motion.a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
