import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useApi from "../hooks/useApi";
import Button from "../components/ui/Button";
import Map from "../components/ui/Map";
import ItineraryTabs from "../components/ui/ItineraryTabs";

import "../styles/layout.css";
import "../styles/typography.css";
import "../styles/utilities.css";
import "../styles/components/card.css";
import styles from "../styles/pages/tripDetails.module.css";

export default function HistoryTripDetails() {
  const api = useApi();
  const [trip, setTrip] = useState({});
  const { tripId } = useParams();
  const nav = useNavigate();

  useEffect(() => {
    let isMounted = true;
    async function fetchTrip() {
      try {
        const { data } = await api.get(`/trips/${tripId}`);
        if (!isMounted) return;
        setTrip(data);
      } catch {
        window.alert("Error fetching trip.");
      }
    }
    fetchTrip();
    return () => {
      isMounted = false;
    };
  }, [tripId, api]);

  return (
    <div className={styles.page}>
      {/* Hero עם תמונה ושם הטיול */}
      {trip.imageUrl && (
        <div className={styles.hero}>
          <img
            src={trip.imageUrl}
            alt={trip.title}
            className={styles.heroImage}
          />
          <h1 className={styles.heroTitle}>{trip.title}</h1>
        </div>
      )}

      <div className={styles.container}>
        {/* תיאור */}
        <div className={styles.card}>
          <h2 className={styles.sectionTitle}>Description</h2>
          {trip.description ? (
            <p className={styles.text}>{trip.description}</p>
          ) : (
            <p className={styles.text}>
              <em>No description available.</em>
            </p>
          )}
        </div>

        {/* מיקום, סוג ואורך כולל */}
        <div className={styles.card}>
          <p className={styles.text}>
            <strong>Location:</strong> {trip.location}
          </p>
          <p className={styles.text}>
            <strong>Type:</strong> {trip.type}
          </p>
          <p className={styles.text}>
            <strong>Total Length:</strong> {trip.totalLengthKm} km
          </p>
        </div>

        {/* מפה */}
        <div className={styles.card}>
          <Map points={trip.route || []} type={trip.type} />
        </div>

        {/* נקודת מוצא וסיום */}
        <div className={styles.card}>
          <p className={styles.text}>
            <strong>Starting Point:</strong> {trip.startingPoint}
          </p>
          <p className={styles.text}>
            <strong>Ending Point:</strong> {trip.endingPoint}
          </p>
        </div>

        {/* ItineraryTabs */}
        <div className={styles.card}>
          <ItineraryTabs days={trip.days || []} />
        </div>

        {/* מזג אוויר */}
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

        {/* כפתור חזרה */}
        <div className={styles.buttonsWrapper}>
          <Button variant="primary" onClick={() => nav("/trips")}>
            Back to My Trips
          </Button>
          <Button variant="secondary" onClick={() => nav("/dashboard")}>
            Back to Home Page
          </Button>
        </div>
      </div>
    </div>
  );
}
