import type { Metadata } from "next";
import ContactView from "@/components/ContactView";

export const metadata: Metadata = {
  title: "Contact",
  description: "Reach Double Shot on WhatsApp, Instagram or Facebook, or send us a message.",
};

export default function ContactPage() {
  return <ContactView />;
}
