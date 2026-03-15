"use client";

import Hero from "./Hero";
import About from "./About";
import Work from "./Work";
import Experience from "./Experience";
import TechStack from "./TechStack";
import Footer from "./Footer";

export default function PageWrapper() {
  return (
    <>
      <Hero preloaderDone={true} />
      <About />
      <Experience />
      <Work />
      <TechStack />
      <Footer />
    </>
  );
}
