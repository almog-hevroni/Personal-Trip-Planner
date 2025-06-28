import React, { useState } from "react";
import {
  Box,
  Heading,
  VStack,
  FormControl,
  FormLabel,
  Input,
  Select,
  Button,
  useToast,
  Spinner,
} from "@chakra-ui/react";
import { useAuth } from "../contexts/AuthContext";
import useApi from "../hooks/useApi";
import { useNavigate } from "react-router-dom";

export default function TripPlanner() {
  const [location, setLocation] = useState("");
  const [type, setType] = useState("bike");
  const [loading, setLoading] = useState(false);

  const { token } = useAuth();
  const api = useApi();
  const nav = useNavigate();
  const toast = useToast();

  const handleGenerate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post("/trips/generate", { location, type });
      nav("/trip", { state: { trip: data } });
    } catch (err) {
      toast({
        status: "error",
        description: "שגיאת יצירת מסלול",
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box p={8}>
      <VStack spacing={6} maxW="md" mx="auto">
        <Heading size="xl">
          {token ? "צור מסלול חדש" : "Trip Planner (אורח)"}
        </Heading>
        <FormControl isRequired>
          <FormLabel>מקום (עיר/מדינה)</FormLabel>
          <Input
            placeholder="הקלד עיר או מדינה"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </FormControl>
        <FormControl isRequired>
          <FormLabel>סוג טיול</FormLabel>
          <Select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="bike">אופניים</option>
            <option value="trek">טרק</option>
          </Select>
        </FormControl>
        <Button
          colorScheme="teal"
          w="full"
          onClick={handleGenerate}
          disabled={loading || !location}
        >
          {loading ? <Spinner size="sm" /> : "צור מסלול"}
        </Button>
      </VStack>
    </Box>
  );
}
