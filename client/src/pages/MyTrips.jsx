// client/src/pages/MyTrips.jsx
import React, { useEffect, useState } from "react";
import useApi from "../hooks/useApi";

import "../styles/layout.css";
import "../styles/typography.css";
import "../styles/utilities.css";
import "../styles/components/card.css";
import "../styles/components/button.css";

import Button from "../components/ui/Button";

export default function MyTrips() {
  const [trips, setTrips] = useState([]);
  const api = useApi();

  useEffect(() => {
    async function fetchTrips() {
      try {
        const { data } = await api.get("/trips");
        setTrips(data);
      } catch {
        window.alert("שגיאה בשליפת מסלולים");
      }
    }
    fetchTrips();
  }, [api]);

  return (
    <div className="container mt-2">
      <h1 className="heading-xl mb-2">היסטוריית מסלולים</h1>
      <div className="grid-2col">
        {trips.map((trip) => (
          <div key={trip.id} className="card">
            <div className="card-body">
              <h2 className="mb-1">{trip.title || `מסלול #${trip.id}`}</h2>
              <p className="mb-1">{trip.description || "אין תיאור"}</p>
              <Button
                variant="primary"
                onClick={() => {
                  // TODO: נווט לעמוד פרטי המסלול
                }}
              >
                פרטים
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
