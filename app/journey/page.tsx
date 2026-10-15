import type { Metadata } from "next";
import JourneyView from "@/components/JourneyView";

export const metadata: Metadata = {
  title: "Our journey",
  description: "From a 350 sq ft shop with four tables in May 2023 to eight branches and Pakistan's first specialty coffee Drive-Thru.",
};

export default function JourneyPage() {
  return <JourneyView />;
}
