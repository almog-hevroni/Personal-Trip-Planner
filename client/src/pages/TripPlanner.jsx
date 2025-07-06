// client/src/pages/TripPlanner.jsx
import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import useApi from "../hooks/useApi";
import { useNavigate } from "react-router-dom";

import InputField from "../components/ui/InputField";
import FormGroup from "../components/ui/FormGroup";
import Button from "../components/ui/Button";

import styles from "../styles/pages/tripPlanner.module.css";

export default function TripPlanner() {
  const [location, setLocation] = useState("");
  const [type, setType] = useState("bike");
  const [loading, setLoading] = useState(false);

  const { token } = useAuth();
  const api = useApi();
  const nav = useNavigate();

  const handleGenerate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post("/trips/generate", { location, type });
      nav("/trip", { state: { trip: data } });
    } catch {
      window.alert("Error creating a trip.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <h1 className={styles.heading}>
          {token ? "Create New Trip" : "Trip Planner"}
        </h1>
        <form className={styles.form} onSubmit={handleGenerate}>
          <div className={styles.formGroup}>
            <InputField
              label="Location (Country/City)"
              value={location}
              onChange={setLocation}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <FormGroup label="Trip Type" required>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
              >
                <option value="bike">Bicycle</option>
                <option value="track">Track</option>
              </select>
            </FormGroup>
          </div>
          <div className={styles.buttonWrapper}>
            <Button
              type="submit"
              variant="primary"
              disabled={loading || !location}
              style={{ width: "100%" }}
            >
              {loading ? "Loading…" : "Create Trip Plan"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}