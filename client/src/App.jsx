// client/src/App.jsx
import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";

import Navbar from "./components/ui/Navbar";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import TripPlanner from "./pages/TripPlanner";
import Dashboard from "./pages/Dashboard";
import MyTrips from "./pages/MyTrips";
import TripDetails from "./pages/TripDetails";
import ProtectedRoute from "./components/guard/ProtectedRoute";
import HistoryTripDetails from "./pages/HistoryTripDetails";

export default function App() {
  const { pathname } = useLocation();
  const showNavbar = pathname !== "/";

  return (
    <>
      {showNavbar && <Navbar />}

      <Routes>
        {/* Landing */}
        <Route path="/" element={<Landing />} />

        {/* Public pages */}
        <Route path="/planner" element={<TripPlanner />} />

        {/* Protected pages */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/trips"
          element={
            <ProtectedRoute>
              <MyTrips />
            </ProtectedRoute>
          }
        />
        <Route
          path="/trips/:tripId"
          element={
            <ProtectedRoute>
              <HistoryTripDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/trip"
          element={
            <ProtectedRoute>
              <TripDetails />
            </ProtectedRoute>
          }
        />

        {/* Catch-all → back to Landing */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
