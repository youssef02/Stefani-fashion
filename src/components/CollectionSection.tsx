"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";

const BASE = process.env.NEXT_PUBLIC_BASE_PATH || "";

const collections = [
  {
    title: "Milano Sera",
    subtitle: "Evening Couture",
    description: "Silk and stardust. A gown that moves like a whisper through a Milanese evening.",
    gradient: "from-rose-gold/60 via-gold/40 to-rose-gold-light/60",
    details: ["Hand-draped Italian silk", "Crystal embellishments", "Bespoke tailoring"],
    image: `${BASE}/images/milano-sera.jpg`,
  },
  {
    title: "Roma Eterna",
    subtitle: "Timeless Elegance",
    description: "Inspired by the eternal city. Classic lines meeting modern digital artistry.",
    gradient: "from-deep-plum/60 via-rose-gold/40 to-deep-plum/60",
    details: ["Sustainable fabrics", "3D-designed patterns", "AI-optimized fit"],
    image: `${BASE}/images/roma-eterna.jpg`,
  },
  {
    title: "Firenze Digitale",
    subtitle: "Digital Renaissance",
    description: "Where Renaissance artistry meets tomorrow's technology. Fashion reimagined.",
    gradient: "from-gold/60 via-champagne/40 to-gold/60",
    details: ["Virtual try-on ready", "NFT-enabled designs", "Holographic accents"],
    image: `${BASE}/images/firenze-digitale.jpg`,
  },
  {
    title: "Venezia Sogno",
    subtitle: "Dreamlike Beauty",
    description: "Like reflections on Venetian waters. Fluid, luminous, and unforgettable.",
    gradient: "from-blush/60 via-rose-gold-light/40 to-champagne/60",
    details: ["Iridescent fabrics", "Water-inspired draping", "Luminous finishes"],
    image: `${BASE}/images/venezia-sogno.jpg`,
  },
];

function CollectionCard({ item, index }: { item: typeof collections[0]; index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay: index * 0.2 }}
      className="group relative"
    >
      <div className="relative overflow-hidden rounded-sm border border-rose-gold/10 bg-white/50 backdrop-blur-sm hover:border-rose-gold/30 transition-all duration-700 hover:shadow-2xl hover:shadow-rose-gold/10">
        {/* Image header */}
        <div className="h-52 sm:h-64 md:h-80 relative overflow-hidden">
          <Image
            src={item.image}
            alt={item.title}
            fill
            className="object-cover object-top group-hover:scale-110 transition-transform duration-1000 ease-out"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
          {/* Gradient overlay on image */}
          <div className={`absolute inset-0 bg-gradient-to-t ${item.gradient} mix-blend-multiply`} />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

          {/* Floating S overlay */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.span
              className="text-white/15 text-[80px] md:text-[140px] font-[family-name:var(--font-playfair)] italic drop-shadow-lg select-none"
              animate={{ scale: [1, 1.05, 1], opacity: [0.15, 0.25, 0.15] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            >
              S
            </motion.span>
          </div>

          {/* Shimmer overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

          {/* Collection number */}
          <div className="absolute top-4 right-4">
            <span className="font-[family-name:var(--font-montserrat)] text-white/50 text-sm tracking-widest drop-shadow">
              0{index + 1}
            </span>
          </div>

          {/* Title overlay on image */}
          <div className="absolute bottom-4 left-6">
            <span className="font-[family-name:var(--font-montserrat)] text-white/80 text-xs tracking-[0.3em] uppercase drop-shadow">
              {item.subtitle}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 md:p-8">
          <h3 className="font-[family-name:var(--font-playfair)] text-2xl md:text-3xl text-noir mt-1 mb-3 md:mb-4">
            {item.title}
          </h3>
          <p className="font-[family-name:var(--font-cormorant)] text-noir/70 text-lg leading-relaxed mb-6">
            {item.description}
          </p>

          {/* Details */}
          <div className="space-y-2">
            {item.details.map((detail, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-rose-gold/50" />
                <span className="font-[family-name:var(--font-montserrat)] text-noir/50 text-xs tracking-wider">
                  {detail}
                </span>
              </div>
            ))}
          </div>

          {/* Hover CTA */}
          <div className="mt-6 overflow-hidden h-0 group-hover:h-12 transition-all duration-500">
            <div className="flex items-center gap-2 text-rose-gold font-[family-name:var(--font-montserrat)] text-xs tracking-[0.2em] uppercase cursor-pointer hover:gap-4 transition-all">
              <span>Discover</span>
              <span className="text-lg">&rarr;</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function CollectionSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <section id="collection" className="py-16 md:py-32 px-4 md:px-6 bg-ivory relative">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-rose-gold/30 to-transparent" />

      <div className="max-w-7xl mx-auto">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-10 md:mb-20"
        >
          <span className="font-[family-name:var(--font-montserrat)] text-rose-gold tracking-[0.4em] uppercase text-xs">
            Italian Digital Couture
          </span>
          <h2 className="font-[family-name:var(--font-playfair)] text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-noir mt-3 md:mt-4 mb-4 md:mb-6">
            La Collezione
          </h2>
          <div className="w-16 md:w-20 h-px bg-rose-gold mx-auto mb-4 md:mb-6" />
          <p className="font-[family-name:var(--font-cormorant)] text-lg md:text-xl text-noir/60 max-w-xl mx-auto">
            Four digital fashion experiences inspired by the most beautiful cities in Italy.
            Each piece designed with the future of fashion in mind.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-8">
          {collections.map((item, index) => (
            <CollectionCard key={item.title} item={item} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
