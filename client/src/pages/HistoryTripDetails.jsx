// client/src/pages/TripDetails.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useApi from "../hooks/useApi";
import Button from "../components/ui/Button";
import Map from "../components/ui/Map";

import "../styles/layout.css";
import "../styles/typography.css";
import "../styles/utilities.css";
import "../styles/components/card.css";


export default function HistoryTripDetails() {
    const api = useApi();
    const [trip, setTrip] = useState({});
    const { tripId } = useParams();
    const nav = useNavigate();



    useEffect(() => {
        async function fetchTrip() {
          try {
            const { data } = await api.get(`/trips/${tripId}`);
            setTrip(data);
            console.log(data);

          } catch {
            window.alert("Error fetching trips.");
          }
        }
        fetchTrip();
      }, []);
    
      return (
        <div className="container mt-2" style={{ maxWidth: "800px" }}>
              {/* 1. כתיבת כותרת */}
              <div className="card mb-2">
                <div className="card-body">
                  <h2>
                    {trip.title}
                  </h2>
                </div>
              </div>
        
              {/* 2. תיאור קצר */}
              <div className="card mb-2">
                <div className="card-body">
                  <p label="Description" required>
                    {trip.description}
                  </p>
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
              {trip?.days?.map((d) => (
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
