"use client";

import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";

const pin = L.divIcon({
  className: "",
  html: `<div style="display:flex;align-items:center;justify-content:center;width:36px;height:36px;border-radius:9999px;background:#064e3b;border:2px solid #d4af37;box-shadow:0 8px 24px rgba(4,31,23,.35)"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#d4af37" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg></div>`,
  iconSize: [36, 36],
  iconAnchor: [18, 18],
  popupAnchor: [0, -18],
});

export default function MapInner({
  lat,
  lng,
  label,
  zoom = 13,
}: {
  lat: number;
  lng: number;
  label: string;
  zoom?: number;
}) {
  return (
    <MapContainer
      center={[lat, lng]}
      zoom={zoom}
      scrollWheelZoom={false}
      style={{ height: "100%", width: "100%" }}
      attributionControl
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
      />
      <Marker position={[lat, lng]} icon={pin}>
        <Popup>{label}</Popup>
      </Marker>
    </MapContainer>
  );
}
