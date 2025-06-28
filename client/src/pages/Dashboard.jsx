import { Box, Heading, Button, VStack } from "@chakra-ui/react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const { user } = useAuth();
  const nav = useNavigate();

  return (
    <Box p={8}>
      <VStack spacing={6} maxW="sm" mx="auto">
        <Heading>שלום, {user.name}</Heading>

        <Button colorScheme="teal" w="full" onClick={() => nav("/trips")}>
          היסטוריית מסלולים
        </Button>

        <Button colorScheme="orange" w="full" onClick={() => nav("/planner")}>
          צור מסלול
        </Button>
      </VStack>
    </Box>
  );
}
