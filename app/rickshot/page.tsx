import type { Metadata } from "next";
import RickShotView from "@/components/RickShotView";

export const metadata: Metadata = {
  title: "RickShot mobile brew bar",
  description: "Premium event catering by Double Shot. Packages from 50 to 150 drinks with our baristas, equipment and calibrated beans.",
};

export default function RickShotPage() {
  return <RickShotView />;
}
