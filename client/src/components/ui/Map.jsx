import React, { useEffect } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine";
import L from "leaflet";

// Component to render realistic routing on the map
function RoutingMachine({ waypoints }) {
  const map = useMap();
  useEffect(() => {
    if (!map || !Array.isArray(waypoints) || waypoints.length < 2) return;

    const control = L.Routing.control({
      waypoints: waypoints.map(({ lat, lng }) => L.latLng(lat, lng)),
      lineOptions: { styles: [{ color: "#3B82F6", weight: 5 }] },
      addWaypoints: false,
      draggableWaypoints: false,
      fitSelectedRoutes: true,
      showAlternatives: false,
    }).addTo(map);

    return () => map.removeControl(control);
  }, [map, waypoints]);
  return null;
}

// Main Map component
export default function Map({ points = [] }) {
  const center = points[0] || { lat: 32.08, lng: 34.78 };

  return (
    <MapContainer
      center={[center.lat, center.lng]}
      zoom={13}
      style={{ height: "400px", width: "100%" }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <RoutingMachine waypoints={points} />
    </MapContainer>
  );
}
