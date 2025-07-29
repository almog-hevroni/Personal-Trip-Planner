// File: client/src/pages/MyTrips.jsx

import React, { useEffect, useState } from "react";
import useApi from "../hooks/useApi";
import { useNavigate } from "react-router-dom";
import Button from "../components/ui/Button";
import styles from "../styles/pages/myTrips.module.css";
import { Trash2 } from "lucide-react";

export default function MyTrips() {
  const [trips, setTrips] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const api = useApi();
  const nav = useNavigate();

  useEffect(() => {
    async function fetchTrips() {
      try {
        const { data } = await api.get("/trips");
        setTrips(data);
      } catch {
        window.alert("Error fetching trips.");
      }
    }
    fetchTrips();
  }, [api]);

  const handleDeleteClick = (trip) => {
    setSelectedTrip(trip);
    setShowModal(true);
  };

  const confirmDelete = async () => {
    try {
      await api.delete(`/trips/${selectedTrip._id}`);
      setTrips((prev) => prev.filter((t) => t._id !== selectedTrip._id));
      setShowModal(false);
    } catch {
      window.alert("Failed to delete trip.");
    }
  };

  const cancelDelete = () => {
    setShowModal(false);
    setSelectedTrip(null);
  };

  return (
    <div className={styles.wrapper}>
      {/* רקע וידאו */}
      <video className={styles.backgroundVideo} autoPlay muted loop playsInline>
        <source src="/videos/dashboard_video.mp4" type="video/mp4" />
      </video>

      {/* תוכן העמוד */}
      <div className={styles.page}>
        <h1 className={styles.heading}>Trip History</h1>

        {trips.length === 0 ? (
          <p className={styles.noTripsText}>You have no trips yet.</p>
        ) : (
          <div className={styles.cardGrid}>
            {trips.map((trip) => (
              <div key={trip._id} className={styles.card}>
                {trip.imageUrl && (
                  <img
                    src={trip.imageUrl}
                    alt={trip.title}
                    className={styles.tripImage}
                  />
                )}
                <h2>{trip.title || `Trip #${trip._id}`}</h2>
                <p>
                  <strong>Location:</strong> {trip.location}
                </p>
                <p>{trip.description || "No Description"}</p>

                {/* כפתורי פעולה: Show Details משמאל, Trash מימין */}
                <div className={styles.cardActions}>
                  <Button
                    variant="primary"
                    onClick={() =>
                      nav(`/trips/${trip._id}`, { state: { trip } })
                    }
                  >
                    Show Details
                  </Button>
                  <button
                    className={styles.trashButton}
                    onClick={() => handleDeleteClick(trip)}
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* מודאל אישור מחיקה */}
      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <p>Are you sure you want to delete this trip?</p>
            <div className={styles.modalButtons}>
              <Button variant="secondary" onClick={confirmDelete}>
                Delete
              </Button>
              <Button variant="secondary" onClick={cancelDelete}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
