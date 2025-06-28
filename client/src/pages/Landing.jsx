// src/pages/Landing.jsx
import React, { useEffect } from "react";
import { Box, Heading, Button, VStack } from "@chakra-ui/react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function Landing() {
  const { token } = useAuth();
  const nav = useNavigate();

  useEffect(() => {
    if (token) {
      nav("/dashboard", { replace: true });
    }
  }, [token, nav]);

  return (
    <Box
      minH="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <VStack spacing={6} w="sm">
        <Heading size="2xl" textAlign="center">
          Trip Planner
        </Heading>
        <Button as={RouterLink} to="/login" colorScheme="teal" w="100%">
          התחברות
        </Button>
        <Button
          as={RouterLink}
          to="/register"
          variant="outline"
          colorScheme="teal"
          w="100%"
        >
          יצירת משתמש
        </Button>
        <Button as={RouterLink} to="/planner" colorScheme="orange" w="100%">
          צור מסלול ללא התחברות
        </Button>
      </VStack>
    </Box>
  );
}
