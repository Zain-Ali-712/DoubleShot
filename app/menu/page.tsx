import type { Metadata } from "next";
import MenuView from "@/components/MenuView";

export const metadata: Metadata = {
  title: "Menu",
  description: "Cans, cold brew, Brazil Cerrado beans, Yoocha matcha and Double Shot merch, with prices in PKR.",
};

export default function MenuPage() {
  return <MenuView />;
}
