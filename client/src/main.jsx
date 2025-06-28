import React from "react";
import ReactDOM from "react-dom/client";

// ייבוא ChakraProvider ו־extendTheme מתוך @chakra-ui/react
import { ChakraProvider, extendTheme } from "@chakra-ui/react";

import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { AuthProvider } from "./contexts/AuthContext";
import "leaflet/dist/leaflet.css";

// גם אם אין לך התאמות, אופציונלית להגדיר theme ריק:
const theme = extendTheme({});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <BrowserRouter>
        <AuthProvider>
          <App />
        </AuthProvider>
      </BrowserRouter>
    </ChakraProvider>
  </React.StrictMode>
);
