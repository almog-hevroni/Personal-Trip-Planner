// client/src/pages/MyTrips.jsx
import React, { useEffect, useState } from "react";
import useApi from "../hooks/useApi";
import { useNavigate } from "react-router-dom";

import "../styles/layout.css";
import "../styles/typography.css";
import "../styles/utilities.css";
import "../styles/components/card.css";
import "../styles/components/button.css";


import Button from "../components/ui/Button";

export default function MyTrips() {
  const [trips, setTrips] = useState([]);
  const api = useApi();
  const nav = useNavigate();

  useEffect(() => {
    async function fetchTrips() {
      try {
        const { data } = await api.get("/trips");
        setTrips(data);
      } catch {
        window.alert("Error fetching trips.");
      }
    }
    fetchTrips();
  }, []);

  return (
    <div className="container mt-2">
      <h1 className="heading-xl mb-2">Trips History</h1>
      <div className="grid-2col">
        {trips.map((trip) => (
          <div key={trip._id} className="card">
            <div className="card-body">
              <h2 className="mb-1">{trip.title || `Trip #${trip._id}`}</h2>
              <p className="mb-1">{trip.description || "No Description"}</p>
              <Button
                variant="primary"
                onClick={() => nav(`/trips/${trip._id}`)}
              >
                Show Details
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
