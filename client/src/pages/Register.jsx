import {
  Box,
  Heading,
  Button,
  Input,
  FormControl,
  FormLabel,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useApi from "../hooks/useApi";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const toast = useToast();
  const api = useApi();
  const nav = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/auth/register", { name, email, password });
      toast({ status: "success", description: "נרשמת בהצלחה!" });
      nav("/login");
    } catch (err) {
      toast({
        status: "error",
        description: err.response?.data?.message || "שגיאה",
      });
    }
  };

  return (
    <Box maxW="md" mx="auto" mt={16} p={8} borderWidth="1px" borderRadius="lg">
      <Heading mb={6} textAlign="center">
        הרשמה
      </Heading>
      <form onSubmit={handleSubmit}>
        <VStack spacing={4}>
          <FormControl isRequired>
            <FormLabel>שם מלא</FormLabel>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>אימייל</FormLabel>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>סיסמה</FormLabel>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </FormControl>
          <Button colorScheme="teal" type="submit" w="full">
            הרשם
          </Button>
        </VStack>
      </form>
    </Box>
  );
}
