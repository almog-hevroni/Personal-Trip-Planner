import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useApi from "../hooks/useApi";
import Button from "../components/ui/Button";
import Map from "../components/ui/Map";

import "../styles/layout.css";
import "../styles/typography.css";
import "../styles/utilities.css";
import "../styles/components/card.css";
import styles from "../styles/pages/tripDetails.module.css";

export default function HistoryTripDetails() {
  const api = useApi();
  const [trip, setTrip] = useState({});
  const [activeDay, setActiveDay] = useState(null); // ← הוספה
  const { tripId } = useParams();
  const nav = useNavigate();

  useEffect(() => {
    async function fetchTrip() {
      try {
        const { data } = await api.get(`/trips/${tripId}`);
        setTrip(data);
        // מגדירים כברירת מחדל את היום הראשון
        if (data.days && data.days.length > 0) {
          setActiveDay(data.days[0].day);
        }
      } catch {
        window.alert("Error fetching trip.");
      }
    }
    fetchTrip();
  }, [api, tripId]);

  const scrollToDay = (day) => {
    const el = document.getElementById(`day-${day}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      setActiveDay(day);
    }
  };

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

        {/* סוג ואורך כולל */}
        <div className={styles.card}>
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

        {/* תוכנית יומית */}
        <div className={styles.card}>
          <h2 className={styles.sectionTitle}>Itinerary</h2>

          {/* רשימת ה־Tabs */}
          <div className={styles.tabsContainer}>
            {trip.days?.map((d) => (
              <button
                key={d.day}
                className={
                  activeDay === d.day
                    ? `${styles.tabButton} ${styles.tabButtonActive}`
                    : styles.tabButton
                }
                onClick={() => scrollToDay(d.day)}
              >
                Day {d.day}
              </button>
            ))}
          </div>

          {/* פירוט לכל יום */}
          <div className={styles.daysList}>
            {trip.days?.map((d) => (
              <div id={`day-${d.day}`} key={d.day} className={styles.dayItem}>
                <h3 className={styles.dayTitle}>Day {d.day}</h3>
                <p className={styles.text}>Length: {d.lengthKm} km</p>
                <p className={styles.text}>Start: {d.startingPoint}</p>
                <p className={styles.text}>End: {d.endingPoint}</p>
                <p className={styles.text}>{d.description}</p>
              </div>
            ))}
          </div>
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
          <Button variant="secondary" onClick={() => nav("/dashboard")}>
            Back To Home Page
          </Button>
        </div>
      </div>
    </div>
  );
}
