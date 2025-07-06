// client/src/pages/MyTrips.jsx
import React, { useEffect, useState } from "react";
import useApi from "../hooks/useApi";
import { useNavigate } from "react-router-dom";
import Button from "../components/ui/Button";
import styles from "../styles/pages/myTrips.module.css";

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
  }, [api]);

  return (
    <div className={styles.page}>
      <h1 className={styles.heading}>Trip History</h1>
      <div className={styles.cardGrid}>
        {trips.map((trip) => (
          <div key={trip._id} className={styles.card}>
            <h2>{trip.title || `Trip #${trip._id}`}</h2>
            <p>{trip.description || "No Description"}</p>
            <div className={styles.buttonsWrapper}>
              <Button
                variant="primary"
                onClick={() => nav(`/trips/${trip._id}`)}
                style={{ width: "100%" }}
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