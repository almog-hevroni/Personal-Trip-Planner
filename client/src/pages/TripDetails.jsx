// client/src/pages/TripDetails.jsx

import React, { useState } from "react";
import {
  Box,
  Heading,
  Button,
  VStack,
  Text,
  Image,
  Input,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import { useLocation, useNavigate } from "react-router-dom";
import Map from "../components/Map";
import useApi from "../hooks/useApi";
import { useAuth } from "../contexts/AuthContext";

export default function TripDetails() {
  const { state } = useLocation();
  const trip = state?.trip;
  const { token } = useAuth();
  const api = useApi();
  const toast = useToast();
  const nav = useNavigate();
  const [saving, setSaving] = useState(false);

  // חדש: סטייט מקומי לעריכת שם ותיאור
  const [title, setTitle] = useState(trip?.title || "");
  const [description, setDescription] = useState(trip?.description || "");

  if (!trip) {
    return (
      <Box p={8} textAlign="center">
        <Text>אין מסלול להצגה.</Text>
        <Button mt={4} onClick={() => nav("/dashboard")}>
          חזור לדף הבית
        </Button>
      </Box>
    );
  }

  const handleSave = async () => {
    setSaving(true);
    try {
      // שולחים את כל האובייקט עם השדות המעודכנים title ו-description
      await api.post("/trips", {
        ...trip,
        title,
        description,
      });
      toast({ status: "success", description: "המסלול נשמר!" });
      nav("/trips");
    } catch (err) {
      toast({
        status: "error",
        description: err.response?.data?.message || "שגיאה בשמירה",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box p={8}>
      <VStack spacing={6} maxW="4xl" mx="auto">
        {/* 1. אפשרות לעריכת כותרת */}
        <Box w="full" p={4} bg="gray.50" borderRadius="md">
          <Text mb={2} fontWeight="semibold">
            שם המסלול
          </Text>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="הכנס שם למסלול"
          />
        </Box>

        {/* תיאור קצר */}
        <Box w="full" p={4} bg="gray.50" borderRadius="md">
          <Text mb={2} fontWeight="semibold">
            תיאור קצר
          </Text>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="הכנס תיאור קצר למסלול"
            rows={2}
          />
        </Box>

        {/* 2. סוג המסלול */}
        <Text fontSize="lg" color="gray.600">
          סוג: {trip.type}
        </Text>

        {/* 3. מפה ריאלית */}
        <Box w="full" h="400px">
          <Map points={trip.route} />
        </Box>

        {/* 4-5. נקודת מוצא ונקודת סיום */}
        <Box w="full">
          <Text fontWeight="semibold">נקודת מוצא: {trip.startingPoint}</Text>
          <Text fontWeight="semibold">נקודת סיום: {trip.endingPoint}</Text>
        </Box>

        {/* 6. אורך כולל */}
        <Box w="full">
          <Text fontWeight="bold">אורך כולל: {trip.totalLengthKm} ק"מ</Text>
        </Box>

        {/* 7. פירוט יומי */}
        {trip.days.map((d) => (
          <Box key={d.day} w="full" p={4} borderWidth="1px" borderRadius="md">
            <Heading size="md">יום {d.day}</Heading>
            <Text>אורך מסלול: {d.lengthKm} ק"מ</Text>
            <Text>נקודת מוצא: {d.startingPoint}</Text>
            <Text>נקודת סיום: {d.endingPoint}</Text>
            <Text mt={2}>תיאור: {d.description}</Text>
          </Box>
        ))}

        {/* 8. מזג אוויר */}
        <Box w="full" p={4} borderWidth="1px" borderRadius="md">
          <Heading size="md" mb={2}>
            מזג אוויר
          </Heading>
          {trip.weather?.forecasts?.map((f) => (
            <Box key={f.day} mb={2}>
              <Text>
                יום {f.day}: {f.forecast}
              </Text>
              <Text>
                טמפרטורה: {f.temperature.low}°–{f.temperature.high}°
              </Text>
            </Box>
          )) || <Text>טרם זמין</Text>}
        </Box>

        {/* 9. תמונה */}
        {trip.imageUrl && (
          <Box w="full" textAlign="center">
            <Image
              src={trip.imageUrl}
              alt="תמונת המסלול"
              maxH="300px"
              mx="auto"
              borderRadius="md"
            />
          </Box>
        )}

        {/* כפתורי שמירה וחזרה */}
        {token && (
          <Button
            colorScheme="teal"
            w="full"
            onClick={handleSave}
            isLoading={saving}
          >
            שמור מסלול
          </Button>
        )}
        <Button variant="outline" w="full" onClick={() => nav("/dashboard")}>
          חזור לדף הבית
        </Button>
      </VStack>
    </Box>
  );
}
