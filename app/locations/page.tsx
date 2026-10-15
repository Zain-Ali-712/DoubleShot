import type { Metadata } from "next";
import LocationsView from "@/components/LocationsView";

export const metadata: Metadata = {
  title: "Locations",
  description: "Eight Double Shot branches across Lahore, from DHA Phase 6 to Mall Road.",
};

export default function LocationsPage() {
  return <LocationsView />;
}
