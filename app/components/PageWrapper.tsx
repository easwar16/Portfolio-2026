"use client";

import { useState, useEffect } from "react";
import Preloader from "./Preloader";
import Hero from "./Hero";
import About from "./About";
import Work from "./Work";
import Experience from "./Experience";
import TechStack from "./TechStack";
import Footer from "./Footer";

export default function PageWrapper() {
  const [showPreloader, setShowPreloader] = useState(true);
  const [preloaderDone, setPreloaderDone] = useState(false);

  // Skip preloader if already shown this session
  useEffect(() => {
    if (sessionStorage.getItem("preloaderShown") === "true") {
      setShowPreloader(false);
      setPreloaderDone(true);
    }
  }, []);

  const handlePreloaderComplete = () => {
    sessionStorage.setItem("preloaderShown", "true");
    setShowPreloader(false);
    setPreloaderDone(true);
  };

  return (
    <>
      {showPreloader && <Preloader onComplete={handlePreloaderComplete} />}

      <Hero preloaderDone={preloaderDone} />
      <About />
      <Experience />
      <Work />
      <TechStack />
      <Footer />
    </>
  );
}
