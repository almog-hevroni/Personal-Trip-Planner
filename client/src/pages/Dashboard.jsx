import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import Button from "../components/ui/Button";
import styles from "../styles/pages/dashboard.module.css";
import useApi from "../hooks/useApi";

export default function Dashboard() {
  const { user } = useAuth();
  const nav = useNavigate();
  const api = useApi();
  const [recentTrips, setRecentTrips] = useState([]);

  // load up to 3 most recent trips
  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const res = await api.get("/trips");
        setRecentTrips(res.data.slice(0, 3));
      } catch (err) {
        console.error("Failed to fetch trips:", err);
      }
    };
    fetchTrips();
  }, [api]);

  return (
    <div className={styles.wrapper}>    
      <video className={styles.backgroundVideo} autoPlay muted loop playsInline>
        <source src="/videos/dashboard_video.mp4" type="video/mp4" />
      </video>

      <div className={styles.page}>
        <h1 className={styles.heading}>Welcome, {user?.name}!</h1>

        <p className={styles.subtitle}>For your next journey click here</p>
        <Button
          variant="secondary"
          onClick={() => nav("/planner")}
          className={styles.largeButton}
          style={{ marginBottom: "3rem" }}
        >
          Create New Trip
        </Button>

        <h2 className={styles.sectionTitle}>Your Recent Trips</h2>
        {recentTrips.length === 0 ? (
          <p className={styles.noTripsText}>You have no recent trips.</p>
        ) : (
          <div className={styles.tripGrid}>
            {recentTrips.map((trip) => (
              <div
                key={trip._id}
                className={styles.tripCard}
                onClick={() => nav(`/trips/${trip._id}`, { state: { trip } })}
              >
                <img
                  src={trip.imageUrl}
                  alt={trip.title}
                  className={styles.tripImage}
                />
                <div className={styles.tripInfo}>
                  <h3 className={styles.tripTitle}>{trip.title}</h3>
                  <p className={styles.tripLocation}>{trip.location}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        <Button
          variant="primary"
          onClick={() => nav("/trips")}
          className={`${styles.largeButton} ${styles.historyButton}`}
        >
          View Trip History
        </Button>
      </div>
    </div>
  );
}
