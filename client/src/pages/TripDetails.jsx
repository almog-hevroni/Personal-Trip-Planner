import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import useApi from "../hooks/useApi";

import Map from "../components/ui/Map";
import FormGroup from "../components/ui/FormGroup";
import Button from "../components/ui/Button";
import ItineraryTabs from "../components/ui/ItineraryTabs"; // ← ייבוא הרכיב

import styles from "../styles/pages/tripDetails.module.css";

export default function TripDetails() {
  const { state } = useLocation();
  const trip = state?.trip;
  const { token } = useAuth();
  const api = useApi();
  const nav = useNavigate();

  const [title, setTitle] = useState(trip?.title || "");
  const [description, setDescription] = useState(trip?.description || "");
  const [saving, setSaving] = useState(false);

  const [notification, setNotification] = useState("");

  useEffect(() => {
    if (!notification) return;
    const timer = setTimeout(() => setNotification(""), 3000);
    return () => clearTimeout(timer);
  }, [notification]);

  if (!trip) {
    return (
      <div className={styles.page}>
        <div className={styles.container}>
          <p className={styles.text}>No route to show.</p>
          <div className={styles.buttonsWrapper}>
            <Button variant="primary" onClick={() => nav("/dashboard")}>
              Back to Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.post("/trips", { ...trip, title, description });
      // מראה Toast
      setNotification("The trip was saved successfully!");
      // ממתין 2 שניות לפני המעבר ל־MyTrips
      setTimeout(() => {
        nav("/trips");
      }, 2000);
    } catch {
      setNotification("Oops! Could not save the trip.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={styles.page}>
      {notification && (
        <div className={styles.notification}>{notification}</div>
      )}

      {/* Hero עם תמונה וכותרת מעליה */}
      {trip.imageUrl && (
        <div className={styles.hero}>
          <img src={trip.imageUrl} alt="Trip" className={styles.heroImage} />
          <h1 className={styles.heroTitle}>Trip Details</h1>
        </div>
      )}

      <div className={styles.container}>
        {/* Trip Name */}
        <div className={styles.card}>
          <FormGroup label="Trip Name" required>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter Trip Name"
              required
            />
          </FormGroup>
        </div>

        {/* Description */}
        <div className={styles.card}>
          <FormGroup label="Description" required>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Write a short description of the trip"
              rows={2}
              required
            />
          </FormGroup>
        </div>

        {/* Info Card */}
        <div className={styles.card}>
          <p className={styles.text}>
            <p className={styles.text}>
              <strong>Location:</strong> {trip.location}
            </p>
            <strong>Type:</strong> {trip.type}
          </p>
          <p className={styles.text}>
            <strong>Starting Point:</strong> {trip.startingPoint}
          </p>
          <p className={styles.text}>
            <strong>Ending Point:</strong> {trip.endingPoint}
          </p>
          <p className={styles.text}>
            <strong>Total Length:</strong> {trip.totalLengthKm} km
          </p>
        </div>

        {/* Map */}
        <div className={styles.card}>
          <Map points={trip.route} type={trip.type} />
        </div>

        {/* Daily Breakdown */}
        {/* Itinerary כטאבים */}
        <div className={styles.card}>
          <ItineraryTabs days={trip.days} />
        </div>

        {/* Weather */}
        <div className={styles.card}>
          <h2 className={styles.sectionTitle}>Weather (Next 3 Days)</h2>
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

        {/* Actions */}
        <div className={styles.buttonsWrapper}>
          {token && (
            <Button variant="primary" onClick={handleSave} disabled={saving}>
              {saving ? "Saving..." : "Save Trip"}
            </Button>
          )}
          <Button variant="secondary" onClick={() => nav("/dashboard")}>
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
}
