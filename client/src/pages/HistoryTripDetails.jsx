// client/src/pages/HistoryTripDetails.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useApi from "../hooks/useApi";
import Button from "../components/ui/Button";
import Map from "../components/ui/Map";

import "../styles/layout.css";
import "../styles/typography.css";
import "../styles/utilities.css";
import "../styles/components/card.css";
import styles from "../styles/pages/tripDetails.module.css"; // reuse the same styling

export default function HistoryTripDetails() {
  const api = useApi();
  const [trip, setTrip] = useState({});
  const { tripId } = useParams();
  const nav = useNavigate();

  useEffect(() => {
    async function fetchTrip() {
      try {
        const { data } = await api.get(`/trips/${tripId}`);
        setTrip(data);
      } catch {
        window.alert("Error fetching trips.");
      }
    }
    fetchTrip();
  }, [api, tripId]);

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        {/* TITLE */}
        <div className={styles.card}>
          <h1 className={styles.heading}>{trip.title}</h1>
        </div>

        {/* DESCRIPTION */}
        <div className={styles.card}>
          <h2 className={styles.sectionTitle}>Description</h2>
          {trip.description
            ? <p className={styles.text}>{trip.description}</p>
            : <p className={styles.text}><em>No description available.</em></p>
          }
        </div>

        {/* INFO (type + total length) */}
        <div className={styles.card}>
          <p className={styles.text}>
            <strong>Type:</strong> {trip.type}
          </p>
          <p className={styles.text}>
            <strong>Total Length:</strong> {trip.totalLengthKm} km
          </p>
        </div>

        {/* MAP */}
        <div className={styles.card}>
          <Map points={trip.route} />
        </div>

        {/* START & END */}
        <div className={styles.card}>
          <p className={styles.text}>
            <strong>Starting Point:</strong> {trip.startingPoint}
          </p>
          <p className={styles.text}>
            <strong>Ending Point:</strong> {trip.endingPoint}
          </p>
        </div>

        {/* ITINERARY */}
        <div className={styles.card}>
          <h2 className={styles.sectionTitle}>Itinerary</h2>
          <div className={styles.daysList}>
            {trip.days?.map((d) => (
              <div key={d.day} className={styles.dayItem}>
                <h3 className={styles.dayTitle}>Day {d.day}</h3>
                <p className={styles.text}>Length: {d.lengthKm} km</p>
                <p className={styles.text}>Start: {d.startingPoint}</p>
                <p className={styles.text}>End: {d.endingPoint}</p>
                <p className={styles.text}>{d.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* WEATHER */}
        <div className={styles.card}>
          <h2 className={styles.sectionTitle}>Weather</h2>
          {trip.weather?.forecast?.length ? (
            trip.weather.forecast.map((f) => (
              <div key={f.dayOffset} className={styles.weatherDay}>
                <p className={styles.text}>
                  <strong>Day {f.dayOffset}:</strong> {f.condition}
                </p>
                <p className={styles.text}>
                  <strong>Temp:</strong> {f.minTempC}°–{f.maxTempC}°
                </p>
              </div>
            ))
          ) : (
            <p className={styles.text}>Not available yet</p>
          )}
        </div>

        {/* IMAGE */}
        {trip.imageUrl && (
          <div className={`${styles.card} ${styles.imageWrapper}`}>
            <img src={trip.imageUrl} alt="Trip" className={styles.image} />
          </div>
        )}

        {/* BACK BUTTON */}
        <div className={styles.buttonsWrapper}>
          <Button variant="secondary" onClick={() => nav("/dashboard")}>
            Back To Home Page
          </Button>
        </div>
      </div>
    </div>
  );
}