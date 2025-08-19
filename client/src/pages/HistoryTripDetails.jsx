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

const formatDateDMY = (iso) => {
  const [yyyy, mm, dd] = iso.split("-");
  return `${dd}-${mm}-${yyyy}`; // 31-07-2025
};

export default function HistoryTripDetails() {
  const api = useApi();
  const [trip, setTrip] = useState({});
  const { tripId } = useParams();
  const nav = useNavigate();

  // Fetch trip by ID on mount
  useEffect(() => {
    // let isMounted = true;
    async function fetchTrip() {
      try {
        const { data } = await api.get(`/trips/${tripId}`);
        // if (!isMounted) return;
        setTrip(data);
      } catch {
        window.alert("Error fetching trip.");
      }
    }
    fetchTrip();
    // return () => {
    //   // isMounted = false;
    // };
  }, [tripId, api]);

  return (
    <div className={styles.page}>
      {/* Hero with image + title */}
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
        {/* Description */}
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

        {/* Basic info */}
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

        {/* Map of route */}
        <div className={styles.card}>
          <Map points={trip.route || []} type={trip.type} />
        </div>

        {/* Starting and ending points */}
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

        {/* Weather */}
        <div className={styles.card}>
          <h2 className={styles.sectionTitle}>Weather (Next 3 Days)</h2>
          {trip.weather?.forecast?.length ? (
            trip.weather.forecast.map((f) => (
              <div key={formatDateDMY(f.date)} className={styles.weatherDay}>
                <p className={styles.text}>
                  <strong>{formatDateDMY(f.date)}:</strong> {f.condition}
                </p>
                <p className={styles.text}>
                  <strong>Temp:</strong> {f.minTempC}° – {f.maxTempC}°
                </p>
              </div>
            ))
          ) : (
            <p className={styles.text}>Not available yet</p>
          )}
        </div>

        {/* Navigation buttons */}
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
