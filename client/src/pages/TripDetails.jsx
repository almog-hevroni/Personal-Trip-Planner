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
        <p>אין מסלול להצגה.</p>
        <Button
          variant="primary"
          onClick={() => nav("/dashboard")}
          style={{ marginTop: "1rem" }}
        >
          חזור לדף הבית
        </Button>
      </div>
    );
  }

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.post("/trips", { ...trip, title, description });
      window.alert("המסלול נשמר!");
      nav("/trips");
    } catch {
      window.alert("שגיאה בשמירה");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container mt-2" style={{ maxWidth: "800px" }}>
      {/* 1. כתיבת כותרת */}
      <div className="card mb-2">
        <div className="card-body">
          <FormGroup label="שם המסלול" required>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="הכנס שם למסלול"
              required
            />
          </FormGroup>
        </div>
      </div>

      {/* 2. תיאור קצר */}
      <div className="card mb-2">
        <div className="card-body">
          <FormGroup label="תיאור קצר" required>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="הכנס תיאור קצר למסלול"
              rows={2}
              required
            />
          </FormGroup>
        </div>
      </div>

      {/* 3. סוג המסלול */}
      <p className="mb-2">
        <strong>סוג:</strong> {trip.type}
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
            <strong>נקודת מוצא:</strong> {trip.startingPoint}
          </p>
          <p>
            <strong>נקודת סיום:</strong> {trip.endingPoint}
          </p>
        </div>
      </div>

      {/* 6. אורך כולל */}
      <p className="mb-2">
        <strong>אורך כולל:</strong> {trip.totalLengthKm} ק"מ
      </p>

      {/* 7. פירוט יומי */}
      {trip.days.map((d) => (
        <div key={d.day} className="card mb-2">
          <div className="card-body">
            <h2 className="heading-md mb-1">יום {d.day}</h2>
            <p>אורך: {d.lengthKm} ק"מ</p>
            <p>התחלה: {d.startingPoint}</p>
            <p>סיום: {d.endingPoint}</p>
            <p className="mt-1">תיאור: {d.description}</p>
          </div>
        </div>
      ))}

      {/* 8. מזג אוויר */}
      <div className="card mb-2">
        <div className="card-body">
          <h2 className="heading-md mb-1">מזג אוויר</h2>

          {trip.weather?.forecast?.length ? (
            trip.weather.forecast.map((f) => (
              <div key={f.dayOffset} className="mb-1">
                <p>
                  יום {f.dayOffset}: {f.condition}
                </p>
                <p>
                  טמפרטורה: {f.minTempC}°–{f.maxTempC}°
                </p>
              </div>
            ))
          ) : (
            <p>טרם זמין</p>
          )}
        </div>
      </div>

      {/* 9. תמונה */}
      {trip.imageUrl && (
        <div className="card mb-2 text-center">
          <div className="card-body">
            <img
              src={trip.imageUrl}
              alt="תמונת המסלול"
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
          {saving ? "שומר..." : "שמור מסלול"}
        </Button>
      )}
      <Button
        variant="secondary"
        onClick={() => nav("/dashboard")}
        style={{ width: "100%" }}
      >
        חזור לדף הבית
      </Button>
    </div>
  );
}
