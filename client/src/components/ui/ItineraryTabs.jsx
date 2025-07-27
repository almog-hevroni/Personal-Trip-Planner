// client/src/components/ui/ItineraryTabs.jsx
import React, { useState } from "react";
import "../../styles/components/itineraryTabs.css"; // תוודאי שהוא קיים

export default function ItineraryTabs({ days }) {
  const [selectedDay, setSelectedDay] = useState(0);

  if (!Array.isArray(days) || days.length === 0) return null;

  const current = days[selectedDay];

  return (
    <div className="itinerary-card">
      <h2 className="itinerary-title">Itinerary</h2>

      <div className="itinerary-tabs">
        {days.map((d, i) => (
          <button
            key={d.day}
            className={`itinerary-tab ${i === selectedDay ? "active" : ""}`}
            onClick={() => setSelectedDay(i)}
          >
            Day {d.day}
          </button>
        ))}
      </div>

      <div className="itinerary-details">
        <h3>Day {current.day}</h3>
        <p>
          <strong>Length:</strong> {current.lengthKm} km
        </p>
        <p>
          <strong>Start:</strong> {current.startingPoint}
        </p>
        <p>
          <strong>End:</strong> {current.endingPoint}
        </p>
        <p>{current.description}</p>
      </div>
    </div>
  );
}
