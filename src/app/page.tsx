"use client";

import { useState, useCallback, useEffect } from "react";
import dynamic from "next/dynamic";
import NavigationBar from "@/components/NavigationBar";
import HeroSection from "@/components/HeroSection";
import CollectionSection from "@/components/CollectionSection";
import RunwaySection from "@/components/RunwaySection";
import LoveLetterSection from "@/components/LoveLetterSection";
import FooterSection from "@/components/FooterSection";
import SplashScreen from "@/components/SplashScreen";

const Scene3D = dynamic(() => import("@/components/Scene3D"), {
  ssr: false,
});

type ThemeKey = "rose" | "blue" | "green";

const BASE = process.env.NEXT_PUBLIC_BASE_PATH || "";

const HERO_BACKGROUNDS: Record<ThemeKey, string> = {
  rose: `${BASE}/images/hero-bg.jpg`,
  blue: `${BASE}/images/hero-bg-blue.jpg`,
  green: `${BASE}/images/hero-bg-green.jpg`,
};

export default function Home() {
  const [loaded, setLoaded] = useState(false);
  const [showcase, setShowcase] = useState(false);
  const [activeTheme, setActiveTheme] = useState<ThemeKey>("rose");

  const [appliedTheme, setAppliedTheme] = useState<ThemeKey>("rose");

  const handleSplashComplete = useCallback(() => setLoaded(true), []);
  const toggleShowcase = useCallback(() => {
    setShowcase((prev) => {
      if (prev) {
        // Exiting showcase — apply the selected theme to the page
        setAppliedTheme(activeTheme);
      }
      return !prev;
    });
  }, [activeTheme]);
  const handleThemeChange = useCallback((theme: ThemeKey) => setActiveTheme(theme), []);

  // Set data-theme on <html> element for CSS variable overrides
  useEffect(() => {
    const html = document.documentElement;
    if (appliedTheme === "rose") {
      html.removeAttribute("data-theme");
    } else {
      html.setAttribute("data-theme", appliedTheme);
    }
  }, [appliedTheme]);

  return (
    <main className="relative">
      {!loaded && <SplashScreen onComplete={handleSplashComplete} />}
      <NavigationBar />

      {/* Hero with 3D Scene + Background Image */}
      <div className="relative min-h-screen bg-deep-plum overflow-hidden">
        {/* Background fashion images - cross-fade based on theme */}
        {(Object.keys(HERO_BACKGROUNDS) as ThemeKey[]).map((key) => {
          const isVisible = showcase ? activeTheme === key : appliedTheme === key;
          return (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={key}
              src={HERO_BACKGROUNDS[key]}
              alt=""
              className="absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-1000"
              style={{ zIndex: 0, opacity: isVisible ? 1 : 0 }}
            />
          );
        })}
        {/* Dark gradient overlay */}
        <div
          className="absolute inset-0 bg-gradient-to-b from-deep-plum/70 via-noir/50 to-deep-plum/80"
          style={{ zIndex: 1 }}
        />
        {/* 3D scene - transparent canvas floating over the image */}
        <Scene3D
          showcase={showcase}
          onToggleShowcase={toggleShowcase}
          activeTheme={activeTheme}
          onThemeChange={handleThemeChange}
        />
        {/* Hero text content - on top, hidden in showcase mode */}
        <div
          className="absolute inset-0 transition-opacity duration-700 pointer-events-none"
          style={{
            zIndex: 3,
            opacity: showcase ? 0 : 1,
          }}
        >
          <HeroSection />
        </div>
      </div>

      {/* Collection */}
      <CollectionSection />

      {/* Digital Fashion Trends & Quotes */}
      <div id="trends">
        <RunwaySection />
      </div>

      {/* Love Letter */}
      <div id="love">
        <LoveLetterSection />
      </div>

      {/* Footer */}
      <FooterSection />
    </main>
  );
}
