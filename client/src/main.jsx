// client/src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";

import "leaflet/dist/leaflet.css";

import "./styles/reset.css";
import "./styles/variables.css";
import "./styles/globals.css";
import "./styles/typography.css";
import "./styles/layout.css";
import "./styles/utilities.css";

import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { AuthProvider } from "./contexts/AuthContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
