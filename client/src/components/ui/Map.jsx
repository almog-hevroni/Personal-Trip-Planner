import { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Polyline,
  Marker,
  Tooltip,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import mapboxSdk from "@mapbox/mapbox-sdk/services/directions";

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;
const directionsClient = mapboxSdk({ accessToken: MAPBOX_TOKEN });

function RoutingLine({ points }) {
  const map = useMap();
  const [route, setRoute] = useState([]);

  useEffect(() => {
    if (!map || points.length < 2) return;

    console.log("Calculating route for points:", points);

    const osrmUrl = `https://router.project-osrm.org/route/v1/walking/${points
      .map((p) => `${p.lng},${p.lat}`)
      .join(";")}?overview=full&geometries=geojson`;

    async function fetchRoute() {
      console.log("Trying OSRM first...");
      try {
        const osrmRes = await fetch(osrmUrl);
        const osrmData = await osrmRes.json();

        if (osrmData.routes?.length) {
          const coords = osrmData.routes[0].geometry.coordinates;
          const latlngs = coords.map(([lng, lat]) => [lat, lng]);
          setRoute(latlngs);
          map.fitBounds(latlngs);
          return;
        } else {
          throw new Error("OSRM returned no routes");
        }
      } catch (err) {
        console.warn("OSRM failed, falling back to Mapbox", err);

        directionsClient
          .getDirections({
            profile: "walking",
            geometries: "geojson",
            overview: "full",
            waypoints: points.map((p) => ({
              coordinates: [p.lng, p.lat],
            })),
          })
          .send()
          .then((res) => {
            const coords = res.body.routes[0].geometry.coordinates;
            const latlngs = coords.map(([lng, lat]) => [lat, lng]);
            setRoute(latlngs);
            map.fitBounds(latlngs);
          })
          .catch((err) => {
            console.error("Mapbox route error:", err);
          });
      }
    }

    fetchRoute();
  }, [map, JSON.stringify(points)]);

  return route.length > 0 ? (
    <Polyline positions={route} color="#3B82F6" weight={5} />
  ) : null;
}

export default function Map({ points = [], type }) {
  const center = points[0] || { lat: 32.08, lng: 34.78 };

  // Check if point are the same, if yes, cut the last one.
  const displayPoints =
    points.length > 1 &&
    points[0].lat === points[points.length - 1].lat &&
    points[0].lng === points[points.length - 1].lng
      ? points.slice(0, -1)
      : points;

  return (
    <MapContainer
      center={[center.lat, center.lng]}
      zoom={13}
      style={{ height: "400px", width: "100%" }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      {displayPoints.map((p, i) => (
        <Marker key={i} position={[p.lat, p.lng]}>
          <Tooltip permanent direction="center">
            {i + 1}
          </Tooltip>
        </Marker>
      ))}

      <RoutingLine points={displayPoints} />
    </MapContainer>
  );
}
