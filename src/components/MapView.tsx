"use client";

import { useEffect, useMemo } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import type { Report } from "@/lib/types";
import { getMarkerTier } from "@/lib/markers";
import { MARKER_COLORS, MICHIGAN_CENTER, DEFAULT_ZOOM } from "@/lib/constants";
import { ScoreBadge } from "./ScoreBadge";
import { IssueTag } from "./IssueTag";
import "leaflet/dist/leaflet.css";

function createIcon(color: string) {
  return L.divIcon({
    className: "boof-marker",
    html: `<div style="
      width:14px;height:14px;
      background:${color};
      border:2px solid rgba(255,255,255,0.9);
      border-radius:50%;
      box-shadow:0 0 12px ${color}88, 0 2px 8px rgba(0,0,0,0.5);
    "></div>`,
    iconSize: [14, 14],
    iconAnchor: [7, 7],
  });
}

function MapController({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [map, center, zoom]);
  return null;
}

export function MapView({
  reports,
  center,
  zoom = DEFAULT_ZOOM,
  className = "",
}: {
  reports: Report[];
  center?: [number, number];
  zoom?: number;
  className?: string;
}) {
  const mapCenter = center ?? [MICHIGAN_CENTER.lat, MICHIGAN_CENTER.lng];

  const markers = useMemo(
    () =>
      reports.filter(
        (r) => r.latitude != null && r.longitude != null
      ),
    [reports]
  );

  const icons = useMemo(
    () => ({
      boof: createIcon(MARKER_COLORS.boof),
      taxed: createIcon(MARKER_COLORS.taxed),
      mid: createIcon(MARKER_COLORS.mid),
      fire: createIcon(MARKER_COLORS.fire),
    }),
    []
  );

  return (
    <div className={`relative overflow-hidden rounded-2xl ${className}`}>
      <MapContainer
        center={mapCenter}
        zoom={zoom}
        className="h-full w-full z-0"
        zoomControl={false}
        attributionControl={false}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
        />
        <MapController center={mapCenter} zoom={zoom} />
        {markers.map((report) => {
          const tier = getMarkerTier(report);
          return (
            <Marker
              key={report.id}
              position={[report.latitude!, report.longitude!]}
              icon={icons[tier]}
            >
              <Popup className="boof-popup">
                <div className="min-w-[180px] p-1 text-zinc-900">
                  <p className="font-semibold">{report.strain_name}</p>
                  <p className="text-xs text-zinc-600">
                    {report.brand_name} · {report.dispensary_name}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {report.issue_tags.slice(0, 3).map((t) => (
                      <span
                        key={t}
                        className="rounded bg-zinc-200 px-1.5 py-0.5 text-[10px]"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                  <p className="mt-1 text-xs">
                    Score: {report.boof_score}/5
                  </p>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      <div className="pointer-events-none absolute bottom-3 left-3 flex flex-wrap gap-2 rounded-xl border border-zinc-800/50 bg-black/70 px-2.5 py-2 backdrop-blur-md">
        {(
          [
            ["boof", "Boof"],
            ["taxed", "Taxed"],
            ["mid", "Mid"],
            ["fire", "Fire"],
          ] as const
        ).map(([key, label]) => (
          <span key={key} className="flex items-center gap-1.5 text-[10px] text-zinc-400">
            <span
              className="h-2 w-2 rounded-full border border-white/50"
              style={{ background: MARKER_COLORS[key] }}
            />
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}
