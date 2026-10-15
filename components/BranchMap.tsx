"use client";

import { useEffect, useRef } from "react";
import type { Map as LeafletMap, Marker } from "leaflet";
import "leaflet/dist/leaflet.css";
import type { Branch } from "@/lib/data";

/** Interactive Lahore map. Flies to the active branch; pins are clickable. */
export default function BranchMap({
  branches,
  active,
  onSelect,
  className = "",
}: {
  branches: Branch[];
  active: number;
  onSelect: (i: number) => void;
  className?: string;
}) {
  const el = useRef<HTMLDivElement>(null);
  const map = useRef<LeafletMap | null>(null);
  const markers = useRef<Marker[]>([]);
  const onSelectRef = useRef(onSelect);
  onSelectRef.current = onSelect;
  const activeRef = useRef(active);
  activeRef.current = active;

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const L = (await import("leaflet")).default;
      if (cancelled || !el.current || map.current) return;
      const m = L.map(el.current, {
        zoomControl: false,
        scrollWheelZoom: false,
        attributionControl: true,
      });
      L.control.zoom({ position: "topright" }).addTo(m);
      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(m);
      markers.current = branches.map((b, i) =>
        L.marker([b.lat, b.lng], {
          icon: L.divIcon({ className: "", html: `<div class="ds-pin"></div>`, iconSize: [18, 18], iconAnchor: [9, 9] }),
          title: b.name,
          keyboard: false,
        })
          .on("click", () => onSelectRef.current(i))
          .addTo(m),
      );
      m.fitBounds(L.latLngBounds(branches.map((b) => [b.lat, b.lng])), { padding: [40, 40] });
      markers.current[activeRef.current]?.getElement()?.querySelector(".ds-pin")?.classList.add("is-active");
      map.current = m;
    })();
    return () => {
      cancelled = true;
      map.current?.remove();
      map.current = null;
    };
  }, [branches]);

  useEffect(() => {
    const m = map.current;
    markers.current.forEach((mk, i) => mk.getElement()?.querySelector(".ds-pin")?.classList.toggle("is-active", i === active));
    if (!m) return;
    const b = branches[active];
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    m.flyTo([b.lat, b.lng], 14, { duration: reduce ? 0 : 1.2 });
  }, [active, branches]);

  return <div ref={el} className={`ds-map h-full w-full ${className}`} role="application" aria-label="Map of Double Shot branches in Lahore" />;
}
