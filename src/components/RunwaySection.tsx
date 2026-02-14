"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const fashionQuotes = [
  { text: "Elegance is not standing out, but being remembered.", author: "Giorgio Armani" },
  { text: "Simplicity is the keynote of all true elegance.", author: "Coco Chanel" },
  { text: "Fashion is the armor to survive everyday life.", author: "Bill Cunningham" },
  { text: "I don't design clothes. I design dreams.", author: "Ralph Lauren" },
];

const trends = [
  {
    title: "AI-Designed Patterns",
    desc: "Neural networks creating unique textile patterns inspired by Italian Renaissance art",
    number: "01",
  },
  {
    title: "Virtual Try-On",
    desc: "3D body scanning meets haute couture for perfect digital fitting experiences",
    number: "02",
  },
  {
    title: "Sustainable Digital First",
    desc: "Zero-waste design through digital prototyping before any fabric is cut",
    number: "03",
  },
  {
    title: "Holographic Textiles",
    desc: "Light-reactive fabrics that shift color and pattern with movement",
    number: "04",
  },
];

export default function RunwaySection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const quotesRef = useRef(null);
  const quotesInView = useInView(quotesRef, { once: true, margin: "-50px" });

  return (
    <section className="relative overflow-hidden">
      {/* Digital Fashion Trends */}
      <div className="bg-gradient-to-b from-ivory via-silk to-ivory py-32 px-6">
        <div className="max-w-6xl mx-auto" ref={ref}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 1 }}
            className="text-center mb-20"
          >
            <span className="font-[family-name:var(--font-montserrat)] text-rose-gold tracking-[0.4em] uppercase text-xs">
              The Future of Fashion
            </span>
            <h2 className="font-[family-name:var(--font-playfair)] text-5xl md:text-6xl text-noir mt-4 mb-6">
              Moda Digitale
            </h2>
            <div className="w-20 h-px bg-rose-gold mx-auto" />
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {trends.map((trend, i) => (
              <motion.div
                key={trend.number}
                initial={{ opacity: 0, x: i % 2 === 0 ? -40 : 40 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.8, delay: i * 0.15 }}
                className="flex gap-6 group"
              >
                <div className="flex-shrink-0">
                  <span className="font-[family-name:var(--font-playfair)] text-5xl text-rose-gold/20 group-hover:text-rose-gold/50 transition-colors duration-500">
                    {trend.number}
                  </span>
                </div>
                <div>
                  <h3 className="font-[family-name:var(--font-playfair)] text-2xl text-noir mb-2">
                    {trend.title}
                  </h3>
                  <p className="font-[family-name:var(--font-cormorant)] text-noir/60 text-lg leading-relaxed">
                    {trend.desc}
                  </p>
                  <div className="w-0 group-hover:w-16 h-px bg-rose-gold mt-4 transition-all duration-700" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Fashion Quotes Marquee */}
      <div className="bg-deep-plum py-20 px-6" ref={quotesRef}>
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {fashionQuotes.map((quote, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                animate={quotesInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: i * 0.2 }}
                className="text-center md:text-left"
              >
                <p className="font-[family-name:var(--font-cormorant)] text-champagne/90 text-xl italic leading-relaxed">
                  &ldquo;{quote.text}&rdquo;
                </p>
                <p className="font-[family-name:var(--font-montserrat)] text-rose-gold/60 text-xs tracking-[0.3em] uppercase mt-3">
                  {quote.author}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
