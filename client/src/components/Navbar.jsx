// src/components/Navbar.jsx
import React from "react";
import { Flex, Link, Button, Spacer } from "@chakra-ui/react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function Navbar() {
  const { token, logout } = useAuth();
  const nav = useNavigate();

  const handleLogout = () => {
    logout();
    // מפנים תמיד לעמוד ה-Landing שבנתיב "/"
    nav("/", { replace: true });
  };

  return (
    <Flex p={4} bg="teal.500" color="white">
      <Link as={NavLink} to="/" fontWeight="bold">
        Trip Planner
      </Link>
      <Spacer />
      {token && (
        <Button size="sm" onClick={handleLogout}>
          Logout
        </Button>
      )}
    </Flex>
  );
}
