import Hero from "@/components/Hero";
import { SectionBridge } from "@/components/Brand";
import { Marquee, Origin } from "@/components/home/Intro";
import ProductRail from "@/components/home/ProductRail";
import { BranchesMap, LatteLineup, Precision, RickShotStrip, VideoFeature } from "@/components/home/Features";

export default function Home() {
  return (
    <>
      <Hero />
      <Marquee />
      <Origin />
      <ProductRail />
      <SectionBridge image="/img/cut-matcha.png" side="left" text="Whisked • Poured • Calibrated • " />
      <Precision />
      <RickShotStrip />
      <SectionBridge image="/img/hero-beans.png" side="right" text="Eight branches • One standard • " tone="var(--color-caramel-soft)" />
      <BranchesMap />
      <VideoFeature />
      <LatteLineup />
    </>
  );
}
