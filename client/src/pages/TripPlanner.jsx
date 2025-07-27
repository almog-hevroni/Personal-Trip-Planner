// client/src/pages/TripPlanner.jsx
import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import useApi from "../hooks/useApi";
import { useNavigate } from "react-router-dom";

import FormGroup from "../components/ui/FormGroup";
import Button from "../components/ui/Button";

import styles from "../styles/pages/tripPlanner.module.css";

export default function TripPlanner() {
  const [location, setLocation] = useState("");
  const [type, setType] = useState("bike");
  const [loading, setLoading] = useState(false);
  const [countries, setCountries] = useState([]);
  const [suggestions, setSuggestions] = useState([]);

  const { token } = useAuth();
  const api = useApi();
  const nav = useNavigate();

  // Fetch all countries once
  useEffect(() => {
    async function fetchCountries() {
      try {
        const res = await fetch("https://restcountries.com/v2/all?fields=name");
        if (!res.ok) throw new Error(`Countries fetch error: ${res.status}`);
        const data = await res.json();
        const names = data
          .map((c) => c.name)
          .sort((a, b) => a.localeCompare(b));
        setCountries(names);
        setSuggestions(names);
      } catch (err) {
        console.error(err);
      }
    }
    fetchCountries();
  }, []);

  // Update suggestions: fetch English place names
  useEffect(() => {
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      const query = location.trim();
      if (query.length >= 3) {
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
              query
            )}&format=json&limit=5&accept-language=en`,
            { signal: controller.signal }
          );
          if (!res.ok) throw new Error(`Place fetch error: ${res.status}`);
          const data = await res.json();
          const places = data
            .map((item) => item.display_name.split(",")[0])
            .filter((p) => !!p);
          const merged = Array.from(new Set([...places, ...countries])).sort(
            (a, b) => a.localeCompare(b)
          );
          setSuggestions(merged);
        } catch (err) {
          if (err.name !== "AbortError") console.error(err);
        }
      } else {
        setSuggestions(countries);
      }
    }, 300);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [location, countries]);

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
            <FormGroup label="Location (Country/City)" required>
              <input
                type="text"
                list="location-options"
                placeholder="Type or select country/city"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className={styles.input}
                required
              />
              <datalist id="location-options">
                {suggestions.map((loc) => (
                  <option key={loc} value={loc} />
                ))}
              </datalist>
            </FormGroup>
          </div>

          <div className={styles.formGroup}>
            <FormGroup label="Trip Type" required>
              <select value={type} onChange={(e) => setType(e.target.value)}>
                <option value="bike">Bicycle</option>
                <option value="trek">Trek</option>
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
