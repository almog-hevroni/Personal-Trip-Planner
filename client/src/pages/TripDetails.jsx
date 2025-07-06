// client/src/pages/TripDetails.jsx
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useApi from "../hooks/useApi";
import { useAuth } from "../contexts/AuthContext";

import Map from "../components/ui/Map";
import InputField from "../components/ui/InputField";
import FormGroup from "../components/ui/FormGroup";
import Button from "../components/ui/Button";

import "../styles/layout.css";
import "../styles/typography.css";
import "../styles/utilities.css";
import "../styles/components/card.css";

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
      <div className="container text-center mt-2">
        <p>No route to show.</p>
        <Button
          variant="primary"
          onClick={() => nav("/dashboard")}
          style={{ marginTop: "1rem" }}
        >
          Back to Home Page
        </Button>
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
      window.alert("An error accured, the trip wasn't saved.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container mt-2" style={{ maxWidth: "800px" }}>
      {/* 1. כתיבת כותרת */}
      <div className="card mb-2">
        <div className="card-body">
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
      </div>

      {/* 2. תיאור קצר */}
      <div className="card mb-2">
        <div className="card-body">
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
      </div>

      {/* 3. סוג המסלול */}
      <p className="mb-2">
        <strong>Type:</strong> {trip.type}
      </p>

      {/* 4. מפה */}
      <div className="card mb-2">
        <div className="card-body" style={{ padding: 0 }}>
          <Map points={trip.route} />
        </div>
      </div>

      {/* 5. נקודת מוצא וסיום */}
      <div className="card mb-2">
        <div className="card-body">
          <p>
            <strong>Starting Point:</strong> {trip.startingPoint}
          </p>
          <p>
            <strong>Ending Point:</strong> {trip.endingPoint}
          </p>
        </div>
      </div>

      {/* 6. אורך כולל */}
      <p className="mb-2">
        <strong>Total Length:</strong> {trip.totalLengthKm} km
      </p>

      {/* 7. פירוט יומי */}
      {trip.days.map((d) => (
        <div key={d.day} className="card mb-2">
          <div className="card-body">
            <h2 className="heading-md mb-1">Day {d.day}</h2>
            <p>Length: {d.lengthKm} km</p>
            <p>Starting Poind: {d.startingPoint}</p>
            <p>Ending Point: {d.endingPoint}</p>
            <p className="mt-1">Description: {d.description}</p>
          </div>
        </div>
      ))}

      {/* 8. מזג אוויר */}
      <div className="card mb-2">
        <div className="card-body">
          <h2 className="heading-md mb-1">Weather</h2>

          {trip.weather?.forecast?.length ? (
            trip.weather.forecast.map((f) => (
              <div key={f.dayOffset} className="mb-1">
                <p>
                  Day {f.dayOffset}: {f.condition}
                </p>
                <p>
                  Tempreture: {f.minTempC}°–{f.maxTempC}°
                </p>
              </div>
            ))
          ) : (
            <p>Not available yet</p>
          )}
        </div>
      </div>

      {/* 9. תמונה */}
      {trip.imageUrl && (
        <div className="card mb-2 text-center">
          <div className="card-body">
            <img
              src={trip.imageUrl}
              alt="Trip Picture"
              style={{ maxHeight: "300px", width: "auto" }}
            />
          </div>
        </div>
      )}

      {/* כפתורי שמירה וחזרה */}
      {token && (
        <Button
          variant="primary"
          onClick={handleSave}
          disabled={saving}
          style={{ width: "100%", marginBottom: "1rem" }}
        >
          {saving ? "Saving..." : "Save Trip"}
        </Button>
      )}
      <Button
        variant="secondary"
        onClick={() => nav("/dashboard")}
        style={{ width: "100%" }}
      >
        Back To Home Page
      </Button>
    </div>
  );
}
