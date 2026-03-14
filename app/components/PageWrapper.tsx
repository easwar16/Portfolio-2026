"use client";

import { useState } from "react";
import Preloader from "./Preloader";
import Hero from "./Hero";
import About from "./About";
import Work from "./Work";
import Experience from "./Experience";
import TechStack from "./TechStack";
import Footer from "./Footer";

export default function PageWrapper() {
  const [preloaderDone, setPreloaderDone] = useState(false);

  return (
    <>
      <Preloader onComplete={() => setPreloaderDone(true)} />

      <Hero preloaderDone={preloaderDone} />
      <About />
      <Experience />
      <Work />
      <TechStack />
      <Footer />
    </>
  );
}
