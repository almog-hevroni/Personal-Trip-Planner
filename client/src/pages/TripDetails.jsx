import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import useApi from "../hooks/useApi";

import Map from "../components/ui/Map";
import FormGroup from "../components/ui/FormGroup";
import Button from "../components/ui/Button";

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

  if (!trip) {
    return (
      <div className={styles.page}>
        <div className={styles.container}>
          <p className={styles.text}>No route to show.</p>
          <div className={styles.buttonsWrapper}>
            <Button variant="primary" onClick={() => nav("/dashboard")}>Back to Home</Button>
          </div>
        </div>
      </div>
    );
  }

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.post("/trips", { ...trip, title, description });
      window.alert("The trip was saved successfully!");
      nav("/trips");
    } catch {
      window.alert("An error occurred; the trip wasn't saved.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <h1 className={styles.heading}>Trip Details</h1>

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
          <p className={styles.text}><strong>Type:</strong> {trip.type}</p>
          <p className={styles.text}><strong>Starting Point:</strong> {trip.startingPoint}</p>
          <p className={styles.text}><strong>Ending Point:</strong> {trip.endingPoint}</p>
          <p className={styles.text}><strong>Total Length:</strong> {trip.totalLengthKm} km</p>
        </div>

        {/* Map */}
        <div className={styles.card}>
          <Map points={trip.route} />
        </div>

        {/* Daily Breakdown */}
        <div className={styles.card}>
          <h2 className={styles.sectionTitle}>Daily Breakdown</h2>
          <div className={styles.daysList}>
            {trip.days.map((d) => (
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

        {/* Weather */}
        <div className={styles.card}>
          <h2 className={styles.sectionTitle}>Weather (Next 3 Days)</h2>
          {trip.weather?.forecast?.length ? (
            trip.weather.forecast.map((f) => (
              <div key={f.dayOffset} className={styles.weatherDay}>
                <p className={styles.text}><strong>Day {f.dayOffset}:</strong> {f.condition}</p>
                <p className={styles.text}><strong>Temp:</strong> {f.minTempC}°–{f.maxTempC}°</p>
              </div>
            ))
          ) : (
            <p className={styles.text}>Not available yet</p>
          )}
        </div>

        {/* Image */}
        {trip.imageUrl && (
          <div className={styles.card + ' ' + styles.imageWrapper}>
            <img src={trip.imageUrl} alt="Trip" className={styles.image} />
          </div>
        )}

        {/* Actions */}
        <div className={styles.buttonsWrapper}>
          {token && (
            <Button variant="primary" onClick={handleSave} disabled={saving}>
              {saving ? "Saving..." : "Save Trip"}
            </Button>
          )}
          <Button variant="secondary" onClick={() => nav("/dashboard")}>Back to Home</Button>
        </div>
      </div>
    </div>
  );
}