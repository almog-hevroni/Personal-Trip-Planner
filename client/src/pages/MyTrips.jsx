// client/src/pages/MyTrips.jsx
import React, { useEffect, useState } from "react";
import {
  Box,
  Heading,
  SimpleGrid,
  Card,
  CardBody,
  Text,
  Button,
  useToast,
} from "@chakra-ui/react";
import useApi from "../hooks/useApi";

export default function MyTrips() {
  const [trips, setTrips] = useState([]);
  const api = useApi();
  const toast = useToast();

  useEffect(() => {
    async function fetchTrips() {
      try {
        const { data } = await api.get("/trips");
        setTrips(data);
      } catch (err) {
        toast({ status: "error", description: "שגיאה בשליפת מסלולים" });
      }
    }
    fetchTrips();
  }, []);

  return (
    <Box p={8}>
      <Heading mb={6}>היסטוריית מסלולים</Heading>
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
        {trips.map((trip) => (
          <Card key={trip.id}>
            <CardBody>
              <Heading size="md">{trip.title || `מסלול #${trip.id}`}</Heading>
              <Text mt={2}>{trip.description || "אין תיאור"}</Text>
              <Button
                mt={4}
                size="sm"
                onClick={() => {
                  /* בעתיד: ניווט לדף פרטי המסלול */
                }}
              >
                פרטים
              </Button>
            </CardBody>
          </Card>
        ))}
      </SimpleGrid>
    </Box>
  );
}
