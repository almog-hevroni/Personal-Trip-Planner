// client/src/pages/TripPlanner.jsx
import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import useApi from "../hooks/useApi";
import { useNavigate } from "react-router-dom";

import InputField from "../components/ui/InputField";
import FormGroup from "../components/ui/FormGroup";
import Button from "../components/ui/Button";

import "../styles/layout.css";
import "../styles/typography.css";
import "../styles/utilities.css";

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
      window.alert("שגיאת יצירת מסלול");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-2" style={{ maxWidth: "400px" }}>
      <h1 className="heading-xl text-center mb-2">
        {token ? "צור מסלול חדש" : "Trip Planner (אורח)"}
      </h1>
      <form onSubmit={handleGenerate}>
        <InputField
          label="מקום (עיר/מדינה)"
          value={location}
          onChange={setLocation}
          required
        />
        <FormGroup label="סוג טיול" required>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="form-group-select"
          >
            <option value="bike">אופניים</option>
            <option value="trek">טרק</option>
          </select>
        </FormGroup>
        <Button
          type="submit"
          variant="primary"
          disabled={loading || !location}
          style={{ width: "100%", marginTop: "1rem" }}
        >
          {loading ? "טוען…" : "צור מסלול"}
        </Button>
      </form>
    </div>
  );
}
